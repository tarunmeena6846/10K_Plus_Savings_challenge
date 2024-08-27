import { Remarkable } from "remarkable";
import Dompurify from "isomorphic-dompurify";
import { render } from "react-dom";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import Quill styles

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return { __html: renderedHTML };
}

const MarkdownPreview = ({ markdown }) => {
  console.log(markdown);
  return (
    <div className="ql-snow text-[#9ca3af]">
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />
    </div>
  );
};

export default MarkdownPreview;
