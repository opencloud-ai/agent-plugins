# OpenCloud agent plugins

Official OpenCloud plugin distribution for ChatGPT, Codex, Claude Code, and
Claude Cowork. One versioned package combines the hosted OpenCloud MCP server
with the workflow skill used to create, validate, deploy, and operate
full-stack OpenCloud applications.

## Supported surfaces

| Surface | Package path | What it provides |
| --- | --- | --- |
| ChatGPT and Codex | `.codex-plugin/plugin.json` | Hosted MCP tools and the OpenCloud workflow skill |
| Claude Code and Cowork | `.claude-plugin/plugin.json` | The same hosted MCP tools and shared workflow skill |
| Claude.ai, Desktop, and mobile | `https://mcp.opencloud.ai/mcp` | Remote MCP connector tools |

The plugin and connector use the same MCP endpoint. No local OpenCloud CLI or
credential file is required; supported clients complete OpenCloud OAuth.

## Install for ChatGPT and Codex

Add the public marketplace:

```bash
codex plugin marketplace add opencloud-ai/agent-plugins
codex plugin marketplace list
```

Restart the ChatGPT desktop app, open **Plugins**, choose **OpenCloud
Platform**, and install **OpenCloud**. Start a new conversation after enabling
it and complete OAuth when prompted.

To test the immutable 1.0.0 release instead of tracking `main`, add the
marketplace with `--ref v1.0.0`.

## Install for Claude Code and Cowork

```bash
claude plugin marketplace add opencloud-ai/agent-plugins
claude plugin install opencloud@opencloud-platform
claude plugin enable opencloud@opencloud-platform
```

Start a new Claude Code session or run `/reload-plugins`, open `/mcp`, and
complete OpenCloud OAuth. The shared skill is available as
`/opencloud:opencloud`.

For Claude.ai, Claude Desktop, and Claude mobile, add
`https://mcp.opencloud.ai/mcp` under **Customize > Connectors**. Connector-only
surfaces receive the MCP tools but not the bundled workflow skill.

## Repository layout

```text
.agents/plugins/marketplace.json       ChatGPT and Codex marketplace
.claude-plugin/marketplace.json        Claude marketplace
plugins/opencloud/                     Canonical cross-client package
  .codex-plugin/plugin.json
  .claude-plugin/plugin.json
  .mcp.json
  skills/opencloud/SKILL.md
  assets/
  submission/
```

## Validate

The package has no runtime dependencies. Run its structural and pinned Claude
CLI checks with:

```bash
npm test
npm run validate:claude
```

The second command runs these strict validators with Claude Code 2.1.221:

```bash
claude plugin validate ./plugins/opencloud --strict
claude plugin validate . --strict
```

All client manifests and marketplace entries are released together. Version
1.0.0 is tagged as `v1.0.0`.

## Support and legal

See the [OpenCloud setup guide](https://docs.opencloud.ai/getting-started/mcp),
[support](https://docs.opencloud.ai/support),
[privacy policy](https://docs.opencloud.ai/legal/privacy), and
[terms of service](https://docs.opencloud.ai/legal/terms).

No open-source license has been selected for this repository yet. Public
directory submission should wait until OpenCloud chooses a license and adds
its SPDX identifier to both plugin manifests.
