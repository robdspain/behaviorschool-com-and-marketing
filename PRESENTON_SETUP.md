# Presenton Setup Guide

Presenton is an open-source AI presentation generator that has been integrated into your admin panel.

## Quick Start

1. **Start Presenton with Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Access Presenton:**
   - Through admin panel: Navigate to `/admin/presentations`
   - Direct access: `http://localhost:5000`

3. **Configure API Keys (Optional):**

   Edit the `docker-compose.yml` file and add your API keys:

   ```yaml
   environment:
     OPENAI_API_KEY: your_openai_key
     ANTHROPIC_API_KEY: your_anthropic_key
     GOOGLE_API_KEY: your_google_key
   ```

   Then restart the container:
   ```bash
   docker-compose restart
   ```

## Features

- **AI-Powered**: Create presentations using OpenAI, Anthropic, Google, or Ollama models
- **Multiple Export Formats**: Export as PDF or PPTX
- **Web Search Integration**: Include up-to-date information in presentations
- **Privacy-Focused**: All processing happens locally
- **Custom Templates**: Generate custom presentation templates

## Useful Commands

- **Start Presenton**: `docker-compose up -d`
- **Stop Presenton**: `docker-compose down`
- **View Logs**: `docker-compose logs -f presenton`
- **Restart Presenton**: `docker-compose restart`

## Data Storage

Presentation data is stored in the `presenton_data` directory at the root of your project.

## Troubleshooting

- If the admin panel shows "Presenton Not Running", make sure Docker is running and execute `docker-compose up -d`
- Check container status: `docker ps | grep presenton`
- View logs for errors: `docker-compose logs presenton`

## Documentation

For more information, visit: https://github.com/presenton/presenton
