import React, { useState, forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  endIcon?: ReactNode;
  label?: string;
  error?: string;
  animateLabel?: boolean;
  containerClassName?: string;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      className,
      type,
      icon,
      endIcon,
      label,
      error,
      animateLabel = true,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value));
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };
    
    return (
      <div className={cn("relative", containerClassName)}>
        {label && animateLabel && (
          <motion.label
            className={`absolute text-xs font-medium transition-all pointer-events-none ${
              isFocused || hasValue
                ? "-top-2 left-3 px-1 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800 z-10"
                : "top-1/2 left-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            }`}
            initial={false}
            animate={{
              y: isFocused || hasValue ? -12 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
              x: isFocused || hasValue ? 0 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            {label}
          </motion.label>
        )}
        
        {label && !animateLabel && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
              {icon}
            </div>
          )}
          
          <motion.div
            whileTap={{ scale: 0.995 }}
            transition={{ duration: 0.1 }}
            className="w-full"
          >
            <input
              type={type}
              className={cn(
                "flex w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
                icon && "pl-10",
                endIcon && "pr-10",
                (isFocused || hasValue) && label && animateLabel && "pt-4 pb-2",
                error && "border-red-500 focus-visible:ring-red-500",
                className
              )}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
          </motion.div>
          
          {endIcon && (
            <motion.div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
              animate={{ 
                scale: isFocused ? 1.1 : 1,
                opacity: isFocused ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
            >
              {endIcon}
            </motion.div>
          )}
          
          {isFocused && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400 rounded-b-md"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {error && (
          <motion.p
            className="mt-1 text-xs text-red-500 dark:text-red-400"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };