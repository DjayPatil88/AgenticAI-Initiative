# Vocera Analytics AI Diagnostics Agent
## Comprehensive Demonstration & Technical Guide

---

### 1. Introduction
The **Vocera Analytics AI Diagnostics Agent** is a mission-critical support tool designed to automate the troubleshooting of the Vocera Analytics (VA) platform. It bridges the gap between raw system data and actionable engineering intelligence using Google Gemini AI.

---

### 2. System Monitoring & Configuration (The Heartbeat)
**Tab: Configuration**

This view provides a "single pane of glass" for the entire VA environment.

**[SCREENSHOT PLACEHOLDER: Configuration Tab]**
*Capture the "System Configuration" and "Server & Service Inventory" sections here.*

**Key Features:**
*   **Security Monitor**: Real-time validation of MTLS, OCSP, and CRL settings directly from `application.conf`.
*   **CRL File Alert**: A dynamic warning system that triggers if the `VoceraVA.crl` file is missing from the `sslutility/` directory.
*   **Inventory Table**: A consolidated list of all Spark, MariaDB, and Flume components with their current health status (Active/Warning/Error).

---

### 3. AI-Powered Log Analysis (The Brain)
**Tabs: Chat & Logs**

The agent uses a dual-interface approach to handle both conversational troubleshooting and heavy-duty data ingestion.

**[SCREENSHOT PLACEHOLDER: Chat Interface]**
*Capture a conversation where the AI identifies a specific Vocera error code.*

**[SCREENSHOT PLACEHOLDER: Log Buffer]**
*Capture the full-screen log editor with a large block of raw logs staged for analysis.*

**Key Features:**
*   **Log Buffer**: A staging area for large blocks of raw data. Clicking "Analyze Buffer" triggers a holistic scan against the system config and knowledge base.
*   **Diagnostic Chat**: An interactive interface for follow-up questions and step-by-step resolution guidance.
*   **Pattern Recognition**: Automatically correlates log errors with the current security hardening status (e.g., "Handshake failed because CRL is disabled").

---

### 4. Connectivity Diagnostics (The Pulse)
**Tab: Network**

Eliminates the need for manual shell access to verify node-to-node reachability.

**[SCREENSHOT PLACEHOLDER: Network Diagnostics]**
*Capture a successful connectivity check to the "Replica Server" showing the green status and raw ping output.*

**Key Features:**
*   **One-Click Pings**: Pre-configured "Quick Check" cards for critical VA nodes (Replica, Voice Server DB, Spark Master).
*   **Raw Shell Output**: Displays the actual terminal response for deep-dive network troubleshooting.

---

### 5. Knowledge Base & Training (The Memory)
**Tab: Knowledge Base**

Digitizes "tribal knowledge" by allowing engineers to teach the agent site-specific troubleshooting scenarios.

**[SCREENSHOT PLACEHOLDER: Knowledge Base Tab]**
*Capture the "Add Real-time Scenario" form and the list of "Existing Scenarios".*

**Key Features:**
*   **Scenario Capture**: Store complex fixes (e.g., MTLS handshake failures due to specific firewall rules).
*   **Instant Recall**: The AI checks this database first before generating a generic response.

---

### 6. Technical Architecture
The agent is a lightweight "Sidecar" application:
*   **Frontend**: React 18 + Tailwind CSS + Framer Motion.
*   **Backend**: Node.js/Express (Port 3000).
*   **AI**: Google Gemini 3.1 Flash.
*   **Integration**: Direct read-only access to `application.conf`, `servers.json`, and VA log directories.

---

### 7. Step-by-Step Demonstration Script

| Step | Action | Talking Point |
| :--- | :--- | :--- |
| **1** | Open **Configuration** | "We start with the system heartbeat. Notice how the agent has automatically detected our MTLS and CRL settings." |
| **2** | Go to **Network** | "We can verify connectivity to the Voice Server DB with one click, ensuring the data pipeline is open." |
| **3** | Paste logs in **Logs** | "I'm staging 500 lines of raw logs here. I'll click 'Analyze Buffer' to let the AI find the needle in the haystack." |
| **4** | Review **Chat** | "The AI has identified a MariaDB timeout. It's now giving me the exact SQL commands to check the connection pool." |
| **5** | Show **Knowledge** | "Finally, we'll save this fix to our Knowledge Base so the next engineer can solve it in seconds." |

---

### 8. How to Export this Guide to PDF
1.  Open this `DEMO_GUIDE_WITH_SCREENSHOTS.md` file in a Markdown viewer (like VS Code or Obsidian).
2.  Capture your screenshots from the live app preview and insert them into the placeholders.
3.  Use the **"Export to PDF"** or **"Print to PDF"** feature of your viewer to generate the final document.
