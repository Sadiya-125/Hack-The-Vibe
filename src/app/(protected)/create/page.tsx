"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  gitHubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();
  const refetch = useRefetch();
  function onSubmit(data: FormInput) {
    if (!!checkCredits.data) {
      createProject.mutate(
        {
          gitHubUrl: data.repoUrl,
          name: data.projectName,
          gitHubToken: data.gitHubToken || "",
        },
        {
          onSuccess: (data) => {
            toast.success("Project Created Successfully!");
            refetch();
            reset();
          },
          onError: (error) => {
            toast.error("Error Creating Project: " + error.message);
          },
        },
      );
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.gitHubToken,
      });
    }
  }

  const hasEnoughCredits = checkCredits?.data?.userCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userCredits
    : true;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-8 md:flex-row">
      <img
        src="/undraw_designer_efwz.svg"
        className="w-3/4 max-w-xs md:h-56 md:w-auto md:max-w-sm lg:max-w-md"
        alt="Designer Illustration"
      />
      <div className="w-full max-w-md">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">
            Link your GitHub Repository
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter the URL of your GitHub repository to link it to Collab-Sphere.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
          <Input
            {...register("projectName", { required: true })}
            placeholder="Project Name"
            className="placeholder:text-sm"
            required
          />
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="GitHub URL"
            className="placeholder:text-sm"
            type="url"
            required
          />
          <Input
            {...register("gitHubToken")}
            placeholder="GitHub Token (Optional)"
            className="placeholder:text-sm"
          />

          {!!checkCredits.data && (
            <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-orange-700">
              <div className="flex items-center gap-2">
                <Info className="size-4" />
                <p className="text-sm">
                  You will be charged{" "}
                  <strong>{checkCredits.data?.fileCount}</strong> credits for
                  this repository.
                </p>
              </div>
              <p className="mt-1 ml-6 text-sm text-blue-600">
                You have <strong>{checkCredits.data?.userCredits}</strong>{" "}
                credits remaining.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              createProject.isPending ||
              checkCredits.isPending ||
              !hasEnoughCredits
            }
            className="w-full"
          >
            {!!checkCredits.data ? "Create Project" : "Check Credits"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
