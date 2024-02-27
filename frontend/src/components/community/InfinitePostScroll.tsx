import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import { postState } from "../store/atoms/post";
import { useRecoilState } from "recoil";

export interface PostType {
  postId: string;
  userProfile: string;
  username: string;
  postTime: Date;
  imageContent: string;
  title: string;
  content: string;
}

const InfinitePostScroll = ({
  isPublished,
  userEmail,
}: {
  isPublished: boolean;
  userEmail: string | null;
}) => {
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  let currentOffset = 0;
  let loading = false;

  const loadTenPosts = () => {
    if (loading) return;
    loading = true;
    console.log(userEmail, "tarun username for my post ");
    let url = `${
      import.meta.env.VITE_SERVER_URL
    }/post?isPublished=${isPublished}&offset=${currentOffset}&limit=10`;
    if (userEmail != null) {
      url = `${
        import.meta.env.VITE_SERVER_URL
      }/post?user=${userEmail}&isPublished=${isPublished}&offset=${currentOffset}&limit=10`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to fetch data");
        }
        return resp.json();
      })
      .then((data) => {
        const tenPosts: PostType[] = data.posts.map((p: any) => ({
          postId: p._id,
          userProfile: "",
          username: p.author,
          postTime: new Date(p.createdAt),
          title: p.title,
          content: p.content,
        }));
        if (tenPosts.length === 0) {
          console.log("No more posts available");
          return;
        }
        if (currentOffset === 0) {
          // If offset is 0, replace existing posts with new posts
          setPosts(tenPosts);
        } else {
          // Otherwise, append new posts to existing posts
          setPosts((prevPosts) => [...prevPosts, ...tenPosts]);
        }
        currentOffset += tenPosts.length;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        loading = false;
      });
  };

  useEffect(() => {
    // Reset currentOffset and posts when isPublished changes
    currentOffset = 0;
    setPosts([]);
    loadTenPosts();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      );
      if (currentHeight + 1 >= scrollHeight) {
        loadTenPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPublished]); // Trigger effect when isPublished changes

  return (
    <div className="flex flex-col font-bold items-center justify-center">
      {posts.map((post) => (
        <Post
          key={post.postId}
          userProfile={post.userProfile}
          postId={post.postId}
          username={post.username}
          postTime={post.postTime}
          imageContent={post.imageContent}
          title={post.title}
          content={post.content}
        />
      ))}
    </div>
  );
};

export default InfinitePostScroll;
