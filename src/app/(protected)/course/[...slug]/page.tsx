import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/QuizCards";
import { db } from "@/server/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async (props: Props) => {
  const { slug } = await props.params;
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });
  if (!course) {
    return redirect("/learning");
  }
  if (!unitIndexParam || !chapterIndexParam) {
    return redirect("/learning");
  }
  let unitIndex = parseInt(unitIndexParam);
  let chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/learning");
  }
  const chapter = unit.chapters[chapterIndex];
  if (!chapter) {
    return redirect("/learning");
  }
  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="w-full lg:w-[22rem] xl:w-[24rem] 2xl:w-[26rem]">
        <div className="sticky top-0 overflow-y-auto">
          <CourseSideBar course={course} currentChapterId={chapter.id} />
        </div>
      </div>

      <div className="ml-[-20px] flex-1 p-4 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <MainVideoSummary
            chapter={chapter}
            chapterIndex={chapterIndex}
            unit={unit}
            unitIndex={unitIndex}
          />
          <QuizCards chapter={chapter} />
        </div>
        <div className="w-full px-4 sm:px-8 lg:ml-[-120] lg:px-16 xl:ml-[-180] xl:px-32">
          <div className="mx-auto my-6 h-[1px] w-full max-w-5xl bg-gray-500" />

          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row">
            {prevChapter && (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
                className="flex w-full sm:w-fit"
              >
                <div className="flex items-center gap-4">
                  <ChevronLeft className="mt-4 mr-1 h-6 w-6 flex-shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-secondary-foreground/60 text-sm">
                      Previous
                    </span>
                    <span className="text-xl font-bold">
                      {prevChapter.name}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {nextChapter && (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
                className="flex w-full sm:ml-auto sm:w-fit"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-secondary-foreground/60 text-sm">
                      Next
                    </span>
                    <span className="text-xl font-bold">
                      {nextChapter.name}
                    </span>
                  </div>
                  <ChevronRight className="mt-4 ml-1 h-6 w-6 flex-shrink-0" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
