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
    <div className="ql-snow">
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />
    </div>
  );
  // var tag_id = document.getElementById("content-div");
  // if (tag_id) {
  //   tag_id.innerHTML = "HTML string";
  // }

  //   console.log(markup);
  // return <h1 dangerouslySetInnerHTML={{ __html: markup }} />;
};
// render(<MarkdownPreview markdown={undefined} />, document.getElementById("root"));

export default MarkdownPreview;
