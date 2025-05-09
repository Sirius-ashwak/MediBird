import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { AIIcon, SendIcon, InformationIcon, SettingsIcon, ShieldCheckIcon } from "@/lib/icons";

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
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg relative bg-white dark:bg-slate-800">
      {/* Background gradient pattern for sophistication */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-50/30 to-transparent dark:from-accent-900/10 pointer-events-none"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/95 relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-md">
            <AIIcon className="text-white h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-display tracking-tight text-slate-800 dark:text-white">AI Health Consultation</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-accent-100 dark:bg-accent-900/70 text-accent-700 dark:text-accent-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-600"></span>
          </span>
          <span>Powered by Gemini AI</span>
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0 relative z-10">
        <div className="border-x border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-sm">
                <AIIcon className="text-white h-4 w-4" />
              </div>
              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">MediBridge Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <InformationIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages with enhanced styling */}
          <div className="p-5 max-h-80 overflow-y-auto space-y-4 bg-white dark:bg-slate-800/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')]">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${message.sender === 'ai' ? 'space-x-3' : 'justify-end space-x-3'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-sm">
                    <AIIcon className="text-white h-4 w-4" />
                  </div>
                )}
                
                <div className={`${
                  message.sender === 'ai' 
                    ? 'bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 shadow-sm' 
                    : 'bg-primary-50 dark:bg-primary-900/30 text-slate-800 dark:text-slate-200 shadow-sm'
                } rounded-2xl p-4 max-w-[80%] backdrop-blur-sm backdrop-saturate-150`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  {message.sender === 'ai' && message.id === 'welcome' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-200 dark:border-slate-600 pt-2">
                      Note: This is preliminary information and not a medical diagnosis.
                    </p>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-medium">
                      {/* User initials - would be dynamic in a real app */}
                      SJ
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {sendMessage.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-sm">
                  <AIIcon className="text-white h-4 w-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700/70 rounded-2xl p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area with enhanced styling */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm backdrop-saturate-150">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" 
                  placeholder="Type your health concern..." 
                />
                <Button 
                  type="submit"
                  disabled={sendMessage.isPending || !input.trim()}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2.5 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:shadow-none"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {quickPhrases.map(phrase => (
                  <Button
                    key={phrase.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(phrase.text)}
                    className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm"
                  >
                    {phrase.text}
                  </Button>
                ))}
              </div>
            </form>
          </div>
        </div>
        
        {/* Security footer with enhanced styling */}
        <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-700/50 px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
            <span className="font-medium">Encrypted with Zero-Knowledge Proofs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
