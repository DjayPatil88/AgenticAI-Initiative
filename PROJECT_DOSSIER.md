# Project Dossier: Vocera Analytics AI Diagnostics Agent

## 1. Executive Summary
The **Vocera Analytics AI Diagnostics Agent** is a specialized troubleshooting tool designed to reduce the Mean Time To Resolution (MTTR) for Vocera Analytics (VA) platform issues. By combining real-time configuration monitoring with Google Gemini AI log analysis, the agent empowers support engineers to identify and resolve complex system failures (MTLS, Database, Spark, Flume) in minutes.

---

## 2. The Problem Statement
Vocera Analytics is a distributed system with high security requirements (DoD/SSL). Troubleshooting typically involves:
*   **Manual Log Grepping**: Sifting through thousands of lines in `Catalina.out`, `VoceraVA.log`, and `Spark-Master.log`.
*   **Configuration Blindness**: Misconfigurations in `application.conf` (like expired CRLs or disabled OCSP) often go unnoticed until a service crash.
*   **Knowledge Silos**: Complex fixes are often known only by senior engineers and are not documented for Tier 1 support.

---

## 3. Technical Architecture
The agent is built using a modern, lightweight full-stack architecture:
*   **Frontend**: React 18 with Tailwind CSS and Framer Motion for a high-density, professional "Mission Control" UI.
*   **Backend**: Node.js/Express server that interacts directly with the local filesystem of the Vocera Analytics VM.
*   **AI Engine**: Google Gemini 3.1 Flash for high-speed, low-latency log interpretation and diagnostic generation.
*   **Data Sources**:
    - `application.conf`: Security and service monitor settings.
    - `servers.json` / `services.json`: Component inventory and health.
    - `*.log`: Raw diagnostic data from the VA logs directory.
    - `VoceraVA.crl`: Certificate Revocation List validation.

---

## 4. Key Features & Functionality

### A. Intelligent Chat & Analysis
*   **Context-Aware**: The AI knows the current system configuration (MTLS status, etc.) when analyzing logs.
*   **Pattern Recognition**: Automatically identifies known Vocera error codes and provides plain-English solutions.

### B. Real-time Configuration Dashboard
*   **Security Monitor**: Instant visibility into MTLS, OCSP, and CRL status.
*   **Missing File Alerts**: Visual warning if the `VoceraVA.crl` file is missing from the `sslutility/` folder.
*   **Inventory View**: Consolidated list of all Spark, MariaDB, and Flume components.

### C. Connectivity Diagnostics
*   **VM-to-VM Pings**: Test reachability between the Analytics server and the Voice server/Replica server with one click.
*   **Raw Output**: Displays the actual shell output for deep-dive network troubleshooting.

### D. Knowledge Base (Training)
*   **Scenario Capture**: Engineers can "teach" the agent new troubleshooting steps for site-specific issues.
*   **Digitized Tribal Knowledge**: Ensures that once a problem is solved, the solution is available to the entire team.

---

## 5. Integration with Vocera Analytics
The agent is designed for **Zero-Impact Integration**:
*   **Read-Only**: It never writes to production databases or modifies core service files.
*   **Sidecar Deployment**: Runs as a background service (via PM2) alongside the main VA application.
*   **Path Mapping**: Configurable paths for logs and configuration files via environment variables.

---

## 6. Business Value & ROI
*   **Efficiency**: Reduces log analysis time by ~80%.
*   **Skill Leveling**: Enables Tier 1 engineers to handle Tier 3 MTLS and Database issues.
*   **Uptime**: Faster diagnostics lead to higher platform availability for clinical staff.
*   **Audit Readiness**: Provides a clear view of security hardening status (DoD compliance).

---

## 7. Demo Script (Step-by-Step)

### Step 1: The Dashboard (Mission Control)
*   *Action*: Open the **Configuration** tab.
*   *Talking Point*: "Here we see the real-time heartbeat of the system. Notice the Security Monitor section—it's telling us exactly which security protocols are active. If a CRL file goes missing, we get an instant alert here before the MTLS handshake fails."

### Step 2: Connectivity Check
*   *Action*: Go to the **Connectivity** tab and click "Check Status" for the Replica Server.
*   *Talking Point*: "No need to jump into a CMD prompt. We can verify network reachability between our analytics nodes directly from this interface."

### Step 3: AI Log Analysis
*   *Action*: Go to the **Logs** tab, paste a sample error log (e.g., a MariaDB timeout), and click "Analyze Buffer."
*   *Talking Point*: "I've pasted a raw log snippet. The AI isn't just searching for keywords; it's interpreting the error in the context of our system. It identifies the root cause and gives us the exact troubleshooting steps."

### Step 4: Training the Agent
*   *Action*: Go to the **Knowledge Base** tab and show an existing scenario.
*   *Talking Point*: "When we find a unique site-specific fix, we add it here. The agent learns from our experience, making it smarter for the next engineer who encounters this issue."

---

## 8. FAQ for Management
*   **Q: Does it send our data to the cloud?**
    *   *A*: Only the specific log snippets you choose to analyze are sent to the Gemini API. No PII or patient data is ever transmitted.
*   **Q: Will it slow down Vocera Analytics?**
    *   *A*: No. It uses minimal CPU/RAM and only reads files when requested.
*   **Q: How long does it take to deploy?**
    *   *A*: Less than 10 minutes using our pre-configured deployment script.
