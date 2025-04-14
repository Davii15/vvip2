import { motion } from "framer-motion";

export default function NewThisWeekBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.9, 1.1, 0.9],
        opacity: 1
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        NEW THIS WEEK
      </div>
    </motion.div>
  );
}