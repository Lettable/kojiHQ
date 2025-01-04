import { toast } from 'react-toastify';

const triggerNotification = (message) => {
  toast(`You were mentioned by ${message.username}!`);
};

export default triggerNotification;