import type { Variants } from 'framer-motion';

/**
 * Animation utility library for MediBridge
 * Contains reusable animations for consistent micro-interactions
 */

// Fade in animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// Slide up fade in animation variants
export const slideUpVariants: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    y: -10, 
    opacity: 0,
    transition: { 
      duration: 0.2
    }
  }
};

// Card hover animation
export const cardHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  tap: { scale: 0.98 }
};

// Button hover animation
export const buttonHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1
    }
  }
};

// Staggered list item animation
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }
};

// Pulse animation (for notifications, highlights)
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

// Draw SVG path animation
export const drawPathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 1.5, bounce: 0 },
      opacity: { duration: 0.2 }
    }
  }
};

// Scale in animation
export const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Rotate and scale animation
export const rotateScaleVariants: Variants = {
  hidden: { rotate: -10, scale: 0.9, opacity: 0 },
  visible: {
    rotate: 0,
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Smooth transition for accordion or expandable content
export const expandVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 }
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  }
};

// Data visualization animation for charts and graphs
export const dataVisualizationVariants: Variants = {
  hidden: { scaleY: 0, originY: 1 },
  visible: {
    scaleY: 1,
    transition: { 
      duration: 0.5, 
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  }
};

// Toast notification variants
export const toastVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { 
      duration: 0.2
    }
  }
};

// For dialog/modal open close animations
export const dialogVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { 
      duration: 0.15
    }
  }
};

// Loading spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

// For tab transitions
export const tabTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    position: 'absolute',
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2
    }
  }
};

// Utility function for staggered delay calculations
export const staggerDelay = (index: number, baseDelay = 0.05) => ({
  delay: index * baseDelay
});