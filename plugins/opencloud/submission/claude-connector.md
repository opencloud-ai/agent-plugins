# Claude connector directory submission

Submit the hosted OpenCloud MCP server separately from the plugin when it
should be discoverable in Claude.ai, Claude Desktop, Claude mobile, Cowork, and
Claude Code. The plugin references this same endpoint and adds workflow
guidance; it does not create a second server.

## Connection

- **Server URL:** `https://mcp.opencloud.ai/mcp`
- **Transport:** Streamable HTTP
- **URL model:** Every user connects to the same URL
- **Authentication:** OAuth 2.0 authorization code flow with PKCE S256,
  protected-resource discovery, dynamic client registration, and the
  `mcp:tools` scope
- **Data access:** Read and write
- **MCP App UI:** None in version 1.0.0
- **Allowed link URIs:** None requested in version 1.0.0; normal HTTPS URLs in
  tool results do not use the MCP Apps `ui/open-link` capability

## Listing

- **Name:** OpenCloud
- **Tagline:** Build and operate full-stack apps with Claude
- **Description:** OpenCloud lets Claude create, edit, validate, preview,
  deploy, and operate full-stack web apps. It provides hosted PostgreSQL, Auth,
  Storage, Realtime, Functions, cron, observability, backups, HTTPS releases,
  and rollback workflows. Draft revisions are validated and exercised in an
  isolated development environment before exact-revision promotion, and
  production verification supplies evidence before Claude reports success.
- **Categories:** Developer tools; Productivity
- **Documentation:** `https://docs.opencloud.ai/getting-started/mcp`
- **Privacy policy:** `https://docs.opencloud.ai/legal/privacy`
- **Support:** `https://docs.opencloud.ai/support`
- **Company:** OpenCloud
- **Website:** `https://opencloud.ai`
- **Requested slug:** `opencloud`
- **Icon:** `plugins/opencloud/assets/directory-icon.png`

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

## Review gates

Before submitting through the Claude.ai connector portal:

1. Use a Team or Enterprise organization whose owner or delegated directory
   manager can submit the connector.
2. Provide a dedicated, fully populated test account in the portal. It must not
   require MFA, SMS, email approval, or private-network access during review.
3. Run every advertised tool with valid parameters through MCP Inspector or a
   custom Claude connector. Record only non-secret pass/fail evidence; do not
   commit credentials or response bodies containing user data. Run
   `npm run audit:opencloud-claude-connector` first for the read-only metadata
   and safe/write-method split audit.
4. Confirm every tool has a title, a name of at most 64 characters, an accurate
   narrow description, and the applicable read/write annotations. Keep safe
   HTTP methods in `request_dev_app` and write methods in
   `mutate_dev_data`; do not combine them into a catch-all request tool.
5. Run the five positive and three negative cases in `test-cases.md`, including
   read-only health inspection, exact-revision deployment, secret
   non-disclosure, validation refusal, and tenant-isolation refusal.
6. Test OAuth and representative read/write workflows in every claimed launch
   surface. Confirm that a connector and plugin configured with the same URL
   expose one deduplicated tool set.
7. Verify the documentation, privacy, support, and icon URLs are public before
   publication and keep the chosen directory slug stable.

Reviewer credentials and test-account setup details belong only in the
submission portal's protected fields.
