"use client";
import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChaptersSchema } from "@/validators/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useProject from "@/hooks/use-project";

type Input = z.infer<typeof createChaptersSchema>;

const CreateCourseForm = () => {
  const router = useRouter();
  const { projectId } = useProject();

  const { mutate: createChapters, isPending } = useMutation({
    mutationFn: async ({ title, units }: Input) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        units,
        projectId,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      units: [""],
    },
  });

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const response = await axios.post("/api/course/suggest", { projectId });

        const title = response.data.course_title;
        const units = response.data.units.map(
          (unit: any) => unit.unit_title ?? unit,
        );

        form.reset({
          title,
          units: units.length > 0 ? units : [""],
        });
      } catch (error) {
        console.error("Error Fetching Course Suggestions:", error);
      }
    }

    if (projectId) {
      fetchCourseData();
    }
  }, [projectId, form]);

  function onSubmit(data: Input) {
    if (data.units.some((unit) => unit === "")) {
      toast.error("Please Fill all the Units");
      return;
    }
    createChapters(data, {
      onSuccess: ({ course_id }) => {
        toast.success("Course Created Successfully");
        router.push(`/learning/${course_id}`);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something Went Wrong");
      },
    });
  }

  form.watch();

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-md font-medium">
                  Course Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus:border-primary focus:ring-primary/20 h-12 rounded-lg border-2 bg-white/50 px-4 text-sm placeholder:text-sm focus:ring-2"
                    placeholder="e.g., Building a Full-Stack E-Commerce Platform"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <AnimatePresence>
            {form.watch("units").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                }}
              >
                <FormField
                  key={index}
                  control={form.control}
                  name={`units.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-md font-medium">
                        Module {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus:border-primary focus:ring-primary/20 h-12 rounded-lg border-2 bg-white/50 px-4 text-sm placeholder:text-sm focus:ring-2"
                          placeholder={
                            index === 0
                              ? "e.g., Project Setup and Environment Configuration"
                              : index === 1
                                ? "e.g., Database Design and Implementation"
                                : index === 2
                                  ? "e.g., User Authentication and Authorization"
                                  : index === 3
                                    ? "e.g., Frontend Development and UI/UX"
                                    : `e.g., Advanced Features and Optimization`
                          }
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="h-10 w-full border-2 border-green-500 font-medium transition-colors hover:cursor-pointer hover:bg-green-50"
              onClick={() => {
                form.setValue("units", [...form.watch("units"), ""]);
              }}
            >
              Add Module
              <Plus className="ml-2 h-5 w-5 text-green-500" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="h-10 w-full border-2 border-red-500 font-medium transition-colors hover:cursor-pointer hover:bg-red-50"
              onClick={() => {
                form.setValue("units", form.watch("units").slice(0, -1));
              }}
            >
              Remove Module
              <Trash className="ml-2 h-5 w-5 text-red-500" />
            </Button>
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="hover:bg-primary/90 mt-2 h-10 w-full font-medium transition-colors hover:cursor-pointer"
            size="sm"
          >
            Create Learning Path
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
