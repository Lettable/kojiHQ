import { motion } from 'framer-motion'

const LoadingAnimation = () => {
  const circleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  }

  const transition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: 'easeInOut',
  }

  return (
    <motion.div className="flex justify-center items-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="w-3 h-3 bg-indigo-500 rounded-full"
          variants={circleVariants}
          initial="start"
          animate="end"
          transition={{
            ...transition,
            delay: index * 0.15,
          }}
        />
      ))}
    </motion.div>
  )
}

export default LoadingAnimation

