const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key] = val;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const targetIds = [
    'e134b66a-78be-4ccc-9232-2be6d49d5dfd', // Coki Nieto
    '6d7f6567-ff3b-4e19-9f90-be73d10cfa0e', // Robert Navarro
    '35ae2fcf-db13-4026-9ed2-296d834e70e4'  // Jon Sanz
  ];
  
  const validImageUrl = "https://res.cloudinary.com/dxmmnvpab/image/upload/v1777980564/656067117_18464630485103231_6128771137241890857_n_vmeh6o.jpg";

  console.log('Updating talents image URLs in the database...');

  for (const id of targetIds) {
    const { data, error } = await supabase
      .from('talents')
      .update({ image_url: validImageUrl })
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating talent ${id}:`, error);
    } else {
      console.log(`Successfully updated talent ${id} (${data[0].name})`);
    }
  }

  console.log('Update finished.');
}

run();
