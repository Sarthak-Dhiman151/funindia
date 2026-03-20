import { 
  Plane,
  Rocket,
  Leaf,
  Anchor,
  Mountain,
  LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'airports',
    title: 'Indian Airports',
    description: 'Take flight with trivia about India\'s airports, from the highest in Ladakh to the coastal runways of Kerala.',
    icon: Plane,
    color: 'text-sky-600 dark:text-sky-400'
  },
  {
    id: 'airforce',
    title: 'Indian Air Force',
    description: 'Discover the guardians of the sky - from legendary fighter jets to historic operations and brave heroes.',
    icon: Rocket,
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    id: 'florafauna',
    title: 'Flora & Fauna',
    description: 'Explore the rich biodiversity of India, from the majestic tigers of Bengal to the rare orchids of Sikkim.',
    icon: Leaf,
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'navy',
    title: 'Indian Navy',
    description: 'Dive deep into the silent guardians of the seas - from aircraft carriers to submarines and marine commandos.',
    icon: Anchor,
    color: 'text-blue-800 dark:text-blue-400'
  },
  {
    id: 'mountains',
    title: 'Indian Mountains',
    description: 'Scale the heights of India\'s majestic peaks, from the mighty Himalayas to the ancient Aravallis.',
    icon: Mountain,
    color: 'text-stone-600 dark:text-stone-400'
  }
];
