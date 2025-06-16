"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import React from "react";
import { toast } from "sonner";

const InviteButton = () => {
  const { projectId } = useProject();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-gray-500 sm:text-left">
            Ask them to Copy and Paste this Link
          </p>
          <Input
            className="mt-1 text-sm"
            readOnly
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/join/${projectId}`,
              );
              toast.success("Copied to Clipboard");
            }}
            value={`${window.location.origin}/join/${projectId}`}
          />
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>
        Invite Members
      </Button>
    </>
  );
};

export default InviteButton;
