import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxwdybicrlhfxyvcnqxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14d2R5YmljcmxoZnh5dmNucXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDYwMjQsImV4cCI6MjA3OTEyMjAyNH0.ZYR5XQzCxrw-sOtAukodDPSIDFCZTEJOR8JHn2Olzw8';

export const supabase = createClient(supabaseUrl, supabaseKey);