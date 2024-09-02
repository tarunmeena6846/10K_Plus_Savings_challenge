import { Remarkable } from "remarkable";
import Dompurify from "isomorphic-dompurify";

const md = new Remarkable();

function formatUrls(text) {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  console.log(urlRegex);
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function renderMarkdownToHTML(markdown) {
  console.log(markdown);
  const formattedMarkdown = formatUrls(markdown); // Format URLs before rendering
  console.log(formattedMarkdown);
  // const sanitizedHTML = Dompurify.sanitize(md.render(formattedMarkdown));
  return { __html: formattedMarkdown };
  // return { __html: markdown };
}

const MarkdownPreview = ({ markdown }) => {
  return (
    <div className="ql-snow text-[#9ca3af]">
      <div
        className="ql-editor pl-0"
        dangerouslySetInnerHTML={renderMarkdownToHTML(markdown)}
      />
    </div>
  );
};

export default MarkdownPreview;
