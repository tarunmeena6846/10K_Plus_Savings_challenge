import { motion } from "framer-motion";
import TextEditor from "./TextEditor";
import Button from "../Button";
import TextFieldWithDropdown from "./InputField";

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

  return (
    <div className="flex flex-col h-full items-center justify-center m-20">
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
          <label htmlFor="discussion-message" className="block font-semibold">
            Discussion Message
          </label>
          <TextEditor
            height="400px"
            setHtmlContent={setPostContent}
            content={content}
          />
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Tags
          </label>
          <TextFieldWithDropdown setTags={setTag} tag={tag} />
          <motion.button>Show tags</motion.button>
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
