# Claude connector directory submission

Submit the hosted OpenCloud MCP server as its own connector listing, even
though the plugin points at it. Submit it first, then the plugin, from the
one Claude organisation that should own both listings long term, and pair
the two. The connector listing carries the server's details, authentication
settings and dashboard. The plugin adds the workflow skill; it doesn't
create a second server. People who add the connector get it in Claude.ai,
Claude Desktop, Claude mobile, Cowork and Claude Code.

## Before you submit

- **Plan and role:** a paid Claude plan. On Pro, Max and Ultra you submit
  from your own account. On Team, an Owner submits. On Enterprise, an Owner
  submits, or a member whose custom role includes the **Directory**
  permission.
- **Release:** the platform release that names Open Cloud Solutions Limited
  on the website, privacy policy and terms is live.

## Connection

- **Server URL:** `https://mcp.opencloud.ai`, the same URL as the plugin, so
  Claude merges the two into one tool set
- **Transport:** Streamable HTTP
- **URL model:** **Universal URL**: every user connects to the same URL
- **Authentication requirement:** **Required when the server asks**. The
  server starts without sign-in. Tools that need an account answer with HTTP
  401 and a `WWW-Authenticate` challenge, and the client then runs OAuth.
- **Authentication method:** **OAuth sign-in**, with Claude registering
  itself through dynamic client registration. OpenCloud's authorization
  server offers PKCE S256, protected-resource discovery and the `mcp:tools`
  scope. There are no Anthropic-held client credentials to enter. The docs
  prefer a Client ID Metadata Document or Anthropic-held credentials for
  busy servers, because dynamic registration creates a client on every fresh
  connection; OpenCloud doesn't offer a metadata document yet.
- **Data access:** Read and write
- **MCP App UI:** None
- **Allowed link URIs:** None requested; normal HTTPS URLs in tool results
  don't use the MCP Apps `ui/open-link` capability

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
- **Slug:** `opencloud`. If it's taken, use `opencloud-ai`; the slug can't
  change once published.
- **Icon:** upload `plugins/opencloud/assets/icon.png` (512 × 512 PNG)

## Primary use cases

1. Create and deploy a private full-stack app from a product brief.
2. Safely change an existing app while preserving data and verifying the exact
   revision before promotion.
3. Inspect app health, deployments, usage, alerts, metrics, and bounded logs.
4. Add Functions, cron jobs, Storage, Realtime, backups, and secret bindings
   without exposing secret values in the conversation.

What users need before they connect: an OpenCloud account in an
organisation. A new user can start from the connector: the passwordless
onboarding flow creates the account, the user confirms it through OpenCloud's
email, then creates or joins an organisation. To build and deploy apps, the
organisation needs OpenCloud's Cloud plan, which starts with a 14-day trial
that requires a card. Returning users complete OAuth outside the
conversation.

## Company

- **Company name:** Open Cloud Solutions Limited
- **Company website:** `https://opencloud.ai`
- **Primary contact:** a monitored team mailbox, such as
  `support@opencloud.ai`

## Data handling

- **Underlying API:** OpenCloud's own
- **Personal health data:** No
- **Sponsored content:** No

## Review gates

Before submitting through the developer portal at
`https://claude.ai/directory/manage` (**Submit new**, then **MCP connector**):

1. Submit from the organisation that will own both listings, with a plan and
   role from [Before you submit](#before-you-submit).
2. In the **Test & launch** step, give a dedicated, fully populated test
   account, with every link, credential and step a reviewer needs. It must
   not require MFA, SMS, email approval, or private-network access.
   `submission/test-cases.md` describes the account and its fixture.
3. Run every advertised tool with valid parameters through MCP Inspector or a
   custom Claude connector. Record only non-secret pass/fail evidence; do not
   commit credentials or response bodies containing user data. First run
   `npm run audit:opencloud-claude-connector` from the platform repository for
   the read-only metadata and safe/write-method split audit.
4. Confirm every tool has a title, a name of at most 64 characters, an accurate
   narrow description, and the applicable read/write annotations. The portal
   syncs the tools from the server and flags any tool missing a title or
   annotation. Keep the safe `GET` and `HEAD` methods in `request_dev_app` and
   fixture writes in `create_dev_data_row`, `create_dev_data_rows`,
   `update_dev_data_row` and `delete_dev_data_row`; do not combine them into a
   catch-all request tool.
5. Run the five positive and three negative review cases from
   `plugins/opencloud/.codex-plugin/plugin.json` with the account and fixture
   described in `submission/test-cases.md`.
6. Test OAuth and representative read/write workflows in every claimed launch
   surface. Confirm that a connector and plugin configured with the same URL
   expose one deduplicated tool set.
7. Verify the documentation, privacy and support URLs are public before
   publication, and keep the chosen slug stable.
8. Confirm the seven policy acknowledgments: the directory guidelines,
   first-party API usage, financial transactions, AI media generation, prompt
   injection, conversation data collection and public documentation.

## After you submit

Anthropic scans the connector automatically and, by default, lists it as a
Community connector with no action from you; the portal then shows it as
**Published**. Some submissions also get a review from a person. A listing a
reviewer clears shows **Approved** and goes live only when you select
**Publish**. Anthropic
may later escalate a useful listing to Verified review; there's no
application for it. For escalations about a submission, email
`mcp-review@anthropic.com`. Reviewer credentials and test-account setup
details belong only in the portal's protected fields.
