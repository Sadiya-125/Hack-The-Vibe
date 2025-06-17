"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
  BotMessageSquare,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useProject from "@/hooks/use-project";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: BotMessageSquare,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Learning",
    url: "/gallery",
    icon: BookOpen,
  },
  {
    title: "Companion",
    url: "/companion",
    icon: UserRoundCheck,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div
          className={cn(
            "mt-2 flex items-center gap-2",
            !open && "flex-col",
            open && "ml-1",
          )}
        >
          <Image src="/logo.png" alt="Logo" width={25} height={25} />
          {open && <h1 className="mt-3/4 text-lg font-bold">Collab-Sphere</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "list-none justify-start",
                          pathname === item.url && "!bg-primary !text-white",
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return open ? (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => setProjectId(project.id)}
                        className="hover:cursor-pointer"
                      >
                        <div
                          className={cn(
                            "text-primary flex size-8 items-center justify-center rounded-sm border bg-white text-sm",
                            {
                              "bg-primary text-white": project.id === projectId,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => setProjectId(project.id)}
                        className={cn(
                          "text-primary flex size-8 list-none items-center justify-center rounded-sm border bg-white text-sm hover:cursor-pointer",
                          {
                            "bg-primary text-white": project.id === projectId,
                          },
                        )}
                      >
                        <div className="justify-center">{project.name[0]}</div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <div className="h-2"></div>
              {open ? (
                <SidebarMenuItem>
                  <Link href="/create">
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="ml-2 w-[205] items-center hover:cursor-pointer"
                    >
                      <Plus />
                      Create Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <Link href="/create">
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="w-[32] hover:cursor-pointer"
                    >
                      <Plus />
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {open && (
        <SidebarFooter>
          <div className="text-muted-foreground p-4 text-center text-sm">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/Sadiya-125"
              target="_blank"
              className="text-primary hover:underline"
            >
              Sadiya
            </Link>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}