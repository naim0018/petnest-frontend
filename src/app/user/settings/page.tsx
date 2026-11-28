"use client";

import React from "react";
import ProfileEditor from "@/components/profile/ProfileEditor";

export default function UserSettingsPage() {
  return <ProfileEditor roleScope="user" hideHeader />;
}
