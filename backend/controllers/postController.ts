import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import { Model } from "mongoose";
import { Response, Request } from "express";
import { TagModel } from "../models/tagSchema";

export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  console.log("inside getAllpost");
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const isPublished = req.query.isPublished as string;
    const user = req.query.user as string;
    console.log("tarun isPublished", req.user, isPublished, offset, user);
    let query = {};
    if (isPublished === "true") {
      if (user === undefined) {
        query = { isPublished: true };
      } else {
        query = { author: user, isPublished: true };
      }
    } else {
      // Assuming username is available in req.user
      query = { author: req.user, isPublished: false };
    }
    // Fetch posts from the database with pagination
    const posts = await Post.find(query)
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned
    console.log("inside post", posts);

    res.status(200).json({ posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

export const getTags = async (req: Request, res: Response) => {
  console.log("tarun inside getags");
  try {
    const tags = await TagModel.find({}, { tag: 1, _id: 0 }); // Exclude _id field
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
) => {};
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
    console.log("post", post);
    res.status(201).json(post);
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
