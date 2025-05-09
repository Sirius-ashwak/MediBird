import { ReactNode, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cardHoverVariants, fadeInVariants, slideUpVariants } from "@/lib/animation-utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: "good" | "warning" | "danger";
  icon?: ReactNode;
  progress?: number;
  link?: {
    label: string;
    href: string;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  unit, 
  status,
  icon, 
  progress, 
  link 
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 group"
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
      animate={{ 
        boxShadow: isHovered 
          ? "0 10px 30px rgba(0, 0, 0, 0.08)" 
          : "0 4px 6px rgba(0, 0, 0, 0.05)" 
      }}
    >
      {/* Animated gradient accent on top */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"
        animate={{ 
          opacity: isHovered ? 1 : 0.8,
          width: isHovered ? "100%" : "95%"
        }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      
      {/* Background pattern for depth (subtle) */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      
      <motion.div
        className="relative"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.span 
            className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase"
            animate={{ 
              color: isHovered ? "var(--primary-600)" : "var(--slate-500)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.span>
          
          {status && (
            <motion.span 
              className={`text-xs font-bold ${
                status === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              } py-1 px-3 rounded-full flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  status === 'good' ? 'bg-green-500' : 
                  status === 'warning' ? 'bg-amber-500' : 
                  'bg-red-500'
                }`}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              ></motion.span>
              {status === 'good' ? 'Good' : status === 'warning' ? 'Fair' : 'Attention'}
            </motion.span>
          )}
          
          {icon && !status && (
            <motion.div 
              className="h-9 w-9 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                backgroundColor: isHovered ? "var(--primary-100)" : "var(--primary-50)" 
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="flex items-baseline mb-1"
          variants={slideUpVariants}
        >
          <motion.span 
            className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              color: isHovered ? "var(--primary-700)" : "var(--slate-800)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
          
          {unit && (
            <motion.span 
              className="ml-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
              animate={{ y: isHovered ? -1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {unit}
            </motion.span>
          )}
        </motion.div>
        
        {progress !== undefined && (
          <motion.div 
            className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden"
            animate={{ opacity: isHovered ? 1 : 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={`${
                progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                progress >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                'bg-gradient-to-r from-red-400 to-red-500'
              } h-2 rounded-full shadow-inner`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.2
              }}
            ></motion.div>
          </motion.div>
        )}
        
        {link && (
          <motion.div 
            className="flex items-center mt-4 text-sm"
            variants={fadeInVariants}
            transition={{ delay: 0.3 }}
          >
            <Link href={link.href} className="group">
              <motion.div 
                className="text-primary-600 dark:text-primary-400 font-medium flex items-center"
                whileHover={{ color: "var(--primary-700)" }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
                <motion.svg 
                  className="ml-1 w-4 h-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  animate={{ x: isHovered ? 3 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </motion.svg>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
