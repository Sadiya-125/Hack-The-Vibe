"use client";
import CompanionsLibrary from "@/components/CompanionsLibrary";

const CompanionsLibraryPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const subject = searchParams.subject ?? "";
  const topic = searchParams.topic ?? "";

  return <CompanionsLibrary subject={subject} topic={topic} />;
};

export default CompanionsLibraryPage;
