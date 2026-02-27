"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileTab() {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Profile</h2>
      <div><Label>Name</Label><Input defaultValue="Michael" /></div>
      <div><Label>Email</Label><Input defaultValue="michael@example.com" /></div>
      <div>
        <Label>Timezone</Label>
        <Select><option>Europe/Bratislava (UTC+1)</option></Select>
      </div>
      <Button primary>Save</Button>
    </div>
  );
}
