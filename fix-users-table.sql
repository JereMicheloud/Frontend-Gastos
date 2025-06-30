-- ============================================================================
-- CORRECCIÓN TABLA USERS - AUTO-GENERATE ID
-- ============================================================================

-- Verificar la estructura actual de la tabla users
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Si la columna id no tiene DEFAULT, agregarla
ALTER TABLE public.users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verificar que la columna password_hash existe (ya debería estar)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' 
                   AND column_name = 'password_hash' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.users ADD COLUMN password_hash VARCHAR(255);
    END IF;
END $$;

-- Verificar la estructura después de los cambios
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
