import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="py-8 text-center">
      <div className="flex items-center justify-center gap-2 text-gray-400 font-medium">
        <span>Made with</span>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Heart className="w-4 h-4 text-red-400 fill-current" />
        </motion.div>
      </div>
    </footer>
  );
}
