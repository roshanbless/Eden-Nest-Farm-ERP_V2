const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('COUNT(*)', { count: 'exact' });
    
    if (error) throw error;
    console.log('✅ Connected! Users count:', data.length);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();
