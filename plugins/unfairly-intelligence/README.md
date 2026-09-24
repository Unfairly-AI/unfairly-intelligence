# Unfairly plugin for Unfairly Intelligence

The Unfairly plugin is the portable workflow component for Unfairly Intelligence, backed by the existing `unfairly` CLI. Its root Agent Plugins manifest carries the shared skills and MCP definition. Codex/ChatGPT Work use the OpenAI extension, Claude Code uses the Claude compatibility manifest, Cursor uses the native Cursor overlay, and Gemini CLI loads the nested `gemini/` extension. All lifecycle hooks call the compatibility command `unfairly pace capture` and emit the same content-free event contract. Employee-facing commands use `unfairly intelligence`.

The plugin intentionally contains only thin compatibility manifests. Identity, redaction, Git enrichment, durable local spooling, upload, and policy live in the shared CLI core.

Employees install it through the existing one-command path:

```bash
npx unfairly@latest
```

The command places a version-pinned runtime and marketplace under `~/.unfairly`, activates every detected hook-capable client, and confirms enrollment with the Intelligence API. No global npm install or administrator permission is required. A newly installed AI client is picked up the next time the command runs. `unfairly intelligence install` is the explicit repair/reinstall command.

Before activation, inspect the exact contract with `unfairly intelligence policy`. Use `unfairly intelligence status` to see enabled clients, queue depth, policy/runtime/plugin versions, attestation expiry, and last upload. Collection can be stopped without losing installation identity with `unfairly intelligence pause` and restarted with `unfairly intelligence resume`. `unfairly intelligence uninstall` removes only tracked Unfairly-managed files and local Intelligence state.

It also closes the learning loop. Employees can search the organization's approved marketplace with `unfairly intelligence playbooks --query "<goal>"`, start one with `unfairly intelligence playbook-use <playbook-id> --version <version>`, and propose a content-safe learning after successful work. Playbook identity and version travel with workflow evidence so the dashboard can distinguish discovery, installation, reuse, and verified outcomes.

The same runtime now includes a local evidence adapter for ChatGPT Desktop, Claude Desktop, and other closed applications. A centrally managed allowlist defines which output or app-state directories may be observed. Output roots produce content-free created/modified artifact facts; app-state roots produce one aggregated activity fact per scan. The adapter never reads file contents, silently expands beyond approved roots, or emits filenames.
