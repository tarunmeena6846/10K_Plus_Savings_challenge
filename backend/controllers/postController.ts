import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import mongoose from "mongoose";
import { Response } from "express";
import { TagModel } from "../models/tagSchema";
import AdminModel from "../models/admin";

export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getAllpost");
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await Post.find({ isPublished: true })
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned
    console.log("inside post", posts);

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
export const deletePostFromDbOrAdmin = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const postId = req.params.id;
  const type = req.params.type;
  const username = req.user;
  console.log("postId and type", postId, type);

  try {
    // Prepare the pull operation dynamically based on the type
    const pullField =
      type === "mydrafts"
        ? "myDrafts"
        : type === "mybookmarks"
        ? "bookmarkedPosts"
        : "myPosts";

    // Perform the update and delete operations concurrently
    const updatePromise = AdminModel.findOneAndUpdate(
      { username: username },
      { $pull: { [pullField]: postId } },
      { new: true } // Return the updated document
    );
    console.log("updatePromise", updatePromise);
    let deletePromise: Promise<mongoose.Document | null> | undefined;
    if (type === "myposts" || type === "allposts") {
      deletePromise = Post.findByIdAndDelete(postId);
    }

    const [deletedPostFromAdmin, deletePostInDB] = await Promise.all([
      updatePromise,
      deletePromise,
    ]);

    if (!deletedPostFromAdmin) {
      return resp
        .status(404)
        .json({ success: false, data: "Admin or Post not found" });
    }

    console.log("deletedPostFromAdmin", deletedPostFromAdmin);
    if (deletePostInDB) {
      console.log("deletePostInDB", deletePostInDB);
    }

    resp.status(200).json({ success: true, data: deletedPostFromAdmin });
  } catch (error) {
    console.error("Error deleting post:", error);
    resp.status(500).json({ success: false, data: "Post delete failed" });
  }
};
export const getBookmarkPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const startTime = performance.now();

    const bookmarkedPostsForUser = await AdminModel.aggregate([
      { $match: { username: req?.user } },
      {
        $lookup: {
          from: "posts",
          localField: "bookmarkedPosts",
          foreignField: "_id",
          as: "bookmarkedPosts",
        },
      },
      {
        $project: {
          bookmarkedPosts: { $slice: ["$bookmarkedPosts", offset, limit] },
        },
      },
    ]);

    console.log(
      "bookmarkedPostsForUser",
      bookmarkedPostsForUser[0]?.bookmarkedPosts || []
    );
    const endTime = performance.now();
    console.log("Execution Time at getBookmarkedPosts", endTime - startTime);

    if (bookmarkedPostsForUser.length > 0) {
      resp.status(200).json({
        success: true,
        data: bookmarkedPostsForUser[0].bookmarkedPosts,
      });
    } else {
      resp.status(400).json({ success: false, data: null });
    }
  } catch (error) {
    console.error(error);
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
    const updateResult = await AdminModel.findOneAndUpdate(
      { username: username },
      { $addToSet: { bookmarkedPosts: postId } }, // Use $addToSet to add postId only if it doesn't already exist
      { new: true, upsert: false }
    );

    if (updateResult) {
      if (updateResult.bookmarkedPosts.includes(postId)) {
        return resp
          .status(200)
          .json({ success: true, data: "Post bookmarked successfully" });
      } else {
        return resp
          .status(200)
          .json({ success: false, data: "Failed to bookmark post" });
      }
    } else {
      return resp.status(400).json({ success: false, data: "Admin not found" });
    }
  } catch (error) {
    return resp.status(500).json(error);
  }
};
export const getTags = async (req: AuthenticatedRequest, res: Response) => {
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
  const startTime = performance.now();
  try {
    console.log("tagId", tagId);
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await TagModel.findById({ _id: tagId })
      .populate({
        path: "posts",
        match: { isPublished: true }, // Filter based on isPublished field
      })
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned;

    const endTime = performance.now();
    console.log("Execution time at getpostbytag", endTime - startTime);
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
  const startTime = performance.now();
  try {
    // Validate input data
    if (!postId || !title || !content || !author || !tag) {
      return resp
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Update the post
    const updatedFields = {
      title,
      content,
      author,
      tag,
      userImage: imageUrl,
      updatedAt: new Date(),
      isPublished: isPublished,
    };

    const options = { new: true };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedFields,
      options
    );

    if (!updatedPost) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // If the post is published, update the admin's records
    if (isPublished) {
      const updatedAdminForDraft = await AdminModel.findOneAndUpdate(
        { username: author },
        {
          $pull: { myDrafts: postId },
          $addToSet: { myPosts: postId }, // Use $addToSet to prevent duplicate entries
        },
        options
      );

      if (!updatedAdminForDraft) {
        return resp
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }
    }
    const endTime = performance.now();
    console.log("Execution time at updateorpublish", endTime - startTime);
    resp.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error in editOrPublishPost:", error);
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside creatapost");
  const { title, content, author, isPublished, tag, imageUrl } = req.body;
  console.log(title, content, author);

  try {
    const startTime = performance.now();
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
    let tagmodel = await TagModel.findOne({ tag: tag });

    if (!tagmodel) {
      tagmodel = new TagModel({
        tag: tag,
        posts: [],
      });
    }
    tagmodel.posts.push(post._id);

    await tagmodel?.save();

    // Update Admin schema with the new post
    const adminUpdate = isPublished
      ? { $push: { myPosts: post._id } }
      : { $push: { myDraft: post._id } };
    const admin = await AdminModel.findOneAndUpdate(
      { username: author },
      adminUpdate,
      { new: true }
    );
    const endTime = performance.now();

    console.log("Execution time at crate post", endTime - startTime);
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
    const startTime = performance.now();
    // const post = await Post.findByIdAndUpdate(req.params.id);
    const comment = new Comment({
      content,
      author: authorId,
      post: req.params.id,
      parentId: parentId,
      imageLink: userprofile,
    });
    console.log("commen before save", comment);
    await comment.save();
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id },
    });

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    const endTime = performance.now();
    console.log("execution time at ad comment ", endTime - startTime);
    console.log("update post and new comment", comment, updatedPost);

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

  console.log("commentid", commentId, postId, req.user);
  try {
    const startTime = performance.now();
    const post = await Post.findOneAndUpdate(
      { _id: postId, author: req.user, isPublished: true }, // TODO check this query its not updating the usage of index in mongoDB
      {
        $pull: { comments: commentId }, // Remove the comment from the comments array
      },
      { new: true } // Return the updated document after the operation
    );
    if (post === null) {
      return resp
        .status(404)
        .json({ success: false, message: "Post is not found" });
    }
    console.log("post", post);
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    const endTime = performance.now();
    console.log("execution time at delete comment", endTime - startTime);
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

  console.log("commentid in editcomment", commentId, req.body.content);
  try {
    // Update content
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: req.body.content },
      { new: true }
    );

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
