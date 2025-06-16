"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import { createCompanion } from "@/lib/actions/companion.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import useProject from "@/hooks/use-project";

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.coerce.number().min(1, { message: "Duration is required." }),
});

const CompanionForm = () => {
  const { projectId } = useProject();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(
      { ...values, subject: "coding" },
      projectId || "",
    );

    if (companion) {
      redirect(`/companion/${companion.id}`);
    } else {
      console.log("Failed to Create a Companion");
      redirect("/companion");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="mt-2 mb-4 w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="mt-2 text-center text-3xl font-bold">
            Create Your AI Companion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary mt-[-10px] flex w-full flex-col items-start gap-4 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-6">
            <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-7 sm:w-7" />
            <p className="text-muted-foreground text-sm">
              Design your personalized AI learning companion. Customize its
              personality, expertise, and teaching style to match your learning
              preferences.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-3xl">
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        Companion Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Code Mentor, Dev Buddy, Hackathon Helper, etc."
                          {...field}
                          className="focus:border-primary focus:ring-primary/20 h-12 rounded-lg border-2 bg-white/50 px-4 text-sm placeholder:text-sm focus:ring-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        What Should the Companion Help With?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Front End Development, React, Next.js, etc."
                          {...field}
                          className="focus:border-primary focus:ring-primary/20 min-h-[100px] rounded-lg border-2 bg-white/50 px-4 py-3 text-sm placeholder:text-sm focus:ring-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        Voice
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-2 bg-white/50 px-4 text-sm focus:ring-2">
                            <SelectValue placeholder="Select the Voice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        Style
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-2 bg-white/50 px-4 text-sm focus:ring-2">
                            <SelectValue placeholder="Select the Style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        Estimated Session Duration (Minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          {...field}
                          className="focus:border-primary focus:ring-primary/20 h-12 rounded-lg border-2 bg-white/50 px-4 text-sm placeholder:text-sm focus:ring-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="hover:bg-primary/90 mt-2 h-10 w-full font-medium transition-colors hover:cursor-pointer"
                >
                  Create Companion
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanionForm;
