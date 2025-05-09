import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the toggle once mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants for the icon switch
  const iconVariants = {
    initial: { opacity: 0, y: -10, scale: 0.8, rotate: -30 },
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    exit: { opacity: 0, y: 10, scale: 0.8, rotate: 30 }
  };

  // For background animation
  const backgroundVariants = {
    light: { 
      background: 'linear-gradient(to right, #f9fafb, #e4e6eb)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
    },
    dark: { 
      background: 'linear-gradient(to right, #1e2734, #121a29)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      animate={theme === 'dark' ? 'dark' : 'light'}
      variants={backgroundVariants}
      transition={{ duration: 0.5 }}
      className="relative rounded-full p-1 hover-glow"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="relative w-9 h-9 rounded-full"
      >
        <motion.div
          key={theme}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={iconVariants}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-blue-300" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
}