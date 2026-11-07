# OpenCloud plugin review test cases

The five positive and three negative review cases live in
`plugins/opencloud/.codex-plugin/plugin.json` under
`extensions.com.openai.review.test_cases`, so they upload with the ZIP. The
OpenAI portal imports them read-only. Use the same cases for the Claude
directory reviews. This file describes the account and fixture that the cases
expect.

## Reviewer account

Create one dedicated account on opencloud.ai for reviewers, never a real
person's account:

- a mailbox the team controls, confirmed, with a password set and the welcome
  steps (name and organisation) finished, so sign-in needs no email link,
  code or second factor;
- the only member and admin of its own organisation, which can build: an
  audited platform-admin billing exemption, or an active subscription;
- no production secrets and no real customer data.

The sign-in page offers an email link first. Reviewers sign in with **Use a
password instead**. Enter the email, password and these instructions only in
the portal's protected **Review details** fields, and keep the account and its
data in place for later reviews.

## Fixture app

Prepare one private app named **OpenCloud Review Tasks** in that
organisation with:

- a `tasks` table holding a few non-sensitive sample rows that only their
  signed-in owner can read;
- one active release and at least one earlier, superseded release;
- a declared `tasks_created` counter and one warning alert rule on it.

Case P1 creates a new app each run, case P2 adds a migration, case P4 replaces
the `REVIEW_SIGNING_KEY` secret and case P5 adds a backup. Delete apps left
from earlier runs and check the fixture before each submission.

## Before submitting

Run every case through the plugin in ChatGPT with the reviewer account, on
desktop and on mobile, and record the demo video from those runs. Record only
pass or fail evidence; never commit credentials, screenshots of secrets or
response bodies containing user data.
