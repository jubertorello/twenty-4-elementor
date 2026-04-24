const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/['"]/g, '');
});

const ACCESS_TOKEN = env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = 'cagdwafxkjzmlygwuzlp';

async function runSql() {
  console.log('📡 Conectando con la API de Supabase...');
  try {
    const response = await fetch("https://api.supabase.com/v1/projects/" + PROJECT_REF + "/database/query", {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: `
        CREATE TABLE IF NOT EXISTS leads (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT now(), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT, status TEXT DEFAULT 'new');
        CREATE TABLE IF NOT EXISTS projects (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT now(), title_en TEXT, title_es TEXT, description_en TEXT, description_es TEXT, mini_description_en TEXT, mini_description_es TEXT, image_url TEXT, video_url TEXT, client TEXT, year TEXT, category_en TEXT, category_es TEXT, slug TEXT UNIQUE, is_video_embed BOOLEAN DEFAULT false);
        CREATE TABLE IF NOT EXISTS talents (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT, sport TEXT, image_url TEXT, instagram_url TEXT);
        CREATE TABLE IF NOT EXISTS brands (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT, logo_url TEXT);
        CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, value_en TEXT, value_es TEXT, updated_at TIMESTAMPTZ DEFAULT now());
      `})
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || JSON.stringify(data));
    console.log('✅ Tablas creadas con éxito.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

runSql();
