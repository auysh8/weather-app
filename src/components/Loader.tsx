// src/components/Loader.tsx
import { motion } from "framer-motion";

const Loader = () => {
  return (
    // 1. Full-screen container with flex centering
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f0f9ff", // Very light sky blue background
      position: "fixed", // Ensures it sits on top of everything
      top: 0,
      left: 0,
      zIndex: 9999,
    }}>
      {/* 2. The Spinning Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          repeat: Infinity, 
          duration: 1, 
          ease: "linear" // Ensures constant speed, no slowing down at ends
        }}
        style={{
          width: "60px",
          height: "60px",
          // The "trick" for ring loaders:
          border: "6px solid #e2e8f0", // Light gray base ring
          borderTop: "6px solid #0ea5e9", // Bright blue spinning part
          borderRadius: "50%",
        }}
      />
      
      {/* 3. Loading Text with subtle pulse */}
      <motion.p 
         animate={{ opacity: [0.6, 1, 0.6] }}
         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
         style={{ 
             marginTop: "24px", 
             color: "#0369a1", // Darker blue text
             fontWeight: 600,
             fontSize: "1.1rem",
             letterSpacing: "0.5px"
         }}>
        Waking up the server...
      </motion.p>
    </div>
  );
};

export default Loader;