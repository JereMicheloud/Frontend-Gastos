-- Agregar columna password_hash a la tabla users
ALTER TABLE public.users ADD COLUMN password_hash VARCHAR(255);

-- Crear índice en email para optimizar consultas de login
CREATE INDEX IF NOT EXISTS idx_users_email_password ON public.users(email, password_hash);

-- Verificar la estructura actualizada
\d public.users;
