import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request, res: Response) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    if (dbUser?.credits <= 20) {
      return NextResponse.json({ error: "No Credits" }, { status: 402 });
    }
    const body = await req.json();
    const { title, units } = createChaptersSchema.parse(body);
    const { projectId } = body;

    if (!projectId || typeof projectId !== "string" || projectId.length < 1) {
      return NextResponse.json(
        { error: "Invalid or Missing ProjectId" },
        { status: 400 },
      );
    }

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    }[];

    let output_units: outputUnits = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant YouTube videos for each chapter.",
      units.map(
        (unitTitle) =>
          `You are creating a course about "${title}". For the unit titled "${unitTitle}", generate exactly 2 chapters. Each chapter should have:
            1. A descriptive chapter_title
            2. A youtube_search_query to find an educational and informative video for this chapter.
          Important:
          - Do not change the unit title. It must remain "${unitTitle}".
          - Each youtube_search_query must give a high-quality educational tutorial or course on the topic.`,
      ),
      {
        title: "Title of the unit (should match the input exactly)",
        chapters:
          "An array of 2 chapters. Each chapter must include a 'chapter_title' and 'youtube_search_query'.",
      },
    );

    const imageSearchTerm = await strict_output(
      "You are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the Unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_search_term: "A good search term for the title of the course",
      },
    );

    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term,
    );
    const course = await db.course.create({
      data: {
        name: title,
        image: course_image,
        projectId: projectId,
      },
    });

    for (const unit of output_units) {
      const title = unit.title;
      const prismaUnit = await db.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await db.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          decrement: 20,
        },
      },
    });

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Body", { status: 400 });
    }
    console.error(error);
  }
}
