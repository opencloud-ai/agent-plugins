import assert from "node:assert/strict";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  openAiListingProblems,
  openAiPackageFiles,
  pluginRoot,
  readJson,
  repositoryRoot,
  reviewToolNames,
  skillPath,
  skillToolNames,
} from "./plugin-files.mjs";

const repository = "https://github.com/opencloud-ai/agent-plugins";
const endpoint = "https://mcp.opencloud.ai";

async function pluginFiles(directory = pluginRoot) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    files.push(entryPath);
    if (entry.isDirectory()) files.push(...(await pluginFiles(entryPath)));
  }
  return files;
}

function frontMatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "SKILL.md starts with YAML front matter");
  return Object.fromEntries(
    match[1].split("\n").map((line) => {
      const separator = line.indexOf(": ");
      return [line.slice(0, separator), line.slice(separator + 2)];
    }),
  );
}

test("the marketplaces list the one OpenCloud plugin in this repository", async () => {
  const [claudeMarketplace, codexMarketplace, manifest] = await Promise.all([
    readJson(".claude-plugin/marketplace.json"),
    readJson(".agents/plugins/marketplace.json"),
    readJson("plugins/opencloud/.claude-plugin/plugin.json"),
  ]);

  assert.equal(claudeMarketplace.name, "opencloud-platform");
  assert.equal(claudeMarketplace.owner.name, "OpenCloud");
  assert.equal(claudeMarketplace.plugins.length, 1);
  const [entry] = claudeMarketplace.plugins;
  assert.equal(entry.name, "opencloud");
  assert.equal(entry.name, manifest.name);
  assert.equal(entry.source, "./plugins/opencloud");
  assert.equal(entry.version, undefined, "plugin.json alone sets the version");

  assert.equal(codexMarketplace.name, "opencloud-platform");
  assert.equal(codexMarketplace.plugins.length, 1);
  assert.equal(codexMarketplace.plugins[0].name, "opencloud");
  assert.equal(codexMarketplace.plugins[0].source.path, "./plugins/opencloud");
  assert.deepEqual(codexMarketplace.plugins[0].policy, {
    installation: "AVAILABLE",
    authentication: "ON_INSTALL",
  });
});

test("the manifests carry the fields the directory listings read", async () => {
  const [claude, codex] = await Promise.all([
    readJson("plugins/opencloud/.claude-plugin/plugin.json"),
    readJson("plugins/opencloud/.codex-plugin/plugin.json"),
  ]);

  for (const manifest of [claude, codex]) {
    assert.equal(manifest.name, "opencloud");
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
    assert.equal(manifest.license, "MIT");
    assert.equal(manifest.repository, repository);
    assert.equal(manifest.author.name, "OpenCloud");
    assert.ok(manifest.description.length > 0);
  }
  assert.equal(codex.version, claude.version, "both clients ship one release");
  // Without these declarations OpenAI ignores the skill and .mcp.json, and the
  // upload would have no MCP server.
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.mcpServers, "./.mcp.json");
  assert.equal(claude.displayName, "OpenCloud");
  assert.equal(claude.defaultEnabled, undefined, "the plugin starts enabled");

  const urls = [
    claude.homepage,
    claude.documentationUrl,
    claude.supportUrl,
    claude.privacyPolicyUrl,
    claude.termsOfServiceUrl,
    codex.homepage,
    codex.interface.websiteURL,
    codex.interface.supportURL,
    codex.interface.privacyPolicyURL,
    codex.interface.termsOfServiceURL,
  ];
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.protocol, "https:", value);
    assert.match(url.hostname, /(^|\.)opencloud\.ai$/, value);
  }

  for (const icon of [claude.icon, codex.interface.composerIcon, codex.interface.logo]) {
    assert.equal(icon, "./assets/icon.png");
  }
  const bytes = await readFile(path.join(pluginRoot, "assets", "icon.png"));
  assert.deepEqual(
    [...bytes.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    "the icon is a PNG",
  );
});

test("the Codex manifest passes OpenAI's directory submission checks", async () => {
  const manifest = await readJson("plugins/opencloud/.codex-plugin/plugin.json");
  assert.deepEqual(await openAiListingProblems(manifest), []);

  const listing = [
    manifest.interface.displayName,
    manifest.interface.shortDescription,
    manifest.interface.longDescription,
    ...manifest.interface.defaultPrompt,
  ].join("\n");
  // The directory rejects listings that advertise prices, trials or offers.
  assert.doesNotMatch(listing, /\b(price|pricing|free|trial|discount|subscri|plan)\w*/i);
  assert.doesNotMatch(manifest.interface.displayName, /\b(MCP|Plugin)\b/);
});

test("the connector is the canonical OpenCloud MCP host", async () => {
  // Clients merge a plugin and a connector only when their URLs match, and the
  // setup guide tells people to add this exact URL, not the /mcp alias.
  assert.deepEqual(await readJson("plugins/opencloud/.mcp.json"), {
    mcpServers: {
      opencloud: { type: "http", url: endpoint },
    },
  });
  const skillAgent = await readFile(
    path.join(path.dirname(skillPath), "agents", "openai.yaml"),
    "utf8",
  );
  assert.match(skillAgent, new RegExp(`url: "${endpoint}"\\n`));
});

test("the skill names OpenCloud's current tools and keeps its safety rules", async () => {
  const skill = await readFile(skillPath, "utf8");
  const { name, description } = frontMatter(skill);

  assert.equal(name, "build-apps");
  assert.ok(description.length > 0 && description.length <= 1024);

  for (const phrase of [
    "`opencloud-skill`",
    "`connect_opencloud`",
    "`browserPreviewUrl`",
    "**Not live**",
    "does not authorize going live",
    "Never ask for, accept or reveal",
  ]) {
    assert.ok(skill.includes(phrase), `SKILL.md mentions ${phrase}`);
  }

  // Names the 1.0 skill still used after the server dropped them, and
  // Sprout's own identifiers.
  for (const retired of [
    "get_opencloud_session",
    "invoke_dev_function",
    "mutate_dev_data",
    "connect_sprout",
    "sprout-skill",
  ]) {
    assert.ok(!skill.includes(retired), `SKILL.md does not mention ${retired}`);
  }

  const tools = skillToolNames(skill);
  for (const core of [
    "list_apps",
    "start_onboarding",
    "create_app",
    "validate_draft",
    "verify_dev_session",
    "promote_dev_revision",
    "verify_app",
  ]) {
    assert.ok(tools.includes(core), `SKILL.md uses ${core}`);
  }

  // Every tool a review case expects is one the skill teaches.
  const manifest = await readJson("plugins/opencloud/.codex-plugin/plugin.json");
  assert.deepEqual(
    reviewToolNames(manifest).filter((tool) => !tools.includes(tool)),
    [],
  );
});

test("the plugin folder follows the directories' file rules", async () => {
  const files = await pluginFiles();
  assert.ok(files.length <= 512);

  for (const file of files) {
    const relative = path.relative(pluginRoot, file);
    const stats = await lstat(file);
    assert.ok(!stats.isSymbolicLink(), `${relative} is not a symbolic link`);
    assert.match(path.basename(file), /^[\w.-]+$/, relative);
    assert.ok(
      !/^(\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX)$/.test(path.basename(file)),
      `${relative} is not a system file`,
    );
    if (stats.isFile() && !relative.endsWith(".png")) {
      assert.ok(stats.size < 256 * 1024, `${relative} is under 256 KiB`);
    }
    assert.ok(stats.size < 5 * 1024 * 1024, `${relative} is under 5 MiB`);
  }

  // claude.ai and Cowork refuse a plugin with a top-level bin/ directory, and
  // OpenAI's directory refuses hooks and app references.
  for (const refused of ["bin", "hooks", ".app.json"]) {
    assert.ok(!files.includes(path.join(pluginRoot, refused)), refused);
  }

  const readme = await readFile(path.join(pluginRoot, "README.md"), "utf8");
  const prose = readme.replace(/```[\s\S]*?```/g, "");
  assert.ok(prose.split(/\s+/).filter(Boolean).length >= 40);

  assert.equal(
    await readFile(path.join(pluginRoot, "LICENSE"), "utf8"),
    await readFile(path.join(repositoryRoot, "LICENSE"), "utf8"),
  );
});

test("the OpenAI ZIP holds the Codex package without the Claude manifest", async () => {
  const files = await openAiPackageFiles();
  for (const required of [
    ".codex-plugin/plugin.json",
    ".mcp.json",
    "LICENSE",
    "README.md",
    "assets/icon.png",
    "skills/build-apps/SKILL.md",
    "skills/build-apps/agents/openai.yaml",
  ]) {
    assert.ok(files.includes(required), required);
  }
  assert.ok(files.every((file) => !file.startsWith(".claude-plugin/")));
});
