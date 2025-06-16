"use client";

import { useEffect, useState } from "react";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import { Plus } from "lucide-react";
import useProject from "@/hooks/use-project";

type Props = {
  subject: string;
  topic: string;
};

const CompanionsLibrary = ({ subject, topic }: Props) => {
  const { projectId } = useProject();
  const [companions, setCompanions] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanions = async () => {
      if (!projectId) return;
      const data = await getAllCompanions({ subject, topic, projectId });
      setCompanions(data);
    };

    fetchCompanions();
  }, [subject, topic, projectId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">Companion Library</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <SearchInput />
          <Link
            href="/companion/create"
            className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-2 py-2 text-[15px] text-white shadow-sm transition-colors"
          >
            <Plus className="h-5.5 w-5 lg:h-4" />
            <span className="ml-2 hidden lg:inline">Build a New Companion</span>
          </Link>
        </div>
      </div>

      {companions.length === 0 ? (
        <div className="my-4 text-sm text-gray-600">No Companions Found</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanionsLibrary;
