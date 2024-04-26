export const handleComment = async (
  commentContent: string,
  postId: string,
  userEmail: string,
  parentId: string | null,
  type: string,
  commentId?: string
) => {
  console.log("inside handlecomment", commentContent, postId);
  console.log("parentId", parentId);

  try {
    let url = `${import.meta.env.VITE_SERVER_URL}/post/${postId}/comments`;
    if (type === "save") {
      url = `${import.meta.env.VITE_SERVER_URL}/post/${commentId}`;
    }
    const response = await fetch(url, {
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
    });

    if (!response.ok) {
      throw new Error("Network Response is not ok");
    }

    const data = await response.json();
    console.log("at postcomment", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
