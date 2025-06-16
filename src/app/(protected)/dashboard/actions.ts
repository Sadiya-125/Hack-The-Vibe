"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";
import { generateText } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();
  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
  SELECT "fileName", "sourceCode", "summary",
  1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
  FROM "SourceCodeEmbedding"
  WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
  AND "projectId"=${projectId}
  ORDER BY similarity DESC
  LIMIT 10
  `) as { fileName: string; sourceCode: string; summary: string }[];

  let context = "";
  for (const doc of result) {
    context += `Source: ${doc.fileName}\nCode Content: ${doc.sourceCode}\nSummary of File: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
      You are a AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
      AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      If the question is asking about the code or a specific file, AI will provide the detailed answer, giving step by step instructions, including code snippets.
      
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK

      START QUESTION
      ${question}
      END OF QUESTION
      
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer."
      AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no ambiguity in the answer.
      `,
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}

export async function askMeetingQuestion(question: string, meetingId: string) {
  const stream = createStreamableValue();

  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: { issues: true },
  });

  if (!meeting || !meeting.transcript) {
    stream.done("Transcript Not Found");
    return {
      output: stream.value,
      issues: [],
    };
  }

  const context = `Meeting Transcript:\n${meeting.transcript}`;

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
      You are a helpful AI assistant that answers questions about team meetings based on provided transcripts.
      Your objective is to help new interns or team members understand meeting discussions in a clear, beginner-friendly way. 
      Provide informative and context-aware responses, as if you were present during the meeting - without ever referencing the transcript or its existence.

      AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.

      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK

      START QUESTION
      ${question}
      END OF QUESTION

      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer."
      AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  return {
    output: stream.value,
    issues: meeting.issues,
  };
}

export async function getCourseNames(projectId: string) {
  const sourceDocs = await db.sourceCodeEmbedding.findMany({
    where: { projectId },
    select: {
      fileName: true,
      sourceCode: true,
      summary: true,
    },
  });

  if (!sourceDocs || sourceDocs.length === 0) {
    throw new Error("No Source Code Documents");
  }

  let context = "";
  for (const doc of sourceDocs) {
    context += `Source File: ${doc.fileName}\nCode Content: ${doc.sourceCode}\nSummary: ${doc.summary}\n\n`;
  }

  const prompt = `
  You are an expert course designer AI.

  Based on the following project context, generate a course title and exactly 2 unit titles to teach the project from scratch to a developer.

  Respond only in **valid JSON format** like this:

  {
    "course_title": "Full title of the course",
    "units": ["Unit 1 title", "Unit 2 title"]
  }

  Do not add any commentary, markdown, or explanation outside the JSON.

  START CONTEXT
  ${context}
  END CONTEXT
  `;

  const response = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: prompt,
  });

  const responseText = response.text;

  try {
    const match = responseText.match(/\{[\s\S]*?\}/);
    if (!match) {
      throw new Error("No JSON object found");
    }

    const json = JSON.parse(match[0]);

    const schema = z.object({
      course_title: z.string(),
      units: z.array(z.string().min(1)).max(5),
    });

    return schema.parse(json);
  } catch (error) {
    console.error("Failed to parse Gemini response:", responseText);
    throw new Error("Gemini response was not in valid JSON format.");
  }
}
