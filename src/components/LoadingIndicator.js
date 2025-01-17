import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center mt-[100px] items-center h-full">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-10 h-10 border-4 border-t-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingIndicator;