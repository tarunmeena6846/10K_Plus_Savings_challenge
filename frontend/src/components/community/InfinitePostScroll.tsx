import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "./Post/Post";
import { SetterOrUpdater, useRecoilState } from "recoil";
import Loader from "./Loader";

export interface PostType {
  postId: string;
  userProfile: string;
  username: string;
  postTime: Date;
  imageContent: string;
  title: string;
  content: string;
  type: string;
  tag: string;
}

const InfinitePostScroll = ({
  type,
  tag,
}: // hasMore,
// setHasMore,
{
  type: string;
  tag: string | null;
  // hasMore: string;
  // setHasMore: SetterOrUpdater;
}) => {
  console.log("start of infinite scroll", type);
  const [items, setItems] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(0); // Start index from 1
  const loaderRef = useRef<HTMLDivElement>(null);
  const prevTag = useRef<string | null>(null); // Use useRef to store the previous tag
  console.log(tag, hasMore);
  const fetchData = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    let url = "";

    // Construct URL based on conditions
    if (tag != "") {
      url = `${import.meta.env.VITE_SERVER_URL}/post/tags/${tag}?offset=${
        index * 10
      }&limit=10`;
    } else {
      if (type === "allposts") {
        url = `${
          import.meta.env.VITE_SERVER_URL
        }/post?isApprovalReqPost=${"approved"}&offset=${index * 10}&limit=10`;
      } else if (type === "myposts" || type === "mydrafts") {
        url = `${import.meta.env.VITE_SERVER_URL}/post/userPosts?isPublished=${
          type === "myposts"
        }&offset=${index * 10}&limit=10`;
      } else if (type === "mybookmarks") {
        url = `${
          import.meta.env.VITE_SERVER_URL
        }/post/getBookmarkPosts?offset=${index * 10}&limit=10`;
      } else if (type === "approvalReqPosts") {
        url = `${
          import.meta.env.VITE_SERVER_URL
        }/post?isApprovalReqPost=${"approvalPending"}&offset=${
          index * 10
        }&limit=10`;
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
      console.log("data", data);
      const tenPosts: PostType[] = data.data.map((p: any) => ({
        postId: p._id,
        userProfile: p.userImage || "",
        username: p.author,
        postTime: new Date(p.createdAt),
        title: p.title,
        content: p.content,
        tag: p.tag,
      }));

      // Update state only if new posts are fetched
      if (tenPosts.length > 0) {
        setItems((prevItems: PostType[]) => [...prevItems, ...tenPosts]);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log(hasMore);
        // No more posts to fetch
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      setIndex(0);
      console.error("Error fetching data:", error);
    }
    // setHasMore(false);
    setIsLoading(false);
  }, [isLoading, index, type, tag, hasMore]);

  useEffect(() => {
    // Check if tag has changed
    console.log(prevTag.current, tag);
    if (prevTag.current !== tag) {
      // Reset state when tag changes
      console.log("pointer at 95");
      setItems([]);
      setIndex(0);
      setHasMore(true);
      prevTag.current = tag;
      // Fetch data
      fetchData();
    }
  }, [tag]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        fetchData(); // Fetch more data when loader is intersecting and there are more items
      }
    });

    if (loaderRef.current && hasMore) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchData]);

  console.log(items);
  return (
    <div className="flex flex-col font-bold items-center justify-center">
      {isLoading && <Loader />}
      {items.map((post) => (
        <Post
          key={post.postId}
          userProfile={post.userProfile}
          postId={post.postId}
          username={post.username}
          postTime={post.postTime}
          imageContent={post.imageContent}
          title={post.title}
          content={post.content}
          type={type}
          tag={post.tag}
        />
      ))}
      {hasMore && <div ref={loaderRef}></div>}
    </div>
  );
};

export default InfinitePostScroll;
