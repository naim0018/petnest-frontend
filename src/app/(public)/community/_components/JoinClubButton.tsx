"use client";

import { useState } from "react";
import PrimaryButton from "@/components/common/PrimaryButton";

export function JoinClubButton({ isInitiallyJoined }: { isInitiallyJoined: boolean }) {
  const [isJoined, setIsJoined] = useState(isInitiallyJoined);

  return (
    <PrimaryButton
      size="sm"
      variant={isJoined ? "secondary" : "primary"}
      onClick={() => setIsJoined(!isJoined)}
      title={isJoined ? "Joined ✓" : "Join Club"}
    />
  );
}
