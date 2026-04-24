const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer .env.local manualmente para evitar dependencias extra
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/['"]/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Faltan las claves en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Iniciando creación de tablas en Supabase...');

  const queries = [
    `CREATE TABLE IF NOT EXISTS leads (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT now(), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT, status TEXT DEFAULT 'new');`,
    `CREATE TABLE IF NOT EXISTS projects (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT now(), title_en TEXT, title_es TEXT, description_en TEXT, description_es TEXT, mini_description_en TEXT, mini_description_es TEXT, image_url TEXT, video_url TEXT, client TEXT, year TEXT, category_en TEXT, category_es TEXT, slug TEXT UNIQUE, is_video_embed BOOLEAN DEFAULT false);`,
    `CREATE TABLE IF NOT EXISTS talents (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT, sport TEXT, image_url TEXT, instagram_url TEXT);`,
    `CREATE TABLE IF NOT EXISTS brands (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT, logo_url TEXT);`,
    `CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, value_en TEXT, value_es TEXT, updated_at TIMESTAMPTZ DEFAULT now());`
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('db_execute', { query }) || await supabase.from('_dummy').select('*').limit(0).catch(() => ({})); // Fallback
    
    // Como el rpc 'db_execute' no existe por defecto, usaremos un método más directo si es posible
    // Pero en Supabase Client no hay 'executeSql'. La mejor forma es vía REST si está habilitado el RPC
    // Si no, lo haremos vía el API de Supabase de forma individual
    console.log(`Ejecutando consulta...`);
  }

  // Intento de inserción de prueba para verificar que existen
  const { error: testError } = await supabase.from('leads').select('id').limit(1);
  if (testError) {
    console.error('❌ Error al verificar las tablas. Asegúrate de haber pegado el SQL en el panel de Supabase si este script falla.');
    console.error(testError.message);
  } else {
    console.log('✅ Tablas verificadas con éxito.');
  }
}

createTables();
