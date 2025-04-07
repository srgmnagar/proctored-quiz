"use client";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import React, { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// type Question = {
//   question: string;
//   correct_answer: string;
//   incorrect_answers: string[];
//   options: string[];
//   selectedAnswer?: string;
// };

// const shuffle = (array: string[]): string[] => {
//   const result = [...array];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// };

// const TestPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const tabSwitchCount = useRef(0);

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [timeRemaining, setTimeRemaining] = useState(120);
//   const [testCompleted, setTestCompleted] = useState(false);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogMsg, setDialogMsg] = useState("");

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const amount = searchParams.get("numQuestions");
//         const category = searchParams.get("category");
//         const difficulty = searchParams.get("difficulty");

//         const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple${
//           category ? `&category=${category}` : ""
//         }${difficulty ? `&difficulty=${difficulty}` : ""}`;

//         const res = await fetch(url);
//         const data = await res.json();

//         const formatted = data.results.map((q: any) => ({
//           question: decodeURIComponent(q.question),
//           correct_answer: decodeURIComponent(q.correct_answer),
//           incorrect_answers: q.incorrect_answers.map((ans: string) =>
//             decodeURIComponent(ans)
//           ),
//           options: shuffle([
//             decodeURIComponent(q.correct_answer),
//             ...q.incorrect_answers.map((ans: string) => decodeURIComponent(ans)),
//           ]),
//         }));

//         setQuestions(formatted);

//         // ⏱️ Dynamic time: 30 seconds per question
//         setTimeRemaining(formatted.length * 30);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//       }
//     };

//     fetchQuestions();
//   }, [searchParams]);

//   const calculateScore = () =>
//     questions.filter((q) => q.selectedAnswer === q.correct_answer).length;

//   // useEffect(() => {
//   //   const handleFullscreenChange = () => {
//   //     if (!document.fullscreenElement) {
//   //       setTestCompleted(true);
//   //       setDialogMsg(
//   //         `You exited fullscreen mode. Your test has been terminated.\nYour score is: ${calculateScore()} / ${questions.length}`
//   //       );
//   //       setDialogOpen(true);
//   //     }
//   //   };

//   //   document.addEventListener("fullscreenchange", handleFullscreenChange);
//   //   return () => {
//   //     document.removeEventListener("fullscreenchange", handleFullscreenChange);
//   //   };
//   // }, [questions]);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         tabSwitchCount.current++;

//         if (tabSwitchCount.current >= 2) {
//           setTestCompleted(true);
//           setDialogMsg(
//             `Test terminated due to tab switching.\nYour score is: ${calculateScore()} / ${questions.length}`
//           );
//           setDialogOpen(true);
//         } else {
//           setDialogMsg(
//             `Tab switch detected. You have ${
//               2 - tabSwitchCount.current
//             } attempt(s) left.`
//           );
//           setDialogOpen(true);
//         }
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [questions]);

//   useEffect(() => {
//     if (timeRemaining > 0 && !testCompleted) {
//       const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
//       return () => clearInterval(timer);
//     } else if (timeRemaining === 0 && !testCompleted) {
//       setTestCompleted(true);
//       setDialogMsg(
//         `Time's up! Your score is: ${calculateScore()} / ${questions.length}`
//       );
//       setDialogOpen(true);
//     }
//   }, [timeRemaining, testCompleted, questions]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   const handleAnswer = (questionIndex: number, option: string) => {
//     setQuestions((prev) =>
//       prev.map((q, i) =>
//         i === questionIndex ? { ...q, selectedAnswer: option } : q
//       )
//     );
//   };

//   const handleSubmit = () => {
//     setTestCompleted(true);
//     setDialogMsg(
//       `Test completed! Your score is: ${calculateScore()} / ${questions.length}`
//     );
//     setDialogOpen(true);
//   };

//   const handleDialogContinue = () => {
//     router.push("/");
//   };

//   return (
//     <div style={{
//       background: "radial-gradient(circle at center, rgb(57 43 106) 0%, #100C24 100%)",
//       backdropFilter: "blur(50px)",
//     }}className="min-h-screen p-6 px-10 font-sans  ">

//     <div
//       className="sm:w-[70%] w-90% mx-auto"
      
//     >
//       <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Notice</AlertDialogTitle>
//             <AlertDialogDescription >
//               {dialogMsg}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={handleDialogContinue}>
//               OK
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <h1 className="text-5xl font-bold mb-4 text-white">Test</h1>
//       <div className="mb-4 text-2xl font-bold text-white">
//         Time Remaining: {formatTime(timeRemaining)}
//       </div>

//       {questions.length === 0 ? (
//         <p className="text-white text-xl">Loading questions...</p>
//       ) : (
//         questions.map((q, index) => (
//           <div style={{
//             background: "linear-gradient(90deg, rgba(3, 133, 187, 0.70) 0%, rgba(5, 51, 81, 0.70) 100%)",
//           }} key={index} className=" p-4 rounded-md mb-4">
//             <p className="font-semibold text-white">{q.question}</p>
//             <ul>
//               {q.options.map((option, i) => (
//                 <li key={i} className="my-2">
//                   <label className="flex items-center p-2 border border-gray-400 rounded-md  w-full bg-transparent text-white cursor-pointer">
//                     <input
//                       type="radio"
//                       name={`question-${index}`}
//                       value={option}
//                       checked={q.selectedAnswer === option}
//                       onChange={() => handleAnswer(index, option)}
//                       disabled={testCompleted}
//                     />
//                     <span className="ml-2">{option}</span>
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))
//       )}

//       {!testCompleted && questions.length > 0 && (
//         <button
//           className="bg-gradient-to-r from-[#61b5ff] to-[#E100FF] text-white font-orbitron font-semibold hover:scale-105 text-xl px-8 py-2 rounded-sm hover:bg-blue-600 transition mx-auto"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       )}
//     </div>
//     </div>
//   );
// };

// export default TestPage;
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
        setTimeRemaining(formatted.length * 30); // 30s per question
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [searchParams]);

  const calculateScore = () =>
    questions.filter((q) => q.selectedAnswer === q.correct_answer).length;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current++;

        if (tabSwitchCount.current >= 2) {
          setTestCompleted(true);
          setDialogMsg(
            `Test terminated due to tab switching.\nYour score is: ${calculateScore()} / ${questions.length}`
          );
          setDialogOpen(true);
        } else {
          setDialogMsg(
            `Tab switch detected. You have ${2 - tabSwitchCount.current} attempt(s) left.`
          );
          setDialogOpen(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [questions]);

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
  };

  return (
    <div className="min-h-screen p-6 sm:px-12 bg-gradient-to-tr from-[#100C24] to-[#392B6A] text-white">
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

        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Quiz Time!</h1>
          <div className="text-xl font-semibold text-pink-300">
            ⏳ Time Remaining: {formatTime(timeRemaining)}
          </div>
        </header>

        {questions.length === 0 ? (
          <p className="text-lg">Loading questions...</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div
                key={index}
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
              </div>
            ))}
          </div>
        )}

        {!testCompleted && questions.length > 0 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:scale-105 hover:shadow-xl transition"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
