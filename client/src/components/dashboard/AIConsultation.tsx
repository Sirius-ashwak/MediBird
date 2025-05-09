import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { AIIcon, SendIcon, InformationIcon, SettingsIcon, ShieldCheckIcon } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import { 
  fadeInVariants, 
  slideUpVariants, 
  pulseVariants,
  buttonHoverVariants,
  expandVariants
} from "@/lib/animation-utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIConsultation() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! How can I help you with your health today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content })
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      return response.json();
    },
    onMutate: (content) => {
      // Optimistically add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput("");
    },
    onSuccess: (data) => {
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        content: data.response,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage.mutate(input);
    }
  };

  const quickPhrases = [
    { id: "headache", text: "Headache" },
    { id: "sleep", text: "Sleep issues" },
    { id: "stress", text: "Stress management" },
    { id: "nutrition", text: "Nutrition" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 300,
        duration: 0.5 
      }}
    >
      <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg relative bg-white dark:bg-slate-800">
        {/* Background gradient pattern for sophistication */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-accent-50/30 to-transparent dark:from-accent-900/10 pointer-events-none"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            background: [
              "linear-gradient(to bottom right, rgba(123, 97, 255, 0.03), transparent)",
              "linear-gradient(to bottom right, rgba(123, 97, 255, 0.08), transparent)",
              "linear-gradient(to bottom right, rgba(123, 97, 255, 0.03), transparent)"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Card Header with animations */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/95 relative z-10">
          <div className="flex items-center">
            <motion.div 
              className="w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 15,
                duration: 0.5 
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <AIIcon className="text-white h-5 w-5" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <CardTitle className="text-lg font-display tracking-tight text-slate-800 dark:text-white">AI Health Consultation</CardTitle>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Badge variant="secondary" className="bg-accent-100 dark:bg-accent-900/70 text-accent-700 dark:text-accent-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <motion.span 
                className="flex h-1.5 w-1.5 relative"
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-600"></span>
              </motion.span>
              <span>Powered by Gemini AI</span>
            </Badge>
          </motion.div>
        </CardHeader>
      
        <CardContent className="p-0 relative z-10">
          <div className="border-x border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Chat header */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <AIIcon className="text-white h-4 w-4" />
                </motion.div>
                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">MediBridge Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <InformationIcon className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Chat messages with enhanced styling */}
            <motion.div 
              className="p-5 max-h-80 overflow-y-auto space-y-4 bg-white dark:bg-slate-800/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')]"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div 
                    key={message.id} 
                    className={`flex items-start ${message.sender === 'ai' ? 'space-x-3' : 'justify-end space-x-3'}`}
                    initial={{ 
                      opacity: 0, 
                      y: 20,
                      scale: 0.95,
                      x: message.sender === 'user' ? 20 : -20 
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: 1,
                      x: 0,
                      transition: { 
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        delay: index * 0.05
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {message.sender === 'ai' && (
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-sm"
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }}
                      >
                        <AIIcon className="text-white h-4 w-4" />
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className={`${
                        message.sender === 'ai' 
                          ? 'bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 shadow-sm' 
                          : 'bg-primary-50 dark:bg-primary-900/30 text-slate-800 dark:text-slate-200 shadow-sm'
                      } rounded-2xl p-4 max-w-[80%] backdrop-blur-sm backdrop-saturate-150`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                      <motion.p 
                        className="text-sm whitespace-pre-line leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {message.content}
                      </motion.p>
                      
                      {message.sender === 'ai' && message.id === 'welcome' && (
                        <motion.p 
                          className="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-200 dark:border-slate-600 pt-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Note: This is preliminary information and not a medical diagnosis.
                        </motion.p>
                      )}
                    </motion.div>
                    
                    {message.sender === 'user' && (
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center shadow-sm"
                        whileHover={{ scale: 1.1 }}
                        initial={{ rotate: 10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {/* User initials - would be dynamic in a real app */}
                          SJ
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator animation */}
              {sendMessage.isPending && (
                <motion.div 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-sm"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <AIIcon className="text-white h-4 w-4" />
                  </motion.div>
                  <motion.div 
                    className="bg-slate-100 dark:bg-slate-700/70 rounded-2xl p-3 shadow-sm"
                    animate={{ 
                      boxShadow: [
                        "0 2px 4px rgba(0, 0, 0, 0.05)",
                        "0 4px 8px rgba(0, 0, 0, 0.1)",
                        "0 2px 4px rgba(0, 0, 0, 0.05)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-accent-500" 
                        animate={{ 
                          y: ["0%", "-50%", "0%"],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          delay: 0
                        }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-accent-500" 
                        animate={{ 
                          y: ["0%", "-50%", "0%"],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          delay: 0.1
                        }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-accent-500" 
                        animate={{ 
                          y: ["0%", "-50%", "0%"],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </motion.div>
            
            {/* Input area with micro-animations */}
            <motion.div 
              className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm backdrop-saturate-150"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <form onSubmit={handleSendMessage} className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 relative">
                  <motion.div 
                    className="flex-1 relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      delay: 0.1
                    }}
                  >
                    {/* Animated focus ring */}
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      animate={{ 
                        boxShadow: input.length > 0 
                          ? "0 0 0 2px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(99, 102, 241, 0.2)" 
                          : "0 0 0 0 rgba(99, 102, 241, 0)"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <Input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" 
                      placeholder="Type your health concern..." 
                    />
                    
                    {/* Animated placeholder/hint text that appears when input is empty and not focused */}
                    {!input && (
                      <motion.div 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 flex items-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.7, 0], 
                          x: [0, 3, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        Ask anything...
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      delay: 0.2
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 5 
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      rotate: 0 
                    }}
                  >
                    <Button 
                      type="submit"
                      disabled={sendMessage.isPending || !input.trim()}
                      className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2.5 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:shadow-none"
                    >
                      {/* Button ripple animation */}
                      {!sendMessage.isPending && input.trim() && (
                        <motion.div
                          className="absolute inset-0 bg-white"
                          initial={{ scale: 0, opacity: 0.5, x: "-50%", y: "-50%" }}
                          animate={{ scale: 0 }}
                          whileTap={{ scale: 4, opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          style={{ borderRadius: "100%", left: "50%", top: "50%", originX: "50%", originY: "50%" }}
                        />
                      )}
                      
                      {/* Send icon with animation */}
                      <motion.div
                        animate={sendMessage.isPending ? { rotate: 360 } : { x: [0, 2, 0] }}
                        transition={sendMessage.isPending ? 
                          { repeat: Infinity, duration: 1, ease: "linear" } : 
                          { repeat: Infinity, repeatDelay: 2, duration: 0.5 }
                        }
                      >
                        <SendIcon className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: "auto",
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }
                    }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {quickPhrases.map((phrase, index) => (
                      <motion.div
                        key={phrase.id}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: 0.3 + (index * 0.08),
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -2,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.95, y: 0 }}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setInput(phrase.text)}
                          className="relative overflow-hidden bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm"
                        >
                          {/* Button glow effect on hover */}
                          <motion.div 
                            className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-full"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                          
                          <motion.span className="relative z-10">
                            {phrase.text}
                          </motion.span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
          
          {/* Security footer with enhanced styling */}
          <motion.div 
            className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-700/50 px-3 py-1.5 rounded-full shadow-sm"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <ShieldCheckIcon className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
              </motion.div>
              <span className="font-medium">Encrypted with Zero-Knowledge Proofs</span>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}