"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSettings } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TIMEZONES = [
  "Europe/Bratislava",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export function ProfileTab() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Europe/Bratislava");
  const { settings, loading, update } = useSettings();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "");
      setName(user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "");
    });
  }, []);

  // Initialize from saved settings
  useEffect(() => {
    if (!loading && settings.profile) {
      if (settings.profile.name) setName(settings.profile.name);
      if (settings.profile.timezone) setTimezone(settings.profile.timezone);
    }
  }, [loading, settings.profile]);

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Profile</h2>
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
      <div><Label>Email</Label><Input value={email} readOnly className="opacity-60" /></div>
      <div>
        <Label>Timezone</Label>
        <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </Select>
      </div>
      <Button primary onClick={() => update("profile", { name, timezone })}>Save</Button>
    </div>
  );
}
