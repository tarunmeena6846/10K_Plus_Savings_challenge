import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import mongoose, { Model, ObjectId } from "mongoose";
import { Response, Request } from "express";
import { TagModel } from "../models/tagSchema";
import AdminModel, { Admin } from "../models/admin";

export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getAllpost");
  // const startTime = performance.now();

  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await Post.find({ isPublished: true })
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned
    console.log("inside post", posts);
    const endTime = performance.now();

    // Calculate the execution time in milliseconds
    // const executionTime = endTime - startTime;

    // Log the execution time
    // console.log("Query execution time:", executionTime, "milliseconds");

    res.status(200).json({ sucess: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  try {
    // const startTime = performance.now();

    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = req.user;
    const isPublished = req.query.isPublished;
    console.log("user at getuserpost", user);
    const adminInfo = await AdminModel.aggregate([
      { $match: { username: user } },
      {
        $project: {
          myPosts: { $cond: [{ $eq: [isPublished, "true"] }, "$myPosts", []] },
          myDrafts: {
            $cond: [{ $eq: [isPublished, "false"] }, "$myDrafts", []],
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "myPosts",
          foreignField: "_id",
          as: "publishedPosts",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "myDrafts",
          foreignField: "_id",
          as: "draftPosts",
        },
      },
      { $project: { publishedPosts: 1, draftPosts: 1 } },
      { $skip: offset },
      { $limit: limit },
    ]);
    // const endTime = performance.now();
    // console.log("Query result getuserposts", endTime - startTime);
    console.log(adminInfo);
    if (adminInfo.length > 0) {
      resp.status(200).json({
        success: true,
        data:
          isPublished === "true"
            ? adminInfo[0].publishedPosts
            : adminInfo[0].draftPosts,
      });
    } else {
      resp.status(400).json({ success: false, data: null });
    }
  } catch (error: any) {
    resp.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req: AuthenticatedRequest, resp: Response) => {
  const postId = req.params.id;
  const type = req.params.type;
  console.log("postid and type", postId, type);
  try {
    const deletedPostFromAdmin = await AdminModel.findOneAndUpdate(
      { username: req?.user },
      // Pull the specified post ObjectId from the myDrafts array
      {
        $pull: {
          ...(type === "mydrafts"
            ? { myDrafts: postId }
            : type === "mybookmarks"
            ? { bookmarkedPosts: postId }
            : { myPosts: postId }),
        },
        // Return the updated document after the operation
      }
    );
    console.log("deletedPostFromAdmin", deletedPostFromAdmin);
    if (type === "myposts" || type === "allposts") {
      const deletePostInDB = await Post.findByIdAndDelete({ _id: postId });
      console.log("deletePostInDB", deletePostInDB);
    }
    resp.status(200).json({ success: true, data: deletedPostFromAdmin });
  } catch (error) {
    resp.status(500).json({ success: false, data: "post delete" });
  }
};
export const getBookmarkPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const bookmarkedPostsForUser = await AdminModel.findOne({
      username: req?.user,
    })
      .populate("bookmarkedPosts")
      .skip(offset)
      .limit(limit);
    console.log(
      "bookmarkedPostsForUser",
      bookmarkedPostsForUser?.bookmarkedPosts
    );
    if (bookmarkedPostsForUser) {
      resp
        .status(200)
        .json({ success: true, data: bookmarkedPostsForUser.bookmarkedPosts });
    } else {
      resp.status(400).json({ success: false, data: null });
    }
  } catch (error) {
    resp.status(500).json(error);
  }
};
export const bookmarkedPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const { postId } = req.body;
  const username = req.user;

  try {
    const admin = await AdminModel.findOne(
      { username: username }
      // { $addToSet: { bookmarkedPosts: postId } }, // Use $addToSet to add postId only if it doesn't already exist
      // { new: true }
    );

    if (admin) {
      if (admin.bookmarkedPosts.includes(postId)) {
        return resp
          .status(200)
          .json({ success: false, data: "Post already bookmarked" });
      } else {
        admin.bookmarkedPosts.push(postId);
        await admin.save();
        return resp
          .status(200)
          .json({ success: true, data: "Post bookmarked successfully" });
      }
    } else {
      return resp.status(400).json({ success: false, data: null });
    }
  } catch (error) {
    return resp.status(500).json(error);
  }
};
// export const getDraftPosts = async (
//   req: AuthenticatedRequest,
//   resp: Response
// ) => {
//   try {
//     const posts = await Post.find({
//       author: req.user,
//       isPublished: false,
//     });
//     resp.status(200).send({ draftPosts: posts });
//   } catch (error: any) {
//     resp.status(500).send({ message: error.message });
//   }
// };

export const getTags = async (req: AuthenticatedRequest, res: Response) => {
  console.log("tarun inside getags");
  // const startTime = performance.now();

  try {
    const tags = await TagModel.find({}, { tag: 1 }); // Exclude _id field
    // const tags = { tag: "tagone" };
    console.log("tags in db", tags);
    // const endtime = performance.now();

    // console.log("query execution in tag", endtime - startTime);

    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
export const getPostByTag = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const tagId = req.params.tagId;
  try {
    console.log("tagId", tagId);
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    // const user = req.user as string;
    // console.log("user", user);
    // if (isPublished === "true") {
    //   // if (user === undefined) {
    //     query = { isPublished: true };
    //   // } else {
    //   //   query = { author: user, isPublished: true };
    //   // }
    // } else {
    //   // Assuming username is available in req.user
    //   query = { author: req.user, isPublished: false };
    // }
    const posts = await TagModel.findById({ _id: tagId })
      .populate({
        path: "posts",
        match: { isPublished: true }, // Filter based on isPublished field
      })
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned;
    console.log("posts in get id by post", posts?.posts);
    if (posts) {
      resp.status(200).json({ success: true, data: posts.posts });
    } else {
      resp.status(500).json({ success: false, data: null });
    }
  } catch (error) {
    resp.status(400).json({ error });
  }
};
export const getPost = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getpost", req.params.id);
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "comments",
      // populate: {
      //   path: "author", // Populate the author field of each comment
      // },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editOrPublishPost = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const postId = req.params.id;
  const { title, content, author, isPublished, tag, imageUrl } = req.body;
  console.log("tarun isPublished", isPublished);
  try {
    // Find the post by its ID and update its fields
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        author,
        isPublished,
        tag,
        userImage: imageUrl,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPost) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    console.log("updatedpost", updatedPost);
    if (isPublished) {
      const updatedAdminForDraft = await AdminModel.findOneAndUpdate(
        { username: author },
        // Pull the specified post ObjectId from the myDrafts array
        {
          $pull: { myDrafts: postId },
          $push: {
            // Add the ID of the new post to myPosts array if isPublished is true
            myPosts: postId,
          },
        },
        // Return the updated document after the operation
        { new: true }
      );
      console.log("updatedadmin", updatedAdminForDraft);
      if (!updatedAdminForDraft) {
        return resp
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }
      // await updatedAdminForDraft.save();
      return resp
        .status(200)
        .json({ success: true, data: updatedAdminForDraft });
    }

    resp.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside creatapost");
  const { title, content, author, isPublished, tag, imageUrl } = req.body;
  console.log(title, content, author);
  try {
    const post = new Post({
      title,
      content,
      author: author,
      createdAt: new Date(),
      comments: [],
      isPublished: isPublished,
      tag: tag,
      userImage: imageUrl,
    });
    await post.save();
    const isTagPresent = await TagModel.findOne({ tag: tag });

    if (!isTagPresent) {
      const newTag = new TagModel({
        tag: tag,
        posts: post._id,
      });
      await newTag.save();
    } else {
      isTagPresent.posts.push(post._id);
    }
    await isTagPresent?.save();

    // Update Admin schema with the new post
    const admin = await AdminModel.findOneAndUpdate(
      { username: author },
      {
        $push: {
          // Add the ID of the new post to myPosts array if isPublished is true
          ...(isPublished ? { myPosts: post._id } : { myDrafts: post._id }),
        },
      },
      { new: true }
    );

    if (admin) {
      res.status(201).json({ success: true, data: post });
    } else {
      return res.status(400).json({ success: false, data: null });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  const { content, authorId, parentId, userprofile } = req.body;
  console.log("inside creatapost", authorId, parentId, userprofile);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    console.log("post inside comment", post, req.params.id);
    const comment = new Comment({
      content,
      author: authorId,
      post: req.params.id,
      parentId: parentId,
      imageLink: userprofile,
    });
    console.log("commen before save", comment);
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    console.log("comment", comment);

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const commentId: String = req.params.id;
  const postId = req.params.postId;
  console.log("commentid", commentId, postId);
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }, // Remove the comment from the comments array
    });
    if (!post)
      resp.status(404).json({ success: false, message: "Post is not found" });
    console.log("post", post);
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return resp
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    resp
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "Server error" });
  }
};
export const upvoteComment = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  console.log("inside upvote");
  const commentId: String = req.params.id;
  const user = req.user;
  console.log(user);
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      {
        $inc: { "likes.likes": 1 }, // Increment likes by 1
        $set: { "likes.username": user }, // Set the username
      },
      { new: true }
    );
    if (!updatedComment) {
      return resp
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    console.log("upvoted comment", updatedComment);
    resp.status(200).json({ success: true, message: "upvoted successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "Server error" });
  }
};
export const editComment = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const commentId: String = req.params.id;
  const upvoted: boolean = req.query.upvoted === "true"; // Check if upvoted query parameter is true

  console.log("commentid in editcomment", commentId, req.body.content);
  try {
    let updatedComment;

    if (upvoted) {
      // Increment likes by 1
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likes: 1 } },
        { new: true }
      );
    } else {
      // Update content
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content: req.body.content },
        { new: true }
      );
    }
    console.log("updatedComment", updatedComment);
    if (!updatedComment) {
      return resp.status(404).json({ message: "Comment not found" });
    }

    resp.status(200).json({ message: "Comment editied successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Server error" });
  }
};
