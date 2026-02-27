"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileTab() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "");
      setName(user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "");
    });
  }, []);

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Profile</h2>
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
      <div><Label>Email</Label><Input value={email} readOnly className="opacity-60" /></div>
      <div>
        <Label>Timezone</Label>
        <Select><option>Europe/Bratislava (UTC+1)</option></Select>
      </div>
      <Button primary>Save</Button>
    </div>
  );
}
