# OpenCloud

OpenCloud is a home for the web apps your team makes: a request tracker, an
onboarding checklist, a shared dashboard. Describe what you need to your AI
assistant, it builds the app with OpenCloud, and the app gets its own address
with its own database, sign-in and storage. OpenCloud hosts it and keeps it
running.

## What the plugin adds

- **The OpenCloud connector.** Your assistant gets OpenCloud's tools for
  making, previewing, publishing and looking after your apps.
- **OpenCloud's building guide.** A skill that shows the assistant how to
  work with OpenCloud: try every change in a private preview with made-up
  data, publish only when you ask and the checks pass, and never ask you for
  a password or secret in the chat.

## Get started

1. Install the plugin, then start a new chat.
2. Ask for an app, for example: "Use OpenCloud to make a request tracker for
   my team."
3. When you're asked to sign in, use the OpenCloud page that opens. New to
   OpenCloud? The same page creates your account; confirm your email, then
   create or join your organisation when asked.

In Claude Code, install the plugin from inside a session:

```text
/plugin install opencloud --marketplace opencloud-ai/agent-plugins
```

The guide is then also available as `/opencloud:build-apps`.

## What it connects to

- **`https://mcp.opencloud.ai`**, OpenCloud's hosted connector. You sign in
  on OpenCloud's own pages at `auth.opencloud.ai`, so the assistant never
  sees your password.
- **OpenCloud's current instructions** at `https://opencloud.ai/SKILL.md` and
  its documentation at `https://docs.opencloud.ai`, which the guide may ask
  the assistant to read.
- **The OpenCloud command-line tool**, in sessions with a terminal such as
  Codex or Claude Code. OpenCloud's instructions have the assistant install
  it with `https://docs.opencloud.ai/install.sh`, which downloads the release
  from GitHub and checks it against its published checksum.

The plugin has no hooks, scripts or programs of its own, and it sends
nothing anywhere else.

## Help and policies

- Support: <https://opencloud.ai/support>
- Privacy: <https://opencloud.ai/privacy>
- Terms: <https://opencloud.ai/terms>

The plugin is available under the [MIT License](LICENSE).
