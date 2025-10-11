-- Checkout Settings Table (stores the master password)
CREATE TABLE IF NOT EXISTS checkout_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default password
INSERT INTO checkout_settings (setting_key, setting_value, description)
VALUES ('checkout_password', 'Transform2025', 'Master password for checkout access')
ON CONFLICT (setting_key) DO NOTHING;

-- Checkout Access Table (approved users who can bypass password)
CREATE TABLE IF NOT EXISTS checkout_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  approved_by TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkout Access Logs Table (track all access attempts)
CREATE TABLE IF NOT EXISTS checkout_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_type TEXT NOT NULL, -- 'password' or 'email'
  identifier TEXT NOT NULL, -- the password or email used
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_access_email ON checkout_access(email);
CREATE INDEX IF NOT EXISTS idx_checkout_access_active ON checkout_access(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_checkout_logs_created ON checkout_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_logs_success ON checkout_access_logs(success);

-- Enable Row Level Security
ALTER TABLE checkout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only service role can access these tables)
CREATE POLICY "Service role can do everything on checkout_settings"
  ON checkout_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on checkout_access"
  ON checkout_access
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on checkout_access_logs"
  ON checkout_access_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_checkout_settings_updated_at BEFORE UPDATE ON checkout_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkout_access_updated_at BEFORE UPDATE ON checkout_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
