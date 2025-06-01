import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1
}) => {
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0 
    },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: delay,
        staggerChildren: staggerDelay 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </motion.div>
  );
};

export default AnimatedContainer;