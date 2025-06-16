import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";

export async function searchYoutube(searchQuery: string) {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: searchQuery,
          videoDuration: "medium",
          videoEmbeddable: "true",
          type: "video",
          maxResults: 5,
        },
      },
    );

    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      console.warn("⚠️ No YouTube results found for:", searchQuery);
      return null;
    }

    const videoId = data.items[0]?.id?.videoId;
    if (!videoId) {
      console.warn("⚠️ YouTube result does not contain videoId.");
      return null;
    }
    return videoId;
  } catch (err: any) {
    console.error("❌ YouTube API error:", {
      message: err.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return null;
  }
}

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  course_title: string,
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };
  const questions: Question[] = await strict_output(
    "You are a helpful AI that generates multiple-choice questions (MCQs) and answers. Each answer and option should not exceed 15 words.",
    new Array(5).fill(
      `Generate a random hard MCQ related to the course "${course_title}" using the context of the following transcript: ${transcript}`,
    ),
    {
      question: "Question",
      answer: "Answer (maximum 15 words)",
      option1: "Option 1 (maximum 15 words)",
      option2: "Option 2 (maximum 15 words)",
      option3: "Option 3 (maximum 15 words)",
    },
  );
  return questions;
}
