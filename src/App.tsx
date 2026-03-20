import React, { useState, Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuizGrid from './components/QuizGrid';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'motion/react';

// Lazy load heavy components
const QuizGame = lazy(() => import('./components/QuizGame'));
const AirportKnowledge = lazy(() => import('./components/AirportKnowledge'));
const AirForceKnowledge = lazy(() => import('./components/AirForceKnowledge'));
const FloraFaunaKnowledge = lazy(() => import('./components/FloraFaunaKnowledge'));
const NavyKnowledge = lazy(() => import('./components/NavyKnowledge'));
const MountainKnowledge = lazy(() => import('./components/MountainKnowledge'));

type ViewState = 'home' | 'quiz' | 'knowledge';

const KNOWLEDGE_VIEWS: Record<string, React.ComponentType<{ onBack: () => void }>> = {
  airports: AirportKnowledge,
  airforce: AirForceKnowledge,
  florafauna: FloraFaunaKnowledge,
  navy: NavyKnowledge,
  mountains: MountainKnowledge,
};

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('airports');

  const renderKnowledgeView = () => {
    const Component = KNOWLEDGE_VIEWS[selectedCategory] || AirportKnowledge;
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component onBack={() => setView('home')} />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-fun-bg font-sans text-fun-text">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero />
              <QuizGrid 
                onStartQuiz={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setView('quiz');
                }} 
                onLearnMore={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setView('knowledge');
                }}
              />
            </motion.div>
          )}
          
          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <QuizGame 
                  category={selectedCategory}
                  onBack={() => setView('home')} 
                />
              </Suspense>
            </motion.div>
          )}

          {view === 'knowledge' && (
            <motion.div
              key={`knowledge-${selectedCategory}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderKnowledgeView()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
