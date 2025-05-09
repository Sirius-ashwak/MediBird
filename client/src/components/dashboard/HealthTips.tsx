import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Category-specific health tips
interface HealthTipCategory {
  id: string;
  name: string;
  color: string; // Tailwind color class
  icon: JSX.Element;
  tips: string[];
}

// Character component for personalized recommendations
const TipCharacter: React.FC<{ emotion: 'happy' | 'thinking' | 'excited'; animate?: boolean }> = ({ 
  emotion, 
  animate = true 
}) => {
  
  // Base animation properties
  const animationProps = animate ? {
    animate: { 
      y: [0, -5, 0],
      rotate: emotion === 'thinking' ? [-2, 2, -2] : 0
    },
    transition: { 
      duration: emotion === 'excited' ? 1 : 2,
      repeat: Infinity,
      repeatType: "mirror" as const
    }
  } : {};
  
  // Render different emotions with different styles and animations
  switch (emotion) {
    case 'happy':
      return (
        <motion.div
          className="bg-green-100 dark:bg-green-900/40 dark:shadow-inner dark:shadow-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center"
          {...animationProps}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" x2="9.01" y1="9" y2="9"/>
            <line x1="15" x2="15.01" y1="9" y2="9"/>
          </svg>
        </motion.div>
      );
    
    case 'thinking':
      return (
        <motion.div
          className="bg-blue-100 dark:bg-blue-900/40 dark:shadow-inner dark:shadow-blue-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center"
          {...animationProps}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
            <circle cx="12" cy="12" r="10"/>
            <line x1="9" x2="9.01" y1="9" y2="9"/>
            <line x1="15" x2="15.01" y1="9" y2="9"/>
            <line x1="8" x2="16" y1="13" y2="13"/>
          </svg>
        </motion.div>
      );
      
    case 'excited':
      return (
        <motion.div
          className="bg-purple-100 dark:bg-purple-900/40 dark:shadow-inner dark:shadow-purple-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
            y: [0, -7, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 9a2 2 0 0 1 4 0"/>
            <path d="M12 17v.01"/>
            <path d="M16 9a2 2 0 0 1-4 0"/>
            <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
          </svg>
        </motion.div>
      );
      
    default:
      return null;
  }
};

// Health tip categories with dynamic icons
const tipCategories: HealthTipCategory[] = [
  {
    id: 'nutrition',
    name: 'Nutrition',
    color: 'green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
        <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>
        <path d="M17.5 2H20a2 2 0 0 1 2 2v2.5"/>
        <path d="M2 12h5"/>
        <path d="M2 18h7"/>
        <path d="M18 20v-5c0-2 4-3.1 4-5 0-1.9-1.3-3-3-3s-3 1.1-3 3"/>
      </svg>
    ),
    tips: [
      "Try incorporating more colorful fruits and vegetables into your meals for a wider range of nutrients.",
      "Aim for at least 5 servings of fruits and vegetables each day for optimal health.",
      "Consider adding healthy fats like avocados, nuts, and olive oil to your diet.",
      "Stay hydrated! Water supports every system in your body, from digestion to brain function.",
      "Whole grains provide more nutrients and fiber than refined grains—try swapping white bread for whole grain."
    ]
  },
  {
    id: 'exercise',
    name: 'Physical Activity',
    color: 'blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.9 15 3-3a21.2 21.2 0 0 0 3.6-5.5"/>
        <path d="m12.6 6.5 2 2"/>
        <path d="M20 15a13.5 13.5 0 0 0-5.5-9"/>
        <path d="M12 13a4.5 4.5 0 0 0 4.5 4.5"/>
        <path d="M19 16a6.5 6.5 0 0 0-1-8"/>
      </svg>
    ),
    tips: [
      "Even short bursts of activity throughout the day add up to significant health benefits.",
      "Try to incorporate strength training exercises at least twice a week to maintain muscle mass.",
      "Walking is an excellent form of exercise. Aim for 30 minutes most days of the week.",
      "Stretching improves flexibility and may help prevent injuries—try to incorporate it into your routine.",
      "Finding activities you enjoy makes it easier to stay motivated with regular exercise."
    ]
  },
  {
    id: 'mental',
    name: 'Mental Wellbeing',
    color: 'purple',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
        <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/>
        <path d="M2 12v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"/>
        <path d="M12 12H4a2 2 0 1 0 0 4h16a2 2 0 1 1 0 4H6"/>
      </svg>
    ),
    tips: [
      "Practicing mindfulness for just a few minutes each day can help reduce stress and anxiety.",
      "Quality sleep is essential for mental health—aim for a consistent sleep schedule.",
      "Social connections are vital for wellbeing. Try to maintain regular contact with supportive people.",
      "Taking short breaks during focused work can help maintain mental energy and prevent burnout.",
      "Spending time in nature, even just a short walk in a park, can improve mood and reduce stress."
    ]
  },
  {
    id: 'prevention',
    name: 'Preventive Care',
    color: 'amber',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
        <path d="M9 12h.01"/>
        <path d="M15 12h.01"/>
        <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
        <path d="M19 9v3a6.98 6.98 0 0 1-3.32 5.94A2 2 0 0 0 14 20.28a19.6 19.6 0 0 1-4 0a2 2 0 0 0-1.68-2.34A6.98 6.98 0 0 1 5 12V9"/>
        <path d="M4 15.86V15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.86"/>
        <path d="M7 15v-1a5 5 0 0 1 10 0v1"/>
        <path d="m13 7.75-.95.95"/>
        <path d="m18 4-3.53 3.52"/>
        <path d="M11.53 8.47 8 12"/>
        <path d="m13 9 3-3"/>
        <path d="M12 12a2 2 0 0 0 0-4"/>
      </svg>
    ),
    tips: [
      "Regular health check-ups help catch potential issues early when they're most treatable.",
      "Maintaining current vaccinations is an important part of preventive health care.",
      "Knowing your family health history can help you and your doctor identify potential risk factors.",
      "Screen time before bed can disrupt sleep. Try to avoid screens an hour before bedtime.",
      "Regular dental check-ups are important not just for oral health but for overall wellbeing."
    ]
  },
];

// Helper function to get random tip
const getRandomTip = (category: string): { tip: string, category: HealthTipCategory } => {
  const selectedCategory = tipCategories.find(c => c.id === category) || 
                          tipCategories[Math.floor(Math.random() * tipCategories.length)];
  
  const tipIndex = Math.floor(Math.random() * selectedCategory.tips.length);
  return { 
    tip: selectedCategory.tips[tipIndex],
    category: selectedCategory
  };
};

interface HealthTipsProps {
  preferredCategory?: string;
  showRandomInitially?: boolean;
}

const HealthTips: React.FC<HealthTipsProps> = ({ 
  preferredCategory,
  showRandomInitially = true 
}) => {
  const [currentTip, setCurrentTip] = useState<{ tip: string, category: HealthTipCategory } | null>(null);
  const [reaction, setReaction] = useState<'liked' | 'disliked' | null>(null);
  const [tipCount, setTipCount] = useState(0);
  
  // Get user health profile to personalize tips
  const { data: healthProfile } = useQuery({
    queryKey: ["/api/health-profile"],
    queryFn: async () => {
      // This would fetch from the real API, but for now using static data
      return {
        interests: ['nutrition', 'exercise'],
        preferredCategory: preferredCategory || 'nutrition'
      };
    }
  });
  
  // Show random tip on initial load
  useEffect(() => {
    if (showRandomInitially) {
      showNewTip(preferredCategory);
    }
  }, [showRandomInitially, preferredCategory]);
  
  // Show a new health tip
  const showNewTip = (category?: string) => {
    const selectedCategory = category || 
      healthProfile?.preferredCategory ||
      tipCategories[Math.floor(Math.random() * tipCategories.length)].id;
    
    setCurrentTip(getRandomTip(selectedCategory));
    setReaction(null);
    setTipCount(prev => prev + 1);
  };
  
  // Handle user reaction to tip
  const handleReaction = (liked: boolean) => {
    setReaction(liked ? 'liked' : 'disliked');
    
    // In a real app, this would send feedback to the server
    // to improve future recommendations
    
    // Show new tip after a short delay
    setTimeout(() => {
      showNewTip();
    }, 1000);
  };
  
  // Determine which emotion to display
  const getCharacterEmotion = (): 'happy' | 'thinking' | 'excited' => {
    if (reaction === 'liked') return 'excited';
    if (reaction === 'disliked') return 'thinking';
    return 'happy';
  };
  
  // Helper function to get dynamic classes
  const getHeaderClass = () => {
    const color = currentTip?.category.color || 'blue';
    if (color === 'green') return 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/60 dark:to-emerald-900/30';
    if (color === 'blue') return 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-indigo-900/30';
    if (color === 'purple') return 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/60 dark:to-violet-900/30';
    if (color === 'amber') return 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-yellow-900/30';
    return 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-indigo-900/30';
  };
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardHeader className={`${getHeaderClass()} py-3 relative overflow-hidden`}>
            {/* Animated background pattern */}
            <motion.div 
              className="absolute inset-0 opacity-5"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='13' cy='13' r='2'/%3E%3C/g%3E%3C/svg%3E")` 
              }}
              animate={isHovered ? { 
                backgroundPositionX: ["0px", "10px"],
                backgroundPositionY: ["0px", "10px"]
              } : {}}
              transition={isHovered ? { 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "loop" 
              } : {}}
            />
            
            <div className="flex justify-between items-center relative z-10">
              <motion.div
                animate={isHovered ? { x: 3 } : { x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <motion.div
                    animate={isHovered ? { 
                      rotate: [0, 5, 0, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={isHovered ? { 
                      duration: 1.5,
                      repeat: 1,
                      repeatType: "reverse"
                    } : {}}
                  >
                    {currentTip?.category.icon}
                  </motion.div>
                  <motion.span
                    animate={isHovered ? { 
                      color: currentTip?.category.color === 'green' ? "#16a34a" :
                             currentTip?.category.color === 'blue' ? "#2563eb" :
                             currentTip?.category.color === 'purple' ? "#9333ea" :
                             "#d97706"
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {currentTip?.category.name || 'Health'} Tips
                  </motion.span>
                </CardTitle>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2 h-8 relative overflow-hidden group"
                  onClick={() => showNewTip()}
                >
                  <motion.div
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0, x: "-50%", y: "-50%" }}
                    whileHover={{ scale: 2 }}
                    transition={{ duration: 0.4 }}
                    style={{ left: "50%", top: "50%", originX: "50%", originY: "50%" }}
                  />
                  <motion.div 
                    className="mr-1 relative z-10"
                    animate={isHovered ? { x: [0, 4, 0] } : {}}
                    transition={{ 
                      duration: 1.5, 
                      repeat: isHovered ? Infinity : 0, 
                      repeatType: "reverse",
                      repeatDelay: 1
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                  <span className="text-xs relative z-10">Next Tip</span>
                </Button>
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>
        
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tipCount}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              >
                <TipCharacter emotion={getCharacterEmotion()} />
              </motion.div>
            </AnimatePresence>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipCount}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: 0.1
                  }}
                >
                  <motion.p
                    className="text-sm text-gray-700 dark:text-gray-300"
                    animate={{ 
                      scale: isHovered ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentTip?.tip || "Click 'Next Tip' to see a health recommendation tailored for you."}
                  </motion.p>
                  
                  {/* Text highlight animation for emphasis */}
                  {isHovered && currentTip?.tip && (
                    <motion.div
                      className="w-full h-2 mt-0.5 bg-gradient-to-r from-transparent via-primary-100 to-transparent dark:via-primary-800/40"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 0.6 }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              
              {currentTip && (
                <motion.div 
                  className="mt-3 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                >
                  <motion.div
                    whileHover={!reaction ? { 
                      scale: 1.05,
                      y: -2
                    } : {}}
                    whileTap={!reaction ? { scale: 0.95 } : {}}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReaction(true)}
                      className={`text-xs relative overflow-hidden ${reaction === 'liked' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-700/30 dark:text-green-300' : 'dark:border-slate-700 dark:text-slate-300'}`}
                      disabled={!!reaction}
                    >
                      {reaction === 'liked' && (
                        <motion.div
                          className="absolute inset-0 bg-green-100 dark:bg-green-800/20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div 
                        className="relative z-10 flex items-center"
                        animate={reaction === 'liked' ? { 
                          y: [0, -3, 0],
                          x: [0, 2, 0, -2, 0]
                        } : {}}
                        transition={{ 
                          duration: 0.5,
                          repeat: reaction === 'liked' ? 1 : 0
                        }}
                      >
                        <ThumbsUp className={`h-3 w-3 mr-1 ${reaction === 'liked' ? 'text-green-600 dark:text-green-400' : ''}`} />
                        <span>Helpful</span>
                      </motion.div>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={!reaction ? { 
                      scale: 1.05,
                      y: -2
                    } : {}}
                    whileTap={!reaction ? { scale: 0.95 } : {}}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReaction(false)}
                      className={`text-xs relative overflow-hidden ${reaction === 'disliked' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700/30 dark:text-blue-300' : 'dark:border-slate-700 dark:text-slate-300'}`}
                      disabled={!!reaction}
                    >
                      {reaction === 'disliked' && (
                        <motion.div
                          className="absolute inset-0 bg-blue-100 dark:bg-blue-800/20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div 
                        className="relative z-10 flex items-center"
                        animate={reaction === 'disliked' ? { 
                          y: [0, -3, 0],
                          rotate: [0, -5, 0]
                        } : {}}
                        transition={{ 
                          duration: 0.5,
                          repeat: reaction === 'disliked' ? 1 : 0
                        }}
                      >
                        <ThumbsDown className={`h-3 w-3 mr-1 ${reaction === 'disliked' ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        <span>Not for me</span>
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthTips;