import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, VariantLabels, HTMLMotionProps } from "framer-motion";
import { buttonHoverVariants } from "@/lib/animation-utils";

export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  rippleEffect?: boolean;
  motionProps?: HTMLMotionProps<"button">;
  fullWidth?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      startIcon,
      endIcon,
      rippleEffect = true,
      motionProps,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Define variant styles
    const variantStyles = {
      default: "bg-primary-600 hover:bg-primary-700 text-white",
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white",
      outline: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
      link: "text-primary-600 dark:text-primary-400 hover:underline p-0 h-auto",
      gradient: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg",
    };
    
    // Define size styles
    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 py-1 text-xs",
      lg: "h-12 px-6 py-3 text-base",
      xl: "h-14 px-8 py-4 text-lg",
      icon: "h-10 w-10 p-2",
    };
    
    const isDisabled = disabled || isLoading;
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        variants={buttonHoverVariants}
        initial="initial"
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap={!isDisabled ? "tap" : undefined}
        disabled={isDisabled}
        {...motionProps}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </motion.div>
        )}
        
        {/* Button content */}
        <motion.div
          className="flex items-center justify-center gap-1.5"
          animate={{ opacity: isLoading ? 0 : 1 }}
        >
          {startIcon && (
            <motion.span 
              className="mr-1"
              animate={{ x: startIcon && !isLoading ? [-1, 1, -1] : 0 }}
              transition={{ 
                repeat: 0,
                repeatType: "mirror",
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {startIcon}
            </motion.span>
          )}
          {children}
          {endIcon && (
            <motion.span 
              className="ml-1"
              animate={{ x: endIcon && !isLoading ? [1, 2, 1] : 0 }}
              transition={{ 
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              {endIcon}
            </motion.span>
          )}
        </motion.div>
        
        {/* Ripple effect */}
        {rippleEffect && !isDisabled && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none"
            initial={{ scale: 0, opacity: 0.5, backgroundColor: "#fff" }}
            whileTap={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };