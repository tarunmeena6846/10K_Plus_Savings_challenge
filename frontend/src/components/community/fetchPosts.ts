import { SetterOrUpdater, useRecoilState } from "recoil";
import { PostType } from "./InfinitePostScroll";
import { useEffect, useState } from "react";

export const fetchTenPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  currentOffset: number,
  tag?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null
) => {
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
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const tenPosts: PostType[] = data.data.map((p: any) => ({
      postId: p._id,
      userProfile: p.userImage || "",
      username: p.author,
      postTime: new Date(p.createdAt),
      title: p.title,
      content: p.content,
    }));

    if (currentOffset === 0) {
      setPosts(tenPosts);
    } else {
      setPosts((prevPosts: PostType[]) => [...prevPosts, ...tenPosts]);
    }

    return tenPosts.length;
  } catch (error) {
    console.error("Error fetching data:", error);
    return 0;
  }
};

const useFetchPosts = (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  type: string,
  tagId?: string | undefined,
  userEmail?: string | null,
  isBookmarkedSet?: boolean | null
) => {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;

      setLoading(true);
      const newItemsCount = await fetchTenPosts(
        isPublished,
        setPosts,
        type,
        currentOffset,
        tagId,
        userEmail,
        isBookmarkedSet
      );
      setCurrentOffset((prevOffset) => prevOffset + newItemsCount);
      setLoading(false);
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchData();
      }
    });

    observer.observe(document.getElementById("loader")); // Change "loader" to the actual ID of your loader element

    return () => {
      observer.disconnect();
    };
  }, [
    isPublished,
    setPosts,
    type,
    currentOffset,
    tagId,
    userEmail,
    isBookmarkedSet,
    loading,
  ]);

  return loading;
};

export default useFetchPosts;
