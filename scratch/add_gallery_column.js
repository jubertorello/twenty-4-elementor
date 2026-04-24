const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cagdwafxkjzmlygwuzlp.supabase.co',
  'sb_secret_JjVEuGKbBIt_13WOeCLSvA_KjDp2CGB'
);

async function run() {
  console.log('Intentando añadir columna gallery...');
  // Nota: En Supabase no se puede ejecutar SQL arbitrario desde el cliente JS 
  // a menos que haya una función RPC configurada. 
  // Vamos a intentar insertar un objeto con el campo nuevo para ver si falla 
  // o si podemos usar una función RPC común si existe.
  
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql_query: 'ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT \'{}\';' 
  });

  if (error) {
    console.log('Error al ejecutar SQL via RPC:', error.message);
    console.log('Si no tienes la función rpc "exec_sql", por favor ejecuta esto en el SQL Editor de Supabase:');
    console.log('ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT \'{}\';');
  } else {
    console.log('Columna gallery añadida correctamente.');
  }
}

run();
