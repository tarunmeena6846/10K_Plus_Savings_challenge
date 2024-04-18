import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import { Model } from "mongoose";
import { Response, Request } from "express";
import { TagModel } from "../models/tagSchema";
import AdminModel, { Admin } from "../models/admin";

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
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;
  const user = req.user;
  const isPublished = req.query.isPublished;
  console.log("user at getuserpost", user);
  const adminInfo = await AdminModel.findOne({ username: user })
    .populate(isPublished === "true" ? "myPosts" : "myDrafts")
    .skip(offset)
    .limit(limit);
  console.log("admin info at getuserPOsts route", adminInfo, isPublished);
  if (adminInfo) {
    resp.status(200).json({
      success: true,
      data: isPublished === "true" ? adminInfo.myPosts : adminInfo.myDrafts,
    });
  } else {
    resp.status(400).json({ success: false, data: null });
  }
};
export const getBookmarkPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  try {
    const bookmarkedPostsForUser = await AdminModel.findOne({
      username: req?.user,
    }).populate("bookmarkedPosts");
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
    const admin = await AdminModel.findOneAndUpdate(
      { username },
      { $addToSet: { bookmarkedPosts: postId } }, // Use $addToSet to add postId only if it doesn't already exist
      { new: true }
    );

    if (admin) {
      if (admin.bookmarkedPosts.includes(postId)) {
        return resp
          .status(200)
          .json({ success: false, data: "Post already bookmarked" });
      } else {
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
  try {
    const tags = await TagModel.find({}, { tag: 1 }); // Exclude _id field
    // const tags = { tag: "tagone" };
    console.log("tags in db", tags);
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
export const getPost = async (req: Request, res: Response) => {
  console.log("inside getpost");
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

export const createPost = async (req: Request, res: Response) => {
  console.log("inside creatapost");
  const { title, content, author, isPublished, tag } = req.body;
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

export const addComment = async (req: Request, res: Response) => {
  const { content, authorId, parentId } = req.body;
  console.log("inside creatapost", authorId, parentId);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    console.log("post inside comment", post, req.params.id);
    const comment = new Comment({
      content,
      author: authorId,
      post: req.params.id,
      parentId: parentId,
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    console.log("comment", comment);

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, resp: Response) => {
  const commentId: String = req.params.id;
  const postId = req.params.postId;
  console.log("commentid", commentId, postId);
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }, // Remove the comment from the comments array
    });
    if (!post) resp.status(404).json("Post is not found");
    console.log("post", post);
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return resp.status(404).json({ message: "Comment not found" });
    }

    resp.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Server error" });
  }
};

export const editComment = async (req: Request, resp: Response) => {
  const commentId: String = req.params.id;
  // const postId = req.params.postId;
  console.log("commentid in editcomment", commentId, req.body.content);
  try {
    // const post = await Post.findById(postId);
    // if (!post) resp.status(404).json("Post is not found");
    // console.log("post", post);
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: req.body.content }, // newContent is the updated content
      { new: true }
    ); // To return the updated document);
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
