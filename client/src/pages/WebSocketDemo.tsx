import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Send, RefreshCw, X } from 'lucide-react';

enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'server' | 'system';
  timestamp: Date;
};

export default function WebSocketDemo() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Add a new message to the chat
  const addMessage = (content: string, sender: 'user' | 'server' | 'system') => {
    const newMessage: Message = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Scroll to bottom after message is added
    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Connect to WebSocket server
  const connectToWebSocket = () => {
    setIsConnecting(true);
    setConnectionStatus(ConnectionStatus.CONNECTING);
    
    try {
      // Get the correct protocol based on the current page protocol
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      
      // In Replit environment, we need to ensure we're connecting to the correct host
      // The server runs on port 5000, but the frontend might be on a different port
      const host = window.location.hostname;
      const port = '5000'; // MediBridge server port
      const wsUrl = `${protocol}//${host}:${port}/ws`;
      
      addMessage(`Connecting to ${wsUrl}...`, 'system');
      
      // Create new WebSocket connection
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // Connection opened
      socket.addEventListener('open', () => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        addMessage('Connection established!', 'system');
        
        // Send authentication message
        const authMessage = {
          type: 'auth',
          userId: 1 // Demo user ID
        };
        socket.send(JSON.stringify(authMessage));
        
        toast({
          title: "Connected",
          description: "WebSocket connection established successfully.",
          variant: "default",
        });
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage(`Received: ${JSON.stringify(data)}`, 'server');
        } catch (e) {
          addMessage(`Received: ${event.data}`, 'server');
        }
      });
      
      // Connection error
      socket.addEventListener('error', (error) => {
        setConnectionStatus(ConnectionStatus.ERROR);
        addMessage(`WebSocket error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'system');
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to the WebSocket server.",
          variant: "destructive",
        });
      });
      
      // Connection closed
      socket.addEventListener('close', (event) => {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        addMessage(`Connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`, 'system');
        
        toast({
          title: "Disconnected",
          description: "WebSocket connection closed.",
          variant: "default",
        });
      });
    } catch (error) {
      setConnectionStatus(ConnectionStatus.ERROR);
      addMessage(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`, 'system');
      
      toast({
        title: "Connection Error",
        description: "Failed to create WebSocket connection.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect from WebSocket server
  const disconnectFromWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
      addMessage('Disconnected from server', 'system');
    }
  };
  
  // Send a message through the WebSocket
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const messageObj = {
          type: 'medical_update',
          content: inputMessage,
          timestamp: new Date().toISOString()
        };
        
        socketRef.current.send(JSON.stringify(messageObj));
        addMessage(inputMessage, 'user');
        setInputMessage('');
      } catch (error) {
        addMessage(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`, 'system');
      }
    } else {
      addMessage('Cannot send message: WebSocket is not connected', 'system');
      
      toast({
        title: "Cannot Send Message",
        description: "WebSocket connection is not active.",
        variant: "destructive",
      });
    }
  };
  
  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  
  // Handle key press (Enter)
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Clean up WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">WebSocket Demo</h1>
      <p className="mb-6 text-gray-600">
        This page demonstrates real-time communication using WebSockets for MediBridge.
      </p>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>WebSocket Connection</CardTitle>
            <ConnectionStatusBadge status={connectionStatus} />
          </div>
          <CardDescription>
            Connect to the MediBridge WebSocket server to send and receive real-time messages.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div
            ref={messageContainerRef}
            className="h-80 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Connect to start communicating.</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={connectionStatus !== ConnectionStatus.CONNECTED}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={connectionStatus !== ConnectionStatus.CONNECTED || !inputMessage.trim()}
              variant="default"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          {connectionStatus === ConnectionStatus.DISCONNECTED || connectionStatus === ConnectionStatus.ERROR ? (
            <Button onClick={connectToWebSocket} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          ) : (
            <Button
              onClick={disconnectFromWebSocket}
              variant="destructive"
              disabled={connectionStatus !== ConnectionStatus.CONNECTED}
            >
              <X className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About This Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This WebSocket implementation demonstrates several key features of MediBridge:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Real-time bidirectional communication between clients and server</li>
            <li>User authentication for secure messaging</li>
            <li>Message persistence and delivery confirmation</li>
            <li>Multi-client support for provider-patient communication</li>
            <li>Protocol-agnostic design (works with both ws:// and wss://)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Connection status badge component
function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  let label: string;
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'outline';
  let icon = null;
  let badgeClass = "flex items-center px-2 py-1";
  
  switch (status) {
    case ConnectionStatus.CONNECTED:
      label = 'Connected';
      variant = 'default';
      badgeClass += " bg-green-100 text-green-800 hover:bg-green-100";
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case ConnectionStatus.CONNECTING:
      label = 'Connecting...';
      variant = 'secondary';
      icon = <RefreshCw className="h-3 w-3 mr-1 animate-spin" />;
      break;
    case ConnectionStatus.ERROR:
      label = 'Connection Error';
      variant = 'destructive';
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    case ConnectionStatus.DISCONNECTED:
    default:
      label = 'Disconnected';
      variant = 'outline';
      icon = <X className="h-3 w-3 mr-1" />;
      break;
  }
  
  return (
    <Badge variant={variant} className={badgeClass}>
      {icon}
      {label}
    </Badge>
  );
}

// Message bubble component
function MessageBubble({ message }: { message: Message }) {
  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Determine message styling based on sender
  let bgColor = '';
  let textColor = '';
  let alignment = '';
  
  switch (message.sender) {
    case 'user':
      bgColor = 'bg-primary-100 border-primary-200';
      textColor = 'text-primary-800';
      alignment = 'ml-auto';
      break;
    case 'server':
      bgColor = 'bg-blue-100 border-blue-200';
      textColor = 'text-blue-800';
      alignment = 'mr-auto';
      break;
    case 'system':
      bgColor = 'bg-gray-100 border-gray-200';
      textColor = 'text-gray-800';
      alignment = 'mx-auto';
      break;
  }
  
  return (
    <div className={`max-w-3/4 rounded-lg p-3 mb-2 border ${bgColor} ${alignment}`}>
      <div className={`text-sm ${textColor}`}>{message.content}</div>
      <div className="text-xs text-gray-500 mt-1 text-right">{formattedTime}</div>
    </div>
  );
}