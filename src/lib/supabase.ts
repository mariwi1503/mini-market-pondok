import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://kzizyzukfvyphdfpqklj.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjljNmZmNWU5LThlM2EtNDBiOS1hZWJkLTQ1Y2Q5MGNhZjdiMCJ9.eyJwcm9qZWN0SWQiOiJreml6eXp1a2Z2eXBoZGZwcWtsaiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyMTU4MDUzLCJleHAiOjIwODc1MTgwNTMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.BoYMuM5DBEx5an_yEm-KK9w1RGRzGV-tSzWly0-pf94';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };