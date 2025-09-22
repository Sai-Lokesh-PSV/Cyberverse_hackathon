-- Cyberverse Land Registry Database Initialization
-- This script creates the database and sets up initial configuration

-- Create database (run as superuser)
-- CREATE DATABASE cyberverse;

-- Connect to cyberverse database
-- \c cyberverse;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'verifier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parcel_status AS ENUM ('verified', 'pending', 'disputed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transfer_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('title_deed', 'survey_report', 'tax_assessment', 'transfer_deed', 'identity_document', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fraud_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
-- These will be created by SQLAlchemy, but we can add custom ones here

-- Full text search index for parcels
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parcels_address_gin 
-- ON parcels USING gin(to_tsvector('english', address));

-- Spatial index for coordinates (if using PostGIS)
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parcels_coordinates 
-- ON parcels USING gist(ST_Point(coordinates_lng, coordinates_lat));

-- Comments for documentation
COMMENT ON DATABASE cyberverse IS 'Cyberverse Land Registry System Database';
COMMENT ON TABLE users IS 'System users including property owners, administrators, and verifiers';
COMMENT ON TABLE parcels IS 'Land parcels with ownership and property details';
COMMENT ON TABLE transfers IS 'Property ownership transfer requests and transactions';
COMMENT ON TABLE documents IS 'Property-related documents and files';
COMMENT ON TABLE transactions IS 'Blockchain transaction history for parcels';
COMMENT ON TABLE ai_analysis IS 'AI-powered fraud risk and market value analysis';
COMMENT ON TABLE encumbrances IS 'Property encumbrances like mortgages and liens';
COMMENT ON TABLE fraud_alerts IS 'Fraud detection alerts and investigations';
COMMENT ON TABLE system_stats IS 'System-wide statistics for dashboard';

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE cyberverse TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
