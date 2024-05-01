import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const TextEditor = ({ height, setHtmlContent, content }) => {
  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    // Set the initial value of the editor when the content prop changes
    setEditorHtml(content);
  }, [content]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const handleChange = (html) => {
    setHtmlContent(html);
    setEditorHtml(html);
  };

  return (
    <div
      style={{
        height,
        background: "white",
        marginBottom: "10px",
        resize: "vertical",
        overflow: "auto",
      }}
    >
      <ReactQuill
        style={{ height: "100%", borderRadius: "6px" }}
        theme="snow"
        modules={modules}
        formats={formats}
        value={editorHtml}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextEditor;

