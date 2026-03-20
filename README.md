# Indian Knowledge Quiz & Learning Hub

A comprehensive interactive web application designed to help users learn about various aspects of India, including its defense forces, geography, and biodiversity. The platform combines detailed knowledge bases with dynamic quizzes to test your understanding.

## Features

- **Interactive Quizzes**: Dynamic question generation based on extensive datasets.
- **Rich Knowledge Base**: Detailed information sections for each category.
- **Beautiful UI/UX**: Modern, responsive design with smooth animations using Framer Motion.
- **Multiple Categories**:
  - **Indian Mountains**: Explore the Himalayas, Western Ghats, and major peaks.
  - **Indian Navy**: Learn about naval history, vessels, and ranks.
  - **Indian Air Force**: Discover aircraft, history, and achievements.
  - **Flora & Fauna**: Dive into India's rich biodiversity and national parks.
  - **Airports**: Get to know the major airports connecting the nation.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Routing**: React Router (implied structure)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd indian-knowledge-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components (QuizCard, Knowledge views)
├── data/             # JSON datasets for all categories
├── utils/            # Helper functions (quiz generation logic)
├── App.tsx           # Main application component
└── main.tsx          # Entry point
```

## How It Works

The application uses a unique **Quiz Generator Engine** located in `src/utils/quizGenerator.ts`. Instead of static questions, it dynamically creates questions from the raw data files in `src/data/`. This ensures:
- A vast variety of questions
- Always up-to-date content
- Different question types (multiple choice, true/false, identification)

## Contributing

Contributions are welcome! Whether it's adding new data categories, improving the UI, or fixing bugs.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
