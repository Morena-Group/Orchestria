import type { ChatMessage } from "@/lib/types";

export const CHATS: ChatMessage[] = [
  { id: "m1", role: "user", content: "Can you break down the authentication module into subtasks?", time: "10:23 AM" },
  { id: "m2", role: "bot", content: "I'll decompose the auth module:\n\n1. **DB schema** — User table, sessions (Claude)\n2. **JWT** — Token generation, validation (Claude)\n3. **OAuth** — Google, GitHub (Gemini)\n4. **Password hashing** — bcrypt (ChatGPT)\n5. **Rate limiting** — Login throttling (Kimi)\n\nCreate these as tasks?", time: "10:23 AM" },
  { id: "m3", role: "user", content: "Yes, but assign OAuth to Claude. Also add 2FA.", time: "10:25 AM" },
  { id: "m4", role: "bot", content: "Done! Created 6 subtasks under 'Auth Module'. All in Draft.\n\nSet up dependencies? JWT should finish before OAuth and 2FA.", time: "10:25 AM" },
];
