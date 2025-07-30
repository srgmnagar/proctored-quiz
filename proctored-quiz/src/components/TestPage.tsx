"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import { motion } from "framer-motion";

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

const decodeBase64 = (str: string) => {
  try {
    return atob(str);
  } catch {
    return str;
  }
};

const TestPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabSwitchCount = useRef(0);
  const hasRecentlyViolated = useRef(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [testCompleted, setTestCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timerDone = false;
    let questionsDone = false;

    const timer = setTimeout(() => {
      timerDone = true;
      if (questionsDone) setLoading(false);
    }, 2000); // 2 seconds

    const fetchQuestions = async () => {
      try {
        const amount = searchParams.get("numQuestions");
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");

        const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple${
          category ? `&category=${category}` : ""
        }${difficulty ? `&difficulty=${difficulty}` : ""}&encode=base64`;

        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.results.map((q: any) => ({
          question: decodeBase64(q.question),
          correct_answer: decodeBase64(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((ans: string) =>
            decodeBase64(ans)
          ),
          options: shuffle([
            decodeBase64(q.correct_answer),
            ...q.incorrect_answers.map((ans: string) => decodeBase64(ans)),
          ]),
        }));

        setQuestions(formatted);
        setTimeRemaining(formatted.length * 30);
        questionsDone = true;
        if (timerDone) setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        questionsDone = true;
        if (timerDone) setLoading(false);
      }
    };

    fetchQuestions();
    return () => clearTimeout(timer);
  }, [searchParams]);

  const calculateScore = () =>
    questions.filter((q) => q.selectedAnswer === q.correct_answer).length;


useEffect(() => {
  const handleViolation = () => {
    if (hasRecentlyViolated.current || testCompleted) return;

    hasRecentlyViolated.current = true;
    setTimeout(() => {
      hasRecentlyViolated.current = false;
    }, 1000); 
    tabSwitchCount.current++;

    if (tabSwitchCount.current >= 2) {
      setTestCompleted(true);
      setDialogMsg(
        `Test terminated due to tab or window switching.\nYour score is: ${calculateScore()} / ${questions.length}`
      );
      setDialogOpen(true);
    } else {
      setDialogMsg(
        `Tab or window switch detected. You have ${2 - tabSwitchCount.current} attempt(s) left.`
      );
      setDialogOpen(true);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) handleViolation();
  };

  const handleWindowBlur = () => {
    if (!document.hidden) handleViolation();
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !testCompleted) {
      setTestCompleted(true);
      setDialogMsg(
        `Test terminated due to exiting fullscreen.\nYour score is: ${calculateScore()} / ${questions.length}`
      );
      setDialogOpen(true);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", handleWindowBlur);
  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, [questions, testCompleted]);



  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted) {
      const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !testCompleted) {
      setTestCompleted(true);
      setDialogMsg(
        `Time's up! Your score is: ${calculateScore()} / ${questions.length}`
      );
      setDialogOpen(true);
    }
  }, [timeRemaining, testCompleted, questions]);

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

  const handleSubmit = () => {
    setTestCompleted(true);
    setDialogMsg(
      `Test completed! Your score is: ${calculateScore()} / ${questions.length}`
    );
    setDialogOpen(true);
  };

  const handleDialogContinue = () => {
    router.push("/");
    localStorage.removeItem("quiz_started");
  };

  useEffect(() => {
    const disableActions = (e: ClipboardEvent | MouseEvent | KeyboardEvent) => {
      e.preventDefault();
      return false;
    };

    const disableKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", disableActions);
    document.addEventListener("copy", disableActions);
    document.addEventListener("cut", disableActions);
    document.addEventListener("paste", disableActions);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("contextmenu", disableActions);
      document.removeEventListener("copy", disableActions);
      document.removeEventListener("cut", disableActions);
      document.removeEventListener("paste", disableActions);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);
  useEffect(() => {
    const quizStarted = localStorage.getItem("quiz_started");
  
    if (quizStarted !== "true") {
      router.replace("/");
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
    
      <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 shadow-lg z-50">
        <div className="text-3xl font-mono font-bold text-pink-300">
          {formatTime(timeRemaining)}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-6 sm:px-12 bg-gradient-to-tr from-[#100C24] to-[#392B6A] text-white"
        style={{ userSelect: "none" }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Notice</AlertDialogTitle>
                <AlertDialogDescription className="whitespace-pre-wrap">
                  {dialogMsg}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleDialogContinue}>
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-3 py-3 font-orbitron">
            <span className="bg-gradient-to-r from-[#61daff] to-[#E100FF] text-transparent bg-clip-text">
              Quiz Time!
            </span>
          </h1>

          {questions.length === 0 ? (
            <p className="text-lg">Loading questions...</p>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="bg-white/10 border border-white/20 backdrop-blur-md p-5 rounded-xl shadow-md transition hover:shadow-lg"
                >
                  <p className="font-medium text-lg mb-4">{q.question}</p>
                  <div className="space-y-3">
                    {q.options.map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md border transition cursor-pointer ${
                          q.selectedAnswer === option
                            ? "border-green-400 bg-green-500/20"
                            : "border-gray-500 hover:border-blue-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={q.selectedAnswer === option}
                          onChange={() => handleAnswer(index, option)}
                          disabled={testCompleted}
                          className="accent-pink-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!testCompleted && questions.length > 0 && (
            <div className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 10px #E100FF, 0 0 32px #61daff" }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#61b5ff] to-[#E100FF] text-white font-orbitron font-semibold text-xl px-8 py-2 rounded-sm transition mx-auto shadow-lg"
              >
                Submit
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default TestPage;
