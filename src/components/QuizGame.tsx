import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RefreshCcw, Home, CheckCircle, XCircle, Trophy, ArrowLeft } from 'lucide-react';
import { generateQuestions, Question } from '../utils/quizGenerator';

interface QuizGameProps {
  onBack: () => void;
  category?: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isAnswered: boolean;
  selectedOption: string | null;
  showResult: boolean;
}

const QuizGame: React.FC<QuizGameProps> = ({ onBack, category = 'airports' }) => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isAnswered: false,
    selectedOption: null,
    showResult: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(`quizState_${category}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        startNewGame();
      }
    } else {
      startNewGame();
    }
  }, [category]);

  // Save to localStorage on state change
  useEffect(() => {
    if (state.questions.length > 0) {
      localStorage.setItem(`quizState_${category}`, JSON.stringify(state));
    }
  }, [state, category]);

  const startNewGame = () => {
    const newState = {
      questions: generateQuestions(10, category),
      currentQuestionIndex: 0,
      score: 0,
      isAnswered: false,
      selectedOption: null,
      showResult: false,
    };
    setState(newState);
    localStorage.setItem(`quizState_${category}`, JSON.stringify(newState));
  };

  const handleOptionClick = (option: string) => {
    if (state.isAnswered) return;
    
    const isCorrect = option === state.questions[state.currentQuestionIndex].correctAnswer;
    
    setState(prev => ({
      ...prev,
      selectedOption: option,
      isAnswered: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOption: null,
        isAnswered: false
      }));
    } else {
      setState(prev => ({
        ...prev,
        showResult: true
      }));
      localStorage.removeItem(`quizState_${category}`); // Clear state on completion
    }
  };

  const handlePlayAgain = () => {
    localStorage.removeItem(`quizState_${category}`);
    startNewGame();
  };

  const handleBack = () => {
    // Clear the current quiz state so that when the user returns, they start fresh.
    localStorage.removeItem(`quizState_${category}`);
    onBack();
  };

  if (state.questions.length === 0) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

  if (state.showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2rem] p-12 shadow-xl border-2 border-gray-100 will-change-transform"
        >
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Quiz Completed!</h2>
          <p className="text-xl text-gray-500 mb-10 font-medium">
            You scored <span className="font-bold text-black text-3xl">{state.score}</span> out of {state.questions.length}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handlePlayAgain}
              className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <RefreshCcw className="w-5 h-5" /> Play Again
            </button>
            <button 
              onClick={handleBack}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <Home className="w-5 h-5" /> Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[600px] contain-layout relative">
      <button 
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium px-4 py-2 -ml-4 rounded-lg hover:bg-gray-100 active:bg-gray-200 touch-manipulation cursor-pointer z-10 relative"
      >
        <ArrowLeft className="w-5 h-5" /> Exit Quiz
      </button>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
          <span>Question {state.currentQuestionIndex + 1}/{state.questions.length}</span>
          <span>Score: {state.score}</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black rounded-full transition-transform duration-500 ease-out origin-left will-change-transform"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <QuestionCard 
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={state.selectedOption}
          isAnswered={state.isAnswered}
          onOptionClick={handleOptionClick}
          onNext={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex === state.questions.length - 1}
        />
      </AnimatePresence>
    </div>
  );
};

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  isAnswered: boolean;
  onOptionClick: (option: string) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuestionCard = React.memo(({ question, selectedOption, isAnswered, onOptionClick, onNext, isLastQuestion }: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border-2 border-gray-100 will-change-transform"
    >
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
        {question.question}
      </h3>

      <div className="space-y-4">
        {question.options.map((option, idx) => {
          let buttonClass = "w-full text-left p-5 rounded-xl border-2 transition-colors duration-100 font-bold text-lg touch-manipulation ";
          
          if (isAnswered) {
            if (option === question.correctAnswer) {
              buttonClass += "border-green-500 bg-green-50 text-green-700";
            } else if (option === selectedOption) {
              buttonClass += "border-red-500 bg-red-50 text-red-700";
            } else {
              buttonClass += "border-gray-100 opacity-50";
            }
          } else {
            buttonClass += "border-gray-100 hover:border-black hover:bg-gray-50 text-gray-700 active:scale-[0.99] transform transition-transform";
          }

          return (
            <button
              key={idx}
              onClick={() => onOptionClick(option)}
              disabled={isAnswered}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && option === question.correctAnswer && <CheckCircle className="w-6 h-6 text-green-500" />}
                {isAnswered && option === selectedOption && option !== question.correctAnswer && <XCircle className="w-6 h-6 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-100"
        >
          <p className="text-blue-800 font-medium leading-relaxed">
            <span className="font-bold block mb-1 text-blue-900">Did you know?</span> 
            {question.explanation?.split('Did you know?')[1] || question.explanation}
          </p>
        </motion.div>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all touch-manipulation ${
            isAnswered 
              ? 'bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
});

export default QuizGame;
