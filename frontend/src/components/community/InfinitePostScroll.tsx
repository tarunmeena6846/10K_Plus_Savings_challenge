import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import { postState } from "../store/atoms/post";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
let count = 0;
// export const posts = [
//   // Sample post data
//   {
//     postId: "1",
//     userProfile: "user1_profile.jpg",
//     username: "user1",
//     postTime: new Date(),
//     imageContent: "./saving1.png",
//     title: "Sample Post Title 1",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//   },
//   {
//     postId: "2",
//     userProfile: "",
//     username: "user2",
//     postTime: new Date(),
//     imageContent: "./target.jpg",
//     title:
//       "Sample Post Title 1 asdasdasd asd as das asd asd asd asddasdas asdasdasas asd asd a sdasd asda dasd asd asd asd asd asd asd asd asd asd asd asd asd  ",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//   },
//   {
//     postId: "3",
//     userProfile: "user1_profile.jpg",
//     username: "user3",
//     postTime: new Date(),
//     imageContent: "",
//     title: "Sample Post Title 1",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//   },
//   {
//     postId: "4",
//     userProfile: "user1_profile.jpg",
//     username: "user4",
//     postTime: new Date(),
//     imageContent: "./target.png",
//     title: "Sample Post Title 1",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//   },
//   {
//     postId: "5",
//     userProfile: "user1_profile.jpg",
//     username: "user5",
//     postTime: new Date(),
//     imageContent: "",
//     title: "Sample Post Title 1",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//   },

//   // Add more posts as needed
// ];
export interface PostType {
  postId: string;
  userProfile: string;
  username: string;
  postTime: Date;
  imageContent: string;
  title: string;
  content: string;
}
const InfinitePostScroll = () => {
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  let currentOffset = 0;
  let loading = false; // Flag to prevent concurrent requests

  const loadTenPosts = () => {
    if (loading) return; // Prevent concurrent requests
    loading = true;
    console.log(currentOffset, "current offset");

    fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/post?offset=${currentOffset}&limit=10`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to fetch data");
        }
        return resp.json();
      })
      .then((data) => {
        console.log("inside data of load top ten", data);
        const tenPosts: PostType[] = data.posts.map((p: any) => ({
          postId: p._id,
          userProfile: "",
          username: p.author,
          postTime: new Date(p.createdAt),
          title: p.title,
          content: p.content,
        }));
        setPosts((prevPosts) => [...prevPosts, ...tenPosts]);
        currentOffset += data.posts.length;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        loading = false; // Reset the loading flag
      });
  };

  useEffect(() => {
    console.log("before load ten post");
    loadTenPosts();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      );
      if (currentHeight + 1 >= scrollHeight) {
        console.log("inside if of loadtenpost");
        loadTenPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array to ensure the effect runs only once

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
