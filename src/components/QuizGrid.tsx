import { categories } from '../data/categories';
import QuizCard from './QuizCard';

interface QuizGridProps {
  onStartQuiz: (categoryId: string) => void;
  onLearnMore: (categoryId: string) => void;
}

export default function QuizGrid({ onStartQuiz, onLearnMore }: QuizGridProps) {
  return (
    <section id="categories" className="pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <div key={category.id} className="h-full">
              <QuizCard 
                category={category} 
                index={index} 
                onStartQuiz={onStartQuiz}
                onLearnMore={onLearnMore}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
