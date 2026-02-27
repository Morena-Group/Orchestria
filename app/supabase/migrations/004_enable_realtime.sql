-- Enable Supabase Realtime on tables that need live updates
-- RLS is automatically enforced on Realtime subscriptions

alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table workers;
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table chats;
alter publication supabase_realtime add table notes;
