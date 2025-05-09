import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Lock, Database, FileCheck, RefreshCw, 
         Globe, Activity, Key, CheckCircle2, Layers, HardDrive } from 'lucide-react';

// Define interfaces for our visual elements
interface HexagonParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number;
  rotation: number;
  rotationSpeed: number;
}

interface BlockElement {
  x: number;
  y: number;
  z: number; // For 3D perspective
  width: number;
  height: number;
  depth: number;
  speed: number;
  color: string;
  shadowColor: string;
  opacity: number;
  scale: number;
  targetScale: number;
  linkedBlocks: number[];
  dataHash: string;
  glowing: boolean;
  glowIntensity: number;
}

interface DataPulse {
  startBlockIndex: number;
  endBlockIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  completed: boolean;
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

  // Modern blockchain visualization
  useEffect(() => {
    if (!canvasRef.current || animationStep < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions and handle resizing
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Create a beautiful, 3D-like blockchain visualization
    const blocks: BlockElement[] = [];
    const hexParticles: HexagonParticle[] = [];
    const dataPulses: DataPulse[] = [];
    
    const numBlocks = 7; // Fewer, more detailed blocks for quality over quantity
    const baseBlockWidth = Math.min(canvas.width, canvas.height) * 0.13;
    const baseBlockHeight = baseBlockWidth * 0.65;
    const blockDepth = baseBlockWidth * 0.2;
    
    // Create background hexagon particles
    const createHexagonParticles = (count: number) => {
      for (let i = 0; i < count; i++) {
        hexParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2 + Math.random() * 10,
          opacity: 0.05 + Math.random() * 0.2,
          speed: 0.05 + Math.random() * 0.3,
          hue: 210 + Math.random() * 40,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01
        });
      }
    };

    createHexagonParticles(50);
    
    // Generate hash-like string for blocks
    const generateBlockHash = () => {
      const chars = '0123456789abcdef';
      let hash = '';
      for (let i = 0; i < 16; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      return hash;
    };
    
    // Initialize blocks in a visually pleasing arrangement
    // Using a modified chain layout for better visual aesthetics
    const initializeBlocks = () => {
      // Calculate the chain's center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2; 
      
      // The vertical offset for odd and even blocks to create a zigzag
      const verticalOffset = baseBlockHeight * 0.7;
      
      for (let i = 0; i < numBlocks; i++) {
        // Position blocks in a horizontal chain with slight elevation changes
        const x = centerX + (i - Math.floor(numBlocks/2)) * (baseBlockWidth * 1.5);
        // Add zigzag effect (even blocks higher, odd blocks lower)
        const y = centerY + (i % 2 === 0 ? -verticalOffset : verticalOffset);
        
        const block: BlockElement = {
          x,
          y,
          z: 0,
          width: baseBlockWidth,
          height: baseBlockHeight,
          depth: blockDepth,
          speed: 0,
          color: `hsl(${210 + Math.random() * 30}, 70%, ${40 + Math.random() * 20}%)`,
          shadowColor: `rgba(80, 100, 240, ${0.3 + Math.random() * 0.3})`,
          opacity: 0.9,
          scale: 1,
          targetScale: 1,
          linkedBlocks: [],
          dataHash: generateBlockHash(),
          glowing: false,
          glowIntensity: 0
        };
        
        // Link blocks in chain
        if (i > 0) {
          block.linkedBlocks.push(i - 1);
          blocks[i - 1].linkedBlocks.push(i);
        }
        
        // Add some non-sequential connections for a more network-like appearance
        if (i > 2 && Math.random() > 0.7) {
          const randomPrevious = Math.floor(Math.random() * (i - 1));
          block.linkedBlocks.push(randomPrevious);
          blocks[randomPrevious].linkedBlocks.push(i);
        }
        
        blocks.push(block);
      }
    };
    
    const createDataPulse = () => {
      if (blocks.length < 2) return;
      
      // Find a valid connection to animate
      const startIdx = Math.floor(Math.random() * blocks.length);
      if (blocks[startIdx].linkedBlocks.length === 0) return;
      
      const linkIdx = Math.floor(Math.random() * blocks[startIdx].linkedBlocks.length);
      const endIdx = blocks[startIdx].linkedBlocks[linkIdx];
      
      // Create the data pulse
      dataPulses.push({
        startBlockIndex: startIdx,
        endBlockIndex: endIdx,
        progress: 0,
        speed: 0.01 + Math.random() * 0.02,
        size: 3 + Math.random() * 4,
        color: `hsl(${180 + Math.random() * 60}, 90%, 70%)`,
        completed: false
      });
      
      // Make the source block temporarily glow
      blocks[startIdx].glowing = true;
      blocks[startIdx].glowIntensity = 1;
    };
    
    // Draw a 3D-like block
    const drawBlock = (block: BlockElement) => {
      ctx.save();
      
      // Apply scale
      ctx.translate(block.x, block.y);
      ctx.scale(block.scale, block.scale);
      ctx.translate(-block.x, -block.y);
      
      const x = block.x - block.width / 2;
      const y = block.y - block.height / 2;
      
      // Draw any glow effect
      if (block.glowing && block.glowIntensity > 0) {
        const glow = ctx.createRadialGradient(
          block.x, block.y, 1,
          block.x, block.y, block.width * 1.2
        );
        glow.addColorStop(0, `rgba(100, 200, 255, ${0.5 * block.glowIntensity})`);
        glow.addColorStop(1, 'rgba(100, 200, 255, 0)');
        
        ctx.fillStyle = glow;
        ctx.fillRect(
          block.x - block.width * 1.5, 
          block.y - block.height * 1.5, 
          block.width * 3, 
          block.height * 3
        );
      }
      
      // Draw main block face
      ctx.fillStyle = block.color;
      ctx.beginPath();
      ctx.rect(x, y, block.width, block.height);
      ctx.fill();
      
      // 3D effect - top face with lighter color
      ctx.fillStyle = adjustBrightness(block.color, 30);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + block.depth, y - block.depth);
      ctx.lineTo(x + block.width + block.depth, y - block.depth);
      ctx.lineTo(x + block.width, y);
      ctx.closePath();
      ctx.fill();
      
      // 3D effect - right face with darker color
      ctx.fillStyle = adjustBrightness(block.color, -20);
      ctx.beginPath();
      ctx.moveTo(x + block.width, y);
      ctx.lineTo(x + block.width + block.depth, y - block.depth);
      ctx.lineTo(x + block.width + block.depth, y + block.height - block.depth);
      ctx.lineTo(x + block.width, y + block.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw subtle grid pattern on main face
      ctx.strokeStyle = adjustBrightness(block.color, 10);
      ctx.lineWidth = 0.5;
      const gridSize = 8;
      
      for (let i = 0; i <= block.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i, y + block.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= block.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + block.width, y + i);
        ctx.stroke();
      }
      
      // Add hash text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '7px monospace';
      ctx.fillText(block.dataHash, x + 5, y + block.height - 6);
      
      // Add a blockchain icon
      const iconSize = block.height * 0.3;
      const iconX = x + block.width/2 - iconSize/2;
      const iconY = y + block.height/2 - iconSize/2;
      
      // Draw a stylized lock icon
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.rect(iconX, iconY, iconSize, iconSize);
      ctx.fill();
      
      ctx.restore();
    };
    
    // Draw hexagon particle background
    const drawHexagonParticle = (particle: HexagonParticle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      ctx.beginPath();
      const a = Math.PI * 2 / 6;
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          particle.size * Math.cos(a * i), 
          particle.size * Math.sin(a * i)
        );
      }
      ctx.closePath();
      
      ctx.fillStyle = `hsla(${particle.hue}, 80%, 50%, ${particle.opacity})`;
      ctx.fill();
      
      ctx.restore();
    };
    
    // Draw data pulse (packet traveling between blocks)
    const drawDataPulse = (pulse: DataPulse) => {
      const startBlock = blocks[pulse.startBlockIndex];
      const endBlock = blocks[pulse.endBlockIndex];
      
      // Calculate current position based on progress
      const x = startBlock.x + (endBlock.x - startBlock.x) * pulse.progress;
      const y = startBlock.y + (endBlock.y - startBlock.y) * pulse.progress;
      
      // Draw glow
      const glow = ctx.createRadialGradient(
        x, y, 1,
        x, y, pulse.size * 3
      );
      glow.addColorStop(0, pulse.color);
      glow.addColorStop(1, 'rgba(100, 200, 255, 0)');
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, pulse.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, pulse.size, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Draw connections between blocks
    const drawConnections = () => {
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        
        for (const linkedIdx of block.linkedBlocks) {
          const linkedBlock = blocks[linkedIdx];
          
          // Create gradient for connection line
          const gradient = ctx.createLinearGradient(
            block.x, block.y, 
            linkedBlock.x, linkedBlock.y
          );
          gradient.addColorStop(0, `rgba(120, 180, 255, 0.4)`);
          gradient.addColorStop(1, `rgba(100, 140, 240, 0.2)`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          
          // Draw connection with a subtle curve
          ctx.beginPath();
          ctx.moveTo(block.x, block.y);
          
          // Add subtle curve for visual interest
          const midX = (block.x + linkedBlock.x) / 2;
          const midY = (block.y + linkedBlock.y) / 2;
          const offset = 15 * (Math.random() > 0.5 ? 1 : -1);
          
          ctx.quadraticCurveTo(
            midX + offset, 
            midY + offset, 
            linkedBlock.x, 
            linkedBlock.y
          );
          
          ctx.stroke();
        }
      }
    };
    
    // Utility to adjust color brightness
    const adjustBrightness = (color: string, percent: number): string => {
      const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (!match) return color;
      
      const h = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      let l = parseInt(match[3], 10);
      
      l = Math.min(100, Math.max(0, l + percent));
      
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
    
    // Initialize the blocks
    initializeBlocks();
    
    // Animation function
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw hexagon particles
      for (const particle of hexParticles) {
        particle.y += particle.speed;
        particle.rotation += particle.rotationSpeed;
        
        // Reset particles that move off-screen
        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
        
        drawHexagonParticle(particle);
      }
      
      // Draw connections between blocks
      drawConnections();
      
      // Update and draw blocks
      for (const block of blocks) {
        // Update block animations
        if (block.scale !== block.targetScale) {
          block.scale += (block.targetScale - block.scale) * 0.1;
        }
        
        // Update glow effect
        if (block.glowing) {
          block.glowIntensity -= 0.02;
          if (block.glowIntensity <= 0) {
            block.glowing = false;
            block.glowIntensity = 0;
          }
        }
        
        // Draw the block
        drawBlock(block);
      }
      
      // Update and draw data pulses
      for (let i = dataPulses.length - 1; i >= 0; i--) {
        const pulse = dataPulses[i];
        
        // Update pulse position
        pulse.progress += pulse.speed;
        
        // Check if pulse reached destination
        if (pulse.progress >= 1) {
          // Trigger glow on destination block
          blocks[pulse.endBlockIndex].glowing = true;
          blocks[pulse.endBlockIndex].glowIntensity = 1;
          
          // Remove completed pulse
          dataPulses.splice(i, 1);
        } else {
          // Draw active pulse
          drawDataPulse(pulse);
        }
      }
      
      // Randomly generate new data pulses
      if (Math.random() < 0.02 && dataPulses.length < 5) {
        createDataPulse();
      }
      
      // Continue animation
      const animationId = requestAnimationFrame(animate);
      animationRef.current = animationId;
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [animationStep]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 dark:from-blue-950 dark:via-indigo-900 dark:to-blue-900 flex flex-col items-center justify-center overflow-hidden relative">
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
                Welcome to MediBird
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
              <div className="bg-white/10 backdrop-blur-lg dark:bg-white/15 dark:backdrop-blur-xl p-6 rounded-xl shadow-md dark:shadow-lg">
                <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Data</h3>
                <p className="text-blue-100 dark:text-blue-50">Your medical records are encrypted and secured using advanced blockchain technology</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg dark:bg-white/15 dark:backdrop-blur-xl p-6 rounded-xl shadow-md dark:shadow-lg">
                <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy Control</h3>
                <p className="text-blue-100 dark:text-blue-50">You control who has access to your medical information at all times</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg dark:bg-white/15 dark:backdrop-blur-xl p-6 rounded-xl shadow-md dark:shadow-lg">
                <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Database className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Decentralized</h3>
                <p className="text-blue-100 dark:text-blue-50">No single point of failure ensures your data remains accessible when you need it</p>
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
            className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-lg dark:bg-white/15 dark:backdrop-blur-xl p-3 rounded-lg flex items-center shadow-md dark:shadow-lg"
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
            className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-lg dark:bg-white/15 dark:backdrop-blur-xl p-3 rounded-lg flex items-center shadow-md dark:shadow-lg"
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