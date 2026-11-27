// I am connecting my project to Supabase here
// All other files will use this same supabase connection
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://xuyrnjwfxuxmbilvivra.supabase.co'
const supabaseKey = 'sb_publishable_uNyP5lY_-h5R_-050XN52w_xwtkny8f'

export const supabase = createClient(supabaseUrl, supabaseKey)