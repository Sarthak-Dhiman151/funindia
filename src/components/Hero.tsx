import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="py-12 md:py-20 text-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex justify-center mb-8"
      >
        <img 
          src="/logo.png" 
          alt="Pixel art tigers and jet in mountains" 
          className="w-full max-w-2xl h-auto rounded-xl shadow-lg [image-rendering:pixelated]"
        />
      </motion.div>
    </section>
  );
}
