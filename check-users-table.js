const db = require('./Backend-gastos/src/config/database');

async function checkUsersTable() {
  try {
    console.log('📊 Verificando estructura de la tabla users...\n');
    
    // Verificar estructura de la tabla users
    const structureQuery = `
      SELECT column_name, data_type, column_default, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const structureResult = await db.query(structureQuery);
    console.log('� Estructura actual de la tabla users:');
    console.table(structureResult.rows);
    
    // Verificar si la columna id tiene DEFAULT
    const idColumn = structureResult.rows.find(row => row.column_name === 'id');
    if (idColumn) {
      console.log(`\n🔍 Campo ID:`, idColumn);
      
      if (!idColumn.column_default || !idColumn.column_default.includes('gen_random_uuid')) {
        console.log('⚠️  El campo ID no tiene DEFAULT gen_random_uuid()');
        console.log('🔧 Aplicando corrección...');
        
        await db.query('ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid()');
        console.log('✅ DEFAULT agregado para campo ID');
      } else {
        console.log('✅ El campo ID ya tiene DEFAULT gen_random_uuid()');
      }
    }
    
    // Verificar si existe la columna password_hash
    const passwordColumn = structureResult.rows.find(row => row.column_name === 'password_hash');
    if (!passwordColumn) {
      console.log('⚠️  Falta la columna password_hash');
      console.log('🔧 Agregando columna password_hash...');
      
      await db.query('ALTER TABLE public.users ADD COLUMN password_hash VARCHAR(255)');
      console.log('✅ Columna password_hash agregada');
    } else {
      console.log('✅ La columna password_hash existe');
    }
    
    // Verificar estructura final
    console.log('\n📋 Estructura final de la tabla users:');
    const finalResult = await db.query(structureQuery);
    console.table(finalResult.rows);
    
    // Probar inserción
    console.log('\n🧪 Probando inserción de usuario...');
    const testQuery = `
      INSERT INTO users (username, email, password_hash, display_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, username, email, display_name;
    `;
    
    const testResult = await db.query(testQuery, [
      'test_user_temp',
      'test_temp@example.com', 
      '$2b$12$dummy.hash.for.testing',
      'Test User Temp'
    ]);
    
    console.log('✅ Inserción exitosa:', testResult.rows[0]);
    
    // Limpiar registro de prueba
    await db.query('DELETE FROM users WHERE username = $1', ['test_user_temp']);
    console.log('🧹 Registro de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

checkUsersTable();
