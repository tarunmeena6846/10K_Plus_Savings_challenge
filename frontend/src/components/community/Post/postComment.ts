export const handleComment = async (
  commentContent: string,
  postId: string,
  userEmail: string,
  parentId: string | null
) => {
  console.log("inside handlecomment");
  console.log("parentId", parentId);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/post/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          content: commentContent,
          authorId: userEmail,
          parentId: parentId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network Response is not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
