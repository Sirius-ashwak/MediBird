import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AIIcon, SendIcon, ShieldCheckIcon } from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { AiConsultation, AiMessage } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIConsultations() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Function to get user initials
  const getUserInitials = (): string => {
    if (!user) return "U";
    
    if (user.name) {
      // Split name by spaces and get first character of each part
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      // If only one name part, use first two characters
      return user.name.substring(0, 2).toUpperCase();
    }
    
    // Fallback to first two characters of username
    return user.username.substring(0, 2).toUpperCase();
  };
  
  const { data: consultations, isLoading } = useQuery<AiConsultation[]>({
    queryKey: ["/api/ai/consultations"],
  });

  useEffect(() => {
    if (activeConsultation === null && consultations && consultations.length > 0) {
      setActiveConsultation(consultations[0].id.toString());
    }
  }, [consultations, activeConsultation]);

  // Fetch messages for active consultation
  const { data: messageData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/ai/consultations", activeConsultation, "messages"],
    queryFn: async () => {
      if (!activeConsultation) return [];
      const response = await fetch(`/api/ai/consultations/${activeConsultation}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return await response.json();
    },
    enabled: !!activeConsultation,
  });

  // Update messages when data changes
  useEffect(() => {
    if (messageData && Array.isArray(messageData)) {
      const formattedMessages = messageData.map(msg => ({
        id: msg.id.toString(),
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
    }
  }, [messageData]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, consultationId: activeConsultation })
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
      queryClient.invalidateQueries({ queryKey: ["/api/ai/consultations"] });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage.mutate(input);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      <div className="mb-8">
        <h2 className="font-display text-xl font-medium text-neutral-800 mb-4">AI Health Consultations</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with consultation history */}
          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>History</span>
                  <Button size="sm">
                    <i className="ri-add-line mr-1"></i>
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : consultations && consultations.length > 0 ? (
                  <div className="space-y-2">
                    {consultations.map((consultation) => (
                      <div 
                        key={consultation.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          activeConsultation === consultation.id.toString() 
                            ? "bg-primary-50 border border-primary-100" 
                            : "bg-neutral-50 border border-neutral-200 hover:bg-neutral-100"
                        }`}
                        onClick={() => setActiveConsultation(consultation.id.toString())}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{consultation.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={consultation.status === "active" 
                              ? "bg-green-50 text-green-700 text-xs" 
                              : "bg-neutral-100 text-neutral-700 text-xs"
                            }
                          >
                            {consultation.status === "active" ? "Active" : "Completed"}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                        <p className="text-xs text-neutral-600 mt-2 truncate">
                          {consultation.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-500">No consultations yet</p>
                    <Button 
                      className="mt-2"
                      onClick={() => {
                        // Create a new consultation via API
                        fetch("/api/ai/consultations", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ 
                            title: "New Consultation", 
                            status: "active" 
                          })
                        })
                        .then(response => response.json())
                        .then(data => {
                          setActiveConsultation(data.id.toString());
                          queryClient.invalidateQueries({ 
                            queryKey: ["/api/ai/consultations"] 
                          });
                        });
                      }}
                    >
                      Start New Consultation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main chat interface */}
          <div className="md:w-3/4">
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">AI Health Consultation</CardTitle>
                  <Badge variant="secondary" className="bg-accent-100 text-accent-700 px-2 py-1 flex items-center gap-1">
                    <AIIcon className="text-accent-700" />
                    <span>Powered by Gemini AI</span>
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500">
                  Ask questions about your health concerns and receive AI-powered guidance.
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="border border-neutral-200 rounded-lg overflow-hidden flex-1 flex flex-col">
                  <div className="bg-neutral-50 p-3 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                        <AIIcon className="text-accent-600" />
                      </div>
                      <span className="font-medium text-sm">MediBridge Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-neutral-600">
                        <i className="ri-information-line"></i>
                      </Button>
                      <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-neutral-600">
                        <i className="ri-settings-4-line"></i>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
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
                        </div>
                        
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                            <span className="text-primary-700 text-xs font-medium">
                              {getUserInitials()}
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
                          className="flex-1" 
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setInput("What causes headaches?")}
                          className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs hover:bg-neutral-200"
                        >
                          What causes headaches?
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setInput("How can I improve my sleep?")}
                          className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs hover:bg-neutral-200"
                        >
                          How can I improve my sleep?
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setInput("Recommend exercises for back pain")}
                          className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs hover:bg-neutral-200"
                        >
                          Exercises for back pain
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-3 text-xs text-neutral-500 flex items-center">
                      <ShieldCheckIcon className="mr-1 text-secondary-500" />
                      <span>Your conversation is private and protected with Zero-Knowledge Proofs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
