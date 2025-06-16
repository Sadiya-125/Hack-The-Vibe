import { getCourseNames } from "@/app/(protected)/dashboard/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const projectId = body.projectId;
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing projectId" },
        { status: 400 },
      );
    }

    const data = await getCourseNames(projectId);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating course names:", error);
    return NextResponse.json(
      { error: "Failed to generate course names" },
      { status: 500 },
    );
  }
}
