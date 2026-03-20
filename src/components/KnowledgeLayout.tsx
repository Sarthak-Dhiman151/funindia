import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface KnowledgeLayoutProps {
  onBack: () => void;
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

const KnowledgeLayout: React.FC<KnowledgeLayoutProps> = ({ 
  onBack, 
  title, 
  children, 
  headerActions 
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all text-gray-700 font-bold border-2 border-gray-100 hover:border-gray-200 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 hidden md:block">{title}</h1>
        </div>
        
        {headerActions && (
          <div className="w-full md:w-auto">
            {headerActions}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default KnowledgeLayout;
