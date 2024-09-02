import React, { useEffect, useState } from "react";
import Post from "./Post/Post"; // Assuming you have a Post component
import { postState } from "../store/atoms/post";
import { PostType } from "./InfinitePostScroll";
import { useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import debounce from "lodash.debounce";
import Popup from "./Popup";

const fetchSearchResult = async (query) => {
  console.log(query);
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/post/search?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response is not correct");
  }
  const data = await response.json();
  console.log(data);
  if (data.success) {
    console.log(data.post);
    return data.post;
  }
  return null;
};

const DiscussionForum = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: results,
    isFetching,
    error,
  } = useQuery(
    ["searchPosts", searchQuery],
    () => fetchSearchResult(searchQuery),
    {
      enabled: !!searchQuery, // Only run query if query string is not empty
      staleTime: 5 * 60 * 1000, // Optional: cache data for 5 minutes
      cacheTime: 10 * 60 * 1000, // Optional: keep data in cache for 10 minutes
    }
  );

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // filterPosts(query);
  };
  // // console.log(posts);
  // const filterPosts = (query) => {
  //   const filtered = posts.filter((post) =>
  //     post.title.toLowerCase().includes(query.toLowerCase())
  //   );
  //   console.log(filtered);
  //   setFilteredPosts(filtered);
  // };

  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  React.useEffect(() => {
    if (results && results.length > 0) {
      handleOpenPopup();
    }
  }, [results]);
  console.log(results);
  return (
    <div className="container mx-auto">
      <div className="mt-8 mb-4 flex justify-center">
        <input
          type="text"
          className="w-3/4 p-3 border rounded-2xl pl-10"
          style={{
            backgroundImage: `url(./search.svg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            // paddingLeft: "20px",
          }}
          value={searchQuery}
          placeholder="Search ..."
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="flex justify-center">
        {isFetching && <div>Loading...</div>}
        {error && <div>Error fetching results</div>}
        {searchQuery.length > 0 ? (
          <div className="z-9999 ">
            {results && results.length > 0 ? (
              <div>
                {/* Popup Component */}
                {showPopup && (
                  <Popup results={results} onClose={handleClosePopup} />
                )}
              </div>
            ) : (
              searchQuery && !isFetching && <div>No results found</div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;
