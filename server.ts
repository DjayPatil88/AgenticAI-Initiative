import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get VA_HOME
  const getVaHome = () => process.env.VA_HOME || process.cwd();

  // API: Get Service Monitor Config (application.conf)
  app.get("/api/config/sm", (req, res) => {
    const vaHome = getVaHome();
    const configPath = path.join(vaHome, "servicemonitor", "conf", "application.conf");
    try {
      if (!fs.existsSync(configPath)) {
        return res.json({ mtls: false, ocsp: false, crl: false, crlFileExists: false });
      }
      const content = fs.readFileSync(configPath, "utf8");
      const mtls = /client\.auth\.enabled\s*=\s*true/i.test(content);
      const ocsp = /client\.auth\.ocspEnabled\s*=\s*"true"/i.test(content);
      const crl = /client\.auth\.crlEnabled\s*=\s*"true"/i.test(content);
      
      const crlFilePath = path.join(vaHome, "sslutility", "VoceraVA.crl");
      const crlFileExists = fs.existsSync(crlFilePath);

      res.json({ mtls, ocsp, crl, crlFileExists, path: configPath });
    } catch (error) {
      res.status(500).json({ error: "Failed to read Service Monitor config" });
    }
  });

  // API: Get/Set Servers and Services JSON
  app.get("/api/config/servers", (req, res) => {
    const vaHome = getVaHome();
    const filePath = path.join(vaHome, "servicemonitor", "conf", "servers.json");
    try {
      if (!fs.existsSync(filePath)) return res.json([]);
      res.json(JSON.parse(fs.readFileSync(filePath, "utf8")));
    } catch (error) { res.status(500).json({ error: "Failed to read servers.json" }); }
  });

  app.post("/api/config/servers", (req, res) => {
    const vaHome = getVaHome();
    const filePath = path.join(vaHome, "servicemonitor", "conf", "servers.json");
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Failed to save servers.json" }); }
  });

  app.get("/api/config/services", (req, res) => {
    const vaHome = getVaHome();
    const filePath = path.join(vaHome, "servicemonitor", "conf", "services.json");
    try {
      if (!fs.existsSync(filePath)) return res.json([]);
      res.json(JSON.parse(fs.readFileSync(filePath, "utf8")));
    } catch (error) { res.status(500).json({ error: "Failed to read services.json" }); }
  });

  app.post("/api/config/services", (req, res) => {
    const vaHome = getVaHome();
    const filePath = path.join(vaHome, "servicemonitor", "conf", "services.json");
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Failed to save services.json" }); }
  });

  // API: Real-time Component Status
  app.get("/api/status", async (req, res) => {
    const vaHome = getVaHome();
    const servicesPath = path.join(vaHome, "servicemonitor", "conf", "services.json");
    const serversPath = path.join(vaHome, "servicemonitor", "conf", "servers.json");
    
    try {
      const services = fs.existsSync(servicesPath) ? JSON.parse(fs.readFileSync(servicesPath, "utf8")) : [];
      const servers = fs.existsSync(serversPath) ? JSON.parse(fs.readFileSync(serversPath, "utf8")) : [];
      
      // Mock status logic: in a real app, you'd check process list or health endpoints
      // For this demo, we'll simulate status based on config presence
      const statusMap = [...services, ...servers].map(item => {
        // Randomly assign status for demo purposes, or check if configured
        let status = "gray"; // Not configured
        if (item.name) {
          const rand = Math.random();
          if (rand > 0.3) status = "active"; // Green
          else if (rand > 0.1) status = "warning"; // Orange
          else status = "error"; // Red
        }
        return { name: item.name, status, type: item.type || "service" };
      });

      res.json(statusMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch component status" });
    }
  });

  // API: Get logs from local filesystem
  app.get("/api/logs", (req, res) => {
    const logDir = process.env.VA_LOG_DIR || path.join(process.cwd(), "logs");
    try {
      if (!fs.existsSync(logDir)) {
        return res.json({ files: [] });
      }
      const files = fs.readdirSync(logDir).filter(f => f.endsWith(".log"));
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: "Failed to read log directory" });
    }
  });

  app.get("/api/logs-all", (req, res) => {
    const logDir = process.env.VA_LOG_DIR || path.join(process.cwd(), "logs");
    try {
      if (!fs.existsSync(logDir)) {
        return res.status(404).json({ error: `Log directory not found at ${logDir}` });
      }
      const files = fs.readdirSync(logDir).filter(f => f.endsWith(".log"));
      if (files.length === 0) {
        return res.status(404).json({ error: "No log files found in the directory." });
      }
      
      let allLogs = "";
      for (const file of files) {
        const content = fs.readFileSync(path.join(logDir, file), "utf8");
        allLogs += `\n--- FILE: ${file} ---\n${content}\n`;
      }
      res.json({ content: allLogs });
    } catch (error) {
      res.status(500).json({ error: "Failed to read logs from directory." });
    }
  });

  app.get("/api/logs/:filename", (req, res) => {
    const logDir = process.env.VA_LOG_DIR || path.join(process.cwd(), "logs");
    const filePath = path.join(logDir, req.params.filename);
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      const content = fs.readFileSync(filePath, "utf8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to read log file" });
    }
  });

  // API: Connectivity Check
  app.post("/api/check-connectivity", async (req, res) => {
    const { host, port } = req.body;
    try {
      // Simple ping check - handle Windows vs Linux/macOS
      const pingCmd = process.platform === "win32" ? `ping -n 1 ${host}` : `ping -c 1 ${host}`;
      const { stdout } = await execPromise(pingCmd);
      res.json({ status: "reachable", output: stdout });
    } catch (error) {
      res.json({ status: "unreachable", error: (error as Error).message });
    }
  });

  // API: Knowledge Base (Training)
  const KNOWLEDGE_FILE = path.join(process.cwd(), "knowledge_base.json");
  
  app.get("/api/knowledge", (req, res) => {
    try {
      if (!fs.existsSync(KNOWLEDGE_FILE)) {
        return res.json([]);
      }
      const data = fs.readFileSync(KNOWLEDGE_FILE, "utf8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read knowledge base" });
    }
  });

  app.post("/api/knowledge", (req, res) => {
    try {
      const newEntry = req.body;
      let knowledge = [];
      if (fs.existsSync(KNOWLEDGE_FILE)) {
        knowledge = JSON.parse(fs.readFileSync(KNOWLEDGE_FILE, "utf8"));
      }
      knowledge.push({ ...newEntry, id: Date.now().toString() });
      fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(knowledge, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save knowledge" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
