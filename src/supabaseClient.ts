import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtyhcoaynxaelrcxcohm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eWhjb2F5bnhhZWxyY3hjb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyOTA1NzksImV4cCI6MjEwMTg2NjU3OX0.D3YTRHfKu54KC35Qgbr0T7oaLzaqYDhvGwxl0Depy9s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);