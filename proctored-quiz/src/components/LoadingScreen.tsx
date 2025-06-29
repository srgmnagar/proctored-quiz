import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#100C24] to-[#392B6A] text-white"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="rounded-full h-32 w-32 border-t-6 border-b-6 border-[#E100FF] mb-8"
      style={{ borderTopColor: "#E100FF", borderBottomColor: "#E100FF" }}
    ></motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-2xl font-bold mb-2"
    >
      Preparing your quiz
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="text-lg text-gray-300"
    >
      Loading questions and setting up your test environment
    </motion.p>
  </motion.div>
);

export default LoadingScreen; 