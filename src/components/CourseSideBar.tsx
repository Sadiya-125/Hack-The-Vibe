"use client";

import { cn } from "@/lib/utils";
import { type Chapter, type Course, type Unit } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
};

const CourseSideBar = ({ course, currentChapterId }: Props) => {
  return (
    <aside
      className={cn(
        "bg-secondary w-full p-5",
        "lg:w-72 xl:w-80 2xl:w-[21rem]",
        "h-full overflow-y-auto",
        "rounded-md shadow-md",
      )}
    >
      <h1 className="mb-4 text-2xl font-bold break-words text-black">
        {course.name}
      </h1>

      <div className="space-y-6">
        {course.units.map((unit, unitIndex) => (
          <div key={unit.id}>
            <div className="text-xs font-semibold text-black uppercase">
              Unit {unitIndex + 1}
            </div>
            <div className="text-xl font-bold break-words text-black">
              {unit.name}
            </div>

            <div className="mt-1 space-y-1">
              {unit.chapters.map((chapter, chapterIndex) => (
                <Link
                  key={chapter.id}
                  href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                  className={cn(
                    "block rounded-md px-3 py-1 text-sm break-words whitespace-normal transition-colors",
                    "hover:bg-primary/10",
                    chapter.id === currentChapterId
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {chapter.name}
                </Link>
              ))}
            </div>

            {unitIndex < course.units.length - 1 && (
              <Separator className="bg-border my-4" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CourseSideBar;
