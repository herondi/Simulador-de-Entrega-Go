-- Script de inicialização do banco de dados delivery_simulator
-- Este arquivo será executado automaticamente quando o container PostgreSQL for criado

-- Conectar ao banco correto
\c delivery_simulator;

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS delivery;

-- Usar o schema
SET search_path TO delivery, public;

-- Tabela de entregadores
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    license_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de entregas
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    driver_id INTEGER REFERENCES drivers(id),
    order_id VARCHAR(100) NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'pending',
    estimated_time INTEGER, -- em minutos
    actual_time INTEGER, -- em minutos
    distance DECIMAL(10, 2), -- em km
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabela de posições/tracking
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    delivery_id INTEGER REFERENCES deliveries(id),
    driver_id INTEGER REFERENCES drivers(id),
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    heading DECIMAL(5, 2),
    speed DECIMAL(5, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_positions_delivery ON positions(delivery_id);
CREATE INDEX idx_positions_driver ON positions(driver_id);
CREATE INDEX idx_positions_time ON positions(recorded_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela drivers
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO drivers (name, email, phone, license_number, vehicle_type, status)
VALUES 
    ('João Silva', 'joao@example.com', '11999999999', 'CNH123456', 'motorcycle', 'available'),
    ('Maria Santos', 'maria@example.com', '11888888888', 'CNH789012', 'car', 'available'),
    ('Pedro Oliveira', 'pedro@example.com', '11777777777', 'CNH345678', 'bicycle', 'busy')
ON CONFLICT (email) DO NOTHING;

-- Permissões
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA delivery TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA delivery TO postgres;