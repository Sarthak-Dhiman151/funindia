import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-display font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
          I
        </div>
        <span className="font-display font-bold text-xl tracking-tight group-hover:text-fun-accent transition-colors">
          India.fun
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-500"
      >
        <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
          Play
        </button>
      </motion.div>
    </header>
  );
}
