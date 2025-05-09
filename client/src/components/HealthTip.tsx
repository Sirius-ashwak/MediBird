import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Health tip data interface
interface HealthTipData {
  id: number;
  tip: string;
  character: 'doctor' | 'nurse' | 'trainer' | 'scientist';
}

// Character illustrations using SVG
const CharacterIllustration = ({ character }: { character: HealthTipData['character'] }) => {
  switch (character) {
    case 'doctor':
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-500"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.9, 1],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M12 13v8" />
          <path d="M9 16h6" />
          <path d="M9 21h6" />
          <path d="M12 3v2" />
          <path d="M10 5h4" />
        </motion.svg>
      );
    case 'nurse':
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-500"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.9, 1],
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          <path d="M9 14v-4" />
          <path d="M15 14v-4" />
          <path d="M12 14v-4" />
          <path d="M12 10v4" />
          <path d="M9 22v-4" />
          <path d="M15 22v-4" />
          <path d="M12 22v-4" />
          <path d="M6 18h12" />
          <path d="M12 4v2" />
          <path d="M10 6h4" />
        </motion.svg>
      );
    case 'trainer':
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
          initial={{ scale: 0.8, rotate: 0 }}
          animate={{ 
            scale: [0.9, 1, 0.9],
            rotate: [0, 0, 5, 0, -5, 0] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M8 14h8" />
          <path d="M10 3L8 6" />
          <path d="M14 3L16 6" />
          <path d="M7 11l-2 4c-.28.56-.42.84-.42 1.1 0 .23.09.45.24.61.15.16.37.25.6.25.26 0 .54-.14 1.1-.42L10 14" />
          <path d="M17 11l2 4c.28.56.42.84.42 1.1 0 .23-.09.45-.24.61-.15.16-.37.25-.6.25-.26 0-.54-.14-1.1-.42L14 14" />
          <path d="M16 19L12 16l-4 3" />
          <path d="M16 21L12 18l-4 3" />
        </motion.svg>
      );
    case 'scientist':
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.9, 1],
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" />
          <path d="M10 8h4" />
          <path d="M8 2h8" />
          <path d="M13 2v2.12M11 2v2.12" />
          <path d="M10 15a2 2 0 0 0 4 0" />
        </motion.svg>
      );
    default:
      return null;
  }
};

// Health tip database
const healthTips: HealthTipData[] = [
  { 
    id: 1, 
    tip: "Remember to drink 8 glasses of water daily for optimal hydration!",
    character: "doctor"
  },
  { 
    id: 2, 
    tip: "Taking a 5-minute break every hour can help reduce eye strain when using digital devices.",
    character: "nurse"
  },
  { 
    id: 3, 
    tip: "A 30-minute walk each day can significantly improve your cardiovascular health.",
    character: "trainer"
  },
  { 
    id: 4, 
    tip: "Eating foods rich in antioxidants can help protect your cells from damage.",
    character: "scientist"
  },
  { 
    id: 5, 
    tip: "Regular health check-ups can help detect conditions before they become serious.",
    character: "doctor"
  },
  { 
    id: 6, 
    tip: "Spending time in nature can reduce stress and improve mental wellbeing.",
    character: "trainer"
  },
  { 
    id: 7, 
    tip: "Getting 7-9 hours of sleep per night supports immune function and cognitive health.",
    character: "scientist"
  },
  { 
    id: 8, 
    tip: "Maintaining a balanced diet rich in fruits and vegetables provides essential nutrients.",
    character: "doctor"
  },
  { 
    id: 9, 
    tip: "Regular hand washing is one of the best ways to prevent the spread of germs.",
    character: "nurse"
  },
  { 
    id: 10, 
    tip: "Taking deep breaths can help reduce stress and improve focus.",
    character: "trainer"
  }
];

interface HealthTipProps {
  // Optional custom position
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  // Auto show interval in ms, 0 to disable
  autoShowInterval?: number;
}

export const HealthTip: React.FC<HealthTipProps> = ({ 
  position = 'bottom-right',
  autoShowInterval = 120000, // default to 2 minutes
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<HealthTipData | null>(null);
  const [dismissed, setDismissed] = useState<number[]>([]);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };

  // Function to show a random health tip
  const showRandomTip = () => {
    const availableTips = healthTips.filter(tip => !dismissed.includes(tip.id));
    
    // Reset dismissed tips if all have been shown
    if (availableTips.length === 0) {
      setDismissed([]);
      setCurrentTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
    } else {
      setCurrentTip(availableTips[Math.floor(Math.random() * availableTips.length)]);
    }
    
    setIsVisible(true);
  };

  // Handle auto show interval
  useEffect(() => {
    if (autoShowInterval > 0) {
      const interval = setInterval(() => {
        showRandomTip();
      }, autoShowInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoShowInterval, dismissed]);

  // Handle dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    if (currentTip) {
      setDismissed(prev => [...prev, currentTip.id]);
    }
  };

  return (
    <>
      {/* Manually trigger a health tip button (could be placed elsewhere) */}
      <motion.button
        className={`fixed ${positionClasses['bottom-left']} z-30 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full p-2 shadow-lg`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={showRandomTip}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 11 2-2-2-2"/>
          <path d="M11 13h4"/>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
      </motion.button>
      
      {/* Health tip popup */}
      <AnimatePresence>
        {isVisible && currentTip && (
          <motion.div
            className={`fixed ${positionClasses[position]} z-40 max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-primary-100`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <div className="flex gap-4 p-4">
              <div className="flex-shrink-0">
                <CharacterIllustration character={currentTip.character} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">Health Tip</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full" 
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <motion.p 
                  className="mt-1 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentTip.tip}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="bg-gradient-to-r from-primary-50 to-blue-50 p-2 flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-white hover:bg-primary-50"
                onClick={handleDismiss}
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthTip;