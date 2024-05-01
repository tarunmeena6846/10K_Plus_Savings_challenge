import { Remarkable } from "remarkable";
import Dompurify from "isomorphic-dompurify";

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return { __html: renderedHTML };
}

export default function MarkdownPreview({ markdown }) {
//   const markup = `
//       <h1>How Blockchain is Saving the World</h1>
//       <p>
//         In his last public speech, <br>
//         the <strong>founder</strong> of the popular 
//         blockchain network, <br> <em>Vitalic Buterin</em>
//         said...
//       </p>
//     `;
//   console.log(markup);
  return <h1 dangerouslySetInnerHTML={{ __html: markdown }} />;
}
