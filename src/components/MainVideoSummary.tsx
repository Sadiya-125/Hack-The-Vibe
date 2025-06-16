import { type Chapter, type Unit } from "@prisma/client";
import React from "react";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

const MainVideoSummary = ({
  unit,
  unitIndex,
  chapter,
  chapterIndex,
}: Props) => {
  return (
    <div className="flex-[2] lg:mt-[-20] lg:ml-[-56]">
      <h4 className="text-secondary-foreground/60 text-sm uppercase">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="text-4xl font-bold break-words">{chapter.name}</h1>
      <div className="mt-4 aspect-video max-h-[32rem] w-full">
        <iframe
          title="chapter video"
          className="h-full w-full rounded-lg"
          src={`https://www.youtube.com/embed/${chapter.videoId}`}
          allowFullScreen
        />
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-semibold">Summary</h3>
        <p className="text-secondary-foreground/80 mt-2">{chapter.summary}</p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
