-- Transfer all seed data ownership to real user
-- UUID: 27ef09ac-6066-4a70-9dd0-22f501bb4fbf

DO $$
DECLARE
  new_uid UUID := '27ef09ac-6066-4a70-9dd0-22f501bb4fbf';
  old_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  UPDATE projects SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE workers SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE tasks SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE task_details SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE task_subtasks SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE task_comments SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE task_timeline SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE task_artifacts SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE plans SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE planner_nodes SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE plan_chats SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE notes SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE storage_files SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE knowledge_index SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE memory_facts SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE notifications SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE chats SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE widget_layouts SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE briefing_templates SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE plugin_configs SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE plugin_data SET user_id = new_uid WHERE user_id = old_uid;
  UPDATE compaction_log SET user_id = new_uid WHERE user_id = old_uid;

  -- Delete the placeholder seed user
  DELETE FROM auth.users WHERE id = old_uid;
END $$;
