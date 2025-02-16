// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { motion } from 'framer-motion'
// import LoadingAnimation from '@/components/LoadingAnimation'

// const WelcomePage = () => {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const token = searchParams.get('token')

//     if (token) {
//       localStorage.setItem('accessToken', token)
      
//       // Simulate a delay to show the welcome animation
//       const timeout = setTimeout(() => {
//         setIsLoading(false)
//         setTimeout(() => {
//           router.push('/')
//         }, 2000) // Wait for 2 seconds before redirecting
//       }, 3000) // 3 seconds delay

//       return () => clearTimeout(timeout)
//     } else {
//       router.push('/login')
//     }
//   }, [searchParams, router])

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#36393f] text-white">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-center"
//       >
//         <motion.h1
//           className="text-4xl font-bold mb-4"
//           initial={{ scale: 0.5 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//         >
//           Welcome to SideProjector!
//         </motion.h1>
//         <motion.p
//           className="text-xl mb-8 text-gray-300"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           We&apos;re excited to have you on board!
//         </motion.p>
//         {isLoading ? (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
//           >
//             <LoadingAnimation />
//             <p className="mt-4 text-gray-400">Setting things up for you...</p>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//           >
//             <p className="text-2xl font-semibold text-green-400">All set!</p>
//             <p className="mt-2 text-gray-400">Redirecting you to the dashboard...</p>
//           </motion.div>
//         )}
//       </motion.div>
//       <motion.div
//         className="absolute bottom-8 left-0 right-0 text-center text-gray-500"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1 }}
//       >
//         <p>Powered by SideProjector</p>
//       </motion.div>
//     </div>
//   )
// }

// export default WelcomePage



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/LoadingAnimation';

const WelcomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = window.location.href;
    const token = url.match(/token=([^&]*)/)?.[1];

    if (token) {
      localStorage.setItem('accessToken', token);

      console.log('Extracted Token:', token);

      const timeout = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          router.push('/');
        }, 2850);
      }, 3730);

      return () => clearTimeout(timeout);
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#36393f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          Welcome to Suized!
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We&apos;re excited to have you on board!
        </motion.p>
        {isLoading ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <LoadingAnimation />
            <p className="mt-4 text-gray-400">Setting things up for you...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-2xl font-semibold text-green-400">All set!</p>
            <p className="mt-2 text-gray-400">Redirecting you to the dashboard...</p>
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Powered by Suized</p>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
