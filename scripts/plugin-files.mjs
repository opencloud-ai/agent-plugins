import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const pluginRoot = path.join(repositoryRoot, "plugins", "opencloud");
export const skillPath = path.join(
  pluginRoot,
  "skills",
  "build-apps",
  "SKILL.md",
);

// Backticked snake_case words in the skill that are error codes or states,
// not tools.
const NON_TOOL_CODES = new Set([
  "onboarding_rate_limited",
  "organisation_setup_required",
  "organisation_subscription_required",
  "plan_limit_reached",
]);

// OpenAI reads the Codex manifest, so its ZIP leaves the Claude one out.
const OPENAI_EXCLUDED_ROOTS = new Set([".claude-plugin"]);

// https://developers.openai.com/plugins/deploy/submission-errors
const OPENAI_CATEGORIES = new Set([
  "Productivity",
  "Creativity",
  "Developer Tools",
  "Business & Operations",
  "Data & Analytics",
  "Communication",
  "Education & Research",
  "Security",
  "Finance",
  "Healthcare",
  "Travel",
  "Entertainment",
  "Other",
]);

export async function readJson(relativePath) {
  return JSON.parse(
    await readFile(path.join(repositoryRoot, relativePath), "utf8"),
  );
}

/** The MCP tool names the skill tells the assistant to call. */
export function skillToolNames(markdown) {
  const names = new Set();
  for (const [, name] of markdown.matchAll(
    /`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g,
  )) {
    if (!NON_TOOL_CODES.has(name)) names.add(name);
  }
  return [...names].sort();
}

/** The MCP tool names the OpenAI review cases expect. */
export function reviewToolNames(codexManifest) {
  const cases =
    codexManifest.extensions?.["com.openai"]?.review?.test_cases?.positive ??
    [];
  const names = new Set();
  for (const testCase of cases) {
    for (const name of testCase.tools_triggered.split(",")) {
      names.add(name.trim());
    }
  }
  return [...names].sort();
}

/** Plugin-root-relative paths of every file in the OpenAI ZIP, sorted. */
export async function openAiPackageFiles(directory = pluginRoot) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    const relative = path.relative(pluginRoot, entryPath).split(path.sep);
    if (OPENAI_EXCLUDED_ROOTS.has(relative[0])) continue;
    if (entry.isDirectory()) files.push(...(await openAiPackageFiles(entryPath)));
    else if (entry.isFile()) files.push(relative.join("/"));
  }
  return files.sort();
}

function pngDimensions(bytes) {
  const signature = "89504e470d0a1a0a";
  if (bytes.subarray(0, 8).toString("hex") !== signature) return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (light + 0.05) / (dark + 0.05);
}

const oneLine = (value) => typeof value === "string" && !/[\r\n]/.test(value);

/**
 * Problems that would stop the Codex manifest passing OpenAI's final
 * directory submission checks for a remote MCP plugin. Empty when it passes.
 */
export async function openAiListingProblems(manifest) {
  const problems = [];
  const fail = (message) => problems.push(message);
  const ui = manifest.interface ?? {};

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name ?? "")) {
    fail("name must use lowercase letters, digits and single hyphens");
  }
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) {
    fail("version must be a semantic version");
  }
  if (!manifest.description || manifest.description.length > 1024) {
    fail("description must be 1 to 1,024 characters");
  }
  if (!manifest.author?.name) fail("author.name is required");

  for (const [field, limit] of [
    ["displayName", 30],
    ["shortDescription", 30],
    ["developerName", 80],
  ]) {
    if (!oneLine(ui[field]) || ui[field].trim() === "" || ui[field].length > limit) {
      fail(`interface.${field} must be one non-empty line of at most ${limit} characters`);
    }
  }
  if (!ui.longDescription || ui.longDescription.length > 4000) {
    fail("interface.longDescription must be 1 to 4,000 characters");
  }
  if (!OPENAI_CATEGORIES.has(ui.category)) {
    fail(`interface.category ${JSON.stringify(ui.category)} is not a directory category`);
  }
  if (
    !Array.isArray(ui.capabilities) ||
    ui.capabilities.length > 20 ||
    ui.capabilities.some((item) => !oneLine(item) || !item || item.length > 120)
  ) {
    fail("interface.capabilities must hold at most 20 one-line labels of at most 120 characters");
  }

  for (const field of [
    "websiteURL",
    "supportURL",
    "privacyPolicyURL",
    "termsOfServiceURL",
  ]) {
    let url;
    try {
      url = new URL(ui[field]);
    } catch {
      fail(`interface.${field} must be an HTTPS URL`);
      continue;
    }
    if (url.protocol !== "https:" || url.username || url.password || ui[field].length > 1024) {
      fail(`interface.${field} must be an HTTPS URL of at most 1,024 characters`);
    }
  }

  const prompts = Array.isArray(ui.defaultPrompt) ? ui.defaultPrompt : [ui.defaultPrompt];
  const normalized = prompts.map((prompt) => String(prompt).normalize("NFKC").replace(/\s+/g, " ").trim());
  if (
    prompts.length > 3 ||
    prompts.some((prompt) => !oneLine(prompt) || !prompt || prompt.length > 128 || prompt.includes("@")) ||
    new Set(normalized).size !== normalized.length
  ) {
    fail("interface.defaultPrompt must be at most 3 unique one-line prompts of at most 128 characters without @mentions");
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(ui.brandColor ?? "") || contrast(ui.brandColor, "#FFFFFF") < 2) {
    fail("interface.brandColor must be #RRGGBB with at least 2:1 contrast against white");
  }

  for (const field of ["composerIcon", "logo"]) {
    if (!/^\.\/assets\/[\w.-]+\.png$/.test(ui[field] ?? "")) {
      fail(`interface.${field} must be a ./assets/ PNG path`);
      continue;
    }
    const bytes = await readFile(path.join(pluginRoot, ui[field]));
    const size = pngDimensions(bytes);
    if (
      !size ||
      size.width !== size.height ||
      size.width < 48 ||
      size.width > 4096 ||
      bytes.length > 5 * 1024 * 1024
    ) {
      fail(`interface.${field} must be a square PNG from 48 to 4,096 pixels and at most 5 MiB`);
    }
  }

  const review = manifest.extensions?.["com.openai"]?.review ?? {};
  const cases = review.test_cases ?? {};
  if (cases.positive?.length !== 5) fail("review needs exactly five positive test cases");
  if (cases.negative?.length !== 3) fail("review needs exactly three negative test cases");
  for (const testCase of cases.positive ?? []) {
    for (const field of ["description", "prompt", "tools_triggered", "expected_behavior"]) {
      if (typeof testCase[field] !== "string" || testCase[field].trim() === "") {
        fail(`every positive test case needs ${field}`);
      }
    }
    if (testCase.description?.length > 4000) fail("positive test case descriptions must be at most 4,000 characters");
  }
  for (const testCase of cases.negative ?? []) {
    for (const field of ["description", "prompt"]) {
      if (typeof testCase[field] !== "string" || testCase[field].trim() === "") {
        fail(`every negative test case needs ${field}`);
      }
    }
  }
  for (const field of ["test_credentials", "reviewer_instructions"]) {
    if (field in review) fail(`review.${field} belongs in the portal, not the package`);
  }
  if (typeof review.commerce !== "boolean") fail("review.commerce must be true or false");

  return problems;
}
