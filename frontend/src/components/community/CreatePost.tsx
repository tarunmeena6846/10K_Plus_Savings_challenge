import { motion } from "framer-motion";
import TextEditor from "./TextEditor";
import Button from "../Button";
import TextFieldWithDropdown from "./InputField";
import { useEffect, useState } from "react";
import { fetchTags, tagDataType } from "./SideBar";

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
  const handleCreatePost = (isPublished: Boolean) => {
    console.log("tarun at createpost wrapper");
    console.log("at createpost", title, content, tag);
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

        <div>
          <Button onClick={() => handleCreatePost(false)}>Save as Draft</Button>
          <Button onClick={() => handleCreatePost(true)}>
            Post Discussion
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreatePost;
