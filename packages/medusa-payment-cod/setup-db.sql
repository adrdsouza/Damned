-- Register the COD payment provider
INSERT INTO payment_provider (id, is_enabled) 
VALUES ('pp_cod_cod', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Generate a unique ID for the region-payment provider association
DO $$
DECLARE
    new_id TEXT;
BEGIN
    new_id := 'rpp_' || substring(md5(random()::text) from 1 for 19);
    
    -- Associate COD with the USA region
    INSERT INTO region_payment_provider (region_id, payment_provider_id, id) 
    VALUES ('reg_01JRHVWY8KXADW4FW7QHXATGFD', 'pp_cod_cod', new_id)
    ON CONFLICT (region_id, payment_provider_id) DO NOTHING;
END $$;