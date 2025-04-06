"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
  selectedAnswer?: string;
};

const shuffle = (array: string[]): string[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const TestPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabSwitchCount = useRef(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [testCompleted, setTestCompleted] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const amount = searchParams.get("numQuestions");
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");

        const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple${
          category ? `&category=${category}` : ""
        }${difficulty ? `&difficulty=${difficulty}` : ""}`;

        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.results.map((q: any) => ({
          question: decodeURIComponent(q.question),
          correct_answer: decodeURIComponent(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((ans: string) =>
            decodeURIComponent(ans)
          ),
          options: shuffle([
            decodeURIComponent(q.correct_answer),
            ...q.incorrect_answers.map((ans: string) => decodeURIComponent(ans)),
          ]),
        }));

        setQuestions(formatted);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [searchParams]);

  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted) {
      const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !testCompleted) {
      setTestCompleted(true);
      setDialogMsg("Time's up! Please click OK to continue.");
      setDialogOpen(true);
    }
  }, [timeRemaining, testCompleted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current++;
        if (tabSwitchCount.current >= 2) {
          setTestCompleted(true);
          setDialogMsg("Test ended due to excessive tab switching. Please click OK to go back.");
          setDialogOpen(true);
        } else {
          setDialogMsg(`Tab switch detected. You have ${2 - tabSwitchCount.current} attempts left.`);
          setDialogOpen(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswer = (questionIndex: number, option: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex ? { ...q, selectedAnswer: option } : q
      )
    );
  };

  const calculateScore = () =>
    questions.filter((q) => q.selectedAnswer === q.correct_answer).length;

  const handleSubmit = () => {
    setTestCompleted(true);
    setDialogMsg(`Test completed! Your score is: ${calculateScore()} / ${questions.length}`);
    setDialogOpen(true);
  };

  const handleDialogContinue = () => {
    if (timeRemaining === 0 || tabSwitchCount.current >= 2 || testCompleted) {
      router.push("/"); 
    }
  };

  return (
    <div className="min-h-screen p-6 px-10 font-sans" style={{ background: "linear-gradient(115deg, rgba(38, 0, 74, 0.73) 2.22%, rgba(105, 36, 171, 0.59) 103.12%)" }}>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notice</AlertDialogTitle>
            <AlertDialogDescription>{dialogMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogContinue}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-5xl font-bold mb-4 text-white">Test</h1>
      <div className="mb-4 text-2xl font-bold text-white">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

      {questions.length === 0 ? (
        <p className="text-white text-xl">Loading questions...</p>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="bg-[#ffffff32] p-4 rounded-md mb-4">
            <p className="font-semibold text-white">{q.question}</p>
            <ul>
              {q.options.map((option, i) => (
                <li key={i} className="my-2">
                  <label className="flex items-center p-2 rounded-md bg-purple-950 hover:bg-purple-900 transition-colors text-white cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={q.selectedAnswer === option}
                      onChange={() => handleAnswer(index, option)}
                      disabled={testCompleted}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {!testCompleted && questions.length > 0 && (
        <button
          className="bg-violet-950 text-white px-6 py-3 rounded-md hover:scale-105 transition-all"
          onClick={handleSubmit}
        >
          Submit Test
        </button>
      )}
    </div>
  );
};

export default TestPage;
