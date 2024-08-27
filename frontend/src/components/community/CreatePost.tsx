import { motion } from "framer-motion";
import TextEditor from "./TextEditor";
import Button from "../Button";
import TextFieldWithDropdown from "./InputField";
import { useEffect, useState } from "react";
import { fetchTags, tagDataType } from "./SideBar";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/user";

const HandleCreatePost = ({
  onSubmit,
  onCancel,
  title,
  setPostTitle,
  content,
  setPostContent,
  tag,
  setTag,
}) => {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  const handleCreatePost = (isPublished: Boolean) => {
    console.log("tarun at createpost wrapper");
    console.log("at createpost", title, content, tag);
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));

    onSubmit(isPublished);
  };

  const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  // const options = ["Option 1", "Option 2", "Option 3"];

  useEffect(() => {
    const fetchTagsFromDB = async () => {
      console.log("here");
      try {
        const response = await fetchTags();
        console.log(response);
        const tags = response.map((obj) => obj.tag);
        console.log(tags);
        setPopularTags(tags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTagsFromDB();
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center m-20 mb-10">
      <div className="w-full max-w-3xl p-4">
        <div>
          <h2 className="text-3xl">New Discussion</h2>
        </div>
        <div className="mt-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Discussion Title
          </label>
          <motion.input
            id="discussion-title"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Tags
          </label>
          <TextFieldWithDropdown
            setProp={setTag}
            prop={tag}
            propValues={popularTags}
            placeholder={""}
          />
          {/* <motion.button>Show tags</motion.button> */}
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-message" className="block font-semibold">
            Discussion Message
          </label>
          <TextEditor
            height="400px"
            setHtmlContent={setPostContent}
            content={content}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`p-4 rounded-3xl text-white ${
              currentUserState.isLoading ? "bg-gray-300" : "bg-[#6d94ff]"
            }`}
            onClick={() => handleCreatePost(false)}
            disabled={currentUserState.isLoading} // Disable the button when isLoading is true
          >
            Save as Draft
          </button>
          <button
            className={`p-4 rounded-3xl text-white ${
              currentUserState.isLoading ? "bg-gray-300" : "bg-[#6d94ff]"
            }`}
            onClick={() => handleCreatePost(true)}
            disabled={currentUserState.isLoading} // Disable the button when isLoading is true
          >
            Post Discussion
          </button>
          <button
            className={`p-4 rounded-3xl text-white bg-[#6d94ff]`}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreatePost;
