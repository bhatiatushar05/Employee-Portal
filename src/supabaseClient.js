import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttcdwwidukdfmsextvwj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2R3d2lkdWtkZm1zZXh0dndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjU5ODgsImV4cCI6MjA3MDUwMTk4OH0.I_XvLtTU9HNLmhYqdcvwOYHcicjMw7Ggn_hfpaFQVKE';

export const supabase = createClient(supabaseUrl, supabaseKey);