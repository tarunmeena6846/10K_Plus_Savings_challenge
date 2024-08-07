import React, { useState } from "react";
import Post from "./Post/Post"; // Assuming you have a Post component
import { postState } from "../store/atoms/post";
import { PostType } from "./InfinitePostScroll";
import { useRecoilValue } from "recoil";
const DiscussionForum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const posts = useRecoilValue(postState);
  const [searchTrigger, setSearchTrigger] = useState(false);
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterPosts(query);
  };

  const filterPosts = (query) => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filtered);
    setFilteredPosts(filtered);
  };

  return (
    <div className="container mx-auto">
      <div className="mt-8 mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-3/4 p-2 border rounded-2xl"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      {searchQuery.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5  font-bold items-center ">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Post
                key={post.postId}
                userProfile={post.userProfile}
                postId={post.postId}
                username={post.username}
                postTime={post.postTime}
                imageContent={post.imageContent}
                title={post.title}
                content={post.content}
                type=""
              />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DiscussionForum;
