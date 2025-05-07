import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Lock, Database, FileCheck, RefreshCw } from 'lucide-react';

// Define interface for blockchain nodes
interface BlockchainNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  connections: number[];
}

const WelcomePage = () => {
  const [, setLocation] = useLocation();
  const [animationStep, setAnimationStep] = useState(0);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Animation timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 1000);

    const timer2 = setTimeout(() => {
      setAnimationStep(2);
    }, 2500);

    const timer3 = setTimeout(() => {
      setAnimationStep(3);
    }, 4000);

    const timer4 = setTimeout(() => {
      setShowGetStarted(true);
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Blockchain visualization animation
  useEffect(() => {
    if (!canvasRef.current || animationStep < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Nodes for the blockchain visualization
    const nodes: BlockchainNode[] = [];
    const numNodes = 12;
    const blockSize = width / 20;
    
    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * (width - blockSize * 2) + blockSize,
        y: Math.random() * (height - blockSize * 2) + blockSize,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: blockSize + Math.random() * 10,
        color: `hsl(${210 + Math.random() * 40}, 80%, 50%)`,
        connections: []
      });
    }

    // Create connections between nodes
    for (let i = 0; i < numNodes; i++) {
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numConnections; j++) {
        let targetNode;
        do {
          targetNode = Math.floor(Math.random() * numNodes);
        } while (targetNode === i || nodes[i].connections.includes(targetNode));
        
        nodes[i].connections.push(targetNode);
        if (!nodes[targetNode].connections.includes(i)) {
          nodes[targetNode].connections.push(i);
        }
      }
    }

    // Animation function
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off walls
        if (node.x < node.size / 2 || node.x > width - node.size / 2) {
          node.vx *= -1;
        }
        if (node.y < node.size / 2 || node.y > height - node.size / 2) {
          node.vy *= -1;
        }
        
        // Draw connections first (so they're behind nodes)
        for (const connectionIndex of node.connections) {
          const connectedNode = nodes[connectionIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = 'rgba(120, 180, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Draw nodes on top of connections
      for (const node of nodes) {
        ctx.beginPath();
        ctx.rect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Draw a lock icon in the center of each block
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        const lockSize = node.size / 3;
        ctx.rect(node.x - lockSize / 2, node.y - lockSize / 2, lockSize, lockSize);
        ctx.fill();
      }

      // Data packet animation
      if (Math.random() < 0.05) {
        const startNode = Math.floor(Math.random() * nodes.length);
        const endNode = nodes[startNode].connections[
          Math.floor(Math.random() * nodes[startNode].connections.length)
        ];
        
        if (endNode !== undefined) {
          const startX = nodes[startNode].x;
          const startY = nodes[startNode].y;
          const endX = nodes[endNode].x;
          const endY = nodes[endNode].y;
          
          ctx.beginPath();
          ctx.arc(startX + (endX - startX) * Math.random(), 
                 startY + (endY - startY) * Math.random(), 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
      }

      const animationId = requestAnimationFrame(animate);
      animationRef.current = animationId;
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationStep]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Canvas for blockchain animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{opacity: animationStep >= 2 ? 1 : 0, transition: 'opacity 1s ease-in-out'}}
      />
      
      <div className="container px-4 z-10 flex flex-col items-center">
        <AnimatePresence>
          {animationStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to MediBridge
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                The decentralized healthcare platform securing your data with blockchain technology
              </p>
            </motion.div>
          )}

          {animationStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
            >
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Data</h3>
                <p className="text-blue-100">Your medical records are encrypted and secured using advanced blockchain technology</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy Control</h3>
                <p className="text-blue-100">You control who has access to your medical information at all times</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Database className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Decentralized</h3>
                <p className="text-blue-100">No single point of failure ensures your data remains accessible when you need it</p>
              </div>
            </motion.div>
          )}

          {showGetStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Button 
                onClick={() => setLocation('/login')} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Get Started <ArrowRight className="ml-2" size={18} />
              </Button>
              <p className="text-blue-200 mt-4 text-sm">
                Experience the future of secure healthcare data management
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security verification animation indicator */}
        {animationStep >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-lg p-3 rounded-lg flex items-center"
          >
            <div className="mr-3 text-green-400">
              <RefreshCw className="animate-spin" size={18} />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Blockchain Security</p>
              <p className="text-blue-200 text-xs">Verifying network integrity...</p>
            </div>
          </motion.div>
        )}

        {animationStep >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-lg p-3 rounded-lg flex items-center"
          >
            <div className="mr-3 text-green-400">
              <FileCheck size={18} />
            </div>
            <div>
              <p className="text-white text-sm font-medium">HIPAA Compliant</p>
              <p className="text-blue-200 text-xs">Privacy standards verified</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;