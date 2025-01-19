// // // // import React, { useEffect, useState } from "react";
// // // // import MarkdownPreview from "@uiw/react-markdown-preview";

// // // // const renderTextWithEmojis = (content, emojis) => {
// // // //   if (!emojis || !Array.isArray(emojis)) {
// // // //     return content;
// // // //   }

// // // //   const emojiRegex = /:([\w-]+):/g;

// // // //   return content.replace(emojiRegex, (match, emojiName) => {
// // // //     const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
// // // //     if (emoji) {
// // // //       return `<img 
// // // //       src="${emoji.emojiUrl}" 
// // // //       alt="${emoji.emojiTitle}" 
// // // //       title="${emoji.emojiTitle}" 
// // // //       class="inline-block w-8 h-8 object-contain rounded-none" 
// // // //       style="background: transparent;" 
// // // //     />`;
// // // //     }
// // // //     return match;
// // // //   });
// // // // };

// // // // const fetchEmojis = async () => {
// // // //   try {
// // // //     const response = await fetch("/api/emojis");
// // // //     const data = await response.json();
// // // //     return data;
// // // //   } catch (error) {
// // // //     console.error("Error fetching emojis:", error);
// // // //     return [];
// // // //   }
// // // // };

// // // // const MarkdownWithEmojis = ({ content }) => {
// // // //   const [emojis, setEmojis] = useState([]);

// // // //   useEffect(() => {
// // // //     const loadEmojis = async () => {
// // // //       const fetchedEmojis = await fetchEmojis();
// // // //       setEmojis(fetchedEmojis);
// // // //     };

// // // //     loadEmojis();
// // // //   }, []);

// // // //   const processedContent = renderTextWithEmojis(content, emojis);

// // // //   return (
// // // //     <MarkdownPreview
// // // //       className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
// // // //       source={processedContent}
// // // //       style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
// // // //       data-color-mode="dark"
// // // //     />
// // // //   );
// // // // };

// // // // export default MarkdownWithEmojis;

// // // import React, { useEffect, useState, useRef, useMemo } from "react";
// // // import MarkdownPreview from "@uiw/react-markdown-preview";

// // // const renderTextWithEmojis = (content, emojis) => {
// // //   if (!emojis || !Array.isArray(emojis)) {
// // //     return content;
// // //   }

// // //   const emojiRegex = /:([\w-]+):/g;

// // //   return content.replace(emojiRegex, (match, emojiName) => {
// // //     const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
// // //     if (emoji) {
// // //       return `<img 
// // //         src="${emoji.emojiUrl}" 
// // //         alt="${emoji.emojiTitle}" 
// // //         title="${emoji.emojiTitle}" 
// // //         class="inline-block w-8 h-8 object-contain rounded-none" 
// // //         style="background: transparent;" 
// // //       />`;
// // //     }
// // //     return match;
// // //   });
// // // };

// // // const fetchEmojis = async () => {
// // //   try {
// // //     const response = await fetch("/api/emojis");
// // //     const data = await response.json();
// // //     return data;
// // //   } catch (error) {
// // //     console.error("Error fetching emojis:", error);
// // //     return [];
// // //   }
// // // };

// // // const MarkdownWithEmojis = ({ content }) => {
// // //   const [emojis, setEmojis] = useState([]);
// // //   const emojisCache = useRef(null);

// // //   useEffect(() => {
// // //     const loadEmojis = async () => {
// // //       if (!emojisCache.current) {
// // //         const fetchedEmojis = await fetchEmojis();
// // //         emojisCache.current = fetchedEmojis;
// // //         setEmojis(fetchedEmojis);
// // //       } else {
// // //         setEmojis(emojisCache.current);
// // //       }
// // //     };

// // //     loadEmojis();
// // //   }, []);

// // //   const processedContent = useMemo(() => renderTextWithEmojis(content, emojis), [content, emojis]);

// // //   return (
// // //     <MarkdownPreview
// // //       className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
// // //       source={processedContent}
// // //       style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
// // //       data-color-mode="dark"
// // //     />
// // //   );
// // // };

// // // export default MarkdownWithEmojis;


// // import React, { useEffect, useState, useRef, useMemo } from "react";
// // import MarkdownPreview from "@uiw/react-markdown-preview";

// // const renderTextWithEmojis = (content, emojis) => {
// //   if (!emojis || !Array.isArray(emojis)) {
// //     return content;
// //   }

// //   const emojiRegex = /:([\w-]+):/g;

// //   return content.replace(emojiRegex, (match, emojiName) => {
// //     const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
// //     if (emoji) {
// //       // Return Markdown-compatible syntax for images
// //       return `![${emoji.emojiTitle}](${emoji.emojiUrl} "Emoji: ${emoji.emojiTitle}")`;
// //     }
// //     return match; // Leave untouched if emoji not found
// //   });
// // };

// // const fetchEmojis = async () => {
// //   try {
// //     const response = await fetch("/api/emojis");
// //     const data = await response.json();
// //     return data;
// //   } catch (error) {
// //     console.error("Error fetching emojis:", error);
// //     return [];
// //   }
// // };

// // const MarkdownWithEmojis = ({ content }) => {
// //   const [emojis, setEmojis] = useState([]);
// //   const emojisCache = useRef(null);

// //   useEffect(() => {
// //     const loadEmojis = async () => {
// //       if (!emojisCache.current) {
// //         const fetchedEmojis = await fetchEmojis();
// //         emojisCache.current = fetchedEmojis;
// //         setEmojis(fetchedEmojis);
// //       } else {
// //         setEmojis(emojisCache.current);
// //       }
// //     };

// //     loadEmojis();
// //   }, []);

// //   const processedContent = useMemo(
// //     () => (emojis.length > 0 ? renderTextWithEmojis(content, emojis) : content),
// //     [content, emojis]
// //   );

// //   return (
// //     <MarkdownPreview
// //       className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
// //       source={processedContent}
// //       style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
// //       data-color-mode="dark"
// //     />
// //   );
// // };

// // export default MarkdownWithEmojis;


// import React, { useEffect, useState, useRef, useMemo } from "react";
// import MarkdownPreview from "@uiw/react-markdown-preview";

// // Render emojis as custom <img> tags with full control
// const renderTextWithEmojis = (content, emojis) => {
//   if (!emojis || !Array.isArray(emojis)) {
//     return content;
//   }

//   const emojiRegex = /:([\w-]+):/g;

//   return content.replace(emojiRegex, (match, emojiName) => {
//     const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
//     if (emoji) {
//       return `<img 
//         src="${emoji.emojiUrl}" 
//         alt="${emoji.emojiTitle}" 
//         title="${emoji.emojiTitle}" 
//         class="custom-emoji"
//       />`;
//     }
//     return match; // Return the original text if no matching emoji is found
//   });
// };

// const fetchEmojis = async () => {
//   try {
//     const response = await fetch("/api/emojis");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching emojis:", error);
//     return [];
//   }
// };

// const MarkdownWithEmojis = ({ content }) => {
//   const [emojis, setEmojis] = useState([]);
//   const emojisCache = useRef(null);

//   useEffect(() => {
//     const loadEmojis = async () => {
//       if (!emojisCache.current) {
//         const fetchedEmojis = await fetchEmojis();
//         emojisCache.current = fetchedEmojis;
//         setEmojis(fetchedEmojis);
//       } else {
//         setEmojis(emojisCache.current);
//       }
//     };

//     loadEmojis();
//   }, []);

//   const processedContent = useMemo(
//     () => (emojis.length > 0 ? renderTextWithEmojis(content, emojis) : content),
//     [content, emojis]
//   );

//   return (
//     <MarkdownPreview
//       className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
//       source={processedContent}
//       style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
//       data-color-mode="dark"
//     />
//   );
// };

// export default MarkdownWithEmojis;


import React, { useEffect, useState, useMemo } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const renderTextWithEmojis = (content, emojis) => {
  if (!emojis || !Array.isArray(emojis)) {
    return content;
  }

  const emojiRegex = /:([\w-]+):/g;

  return content.replace(emojiRegex, (match, emojiName) => {
    const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
    if (emoji) {
      // Replace with Markdown-compatible <img> tag
      return `![${emoji.emojiTitle}](${emoji.emojiUrl} "Emoji")`;
    }
    return match;
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
  const emojisCache = useMemo(() => new Map(), []);

  useEffect(() => {
    const loadEmojis = async () => {
      if (emojisCache.size === 0) {
        const fetchedEmojis = await fetchEmojis();
        fetchedEmojis.forEach((emoji) => {
          emojisCache.set(emoji.emojiTitle, emoji);
        });
        setEmojis(fetchedEmojis);
      } else {
        setEmojis(Array.from(emojisCache.values()));
      }
    };

    loadEmojis();
  }, [emojisCache]);

  const processedContent = useMemo(() => renderTextWithEmojis(content, emojis), [content, emojis]);

  return (
    <MarkdownPreview
      className="m-0 bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md markdown-body"
      source={processedContent}
      style={{ backgroundColor: "rgba(24, 24, 27, 0.5)" }}
      data-color-mode="dark"
    />
  );
};

export default MarkdownWithEmojis;
