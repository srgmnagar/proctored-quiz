"use client";
import { createContext, useContext, useState } from "react";

type Question = {
  question: string;
  correct_answer: string;
  options: string[];
};

type QuizData = {
  questions: Question[];
  selectedAnswers: number[];      
  scorePerQuestion: number[];      
  totalScore: number;
};

type QuizContextType = {
  quizData: QuizData | null;
  setQuizData: React.Dispatch<React.SetStateAction<QuizData | null>>;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

  