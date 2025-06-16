"use client";
import { cn } from "@/lib/utils";
import { type Chapter, type QuizQuestion } from "@prisma/client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import Confetti from "react-confetti";

type Props = {
  chapter: Chapter & {
    questions: QuizQuestion[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [questionState, setQuestionState] = React.useState<
    Record<string, boolean | null>
  >({});
  const [correctCount, setCorrectCount] = React.useState<number | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const checkAnswer = React.useCallback(() => {
    const newQuestionState: Record<string, boolean | null> = {};
    let count = 0;

    chapter.questions.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;

      const isCorrect = user_answer === question.answer;
      newQuestionState[question.id] = isCorrect;

      if (isCorrect) {
        count += 1;
      }
    });

    setQuestionState(newQuestionState);
    setCorrectCount(count);
    setShowConfetti(count === chapter.questions.length);
  }, [answers, chapter.questions]);

  return (
    <div className="w-full flex-1 md:mt-[-10] md:mr-[-30] lg:mt-1 lg:max-w-[700px] xl:max-w-[800px]">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <h1 className="text-3xl font-bold">Concept Check</h1>

      <div className="mt-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div
              key={question.id}
              className={cn(
                "mt-4 rounded-lg border p-3 transition md:w-[330]",
                {
                  "border-green-500 bg-green-100":
                    questionState[question.id] === true,
                  "border-red-500 bg-red-100":
                    questionState[question.id] === false,
                  "bg-secondary border-gray-300":
                    questionState[question.id] === null,
                },
              )}
            >
              <h2 className="text-md mb-3 font-semibold">
                {question.question}
              </h2>
              <RadioGroup
                className="mt-2 space-y-1"
                onValueChange={(e) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: e,
                  }));
                }}
              >
                {options.map((option, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem
                      value={option}
                      id={question.id + index.toString()}
                      checked={answers[question.id] === option}
                    />
                    <Label htmlFor={question.id + index.toString()}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full hover:cursor-pointer"
        size="sm"
        onClick={checkAnswer}
      >
        <div className="flex items-center justify-center gap-2">
          Check Answer
          <ChevronRight className="ml-2 h-4 w-4" />
        </div>
      </Button>

      {correctCount !== null && (
        <div className="text-md mt-4 text-center font-medium">
          You got {correctCount} out of {chapter.questions.length} correct!
        </div>
      )}
    </div>
  );
};

export default QuizCards;
