# Claude plugin 1.0.0 submission

Use these values for the Claude plugin directory submission. The plugin
directory is distinct from the Claude Connectors Directory; submit both when
OpenCloud should be discoverable as both a workflow package and a connector.

## Listing values

- **Name:** OpenCloud
- **Version:** 1.0.0
- **Plugin identifier:** `opencloud`
- **Description:** Create, validate, deploy, and operate full-stack OpenCloud
  apps from Claude Code and Cowork.
- **Developer:** OpenCloud
- **Website:** `https://opencloud.ai`
- **Documentation:** `https://docs.opencloud.ai/getting-started/mcp`
- **Support:** `https://docs.opencloud.ai/support`
- **Privacy policy:** `https://docs.opencloud.ai/legal/privacy`
- **Terms:** `https://docs.opencloud.ai/legal/terms`
- **Source directory:** `plugins/opencloud`
- **Source repository:** `https://github.com/opencloud-ai/agent-plugins`
- **Marketplace identifier:** `opencloud-platform`
- **Category:** Development
- **MCP server:** `https://mcp.opencloud.ai/mcp`
- **Components:** one hosted MCP server and one workflow skill

## Release notes

OpenCloud 1.0.0 adds a Claude Code and Cowork plugin for creating, editing,
validating, previewing, deploying, and operating OpenCloud apps through the
production hosted MCP server. It bundles exact-revision promotion, isolated
development verification, safe secret handling, durable operation tracking,
and production verification guidance.

## Publication gates

Before submitting at `https://platform.claude.com/plugins/submit` or through
the Claude.ai directory administration screen:

1. Confirm `https://github.com/opencloud-ai/agent-plugins` remains public and
   exposes the complete package without reviewer credentials.
2. Choose and add an appropriate open-source license, then add the matching
   SPDX identifier to `.claude-plugin/plugin.json`. The repository currently
   has no license file, so the license must not be guessed.
3. Run `claude plugin validate ./plugins/opencloud --strict` and validate the
   containing marketplace with `claude plugin validate . --strict`.
4. Install from the public GitHub source, enable the plugin, reload plugins,
   complete OAuth through `/mcp`, and run the positive and negative cases in
   `test-cases.md` with a dedicated reviewer account.
5. Confirm that the public source link exposes the manifest, MCP configuration,
   skill, documentation, and any license without requiring reviewer
   credentials.

Reviewer credentials belong only in the submission portal's protected fields.
Never commit credentials, tokens, cookies, one-time links, or secret-entry URLs.
