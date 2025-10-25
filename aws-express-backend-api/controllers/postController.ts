import { AuthenticatedRequest } from "../middleware";
import { Response } from "express";
import { Post, PostModel } from "../models/dynamodb/Post";
import { UserModel } from "../models/dynamodb/User";
import { TagModel } from "../models/dynamodb/Tag";
import { CommentModel } from "../models/dynamodb/Comment";
// import { sendAdminPostNotification } from "../routes/reminders";

/**
 * Controller to get all posts.
 * @param req Request object containing query parameters like offset and limit.
 * @param res Response object to send the result.
 */
export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getAllpost");
  try {
    // const emailNotifcationResponse = await sendAdminPostNotification();

    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const isApprovalReqPost = req.query.isApprovalReqPost;
    console.log("isApprovalReqPosts", isApprovalReqPost);
    const posts = await PostModel.findAll(limit);
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
    if (type === "delete") {
      await PostModel.delete(postId);
    } else {
      await PostModel.update(postId, { status: type as "approved" | "rejected" });
      // console.log("inside post", posts);
    }
    res.status(200).json({ sucess: true });
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
    // const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = req.user;
    const isPublished = req.query.isPublished;
    console.log("user at getuserpost", user, isPublished);
    const adminInfo = await UserModel.findByEmail(user!);
    if (!adminInfo) {
      return resp.status(404).json({ success: false, data: "User not found" });
    }
    const posts = await PostModel.findByAuthor(adminInfo.email, limit);
    resp.status(200).json({ success: true, data: posts });
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
    const userInfo = await UserModel.findByEmail(username!);
    if (!userInfo) {
      return resp.status(404).json({ success: false, data: "User not found" });
    }
    
    await UserModel.update(userInfo.PK, { [pullField]: [...userInfo[pullField], postId] });
    await PostModel.delete(postId);
    resp.status(200).json({ success: true });
  } catch (error: any) {
    resp.status(500).json({ message: error.message });
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
    const bookmarkedPostsForUser = await UserModel.findByEmail(req?.user!);
    if (!bookmarkedPostsForUser) {
      return resp.status(404).json({ success: false, data: "User not found" });
    }
    const bookmarkedPosts = await PostModel.findByIds(bookmarkedPostsForUser.bookmarkedPosts);
    resp.status(200).json({ success: true, data: bookmarkedPosts });
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
    const userInfo = await UserModel.findByEmail(username!);
    if (!userInfo) {
      return resp.status(404).json({ success: false, data: "User not found" });
    }
    await UserModel.update(userInfo.PK, { bookmarkedPosts: [...userInfo.bookmarkedPosts, postId] });
    resp.status(200).json({ success: true });
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
    const tags = await TagModel.findAll(100); // Exclude _id field
    res.status(200).json({ success: true, data: tags });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    const tagPosts = await TagModel.findByTag(tagId)
    if (!tagPosts) {
        return resp.status(404).json({ success: false, data: "Tag not found" });
      }
      const posts = await PostModel.findByIds(tagPosts.posts);
      resp.status(200).json({ success: true, data: posts });
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
    const post = await PostModel.findById(req.params.id);
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

    const updatedPost = await PostModel.update(postId, updatedFields as unknown as Partial<Post>);
    const updatedUser = await UserModel.update(author, { myPosts: [...(await UserModel.findByEmail(author))?.myPosts || [], postId] });
    resp.status(200).json({ success: true, data: updatedPost });
  } catch (error: any) {
    console.error("Error in editOrPublishPost:", error);
    resp.status(500).json({ message: error.message });
  }
};

/**
 * Controller to create a post.
 * @param req Request object containing username and postID, title,content, author, isPublished, tag, and imageURL.
 * @param resp Response object to send the result.
 */
// export const createPost = async (req: AuthenticatedRequest, res: Response) => {
//   console.log("inside creatapost");
//   const { title, content, author, isPublished, tag, imageUrl } = req.body;
//   console.log(title, content, author, tag);

//   try {
//     const post = new Post({
//       title,
//       content,
//       author: author,
//       createdAt: new Date(),
//       comments: [],
//       isPublished: isPublished,
//       tag: tag,
//       userImage: imageUrl,
//     });
//     await post.save();
//     if (tag != "") {
//       let tagmodel = await TagModel.findOne({ tag: tag });

//       if (!tagmodel) {
//         tagmodel = new TagModel({
//           tag: tag,
//           posts: [],
//         });
//       }
//       console.log("post_id in create", post._id);
//       tagmodel.posts.push(post._id as mongoose.Types.ObjectId);

//       await tagmodel?.save();
//       console.log("tagid", tagmodel);
//     }
//     // Update Admin schema with the new post
//     const adminUpdate = isPublished
//       ? { $push: { ["myPosts"]: post._id } }
//       : { $push: { ["myDrafts"]: post._id } };
//     console.log("adminUpdate", adminUpdate, author, isPublished);
//     const admin = await AdminModel.findOneAndUpdate(
//       { username: author },
//       adminUpdate,
//       { new: true }
//     );
//     await admin?.save();
//     console.log("new admin after update", admin);
//     if (admin) {
//       const emailNotifcationResponse = await sendAdminPostNotification(
//         post._id,
//         admin.username,
//         post.title,
//         admin.isAdmin
//       );

//       console.log("postnotifcation ", emailNotifcationResponse);

//       res.status(201).json({ success: true, data: post });
//     } else {
//       return res.status(400).json({ success: false, data: null });
//     }
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };
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
    const comment = await CommentModel.create({
      content,
      author: authorId,
      post: req.params.id,
      parentId: parentId,
      imageLink: userprofile,
    });
    console.log("update post and new comment", comment);

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
    await PostModel.update(postId, { comments: (await PostModel.findById(postId))?.comments.filter(comment => comment !== commentId) });
    await CommentModel.delete(commentId as string);
    resp.status(200).json({ success: true });
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
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return resp.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const hasUpvoted = comment.likes.users.includes(user as string);
    const updatedComment = await CommentModel.update(commentId, { likes: { users: hasUpvoted ? comment.likes.users.filter(user => user !== user) : [...comment.likes.users, user as string], likes: hasUpvoted ? comment.likes.likes - 1 : comment.likes.likes + 1 } });
    resp.status(200).json({ success: true, data: updatedComment });
  } catch (error: any) {
    resp.status(500).json({ message: error.message });
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
    const updatedComment = await CommentModel.update(
      commentId as string,
      { content: req.body.content }
    );

    resp.status(200).json({ message: "Comment editied successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Server error" });
  }
};

export const searchPost = async (req: AuthenticatedRequest, resp: Response) => {
  const query = req.query.query;
  console.log("search query ", query);
  try {
    const posts = await PostModel.findAll(100);
    console.log(posts);
    resp.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    resp.status(500).json({ message: error.message });
  }
};
