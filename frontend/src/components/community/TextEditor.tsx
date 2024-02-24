import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
// import "./TextEditor.css"; // Add your custom styles here

const TextEditor = ({ height, setHtmlContent }) => {
  const [editorHtml, setEditorHtml] = useState("");

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
    // console.log(html);
  };

  return (
    <div style={{ height, background: "white", marginBottom: "50px" }}>
      <style>{`.ql-editor { background-color: white !important; }`}</style>
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
