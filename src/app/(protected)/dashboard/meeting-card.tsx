"use client";

import { Card } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import React from "react";
import { uploadFile } from "@/lib/appwrite/index";
import { Presentation, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const MeetingCard = () => {
  const { project } = useProject();
  const processMeeting = useMutation({
    mutationFn: async (data: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      const { meetingUrl, meetingId, projectId } = data;
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });
      return response.data;
    },
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const router = useRouter();

  const uploadMeeting = api.project.uploadMeeting.useMutation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      if (!project) return;
      setIsUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (!file) return;
      const downloadURL = (await uploadFile(
        file as File,
        setProgress,
      )) as string;
      uploadMeeting.mutate(
        {
          projectId: project.id,
          meetingUrl: downloadURL,
          name: file.name,
        },
        {
          onSuccess: (meeting) => {
            toast.success("Meeting Uploaded Successfully");
            router.push("/meetings");
            processMeeting.mutateAsync({
              meetingUrl: downloadURL,
              meetingId: meeting.id,
              projectId: project.id,
            });
          },
          onError: () => {
            toast.error("Failed to Upload Meeting");
          },
        },
      );
      setIsUploading(false);
    },
  });

  return (
    <Card
      className="col-span-3 flex flex-col items-center p-5 md:col-span-2"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="mt-2 h-10 w-10 animate-bounce" />
          <h3 className="text-center font-semibold text-gray-900">
            Create a New Meeting
          </h3>
          <p className="text-center text-sm text-gray-500">
            Analyse your Meeting with Collab-Sphere.
            <br />
            Powered by AI.
          </p>
          <div>
            <Button disabled={isUploading}>
              <Upload className="mr-1.5 -ml-0.5 h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div className="flex flex-col items-center justify-center">
          <CircularProgressbar
            value={progress}
            className="mt-5 mr-5 size-20"
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
            })}
          />
          <p className="mt-5 text-sm text-gray-500">
            Uploading your Meeting...
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
