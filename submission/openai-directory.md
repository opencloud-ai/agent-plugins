# OpenAI plugin directory submission

The OpenAI plugin directory serves ChatGPT and Codex from one listing. Submit
OpenCloud through **With MCP** at `https://platform.openai.com/plugins`, using
the ZIP that `npm run package:openai` builds in `dist/`.

## What the ZIP carries

- **Package:** everything in `plugins/opencloud` except the Claude manifest:
  the Codex manifest `.codex-plugin/plugin.json`, `.mcp.json`, the
  `build-apps` skill and its `agents/openai.yaml`, the icon, the README and
  the MIT License. It has the same shape as the accepted Sprout package, plus
  the Codex manifest.
- **Listing:** display name, short and long description, category, starter
  prompts, brand color, icon, and the website, support, privacy and terms
  URLs.
- **Review:** the five positive and three negative test cases, the commerce
  declaration (`false`) and the release notes, all under
  `extensions.com.openai`. They import read-only; change them in the
  manifest and upload a new ZIP.
- **MCP server:** `https://mcp.opencloud.ai`, the canonical full endpoint.
  OAuth details come from discovery: protected-resource metadata, PKCE S256
  and dynamic client registration at `https://auth.opencloud.ai`.

## What the portal needs besides the ZIP

1. **Developer identity.** Publish under the verified business identity. The
   directory shows that name regardless of `developerName`, and the website,
   privacy and terms pages must identify the same publisher.
2. **Domain verification.** The portal shows a token for
   `https://mcp.opencloud.ai/.well-known/openai-apps-challenge`. Serve it as
   plain text through the platform-admin well-known manager (origin `mcp`,
   name `openai-apps-challenge`); no release is needed.
3. **Demo video.** A reviewer-accessible recording that walks through the
   test cases on desktop and mobile. Enter its URL in **Review details**, or
   add `review.demo_recording_url` to the manifest.
4. **Reviewer account.** Enter it only in the portal's **Review details**, as
   described in `test-cases.md`. It must work at once: password sign-in, no
   email link, code or second factor.
5. **Attestations.** Confirm the policy attestations when you submit.

Only one version can be in review at a time. After approval, choose
**Publish plugin**. Later changes to the hosted tools reach the directory
through OpenAI's daily scans without a new ZIP; skill and listing changes
need a new version and a new review. The MCP server URL can't change after
submission without OpenAI support.

## Listing rules to keep

- Don't mention prices, plans, trials, discounts or promotions in the
  listing, and don't append "MCP" or "Plugin" to the name.
- Keep starter prompts unique, at most 128 characters and free of
  `@mentions`.
- Keep the skill text client-neutral: say "the model" or "the person", not
  a client or provider name.
- Never put credentials, reviewer instructions, one-time links, tokens or
  secret values in the package; the manifest rejects `test_credentials` and
  `reviewer_instructions`.

`npm test` checks these limits, and `npm run check:live` confirms that every
tool the skill and the review cases name is live on `https://mcp.opencloud.ai`
with explicit safety annotations.
