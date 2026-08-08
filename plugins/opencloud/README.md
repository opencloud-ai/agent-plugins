# OpenCloud plugin

OpenCloud 1.0.1 is one cross-client plugin package for creating, validating,
deploying, and operating full-stack OpenCloud apps. It bundles the hosted MCP
connection and the exact-revision workflow skill; no local OpenCloud CLI is
required.

## Package contents

- `.codex-plugin/plugin.json` describes the ChatGPT and Codex plugin.
- `.claude-plugin/plugin.json` describes the Claude Code and Cowork plugin.
- `.mcp.json` connects both clients to `https://mcp.opencloud.ai/mcp`.
- `skills/opencloud/SKILL.md` is the shared build, verification, deployment,
  and secret-handling workflow.

## Install in Claude Code

From a checkout of this repository, validate and load the plugin directly:

```bash
claude plugin validate ./plugins/opencloud --strict
claude --plugin-dir ./plugins/opencloud
```

For a marketplace install from the public GitHub repository:

```bash
claude plugin marketplace add opencloud-ai/agent-plugins
claude plugin install opencloud@opencloud-platform
claude plugin enable opencloud@opencloud-platform
```

The plugin intentionally installs disabled because it connects to an external
service. Enabling it is the user's explicit opt-in. Start a new Claude Code
session, or run `/reload-plugins`, then open `/mcp` and complete OpenCloud OAuth
when prompted. The bundled skill is available as `/opencloud:opencloud` and can
also activate automatically for matching requests.

The package is publicly available from
`https://github.com/opencloud-ai/agent-plugins` under the MIT License.

## Connect other Claude surfaces

Claude.ai, Claude Desktop, and Claude mobile use the same hosted server as a
remote MCP connector. Add `https://mcp.opencloud.ai/mcp` in **Customize >
Connectors**, then complete OAuth. Claude deduplicates a connector and plugin
that point at the same endpoint, so users should not see two copies of the tool
set.

The plugin supplies the workflow skill in Claude Code and Cowork. Connector-only
surfaces receive the tools but not the bundled plugin skill.

## Safety and support

OpenCloud never needs a password, OAuth token, cookie, database credential, or
secret value in a prompt. Use the platform's generated-secret or secret-entry
workflows. See the [setup and surface guide](https://docs.opencloud.ai/getting-started/mcp),
[support](https://docs.opencloud.ai/support),
[privacy policy](https://docs.opencloud.ai/legal/privacy), and
[terms](https://docs.opencloud.ai/legal/terms).
