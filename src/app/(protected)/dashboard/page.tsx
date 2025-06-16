"use client";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-button";
// import InviteButton from "./invite-button";
const InviteButton = dynamic(() => import("./invite-button"), { ssr: false });
import TeamMembers from "./team-members";
import dynamic from "next/dynamic";
// import MermaidChart from "./mermaid-chart";
const MermaidChart = dynamic(() => import("./mermaid-chart"), { ssr: false });

const DashboardPage = () => {
  const { project, projectId } = useProject();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* GitHub Link */}
        <div className="bg-primary w-fit rounded-md px-5 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center">
              <Github className="size-5 shrink-0 text-white" />
            </div>
            <p className="text-sm font-medium break-words text-white">
              This project is linked to{" "}
              <Link
                href={project?.gitHubUrl ?? ""}
                className="inline-flex items-center text-white/80 hover:underline"
              >
                {project?.gitHubUrl}
                <ExternalLink className="ml-1 hidden size-4 sm:inline" />
              </Link>
            </p>
          </div>
        </div>

        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          <MeetingCard />
        </div>
      </div>
      <div className="mt-6"></div>
      <MermaidChart projectId={projectId} />
      <div className="h-6"></div>
      <CommitLog />
    </div>
  );
};

export default DashboardPage;
