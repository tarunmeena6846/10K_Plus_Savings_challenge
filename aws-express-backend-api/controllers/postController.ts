import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import mongoose, { ObjectId } from "mongoose";
import { Response } from "express";
import { TagModel } from "../models/tagSchema";
import AdminModel from "../models/admin";

/**
 * Controller to get all posts.
 * @param req Request object containing query parameters like offset and limit.
 * @param res Response object to send the result.
 */
export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getAllpost");
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const isApprovalReqPost = req.query.isApprovalReqPost;
    console.log("isApprovalReqPosts", isApprovalReqPost);
    const posts = await Post.find({
      isPublished: true,
      status: isApprovalReqPost,
    })
      .sort({ createdAt: -1 })
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned
    console.log("inside post", posts);

    res.status(200).json({ sucess: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveOrDeclinePost = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("inside aprovePost");
  try {
    const postId = req.params.id;
    const { type } = req.body;
    console.log("isApprovalReqPosts", postId, type);
    // Update the post
    const updatedFields = {
      status: type,
    };

    const options = { new: true };
    const posts = await Post.findByIdAndUpdate(postId, updatedFields, options);
    console.log("inside post", posts);

    res.status(200).json({ sucess: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Controller to get posts by a specific user.
 * @param req Request object containing query parameters like offset, limit, and user information.
 * @param res Response object to send the result.
 */
export const getUserPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = req.user;
    const isPublished = req.query.isPublished;
    console.log("user at getuserpost", user, isPublished);
    const adminInfo = await AdminModel.aggregate([
      { $match: { email: user } },
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

    console.log("adminInfo at get", adminInfo);
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

/**
 * Controller to delete a post from the database or admin's records.
 * @param req Request object containing post ID, type, and user information.
 * @param resp Response object to send the result.
 */
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
      { email: username },
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

/**
 * Controller to get bookmarked post for the user.
 * @param req Request object containing query parameters like offset and limit.
 * @param resp Response object to send the result.
 */
export const getBookmarkPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const bookmarkedPostsForUser = await AdminModel.aggregate([
      { $match: { email: req?.user } },
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

/**
 * Controller to bookmark a Post.
 * @param req Request object containing PostId and username.
 * @param resp Response object to send the result.
 */
export const bookmarkedPosts = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const { postId } = req.body;
  const username = req.user;
  try {
    const updateResult = await AdminModel.findOneAndUpdate(
      { email: username },
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

/**
 * Controller to get all the tags from the DB.
 * @param req Request object containing username.
 * @param resp Response object to send the result.
 */
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

/**
 * Controller to get all the post related to a specific tags from the DB.
 * @param req Request object containing username, and TagID.
 * @param resp Response object to send the result.
 */
export const getPostByTag = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const tagId = req.params.tagId;
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
/**
 * Controller to get post based on post._id from the DB.
 * @param req Request object containing username and postID.
 * @param resp Response object to send the result.
 */
export const getPost = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getpost", req.params.id);
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "comments",
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Controller to edit a draft post or publish the draft post.
 * @param req Request object containing username and postID, title,content, author, isPublished, tag, and imageURL.
 * @param resp Response object to send the result.
 */
export const editOrPublishPost = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const postId = req.params.id;
  const { title, content, author, isPublished, tag, imageUrl } = req.body;
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
        { email: author },
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
    resp.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error in editOrPublishPost:", error);
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to create a post.
 * @param req Request object containing username and postID, title,content, author, isPublished, tag, and imageURL.
 * @param resp Response object to send the result.
 */
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
    let tagmodel = await TagModel.findOne({ tag: tag });

    if (!tagmodel) {
      tagmodel = new TagModel({
        tag: tag,
        posts: [],
      });
    }
    console.log("post_id in create", post._id);
    tagmodel.posts.push(post._id as mongoose.Types.ObjectId);

    await tagmodel?.save();
    console.log("tagid", tagmodel);
    // Update Admin schema with the new post
    const adminUpdate = isPublished
      ? { $push: { ["myPosts"]: post._id } }
      : { $push: { ["myDrafts"]: post._id } };
    console.log("adminUpdate", adminUpdate, author, isPublished);
    const admin = await AdminModel.findOneAndUpdate(
      { email: author },
      adminUpdate,
      { new: true }
    );
    await admin?.save();
    console.log("new admin after update", admin);
    if (admin) {
      res.status(201).json({ success: true, data: post });
    } else {
      return res.status(400).json({ success: false, data: null });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * Controller to add comment to a post.
 * @param req Request object containing username and , title,content, author, isPublished, tag, and imageURL.
 * @param resp Response object to send the result.
 */
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  const { content, authorId, parentId, userprofile } = req.body;
  console.log("inside creatapost", authorId, parentId, userprofile, content);
  try {
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
    console.log("commen after save");

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id },
    });

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    console.log("update post and new comment", comment, updatedPost);

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * Controller to delete a comment from a post.
 * @param req Request object containing username and postid, and commentid.
 * @param resp Response object to send the result.
 */
export const deleteComment = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  const commentId: String = req.params.id;
  const postId = req.params.postId;

  console.log("commentid", commentId, postId, req.user);
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, isPublished: true }, // TODO check this query its not updating the usage of index in mongoDB
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

/**
 * Controller to upvote a comment.
 * @param req Request object containing username and commentID.
 * @param resp Response object to send the result.
 */
export const upvoteComment = async (
  req: AuthenticatedRequest,
  resp: Response
) => {
  console.log("inside upvote");
  const commentId: string = req.params.id;
  const user = req.user;
  console.log(user);

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return resp.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const hasUpvoted = comment.likes.users.includes(user as string);
    const update = hasUpvoted
      ? { $inc: { "likes.likes": -1 }, $pull: { "likes.users": user } }
      : { $inc: { "likes.likes": 1 }, $push: { "likes.users": user } };

    const updatedComment = await Comment.findByIdAndUpdate(commentId, update, {
      new: true,
    });

    const message = hasUpvoted
      ? "Removed upvote successfully"
      : "Upvoted successfully";

    resp.status(200).json({
      success: true,
      message,
      comment: updatedComment,
    });
    console.log("updated comment", updatedComment);
  } catch (error) {
    console.error(error);
    resp.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Controller to edit a comment.
 * @param req Request object containing username and commentID.
 * @param resp Response object to send the result.
 */
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
