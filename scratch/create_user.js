const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function createAdminUser() {
  console.log('🔐 Intentando crear usuario admin: team@twenty4studios.com');
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'team@twenty4studios.com',
    password: 'Dominiotwenty4!',
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ El usuario ya existe, procediendo a actualizar su contraseña por seguridad...');
      // Si ya existe, nos aseguramos de que la contraseña sea la que has pedido
      const { data: listData } = await supabase.auth.admin.listUsers();
      const user = listData.users.find(u => u.email === 'team@twenty4studios.com');
      
      if (user) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          password: 'Dominiotwenty4!'
        });
        if (updateError) console.error('❌ Error al actualizar:', updateError.message);
        else console.log('✅ Contraseña actualizada correctamente.');
      }
    } else {
      console.error('❌ Error al crear usuario:', error.message);
    }
  } else {
    console.log('✅ Usuario creado y confirmado con éxito.');
  }
}

createAdminUser();
