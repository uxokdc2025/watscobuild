"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category, Demo, State, Block } from "../_showcase";

export function FeedbackSection() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 11));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <Category
      id="feedback"
      title="Feedback"
      description="Status, progress, loading placeholders, transient toasts, and tooltips."
    >
      {/* ── Alert ── */}
      <Demo name="Alert" slug="alert" className="items-stretch">
        <Block label="Default">
          <Alert>
            <Terminal />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </Alert>
        </Block>
        <Block label="Success">
          <Alert className="text-in-stock *:data-[slot=alert-description]:text-in-stock/90">
            <CheckCircle2 />
            <AlertTitle>Payment received</AlertTitle>
            <AlertDescription>Your order is confirmed.</AlertDescription>
          </Alert>
        </Block>
        <Block label="Error">
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Your session expired. Please log in again.
            </AlertDescription>
          </Alert>
        </Block>
      </Demo>

      {/* ── Progress ── */}
      <Demo name="Progress" slug="progress" className="items-start">
        <State label="Empty" className="w-full">
          <Progress value={0} className="w-full" />
        </State>
        <State label="In progress" className="w-full">
          <Progress value={66} className="w-full" />
        </State>
        <State label="Loading (live)" className="w-full">
          <Progress value={progress} className="w-full" />
        </State>
        <State label="Complete" className="w-full">
          <Progress value={100} className="w-full" />
        </State>
      </Demo>

      {/* ── Skeleton ── */}
      <Demo name="Skeleton" slug="skeleton">
        <Block label="Loading placeholder">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-4 w-[140px]" />
            </div>
          </div>
        </Block>
      </Demo>

      {/* ── Sonner ── */}
      <Demo
        name="Sonner"
        slug="sonner"
        description="Toast notifications. Click to fire each state."
      >
        <State label="Default">
          <Button variant="outline" onClick={() => toast("Event created")}>
            Toast
          </Button>
        </State>
        <State label="Success">
          <Button
            variant="outline"
            onClick={() => toast.success("Saved successfully")}
          >
            Success
          </Button>
        </State>
        <State label="Error">
          <Button
            variant="outline"
            onClick={() => toast.error("Could not save changes")}
          >
            Error
          </Button>
        </State>
        <State label="Loading">
          <Button
            variant="outline"
            onClick={() => {
              const id = toast.loading("Uploading…");
              setTimeout(() => toast.success("Uploaded", { id }), 1800);
            }}
          >
            Loading
          </Button>
        </State>
        <State label="Action">
          <Button
            variant="outline"
            onClick={() =>
              toast("File deleted", {
                action: { label: "Undo", onClick: () => toast("Restored") },
              })
            }
          >
            With action
          </Button>
        </State>
      </Demo>

      {/* ── Tooltip ── */}
      <Demo
        name="Tooltip"
        slug="tooltip"
        description="Requires a TooltipProvider ancestor."
      >
        <TooltipProvider>
          <State label="Default (open)">
            <Tooltip open>
              <TooltipTrigger asChild>
                <Button variant="outline">Anchored</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Always-on tooltip</TooltipContent>
            </Tooltip>
          </State>
          <State label="Hover / Focus">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Appears on hover or focus</TooltipContent>
            </Tooltip>
          </State>
        </TooltipProvider>
      </Demo>
    </Category>
  );
}
