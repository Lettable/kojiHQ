import React, { useEffect, useState, useMemo } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const renderTextWithEmojis = (content, emojis, users) => {
  if (!emojis || !Array.isArray(emojis)) {
    return content;
  }

  const emojiRegex = /:([\w-]+):/g;
  let processed = content.replace(emojiRegex, (match, emojiName) => {
    const emoji = emojis.find((e) => e.emojiTitle === `:${emojiName}:`);
    if (emoji) {
      return `![${emoji.emojiTitle}](${emoji.emojiUrl} "Emoji")`;
    }
    return match;
  });

  const mentionRegex = /@([\w-]+)/g;
  processed = processed.replace(mentionRegex, (match, username) => {
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const user = users.find(u =>
      u.username.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanUsername
    );

    const effectClass = user ? user.usernameEffect : 'mention-default';
    return `<a href="/user/${username}" class="mention ${effectClass}">@${username}</a>`;
  });

  return processed;
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

const fetchUsers = async () => {
  try {
    const response = await fetch("/api/mics/mention-regex");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const MarkdownWithEmojis = ({ content, style = {}, users = [], emojisData = []}) => {
  const [emojis, setEmojis] = useState(emojisData || []);
  const [allUsers, setAllUsers] = useState(users);
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

    const loadUsers = async () => {
      if (!users) {
        const fetchedUsers = await fetchUsers();
        setAllUsers(fetchedUsers);
      }
    };

    loadUsers();
    loadEmojis();
  }, [emojisCache, users]);

  // const processedContent = useMemo(() => renderTextWithEmojis(content, emojis), [content, emojis]);
  const processedContent = useMemo(
    () => renderTextWithEmojis(content, emojis, allUsers),
    [content, emojis, allUsers]
  );

  const defaultStyle = {
    margin: 0,
    padding: '8px',
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    color: "#c9d1d9",
    borderRadius: '4px',
  };

  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <MarkdownPreview
      className="markdown-body"
      source={processedContent}
      style={mergedStyle}
      data-color-mode="dark"
    />
  );
};

export default MarkdownWithEmojis;