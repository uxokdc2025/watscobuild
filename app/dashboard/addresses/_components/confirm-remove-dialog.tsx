"use client";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Address } from "../_lib/types";

type Props = {
  address: Address | null;
  onCancel: () => void;
  onConfirm: (addr: Address) => void;
};

export function ConfirmRemoveDialog({ address, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={!!address} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove address?</DialogTitle>
          <DialogDescription>
            {address ? `This will remove "${address.label}" from this browser session.` : null} This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" className="min-h-11" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="min-h-11"
            onClick={() => address && onConfirm(address)}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Remove
          </Button>
        </div>
        <button
          aria-label="Close"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="size-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
