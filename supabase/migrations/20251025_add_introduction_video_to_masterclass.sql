-- Add introduction video URL field to masterclass certificate config
-- This allows admins to configure a Wistia-hosted intro video for the course

ALTER TABLE masterclass_certificate_config
ADD COLUMN IF NOT EXISTS introduction_video_url TEXT;

COMMENT ON COLUMN masterclass_certificate_config.introduction_video_url IS 'URL for the course introduction video (typically hosted on Wistia)';
