import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log(`Testing connection to Supabase at: ${supabaseUrl}`);
  
  // Test categories table
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, type')
    .limit(5);

  if (catError) {
    console.warn('Notice on categories table:', catError.message);
    console.log('If tables are not created yet, please run supabase/schema.sql in the Supabase SQL Editor.');
  } else {
    console.log('Categories query success! Sample count:', categories?.length ?? 0);
  }

  // Test providers table
  const { data: providers, error: provError } = await supabase
    .from('providers')
    .select('id, name')
    .limit(5);

  if (provError) {
    console.warn('Notice on providers table:', provError.message);
  } else {
    console.log('Providers query success! Sample count:', providers?.length ?? 0);
  }

  console.log('Supabase connection test finished.');
}

testConnection();
