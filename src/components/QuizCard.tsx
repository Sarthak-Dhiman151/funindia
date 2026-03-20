import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../data/categories';
import { Play, BookOpen, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  category: Category;
  index: number;
  onStartQuiz: (id: string) => void;
  onLearnMore: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = React.memo(({ category, index, onStartQuiz, onLearnMore }) => {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gray-200 rounded-[2rem] transform translate-y-2 translate-x-0 transition-transform group-hover:translate-y-3"></div>
      
      <div className="relative h-full bg-white rounded-[2rem] border-2 border-gray-100 p-8 flex flex-col items-center text-center transition-transform transform group-hover:-translate-y-1">
        
        <div className={`mb-6 p-6 rounded-2xl ${category.color.replace('text-', 'bg-').replace('600', '100').replace('dark:text-', 'dark:bg-').split(' ')[0]} text-black`}>
          <Icon className="w-12 h-12 stroke-[1.5]" />
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          {category.title}
        </h3>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
          {category.description}
        </p>

        <div className="flex gap-3 w-full mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartQuiz(category.id);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors group/btn"
          >
            Play <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore(category.id);
            }}
            className="px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            aria-label="Learn More"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default QuizCard;
