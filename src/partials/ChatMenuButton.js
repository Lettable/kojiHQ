import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from 'lucide-react';

const ChatMenuButton = ({ isDarkTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOptionClick = (option) => {
    if (option === 'liveGroupChat') {
      window.location.href = '/chat-box';
    } else if (option === 'personalChat') {
      window.location.href = '/chat';
    }
    handleClose();
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 w-10 rounded-full p-4 shadow-lg ${isDarkTheme ? 'bg-yellow-400/30 text-white' : 'bg-black text-white'}`}
      >
        <MessageCircleIcon className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className={`absolute right-0 bottom-full mb-2 ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'} rounded-lg shadow-lg p-2`}>
          <button onClick={() => handleOptionClick('liveGroupChat')} className={`flex items-center w-full text-left p-2 hover:${isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-300'} whitespace-nowrap`}>
            Shout Box
          </button>
          <hr />
          <button onClick={() => handleOptionClick('personalChat')} className={`flex items-center w-full text-left p-2 hover:${isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-300'} whitespace-nowrap`}>
            Personal Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMenuButton;
