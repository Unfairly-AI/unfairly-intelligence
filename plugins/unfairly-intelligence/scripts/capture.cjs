#!/usr/bin/env node
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const event = process.argv[2] || process.env.HOOK_EVENT_NAME || "Unknown";
const source = process.env.GEMINI_CLI_HOME
  ? "gemini_cli"
  : process.env.CURSOR_PLUGIN_ROOT || process.env.CURSOR_PROJECT_DIR
    ? "cursor"
  : process.env.PLUGIN_ROOT
    ? "codex"
    : "claude_code";

// Prefer the runtime bundled with this plugin, so installing the plugin from
// an AI client's plugin store is the whole install. Fall back to a runtime
// placed by `npx unfairly`, then to a global `unfairly`.
const bundled = path.join(__dirname, "..", "runtime", "unfairly-intelligence.mjs");
let command = "unfairly";
let args = ["pace", "capture", "--source", source, "--event", event];
let connectArgs = null;
if (fs.existsSync(bundled)) {
  command = process.execPath;
  args = [bundled, "capture", source, event];
  connectArgs = [bundled, "connect", source, event];
} else {
  try {
    const pointer = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".unfairly", "runtime", "current.json"), "utf8"));
    if (typeof pointer.node === "string" && typeof pointer.entrypoint === "string") {
      command = pointer.node;
      args = [pointer.entrypoint, ...args];
    }
  } catch {
    // Compatibility fallback for existing global installs.
  }
}

// On session start, check the connection synchronously (bounded) so a
// first-run "connect this machine" link can reach the person.
if (connectArgs && (event === "SessionStart" || event === "sessionStart")) {
  try {
    const result = spawnSync(command, connectArgs, { encoding: "utf8", timeout: 4000, env: process.env, stdio: ["ignore", "pipe", "ignore"] });
    if (result.stdout && result.stdout.trim()) process.stdout.write(result.stdout);
  } catch {
    // Never block or fail the session over telemetry.
  }
}

// Read the hook payload, hand it to a detached runtime process, and return at
// once: summarizing transcripts and uploading must never make the AI client wait.
const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("error", () => process.exit(0));
process.stdin.on("end", () => {
  let child;
  try {
    child = spawn(command, args, { stdio: ["pipe", "ignore", "ignore"], env: process.env, detached: true });
  } catch {
    process.exit(0);
  }
  child.on("error", () => process.exit(0));
  child.stdin.on("error", () => undefined);
  child.stdin.end(Buffer.concat(chunks), () => {
    child.unref();
    process.exit(0);
  });
});
