"use client";
import { type Chapter, type Course, type Unit } from "@prisma/client";
import React from "react";
import ChapterCard from "./ChapterCard";
import type { ChapterCardHandler } from "./ChapterCard";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const chapterRefs: Record<
    string,
    React.RefObject<ChapterCardHandler | null>
  > = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      chapterRefs[chapter.id] = React.useRef<ChapterCardHandler>(null);
    });
  });
  const [completedChapters, setCompletedChapters] = React.useState<Set<string>>(
    new Set(),
  );
  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  return (
    <div className="w-full">
      {course.units.map((unit, unitIndex) => {
        return (
          <Card key={unit.id} className="mb-4">
            <CardContent>
              <div className="mb-4">
                <h2 className="text-secondary-foreground/60 text-sm font-medium uppercase">
                  Module {unitIndex + 1}
                </h2>
                <h3 className="mt-1 text-xl font-bold">{unit.name}</h3>
              </div>
              <div className="space-y-3">
                {unit.chapters.map((chapter, chapterIndex) => {
                  return (
                    <ChapterCard
                      completedChapters={completedChapters}
                      setCompletedChapters={setCompletedChapters}
                      ref={chapterRefs[chapter.id]}
                      key={chapter.id}
                      chapter={chapter}
                      chapterIndex={chapterIndex}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/learning"
          className={buttonVariants({
            variant: "secondary",
            className:
              "h-10 w-full border-2 border-gray-300 font-medium transition-colors hover:bg-gray-50",
          })}
        >
          <ChevronLeft className="mr-2 h-5 w-5" strokeWidth={4} />
          Back
        </Link>
        {totalChaptersCount === completedChapters.size ? (
          <Link
            className={buttonVariants({
              className:
                "hover:bg-primary/90 h-10 w-full font-medium transition-colors",
            })}
            href={`/course/${course.id}/0/0`}
          >
            Save & Continue
            <ChevronRight className="ml-2 h-5 w-5" strokeWidth={4} />
          </Link>
        ) : (
          <Button
            type="button"
            className="hover:bg-primary/90 h-10 w-full font-medium transition-colors hover:cursor-pointer"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              Object.values(chapterRefs).forEach((ref) => {
                ref.current?.triggerLoad();
              });
            }}
          >
            Generate
            <ChevronRight className="ml-2 h-5 w-5" strokeWidth={4} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConfirmChapters;
