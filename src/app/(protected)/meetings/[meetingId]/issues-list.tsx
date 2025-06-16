"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/trpc/react";
import { VideoIcon } from "lucide-react";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";
import { askMeetingQuestion } from "../../dashboard/actions";

type Props = {
  meetingId: string;
};

const IssuesList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    { meetingId },
    {
      refetchInterval: 4000,
    },
  );

  if (isLoading || !meeting)
    return <div className="p-8 text-sm font-semibold">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
        <div className="flex items-center gap-x-6">
          <h1>
            <div className="mb-2 ml-0 flex flex-col items-center justify-center gap-3 text-sm text-[15px] leading-6 text-gray-600 md:ml-6 md:flex-row md:justify-start">
              <VideoIcon className="h-10 w-10 rounded-full border bg-white p-2" />
              Meeting on {meeting.createdAt.toLocaleDateString()}
            </div>
            <div className="mt-1 ml-6 text-lg leading-6 font-semibold text-gray-900">
              {meeting.name}
            </div>
          </h1>
        </div>
      </div>

      <div className="h-4"></div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {meeting.issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} meetingId={meetingId} />
        ))}
      </div>
    </div>
  );
};

function IssueCard({
  issue,
  meetingId,
}: {
  issue: NonNullable<
    RouterOutputs["project"]["getMeetingById"]
  >["issues"][number];
  meetingId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("Please Enter a Question");
      return;
    }

    setAnswer("");
    setLoading(true);
    try {
      const { output } = await askMeetingQuestion(question, meetingId);

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAnswer((prev) => prev + delta);
        }
      }
    } catch (error) {
      toast.error("Failed to Ask Question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{issue.gist}</DialogTitle>
            <DialogDescription>
              {issue.createdAt.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <p className="text-gray-600">{issue.headline}</p>
          <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
            <span className="text-sm text-gray-600">
              {issue.start} - {issue.end}
            </span>
            <p className="leading-relaxed font-medium text-gray-900 italic">
              {issue.summary}
            </p>
          </blockquote>

          <div className="mt-2 space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Ask for Further Clarification...
            </label>
            <Textarea
              placeholder="What did you mean by..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-2 text-[15px] placeholder:text-[15px]"
            />
            <p className="text-muted-foreground text-xs">
              Collab-Sphere has context about this Issue and the Meeting.
            </p>
          </div>

          {answer && (
            <div className="text-[15px] whitespace-pre-wrap">
              <p className="text-sm font-semibold">Answer</p>
              {answer}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleAsk} disabled={loading}>
              Ask Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="relative flex h-full flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-lg">{issue.gist}</CardTitle>
          <div className="border-b"></div>
          <CardDescription>{issue.headline}</CardDescription>
        </CardHeader>
        <CardContent className="-mt-2 -mb-1">
          <Button size="sm" onClick={() => setOpen(true)}>
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default IssuesList;
