"use client";
import { api } from "@/trpc/react";
import GalleryCourseCard from "@/components/GalleryCourseCard";
import useProject from "@/hooks/use-project";
import Link from "next/link";
import React from "react";
import { Plus } from "lucide-react";

type Props = {};

const GalleryPage = (props: Props) => {
  const { projectId } = useProject();
  const {
    data: courses,
    isLoading,
    refetch,
  } = api.project.getCourses.useQuery(
    { projectId },
    {
      refetchInterval: 4000,
    },
  );

  const deleteMutation = api.project.deleteCourse.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate({ courseId: id });
    }
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Link
          href="/learning"
          className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Link>
      </div>

      {isLoading && (
        <div className="my-4 text-sm font-semibold text-gray-700">
          Loading...
        </div>
      )}
      {courses && courses.length === 0 && (
        <div className="my-4 text-sm text-gray-600">No Courses Found</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses &&
          courses.map((course) => (
            <GalleryCourseCard
              course={course}
              key={course.id}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default GalleryPage;
