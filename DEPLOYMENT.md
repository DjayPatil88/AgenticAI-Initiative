# Vocera Analytics AI Diagnostics Agent - VM Deployment Guide

This guide explains how to deploy and integrate the AI Agent on a Windows or Linux VM alongside your Vocera Analytics installation.

## 1. Environment Configuration
Create a `.env` file in the root directory of the extracted project on your VM:

```env
# Path to your Vocera Analytics Logs
VA_LOG_DIR=C:\Vocera\Analytics\Logs

# Path to your Vocera Analytics Configuration
VA_CONFIG_DIR=C:\Vocera\Analytics\Configuration

# Port for the Agent UI (Default: 3000)
PORT=3000

# Your Gemini API Key (Required for AI Analysis)
GEMINI_API_KEY=your_api_key_here
```

## 2. Installation & Build
Open a terminal/command prompt in the project folder and run:

```bash
# Install dependencies
npm install

# Build the production frontend
npm run build
```

## 3. Running as a Background Service
We recommend using **PM2** to ensure the agent stays active.

```bash
# Start the agent
pm2 start server.ts --name vocera-ai-agent --interpreter tsx

# Ensure it starts on VM reboot
pm2 save
pm2 startup
```

## 4. Integration with Vocera Analytics
The agent is designed to be "Read-Only" for safety. It monitors:
- **application.conf**: To check MTLS/OCSP/CRL status.
- **servers.json / services.json**: To monitor component health.
- **Log Files**: To provide real-time troubleshooting.

## 5. Accessing the UI
Once started, you can access the agent from any browser on your network:
`http://<VM-IP-ADDRESS>:3000`
