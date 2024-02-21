import React, { useEffect, useState } from "react";
import Post from "./Post";
export const posts = [
  // Sample post data
  {
    postId: "1",
    userProfile: "user1_profile.jpg",
    username: "user1",
    postTime: new Date(),
    imageContent: "./saving1.png",
    title: "Sample Post Title 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    postId: "2",
    userProfile: "",
    username: "user2",
    postTime: new Date(),
    imageContent: "./target.jpg",
    title:
      "Sample Post Title 1 asdasdasd asd as das asd asd asd asddasdas asdasdasas asd asd a sdasd asda dasd asd asd asd asd asd asd asd asd asd asd asd asd  ",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    postId: "3",
    userProfile: "user1_profile.jpg",
    username: "user3",
    postTime: new Date(),
    imageContent: "",
    title: "Sample Post Title 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    postId: "4",
    userProfile: "user1_profile.jpg",
    username: "user4",
    postTime: new Date(),
    imageContent: "./target.png",
    title: "Sample Post Title 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    postId: "5",
    userProfile: "user1_profile.jpg",
    username: "user5",
    postTime: new Date(),
    imageContent: "",
    title: "Sample Post Title 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },

  // Add more posts as needed
];
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
  // const [posts, setPosts] = useState<PostType[]>([]);
  // let currentOffset = 0;

  const loadTenPosts = () => {
    // // fetch(
    // //   `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentOffset}`,
    // //   {
    // //     method: "GET",
    // //   }
    // // )
    // //   .then((resp) => {
    // //     if (!resp.ok) {
    // //       throw new Error("Failed to fetch data");
    // //     }
    // //     return resp.json();
    // //   })
    // //   .then((data) => {
    // //     const tenPosts: PostType[] = data.results.map((p: any) => ({
    // //       postId: p.name,
    // //       userProfile: "",
    // //       username: "",
    // //       postTime: "",
    // //       title: "",
    // //       content: "",
    // //     }));
    //     setPosts((prevPosts) => [...prevPosts, ...tenPosts]);
    // })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
    // currentOffset += 10;
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex flex-col font-bold items-center justify-center  text-center">
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
