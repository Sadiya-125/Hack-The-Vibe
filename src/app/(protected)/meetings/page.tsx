"use client";
import useProject from "@/hooks/use-project";
import React from "react";
import { api } from "@/trpc/react";
import MeetingCard from "../dashboard/meeting-card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

const MeetingsPage = () => {
  const { projectId } = useProject();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    {
      refetchInterval: 4000,
    },
  );
  const deleteMeeting = api.project.deleteMeeting.useMutation();
  const refetch = useRefetch();
  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && (
        <div className="mt-3 text-sm">No Meetings Found</div>
      )}
      {isLoading && (
        <div className="mt-3 text-sm font-semibold">Loading...</div>
      )}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="truncate text-[15px] font-semibold"
                >
                  {meeting.name}
                </Link>
                {meeting.status === "PROCESSING" && (
                  <Badge className="bg-yellow-500 text-white">
                    Processing...
                  </Badge>
                )}
              </div>
              <div className="mt-1 mb-2 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                <p className="whitespace-nowrap">
                  {meeting.createdAt.toLocaleDateString()}
                </p>
                <p className="truncate">
                  {meeting.issues.length}{" "}
                  {meeting.issues.length === 1 ? "issue" : "issues"}
                </p>
              </div>
            </div>

            <div className="mt-[-15px] flex flex-wrap justify-end gap-2 sm:flex-none">
              <Link href={`/meetings/${meeting.id}`}>
                <Button variant="outline" size="sm">
                  View Meeting
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteMeeting.isPending}
                onClick={() =>
                  deleteMeeting.mutate(
                    { meetingId: meeting.id },
                    {
                      onSuccess: () => {
                        toast.success("Meeting Deleted Successfully");
                        useRefetch();
                      },
                    },
                  )
                }
              >
                Delete Meeting
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingsPage;
