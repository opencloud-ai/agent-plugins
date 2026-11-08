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
the portals' protected fields: **Review details** in OpenAI's portal, and the
connector's **Test & launch** step in Claude's (its plugin form has no such
field). Keep the account and its data in place for later reviews.

## Fixture app

Prepare one private app named **OpenCloud Review Tasks** in that
organisation with:

- a `tasks` table holding a few non-sensitive sample rows that only their
  signed-in owner can read;
- one active release and at least one earlier, superseded release;
- a declared `tasks_created` counter and one warning alert rule on it.

Keep the fixture's source so you can build it again. Running the cases changes
it: P1 creates a new app, P2 adds a priority field with a new migration, P4
stores or replaces the `REVIEW_SIGNING_KEY` secret and P5 adds a backup. P2
shows its migration and new release only on its first run after a reset; a
later run finds the priority field already there, says so and adds no second
migration, which its expected behaviour allows. Reset the fixture after every
rehearsal and before each submission, so reviewers start from the original
state:

1. Delete the apps P1 created.
2. Delete **OpenCloud Review Tasks** and build it again from the saved
   source, with its sample rows, two releases, counter and alert rule, and no
   `REVIEW_SIGNING_KEY`.
3. Open it once to check that it matches the list above.

## Before submitting

Run every case with the reviewer account in ChatGPT, on the web, on desktop
and on mobile, and in Codex. In Codex and other sessions with a terminal, the
skill takes the OpenCloud CLI path, so expect CLI commands there instead of
the listed tools. To see P2's migration on each of them, reset the fixture
between them; otherwise expect P2's repeat branch after the first. Record the
demo video from those runs, then reset the fixture. Record only pass or fail
evidence; never commit credentials, screenshots of secrets or response bodies
containing user data.
