"use client";
import { Button } from "@radix-ui/themes";
import React from "react";

export default function ShareProfileButton({ userId }: { userId: string }) {
  return (
    <Button
      variant="solid"
      color="purple"
      size="3"
      className="mt-2"
      onClick={async () => {
        await navigator.clipboard.writeText(
          `${window.location.origin}/profile/${userId}`
        );
        alert("Profile link copied to clipboard!");
      }}
    >
      Share Profile
    </Button>
  );
}
