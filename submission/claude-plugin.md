# Claude plugin 1.1.0 submission

Use these values for the Claude plugin directory submission. The plugin
directory is distinct from the Claude Connectors Directory; submit both when
OpenCloud should be discoverable as both a workflow package and a connector.

## Listing values

- **Name:** OpenCloud
- **Version:** 1.1.0
- **Plugin identifier:** `opencloud`
- **Description:** Make, change and look after full-stack web apps for your
  team, right from Claude. OpenCloud hosts them with a database, sign-in and
  storage, and keeps them running.
- **Developer:** OpenCloud
- **Website:** `https://opencloud.ai`
- **Documentation:** `https://docs.opencloud.ai/getting-started/mcp`
- **Support:** `https://opencloud.ai/support`
- **Privacy policy:** `https://opencloud.ai/privacy`
- **Terms:** `https://opencloud.ai/terms`
- **Source directory:** `plugins/opencloud`
- **Source repository:** `https://github.com/opencloud-ai/agent-plugins`
- **Marketplace identifier:** `opencloud-platform`
- **Category:** Development
- **MCP server:** `https://mcp.opencloud.ai`
- **Components:** one hosted MCP server and one workflow skill

## Release notes

OpenCloud 1.1.0 connects to the canonical hosted MCP endpoint
`https://mcp.opencloud.ai`, so the plugin and a connector added from the setup
guide share one server. Its rewritten skill names only tools the server
offers, covers organisation onboarding, uses the OpenCloud CLI in sessions
with a terminal, and keeps the exact-revision preview, verification,
publishing and secret-handling rules. The plugin now starts enabled once
installed.

## Publication gates

Before submitting at `https://platform.claude.com/plugins/submit` or through
the Claude.ai directory administration screen:

1. Confirm `https://github.com/opencloud-ai/agent-plugins` remains public and
   exposes the complete package without reviewer credentials.
2. Confirm `LICENSE` contains the MIT License and both client manifests use the
   matching `MIT` SPDX identifier.
3. Run `claude plugin validate ./plugins/opencloud --strict` and validate the
   containing marketplace with `claude plugin validate . --strict`.
4. Install from the public GitHub source and run the positive and negative
   review cases from `plugins/opencloud/.codex-plugin/plugin.json`, with the
   reviewer account described in `submission/test-cases.md`, where the skill
   uses the connector: Claude chat, or Cowork without a shell. In Claude Code
   the skill takes the CLI path instead, so check that path separately.
5. Confirm that the public source link exposes the manifest, MCP configuration,
   skill, documentation, and any license without requiring reviewer
   credentials.

Reviewer credentials belong only in the submission portal's protected fields.
Never commit credentials, tokens, cookies, one-time links, or secret-entry URLs.
