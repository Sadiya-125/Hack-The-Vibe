import React from "react";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import CreateCourseForm from "@/components/CreateCourseForm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {};

const Learning = async (props: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User Not Found" }, { status: 404 });
  }

  if (dbUser?.credits <= 20) {
    return NextResponse.json({ error: "No Credits" }, { status: 402 });
  }
  return (
    <div className="flex flex-col items-center">
      <Card className="mb-4 w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary mt-[-10px] flex w-full flex-col items-start gap-4 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-6">
            <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-7 sm:w-7" />
            <p className="text-muted-foreground text-sm">
              Transform your project into an interactive learning experience!
              Our AI-powered system crafts a personalized course that guides you
              and your team through every step of building your masterpiece.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-3xl">
        <CreateCourseForm />
      </div>
    </div>
  );
};

export default Learning;
