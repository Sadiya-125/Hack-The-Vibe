import ConfirmChapters from "@/components/ConfirmChapters";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapters = async (props: Props) => {
  const { courseId } = await props.params;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });
  if (!course) {
    return redirect("/learning");
  }
  return (
    <div className="flex flex-col items-center">
      <Card className="mb-4 w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {course.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary mt-[-10px] flex w-full flex-col items-start gap-4 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-6">
            <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-7 sm:w-7" />
            <p className="text-muted-foreground text-sm">
              We've generated detailed chapters for each module. Review them
              carefully and click the button below to confirm and continue with
              your learning journey!
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-3xl">
        <ConfirmChapters course={course} />
      </div>
    </div>
  );
};

export default CreateChapters;
