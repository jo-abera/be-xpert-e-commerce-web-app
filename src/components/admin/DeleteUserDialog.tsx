"use client";

import { Alert } from "@/components/ui/alert-message";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types/user";

type DeleteUserDialogProps = {
  user: User;
  open: boolean;
  errorMessage?: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteUserDialog({
  user,
  open,
  errorMessage,
  isPending,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-user-title" className="text-lg font-semibold">
          Delete user?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This will permanently remove{" "}
          <span className="font-medium text-foreground">{user.name}</span> (
          {user.email}) from the EscuelaJS API.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Demo and seed accounts usually cannot be deleted. Only users you
          registered can be removed.
        </p>
        {errorMessage ? (
          <Alert tone="error" title="Could not delete user" className="mt-4">
            {errorMessage}
          </Alert>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={isPending}
            onClick={onConfirm}
          >
            Delete user
          </Button>
        </div>
      </div>
    </div>
  );
}
