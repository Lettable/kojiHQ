import React, { useEffect, useState } from "react";
import MarkdownIt from "markdown-it"; // For Markdown parsing
import MarkdownPreview from "@uiw/react-markdown-preview";

const renderTextWithEmojis = (htmlContent, emojis) => {
  if (!emojis || !Array.isArray(emojis)) {
    return htmlContent;
  }

  const emojiRegex = /:([\w-]+):/g;

  // Replace emoji placeholders in the rendered HTML content
  return htmlContent.replace(emojiRegex, (match, emojiName) => {
    const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
    if (emoji) {
      return `<img 
        src="${emoji.emojiUrl}" 
        alt="${emoji.emojiTitle}" 
        title="${emoji.emojiTitle}" 
        class="inline-block w-8 h-8 object-contain rounded-none" 
        style="background: transparent;" 
      />`;
    }
    return match; // Return the original text if emoji not found
  });
};

const fetchEmojis = async () => {
  try {
    const response = await fetch("/api/emojis");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching emojis:", error);
    return [];
  }
};

const MarkdownWithEmojis = ({ content }) => {
  const [emojis, setEmojis] = useState([]);
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    const loadEmojis = async () => {
      const fetchedEmojis = await fetchEmojis();
      setEmojis(fetchedEmojis);
    };

    loadEmojis();
  }, []);

  useEffect(() => {
    if (content && emojis.length > 0) {
      const md = new MarkdownIt();
      const renderedMarkdown = md.render(content);
      const htmlWithEmojis = renderTextWithEmojis(renderedMarkdown, emojis);
      setProcessedContent(htmlWithEmojis);
    }
  }, [content, emojis]);

  return (
    <div
      className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
      dangerouslySetInnerHTML={{ __html: processedContent }}
      style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
      data-color-mode="dark"
    />
  );
};

export default MarkdownWithEmojis;
