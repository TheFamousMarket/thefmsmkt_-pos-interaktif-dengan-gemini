import React from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color = 'bg-blue-600',
  trend,
  onClick
}) => {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ 
        scale: onClick ? 1.02 : 1,
        boxShadow: onClick ? "0 8px 25px rgba(0,0,0,0.15)" : ""
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-1">
        <div className={`${color} p-4 rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <h3 className="text-white text-sm font-medium">{title}</h3>
            {icon && (
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 0 }}
                className="text-white opacity-80"
              >
                {icon}
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-b-lg">
          <div className="flex justify-between items-end">
            <motion.div 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {value}
            </motion.div>
            
            {trend && (
              <div className={`flex items-center ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  animate={{ 
                    y: [0, -4, 0],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                >
                  {trend.isPositive ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </motion.svg>
                <span className="ml-1 text-sm font-medium">{trend.value}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;