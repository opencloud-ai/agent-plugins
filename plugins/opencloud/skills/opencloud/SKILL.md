---
name: opencloud
description: Create, edit, validate, preview, deploy, and operate OpenCloud applications through the hosted OpenCloud MCP connector without requiring a local CLI. Use for new apps, changes to existing apps, production verification, deployment health checks, and OpenCloud work in ChatGPT, Codex, Claude Code, or Cowork.
---

# Build and ship OpenCloud apps

Use the connected OpenCloud tools as the source of truth. Read the
`opencloud-skill` MCP resource and only the documentation pages needed for the
requested product. Never request or reveal a password, cookie, access token,
completion token, database credential, or secret value.

## Respect the active client surface

In Claude Code and Cowork, use the MCP server and this skill bundled by the
OpenCloud plugin. Let the client present OAuth outside the conversation. If the
same server URL is also configured as a Claude connector, use the one
deduplicated tool set instead of adding another connection.

Claude.ai, Claude Desktop, and Claude mobile can use the hosted OpenCloud MCP
connector, but connector-only surfaces do not receive this bundled plugin
skill. Continue with the tools that are available and do not claim the skill is
installed there.

For ChatGPT Remote, treat the phone as a controller for a Codex task running on
a connected Mac or Windows host. The phone does not run this plugin, its MCP
server, or shell commands. Use the plugin, credentials, tools, files, and
permissions of the connected host.

- Continue a phone-steered OpenCloud workflow on the host. Do not ask the user to
  install a CLI or run terminal commands on the phone.
- Keep progress updates compact. Surface only approvals, account confirmations,
  or product decisions that require the user.
- Require the OpenCloud plugin to be installed and enabled on the host before
  the Remote chat starts. Complete connector sign-in on a supported host
  surface; never ask for credentials in chat.
- If the OpenCloud tools are absent, explain the exact host setup needed:
  install or enable the plugin, connect OpenCloud when prompted, start a new
  Codex chat, and reopen it from Remote. Do not claim that a direct ChatGPT
  mobile chat can execute the plugin.

## Establish the product and session

Identify the audience and one primary workflow. Do not repeat questions the
user already answered. Then call `get_opencloud_session`.

- For a returning user, call `connect_opencloud` when disconnected and let the
  supported host surface complete OAuth.
- For first registration, call `start_onboarding` once the email, project name,
  and visibility are known. A new email receives a provisional account and
  first app immediately.
- Give the user the non-secret `launchUrl` returned by `start_onboarding` as the
  primary owner link while confirmation or deployment is pending. It opens the
  project after both complete.
- For an existing email, wait for the user to approve the emailed request, then
  call `complete_onboarding` with the public onboarding ID. Never request or
  expose the private completion token.

Build only through source drafts:

1. Resolve the assigned app, then call `get_app_starter` with the app ID and
   intended unique version.
2. Call `create_draft`, followed by `list_files` and `read_files`. Preserve
   intentional existing work.
3. Use `apply_file_changes` with the current `expectedRevision` and per-file
   hashes. Never fabricate either value.
4. Call `validate_draft`; inspect every diagnostic and fix every error before
   continuing.
5. Call `start_dev_session` for that exact validated revision. If the user
   wants to review it before deployment, give them `browserPreviewUrl`, never
   the raw `previewUrl`. The owner/builder link opens a clearly marked **Not live**
   window with Full size, Tablet, Mobile, and Reload tools around
   isolated synthetic data. An explicit no-deploy request stops at this review
   point and does not authorize promotion. After each later source edit,
   validate and call `apply_dev_revision` again.
6. Inspect the preview with `request_dev_app` and, where needed,
   `mutate_dev_data`. Use only dummy development fixtures.
7. Exercise every declared Function with `invoke_dev_function`, then inspect
   the correlated entries from `list_dev_invocations`.
8. Call `verify_dev_session` only for the exact current revision.

Promote only the verified revision:

1. Call `promote_dev_revision` only with a current passing receipt.
2. Follow the returned operation with `get_operation` until it succeeds, fails,
   or is cancelled.
3. Call `verify_app`, then follow its operation and `get_verification_run` until
   every required gate is terminal.
4. Call `get_app` and report the canonical HTTPS URL only when the promoted
   deployment is active and production verification passed.
5. Stop the development session only after production succeeds.

Use `generate_secret` for platform-generated values and
`create_secret_entry_link` when the user must enter a provider secret. Never
route around a missing development capability by reading or mutating production.

On revision or file-hash conflicts, re-read the draft and files, then rebase
only the intended change. Never treat a preview URL, queued deployment, elapsed
time, or partial verification run as completion. If work cannot continue,
distinguish a missing host-side plugin or connection from an OpenCloud
validation or deployment failure and give one specific next action.
