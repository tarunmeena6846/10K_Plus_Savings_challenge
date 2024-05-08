import { SetterOrUpdater, useRecoilState } from "recoil";
import { PostType } from "./InfinitePostScroll";
import { useEffect, useState } from "react";

export const fetchTenPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  loading: boolean,
  setLoading,
  currentOffset: number,
  setCurrentOffset,
  tag?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null
) => {
  console.log("tag at fetch post", tag, currentOffset);
  if (loading) return;
  setLoading(true);

  let url = "";

  if (tag) {
    url = `${
      import.meta.env.VITE_SERVER_URL
    }/post/tags/${tag}?offset=${currentOffset}&limit=10`;
  } else {
    if (type === "allposts") {
      url = `${
        import.meta.env.VITE_SERVER_URL
      }/post?isPublished=${true}&offset=${currentOffset}&limit=10`;
    } else if (type === "myposts" || type === "mydrafts") {
      url = `${import.meta.env.VITE_SERVER_URL}/post/userPosts?isPublished=${
        type === "myposts" ? true : false
      }&offset=${currentOffset}&limit=10`;
    } else if (type === "mybookmarks") {
      url = `${
        import.meta.env.VITE_SERVER_URL
      }/post/getBookmarkPosts?offset=${currentOffset}&limit=10`;
    }
  }
  console.log("url before fetch", url, userEmail);
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
      console.log("posts data", data);

      const tenPosts: PostType[] = data.data.map((p: any) => ({
        postId: p._id,
        userProfile: p.userImage || "",
        username: p.author,
        postTime: new Date(p.createdAt),
        title: p.title,
        content: p.content,
      }));
      if (tenPosts.length === 0) {
        console.log("No more posts available");
        return;
      }
      console.log(
        "variables at fetch ",
        userEmail,
        isBookmarkedSet,
        isPublished
      );
      if (currentOffset === 0) {
        console.log("cuurentpost");
        // If offset is 0, replace existing posts with new posts
        setPosts(tenPosts);
      } else {
        // Otherwise, append new posts to existing posts
        setPosts((prevPosts: PostType[]) => [...prevPosts, ...tenPosts]);
      }
      setCurrentOffset((currentOffset += 10));
      console.log(currentOffset);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      setLoading(false);
    });
};

const useFetchPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  // currentOffset,
  // setCurrentOffset,
  // loading,
  // setLoading,
  tagId?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null
) => {
  // let currentOffset = 0;
  // let loading = false;
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("inside useEffect", tagId, currentOffset);

    // Fetch all posts
    // Reset currentOffset and posts when isPublished changes
    // currentOffset = 0;
    setPosts([]);
    fetchTenPosts(
      isPublished,
      setPosts,
      type,
      loading,
      setLoading,
      currentOffset,
      setCurrentOffset,
      tagId,
      userEmail,
      isBookmarkedSet
    );

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      );
      if (currentHeight + 1 >= scrollHeight) {
        // currentOffset = currentOffset + 10;
        console.log("currentoffset at scroll", currentOffset);
        fetchTenPosts(
          true,
          setPosts,
          type,
          loading,
          setLoading,
          currentOffset,
          setCurrentOffset,
          tagId,
          userEmail,
          isBookmarkedSet
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPublished, setPosts, tagId, userEmail, isBookmarkedSet]);
};

export default useFetchPosts;
