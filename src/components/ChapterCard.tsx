"use client";
import { cn } from "@/lib/utils";
import { type Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<string>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const [success, setSuccess] = React.useState<boolean | null>(null);
    const { mutate: getChapterInfo, isPending } = useMutation({
      mutationFn: async () => {
        try {
          const response = await axios.post("/api/chapter/getInfo", {
            chapterId: chapter.id,
          });
          return response.data;
        } catch (error) {
          console.error("Mutation Error:", error);
          throw error;
        }
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet;
      }
    }, [chapter, addChapterIdToSet]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        getChapterInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChapterIdToSet();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            toast.error("There was an Error Loading your Chapter");
            addChapterIdToSet();
          },
        });
      },
    }));
    return (
      <div
        key={chapter.id}
        className={cn("mt-2 flex justify-between rounded px-4 py-2", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {isPending && <Loader2 className="animate-spin" />}
      </div>
    );
  },
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
