import CompanionForm from "@/components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const canCreateCompanion = await newCompanionPermissions();

  if (canCreateCompanion) {
    return <CompanionForm />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Limit Reached
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative">
            <Image
              src="/images/limit.svg"
              alt="Companion limit reached"
              width={360}
              height={230}
              className="mx-auto"
            />
            <div className="bg-primary absolute -top-3 right-0 rounded-full px-4 py-1 text-sm font-medium text-white">
              Upgrade Required
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              You've Reached Your Companion Limit
            </h2>
            <p className="text-muted-foreground max-w-md text-sm">
              Upgrade your plan to create more companions and unlock premium
              features for an enhanced learning experience.
            </p>
          </div>

          <Link
            href="/companion/subscription"
            className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex w-full max-w-xs items-center justify-center rounded-md px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors"
          >
            Upgrade My Plan
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCompanion;
