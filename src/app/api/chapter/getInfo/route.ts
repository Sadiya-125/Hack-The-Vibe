import { strict_output } from "@/lib/gpt";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter Not Found",
        },
        { status: 404 },
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    if (!videoId) {
      throw new Error("YouTube Video Not Found");
    }
    let transcript = await getTranscript(videoId);
    let maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const { summary }: { summary: string } = await strict_output(
      "You are an AI capable of summarizing a YouTube transcript.",
      "Summarize the following transcript in 250 words or less. Do not mention sponsors or any unrelated content. Avoid introducing what the summary is about.\n" +
        transcript,
      {
        summary: "Summary of the transcript",
      },
    );

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name,
    );

    await db.quizQuestion.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await db.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Body",
        },
        { status: 400 },
      );
    } else {
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          error: "Unknown",
        },
        { status: 500 },
      );
    }
  }
}
