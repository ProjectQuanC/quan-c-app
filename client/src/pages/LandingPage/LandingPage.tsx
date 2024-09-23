import React from 'react';
import { motion } from 'framer-motion'; 
import AboutLanding from '../../components/AboutLanding/AboutLanding';
import Usp from '../../components/Usp/Usp';
import Community from '../../components/Community/Community';
import HookLanding from '../../components/HookLanding/HookLanding';
import './Landing.css'

const LandingPage = () => {
  return (
    <div className="overflow-mobile">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <AboutLanding />
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Usp />
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Community />
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <HookLanding />
      </motion.div>
    </div>
  );
};

export default LandingPage;
