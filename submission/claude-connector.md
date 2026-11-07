# Claude connector directory submission

Submit the hosted OpenCloud MCP server as its own connector listing, even
though the plugin points at it. The connector listing carries the server's
details, authentication settings and dashboard, and lets you pair it with the
plugin. The plugin adds the workflow skill; it does not create a second
server. People who add the connector get it in Claude.ai, Claude Desktop,
Claude mobile, Cowork and Claude Code.

## Connection

- **Server URL:** `https://mcp.opencloud.ai`, the same URL as the plugin, so
  Claude merges the two into one tool set
- **Transport:** Streamable HTTP
- **URL model:** Every user connects to the same URL
- **Authentication requirement:** **Required when the server asks**. The
  server starts without sign-in. Tools that need an account answer with HTTP
  401 and a `WWW-Authenticate` challenge, and the client then runs OAuth.
- **Authentication method:** OAuth 2.0 authorization code flow with PKCE S256,
  protected-resource discovery, dynamic client registration and the
  `mcp:tools` scope. There is no client ID or secret to enter.
- **Data access:** Read and write
- **MCP App UI:** None in version 1.1.0
- **Allowed link URIs:** None requested in version 1.1.0; normal HTTPS URLs in
  tool results do not use the MCP Apps `ui/open-link` capability

## Listing

The portal allows a name of up to 100 characters, a one-liner of up to 200, a
description of up to 2,000 and one to five categories. The slug is permanent
once published.

- **Name:** OpenCloud
- **One-liner:** Build and operate full-stack apps with Claude
- **Description:** OpenCloud lets Claude create, edit, validate, preview,
  deploy, and operate full-stack web apps. It provides hosted PostgreSQL, Auth,
  Storage, Realtime, Functions, cron, observability, backups, HTTPS releases,
  and rollback workflows. Draft revisions are validated and exercised in an
  isolated development environment before exact-revision promotion, and
  production verification supplies evidence before Claude reports success.
- **Categories:** Developer tools; Productivity
- **Documentation:** `https://docs.opencloud.ai/getting-started/mcp`
- **Privacy policy:** `https://opencloud.ai/privacy`
- **Support:** `https://opencloud.ai/support`
- **Company:** Open Cloud Solutions Limited, which operates OpenCloud
- **Website:** `https://opencloud.ai`
- **Requested slug:** `opencloud`
- **Icon:** `plugins/opencloud/assets/icon.png` (512 × 512 PNG)

## Primary use cases

1. Create and deploy a private full-stack app from a product brief.
2. Safely change an existing app while preserving data and verifying the exact
   revision before promotion.
3. Inspect app health, deployments, usage, alerts, metrics, and bounded logs.
4. Add Functions, cron jobs, Storage, Realtime, backups, and secret bindings
   without exposing secret values in the conversation.

Users need an OpenCloud account or may begin the bounded passwordless
onboarding flow from the connector. Returning users complete OAuth outside the
conversation. New users confirm account ownership through OpenCloud's email
flow.

## Data handling

- **Underlying API:** OpenCloud's own
- **Personal health data:** No
- **Sponsored content:** No

## Review gates

Before submitting through the developer portal at
`https://claude.ai/directory/manage` (**Submit new**, then **MCP connector**):

1. Submit from any paid Claude plan: Pro, Max, Ultra, Team or Enterprise. On
   Team and Enterprise, an Owner submits, or a member an Owner gave the
   **Directory** permission.
2. Provide a dedicated, fully populated test account in the portal. It must not
   require MFA, SMS, email approval, or private-network access during review.
   `submission/test-cases.md` describes the account and its fixture.
3. Run every advertised tool with valid parameters through MCP Inspector or a
   custom Claude connector. Record only non-secret pass/fail evidence; do not
   commit credentials or response bodies containing user data. First run
   `npm run audit:opencloud-claude-connector` from the platform repository for
   the read-only metadata and safe/write-method split audit.
4. Confirm every tool has a title, a name of at most 64 characters, an accurate
   narrow description, and the applicable read/write annotations. The portal
   syncs the tools from the server and flags any that lack them. Keep the safe
   `GET` and `HEAD` methods in `request_dev_app` and fixture writes in
   `create_dev_data_row`, `create_dev_data_rows`, `update_dev_data_row` and
   `delete_dev_data_row`; do not combine them into a catch-all request tool.
5. Run the five positive and three negative review cases from
   `plugins/opencloud/.codex-plugin/plugin.json` with the account and fixture
   described in `submission/test-cases.md`.
6. Test OAuth and representative read/write workflows in every claimed launch
   surface. Confirm that a connector and plugin configured with the same URL
   expose one deduplicated tool set.
7. Verify the documentation, privacy, support, and icon URLs are public before
   publication and keep the chosen directory slug stable.
8. Confirm the seven policy acknowledgments: the directory guidelines,
   first-party API usage, financial transactions, AI media generation, prompt
   injection, conversation data collection and public documentation.

After you submit, Anthropic scans the connector automatically and lists it as
a Community connector by default. Reviewer credentials and test-account setup
details belong only in the submission portal's protected fields.
