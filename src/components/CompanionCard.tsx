"use client";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
}: CompanionCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
            Coding
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600">{topic}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>
            {duration} {duration === 1 ? "Minute" : "Minutes"}
          </span>
        </div>

        <Link
          href={`/companion/${id}`}
          className="bg-primary hover:bg-primary/90 focus:ring-primary block w-full rounded-md px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:cursor-pointer"
        >
          Launch Lesson
        </Link>
      </CardContent>
    </Card>
  );
};

export default CompanionCard;
