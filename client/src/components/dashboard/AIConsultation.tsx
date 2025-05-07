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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">AI Health Consultation</CardTitle>
        <Badge variant="secondary" className="bg-accent-100 text-accent-700 px-2 py-1 flex items-center gap-1">
          <AIIcon className="text-accent-700" />
          <span>Powered by Gemini AI</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 p-3 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                <AIIcon className="text-accent-600" />
              </div>
              <span className="font-medium text-sm">MediBridge Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-neutral-600">
                <InformationIcon />
              </Button>
              <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-neutral-600">
                <SettingsIcon />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="p-4 max-h-80 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${message.sender === 'ai' ? 'space-x-3' : 'justify-end space-x-3'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex-shrink-0 flex items-center justify-center">
                    <AIIcon className="text-accent-600" />
                  </div>
                )}
                
                <div className={`${
                  message.sender === 'ai' ? 'bg-neutral-100' : 'bg-primary-50'
                } rounded-lg p-3 max-w-[80%]`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.sender === 'ai' && message.id === 'welcome' && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Note: This is preliminary information and not a medical diagnosis.
                    </p>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                    <span className="text-primary-700 text-xs font-medium">
                      {/* User initials - would be dynamic in a real app */}
                      SJ
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {sendMessage.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent-100 flex-shrink-0 flex items-center justify-center">
                  <AIIcon className="text-accent-600" />
                </div>
                <div className="bg-neutral-100 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t border-neutral-200 p-3">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="Type your health concern..." 
                />
                <Button 
                  type="submit"
                  disabled={sendMessage.isPending || !input.trim()}
                  className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SendIcon />
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
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs hover:bg-neutral-200"
                  >
                    {phrase.text}
                  </Button>
                ))}
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-neutral-500 flex items-center">
          <ShieldCheckIcon className="mr-1 text-secondary-500" />
          <span>Your conversation is private and protected with Zero-Knowledge Proofs</span>
        </div>
      </CardContent>
    </Card>
  );
}
