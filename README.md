# OpenCloud plugins

The OpenCloud plugin for ChatGPT, Codex, Claude Code, Cowork and Claude chat.
It bundles OpenCloud's hosted connector, `https://mcp.opencloud.ai`, with a
skill that guides the assistant through OpenCloud's build, preview and publish
steps. The plugin itself is in [`plugins/opencloud`](plugins/opencloud); its
README is what people see when they browse the plugin.

## Install in ChatGPT and Codex

```bash
codex plugin marketplace add opencloud-ai/agent-plugins
```

Restart the ChatGPT desktop app, open **Plugins**, choose **OpenCloud
Platform** and install **OpenCloud**. Start a new chat and sign in when
asked. Once OpenAI's plugin directory lists OpenCloud, people can install it
from there instead.

## Install in Claude Code

```bash
claude plugin marketplace add opencloud-ai/agent-plugins
claude plugin install opencloud@opencloud-platform
```

On Claude Code 2.1.275 or later, one command in a session does both:
`/plugin install opencloud --marketplace opencloud-ai/agent-plugins`.

Start a new session or run `/reload-plugins`. The skill runs by itself for
matching requests and is also available as `/opencloud:build-apps`. Sessions
with a terminal follow OpenCloud's CLI path; the connector is for sessions
without one, and its sign-in is under `/mcp`.

## Claude on the web, desktop and mobile

Add `opencloud-ai/agent-plugins` as a marketplace under **Customize >
Plugins** on claude.ai and install **OpenCloud**. The plugin brings the skill
and lists the connector on its **Connectors** tab, where you connect it.
Plugins installed on claude.ai also reach Claude Code as `opencloud@synced`.

Without the plugin, people can still add `https://mcp.opencloud.ai` under
**Customize > Connectors**. They then get OpenCloud's tools without the skill.

## Layout

```text
.claude-plugin/marketplace.json     The "opencloud-platform" marketplace for Claude
.agents/plugins/marketplace.json    The same marketplace for ChatGPT and Codex
plugins/opencloud/                  The plugin
  .claude-plugin/plugin.json        Claude manifest and directory listing fields
  .codex-plugin/plugin.json         ChatGPT and Codex manifest, listing and review cases
  .mcp.json                         The hosted OpenCloud connector
  skills/build-apps/SKILL.md        Workflow and safety guide for the assistant
  assets/icon.png                   Listing icon
scripts/                            Package tests, the live tool check and the OpenAI packager
submission/                         Notes for the OpenAI and Claude directory submissions
```

## Check a change

```bash
npm test
npm run validate
npm run check:live
```

`npm test` checks the manifests, the skill, the package rules of Anthropic's
plugin directory and the listing limits of OpenAI's. `npm run validate` runs
Claude Code's strict validator on the plugin and the marketplace.
`npm run check:live` opens an anonymous MCP session on
`https://mcp.opencloud.ai` and confirms that every tool the skill and the
review cases name, and the `opencloud-skill` resource, still exist. CI runs
all three on pull requests and once a week.

To try a local copy before you push:

```bash
claude plugin marketplace add ./
claude plugin install opencloud@opencloud-platform
```

## Release

1. Raise `version` in both `plugins/opencloud/.claude-plugin/plugin.json` and
   `plugins/opencloud/.codex-plugin/plugin.json`. Claude Code installs a new
   copy only when it changes.
2. Merge to `main`, then tag the merge commit `vX.Y.Z`.
3. Point the platform repository's plugin catalogs at the new tag and commit.
4. For OpenAI's plugin directory, run `npm run package:openai` and upload
   `dist/opencloud-X.Y.Z-openai.zip`, as
   [`submission/openai-directory.md`](submission/openai-directory.md)
   describes.
5. For Claude's directory, set the plugin's **Tracked branch or tag** to the
   new tag on its **Settings** tab in the developer portal, then select
   **Publish update** once the scan passes, as
   [`submission/claude-plugin.md`](submission/claude-plugin.md) describes.

## Support and policies

See [OpenCloud support](https://opencloud.ai/support), the
[privacy policy](https://opencloud.ai/privacy) and the
[terms](https://opencloud.ai/terms). Report security problems privately as
[SECURITY.md](SECURITY.md) describes.

Available under the [MIT License](LICENSE).
