# Claude plugin 1.1.0 submission

Claude's directory lists a plugin and a connector separately. Submit both
from the one Claude organisation that should own them long term: first the
hosted MCP server as a connector, as `claude-connector.md` describes, then
this plugin bundle. The first organisation to submit a repository folder
holds that plugin listing, and the two listings can be paired only when the
same organisation submits both.

## Before you submit

- **Plan and role:** a paid Claude plan. On Pro, Max and Ultra you submit
  from your own account. On Team, an Owner submits. On Enterprise, an Owner
  submits, or a member whose custom role includes the **Directory**
  permission.
- **GitHub:** a GitHub account connected on claude.ai in the submitting
  organisation, with write (push) access to `opencloud-ai/agent-plugins`.
  The portal checks push access before it creates, submits or publishes the
  plugin. Setting up the push webhook also needs admin access to the
  repository.
- **Release:** the platform release that names Open Cloud Solutions Limited
  on the website, privacy policy and terms is live.
- **Connector:** `https://mcp.opencloud.ai` is already submitted from the
  same organisation.

## Submit

1. Open the developer portal at `https://claude.ai/directory/manage`, select
   **Submit new**, then **Plugin bundle**.
2. On the **Source** step, enter:
   - **Repository:** `opencloud-ai/agent-plugins`
   - **Plugin path:** `plugins/opencloud`
   - **Branch or tag:** the release tag, now `v1.1.0`. A tag keeps the
     directory on tagged releases, the ones the platform's catalogs pin. If
     you track `main` instead, every merge that touches `plugins/opencloud`
     becomes a directory version, so it must raise `version` in both
     manifests.
3. Select **Validate**. Fix every finding the report marks **Blocking**, push
   the fix, and select **Re-validate**. `claude plugin validate` doesn't check
   names, but the portal does, here and in every scan after you submit:
   - **Name is taken** blocks the submission. Fall back to `opencloud-ai`, as
     Sprout became `sprout-is`.
   - **Name matches a known brand** or **Name may be confused with an
     existing listing** is a **Policy hold**. You can submit, and an Anthropic
     reviewer decides. One is possible here: OpenCloud GmbH (opencloud.eu)
     sells an unrelated file-sharing product called OpenCloud.
4. Check the **Listing details** step. The portal reads them from
   `plugins/opencloud/.claude-plugin/plugin.json` and the plugin README, so
   change them there, not in the portal.
5. On the **Data handling** step, answer as the plugin README's "What it
   connects to" section says:
   - **Reads or stores personal data:** it reads and changes OpenCloud
     account and app data through the OpenCloud connector. The plugin itself
     stores nothing.
   - **Sends data to services other than its declared connectors:** in
     sessions with a terminal, the skill has the assistant install the
     OpenCloud CLI from `https://docs.opencloud.ai/install.sh`, which
     downloads the release from GitHub. The CLI then calls OpenCloud's API
     directly.
   - **How long it keeps data:** the plugin keeps none. OpenCloud keeps
     account and app data as its privacy policy describes.
   - **Intended for people under 18:** no. OpenCloud's terms require users to
     be 18 or the age of majority.
6. On the **Compliance** step, set the contact email to a monitored team
   address such as `support@opencloud.ai`, and select all four
   acknowledgements.
7. On **Review and submit**, keep **GitHub push webhook** and leave
   **Auto-publish passing versions** off, so a version goes live only when
   you choose. Select **Submit for review**, then **Set up push updates**,
   which needs admin access to the repository.
8. Once a version passes its scan, select **Publish**. By default an
   Anthropic reviewer then publishes each version. The **Auto-publish** row on
   the plugin's **Overview** tab shows which publish setting applies. A
   version is installable only once its status is **Published**; **Approved**
   isn't live yet.

## Each later release

When a new release is tagged, open the plugin's **Settings** tab, set
**Tracked branch or tag** to the new tag and select **Save**. When the scan
passes, select **Publish update**. The tracked tag can't change while the
plugin is with a reviewer.

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
3. Run `npm test`, which checks the manifests, the skill and the directory's
   package rules, then `npm run validate`, Claude Code's strict validator for
   the plugin and the marketplace, and `npm run check:live`.
4. Install the public copy. Run `claude plugin marketplace list` and remove
   any local `opencloud-platform` entry first, then run
   `claude plugin install opencloud --marketplace opencloud-ai/agent-plugins`
   (Claude Code 2.1.292 or later) and
   `claude plugin details opencloud@opencloud-platform`. It should list the
   `build-apps` skill and the `opencloud` MCP server.
5. Run the positive and negative review cases from
   `plugins/opencloud/.codex-plugin/plugin.json`, with the reviewer account
   described in `submission/test-cases.md`, where the skill uses the
   connector: Claude chat, or Cowork without a shell. In Claude Code the
   skill takes the CLI path instead, so check that path separately.

The plugin form has no reviewer-account field. Reviewers use the account
entered in the connector's **Test & launch** step. Never commit credentials,
tokens, cookies, one-time links, or secret-entry URLs.
