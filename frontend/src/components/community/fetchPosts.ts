import { SetterOrUpdater } from "recoil";
import { PostType } from "./InfinitePostScroll";

export const fetchTenPosts = async (
  isPublished: boolean,
  setPosts: SetterOrUpdater<PostType[]>,
  loading: boolean,
  currentOffset: number,
  tag?: string | undefined,
  userEmail?: string | null
) => {
  if (loading) return;
  loading = true;
  console.log(tag, "tarun username for my post ");
  let url = "";

  if (tag) {
    url = `${import.meta.env.VITE_SERVER_URL}/post/tags/${tag}`;
  } else {
    url = `${
      import.meta.env.VITE_SERVER_URL
    }/post?isPublished=${isPublished}&offset=${currentOffset}&limit=10`;
    if (userEmail != null) {
      url = `${
        import.meta.env.VITE_SERVER_URL
      }/post?user=${userEmail}&isPublished=${isPublished}&offset=${currentOffset}&limit=10`;
    }
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
      console.log(data.data);
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

export default fetchTenPosts;
