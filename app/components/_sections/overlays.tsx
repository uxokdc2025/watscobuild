"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Demo, State } from "../_showcase";

export function OverlaysSection() {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <Category
      id="overlays"
      title="Overlays"
      description="Layered surfaces triggered by a control. Open each to see its states — items support hover, focus, disabled, and selected."
    >
      {/* ── Dialog ── */}
      <Demo name="Dialog" slug="dialog" description="Modal focus-trapped surface.">
        <State label="Default (click)">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Label htmlFor="dlg-name">Name</Label>
                <Input id="dlg-name" defaultValue="Ada Lovelace" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </State>
      </Demo>

      {/* ── Popover ── */}
      <Demo name="Popover" slug="popover" description="Non-modal floating panel.">
        <State label="Default (click)">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="grid gap-2">
                <p className="font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
                <div className="mt-2 grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="pop-w">Width</Label>
                  <Input
                    id="pop-w"
                    defaultValue="100%"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </State>
      </Demo>

      {/* ── Dropdown Menu ── */}
      <Demo
        name="Dropdown Menu"
        slug="dropdown-menu"
        description="Items with disabled and selected states."
      >
        <State label="Default (click)">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={notifications}
                onCheckedChange={setNotifications}
              >
                Notifications (selected)
              </DropdownMenuCheckboxItem>
              <DropdownMenuItem disabled>Team (disabled)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Delete account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </State>
      </Demo>
    </Category>
  );
}
