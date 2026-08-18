import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const pluginRoot = path.join(repositoryRoot, "plugins", "opencloud");

async function readJson(relativePath) {
  return JSON.parse(
    await readFile(path.join(repositoryRoot, relativePath), "utf8"),
  );
}

test("OpenCloud client manifests describe one canonical 1.0.3 package", async () => {
  const [
    packageManifest,
    codexMarketplace,
    claudeMarketplace,
    codexManifest,
    claudeManifest,
    mcp,
  ] = await Promise.all([
    readJson("package.json"),
    readJson(".agents/plugins/marketplace.json"),
    readJson(".claude-plugin/marketplace.json"),
    readJson("plugins/opencloud/.codex-plugin/plugin.json"),
    readJson("plugins/opencloud/.claude-plugin/plugin.json"),
    readJson("plugins/opencloud/.mcp.json"),
  ]);

  assert.equal(packageManifest.version, "1.0.3");
  assert.equal(packageManifest.license, "MIT");

  assert.equal(codexMarketplace.name, "opencloud-platform");
  assert.equal(codexMarketplace.plugins.length, 1);
  assert.equal(codexMarketplace.plugins[0].name, "opencloud");
  assert.equal(
    codexMarketplace.plugins[0].source.path,
    "./plugins/opencloud",
  );
  assert.equal(
    codexMarketplace.plugins[0].policy.installation,
    "AVAILABLE",
  );
  assert.equal(
    codexMarketplace.plugins[0].policy.authentication,
    "ON_INSTALL",
  );

  assert.equal(claudeMarketplace.name, "opencloud-platform");
  assert.equal(claudeMarketplace.version, "1.0.3");
  assert.equal(claudeMarketplace.plugins.length, 1);

  const [entry] = claudeMarketplace.plugins;
  assert.equal(entry.name, "opencloud");
  assert.equal(entry.source, "./plugins/opencloud");
  assert.equal(entry.version, "1.0.3");
  assert.equal(entry.license, "MIT");
  assert.equal(entry.strict, true);
  assert.equal(entry.defaultEnabled, false);

  assert.equal(codexManifest.name, "opencloud");
  assert.equal(codexManifest.version, "1.0.3");
  assert.equal(codexManifest.license, "MIT");
  assert.equal(
    codexManifest.repository,
    "https://github.com/opencloud-ai/agent-plugins",
  );
  assert.equal(codexManifest.skills, "./skills/");
  assert.equal(codexManifest.mcpServers, "./.mcp.json");
  assert.equal(
    codexManifest.interface.privacyPolicyURL,
    "https://opencloud.ai/privacy",
  );
  assert.equal(
    codexManifest.interface.termsOfServiceURL,
    "https://opencloud.ai/terms",
  );

  assert.equal(claudeManifest.name, "opencloud");
  assert.equal(claudeManifest.version, "1.0.3");
  assert.equal(claudeManifest.license, "MIT");
  assert.equal(
    claudeManifest.repository,
    "https://github.com/opencloud-ai/agent-plugins",
  );
  assert.equal(claudeManifest.defaultEnabled, false);
  assert.equal(claudeManifest.skills, "./skills/");
  assert.equal(claudeManifest.mcpServers, "./.mcp.json");

  assert.deepEqual(mcp, {
    mcpServers: {
      opencloud: {
        type: "http",
        url: "https://mcp.opencloud.ai/mcp",
      },
    },
  });
});

test("OpenCloud package keeps every declared local component self-contained", async () => {
  const requiredPaths = [
    "skills/opencloud/SKILL.md",
    ".mcp.json",
    "assets/composer-icon.png",
    "assets/directory-icon.png",
    "README.md",
  ];

  await Promise.all(
    requiredPaths.map((relativePath) =>
      readFile(path.resolve(pluginRoot, relativePath)),
    ),
  );

  const skill = await readFile(
    path.join(pluginRoot, "skills", "opencloud", "SKILL.md"),
    "utf8",
  );
  assert.match(skill, /^---\nname: opencloud\n/m);
  assert.match(skill, /Claude Code/);
  assert.match(skill, /Never request or reveal a password/);
  assert.match(skill, /browserPreviewUrl/);
  assert.match(skill, /Not live/);
  assert.match(skill, /does not authorize promotion/);
});
