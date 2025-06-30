-- ============================================================================
-- CONTROL DE GASTOS - ESTRUCTURA DE BASE DE DATOS SUPABASE
-- ============================================================================

-- Habilitar Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ============================================================================
-- TABLA: users (Usuarios personalizados)
-- ============================================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);

-- ============================================================================
-- TABLA: categories (Categorías de transacciones)
-- ============================================================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'HelpCircle',
    color VARCHAR(7) DEFAULT '#6B7280',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Índices
CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- ============================================================================
-- TABLA: transactions (Transacciones)
-- ============================================================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    payee VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);

-- ============================================================================
-- TABLA: budgets (Presupuestos)
-- ============================================================================
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id, period, start_date)
);

-- Índices
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_category_id ON public.budgets(category_id);
CREATE INDEX idx_budgets_period ON public.budgets(period);

-- ============================================================================
-- FUNCIONES DE TRIGGER PARA UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Políticas para la tabla categories
CREATE POLICY "Users can view own categories" ON public.categories
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own categories" ON public.categories
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- Políticas para la tabla transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- Políticas para la tabla budgets
CREATE POLICY "Users can view own budgets" ON public.budgets
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own budgets" ON public.budgets
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para crear un usuario personalizado después del registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (auth_id, email, username, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        SPLIT_PART(NEW.email, '@', 1), -- username basado en email
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
    );
    
    -- Crear categorías por defecto para el nuevo usuario
    INSERT INTO public.categories (user_id, name, icon, color, is_default)
    SELECT 
        (SELECT id FROM public.users WHERE auth_id = NEW.id),
        unnest(ARRAY['Salario', 'Alimentación', 'Vivienda', 'Servicios', 'Entretenimiento', 'Transporte', 'Salud', 'Regalos', 'Otros']),
        unnest(ARRAY['Landmark', 'Utensils', 'Home', 'Zap', 'Film', 'Bus', 'Stethoscope', 'Gift', 'HelpCircle']),
        unnest(ARRAY['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#6B7280']),
        TRUE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente al registrarse
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista para obtener transacciones con información de categoría
CREATE VIEW public.transactions_with_category AS
SELECT 
    t.*,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id;

-- Vista para estadísticas mensuales por usuario
CREATE VIEW public.monthly_stats AS
SELECT 
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_amount,
    COUNT(*) as transaction_count
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date)
ORDER BY user_id, month DESC;

-- ============================================================================
-- DATOS DE PRUEBA (OPCIONAL - REMOVER EN PRODUCCIÓN)
-- ============================================================================

-- Insertar algunos datos de prueba después de crear un usuario
-- Estos se ejecutarán automáticamente cuando un usuario se registre
-- gracias a la función handle_new_user()

-- ============================================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- ============================================================================

-- Índice compuesto para consultas de dashboard frecuentes
CREATE INDEX idx_transactions_user_type_date ON public.transactions(user_id, type, transaction_date DESC);

-- Índice para búsquedas de texto en descripciones
CREATE INDEX idx_transactions_description_gin ON public.transactions USING gin(to_tsvector('spanish', description));

-- ============================================================================
-- COMENTARIOS EN LAS TABLAS
-- ============================================================================

COMMENT ON TABLE public.users IS 'Información extendida de usuarios';
COMMENT ON TABLE public.categories IS 'Categorías de transacciones por usuario';
COMMENT ON TABLE public.transactions IS 'Registro de todas las transacciones';
COMMENT ON TABLE public.budgets IS 'Presupuestos definidos por los usuarios';

COMMENT ON COLUMN public.users.auth_id IS 'Referencia al usuario en auth.users';
COMMENT ON COLUMN public.users.username IS 'Nombre de usuario único';
COMMENT ON COLUMN public.transactions.amount IS 'Monto en valor absoluto';
COMMENT ON COLUMN public.transactions.type IS 'Tipo: income (ingreso) o expense (gasto)';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
