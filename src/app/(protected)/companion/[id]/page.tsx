import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import { CodeSquare } from "lucide-react";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  const { name, subject, title, topic, duration } = companion;

  if (!user) redirect("/sign-in");
  if (!name) redirect("/companion");

  return (
    <main>
      <article className="rounded-border mb-5 flex justify-between gap-4 p-4 max-md:flex-col">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-md max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <CodeSquare className="text-white" size={24} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{name}</p>
              <div className="subject-badge px-2 py-1 text-xs max-sm:hidden">
                {subject}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{topic}</p>
          </div>
        </div>

        <div className="text-muted-foreground items-start text-sm max-md:hidden">
          {duration}
          {duration != 1 ? " Minutes" : " Minute"}
        </div>
      </article>

      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;
