import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AnimatedCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  icon,
  color,
  path
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={path}>
      <motion.div
        className={`rounded-xl p-6 cursor-pointer h-full ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div 
          className="flex flex-col items-center justify-center"
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
          <motion.h3 
            className="text-white text-lg font-medium text-center"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            {title}
          </motion.h3>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default AnimatedCard;