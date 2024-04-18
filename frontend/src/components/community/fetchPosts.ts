import { SetterOrUpdater, useRecoilState } from "recoil";
import { PostType } from "./InfinitePostScroll";
import { useEffect } from "react";

export const fetchTenPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  loading: boolean,
  currentOffset: number,
  tag?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null,
  setCount?: SetterOrUpdater<{
    myDiscussionCount: number;
    bookmarkCount: number;
    draftCount: number;
  }>
) => {
  console.log("tag at fetch post", tag);
  if (loading) return;
  loading = true;

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
      // console.log(data);

      const tenPosts: PostType[] = data.data.map((p: any) => ({
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
      console.log(
        "variables at fetch ",
        userEmail,
        isBookmarkedSet,
        isPublished
      );
      if (currentOffset === 0) {
        // If offset is 0, replace existing posts with new posts
        setPosts(tenPosts);
      } else {
        // Otherwise, append new posts to existing posts
        setPosts((prevPosts: PostType[]) => [...prevPosts, ...tenPosts]);
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

const useFetchPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  tagId?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null,
  setCount?: SetterOrUpdater<{
    myDiscussionCount: number;
    bookmarkCount: number;
    draftCount: number;
  }>
) => {
  let currentOffset = 0;
  let loading = false;

  useEffect(() => {
    console.log("inside useEffect", tagId);

    // Fetch all posts
    // Reset currentOffset and posts when isPublished changes
    currentOffset = 0;
    setPosts([]);
    fetchTenPosts(
      isPublished,
      setPosts,
      type,
      loading,
      currentOffset,
      tagId,
      userEmail,
      isBookmarkedSet,
      setCount
    );

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      );
      if (currentHeight + 1 >= scrollHeight) {
        fetchTenPosts(
          true,
          setPosts,
          type,
          loading,
          currentOffset,
          tagId,
          userEmail,
          isBookmarkedSet,
          setCount
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPublished, setPosts, tagId, userEmail, isBookmarkedSet, setCount]);
};

export default useFetchPosts;
