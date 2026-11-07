# Claude plugin 1.1.0 submission

Claude's directory lists a plugin and a connector separately. Submit both:
this plugin bundle, and the hosted MCP server as a connector, as
`claude-connector.md` describes.

## Before you submit

- A paid Claude plan: Pro, Max, Ultra, Team or Enterprise. On Team and
  Enterprise, an Owner submits, or a member an Owner gave the **Directory**
  permission.
- A GitHub account connected in the developer portal. The repository is
  public, so read access is enough.
- The platform release that names Open Cloud Solutions Limited on the
  website, privacy policy and terms is live.

## Submit

1. Open the developer portal at `https://claude.ai/directory/manage`, select
   **Submit new**, then **Plugin bundle**.
2. On the **Source** step, enter:
   - **Repository:** `opencloud-ai/agent-plugins`
   - **Plugin path:** `plugins/opencloud`
   - **Branch or tag:** `main`, so each merged release reaches the
     directory, or a release tag such as `v1.1.0`
3. Select **Validate**. Fix every finding the report marks **Blocking**, push
   the fix, and select **Re-validate**. The directory's name check runs only
   here: if another organisation already uses `opencloud`, the report says
   **Name is taken**.
4. Check the **Listing details** step. The portal reads them from
   `plugins/opencloud/.claude-plugin/plugin.json` and the plugin README, so
   change them there, not in the portal.
5. On **Review and submit**, keep **GitHub push webhook**, choose whether
   passing versions publish automatically, and select **Submit for review**.
6. Once the scan passes, select **Publish**. An Anthropic reviewer publishes
   the first version.

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

## Checks before each submission

1. Confirm `https://github.com/opencloud-ai/agent-plugins` is still public and
   holds the complete package.
2. Confirm `LICENSE` holds the MIT License and both client manifests use the
   matching `MIT` SPDX identifier.
3. Run `npm run validate`, Claude Code's strict validator for the plugin and
   the marketplace, and `npm run check:live`.
4. Install from the public marketplace with
   `/plugin install opencloud --marketplace opencloud-ai/agent-plugins`, then
   run `claude plugin details opencloud@opencloud-platform`. It should list
   the `build-apps` skill and the `opencloud` MCP server.
5. Run the positive and negative review cases from
   `plugins/opencloud/.codex-plugin/plugin.json`, with the reviewer account
   described in `submission/test-cases.md`, where the skill uses the
   connector: Claude chat, or Cowork without a shell. In Claude Code the
   skill takes the CLI path instead, so check that path separately.

Reviewer credentials belong only in the submission portal's protected fields.
Never commit credentials, tokens, cookies, one-time links, or secret-entry URLs.
