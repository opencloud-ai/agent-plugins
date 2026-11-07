// Confirms that the live OpenCloud MCP server still offers every tool the
// skill and the OpenAI review cases name, and the opencloud-skill resource.
// Uses one anonymous session, which it deletes before exiting; no sign-in or
// credentials are involved.
import { readFile } from "node:fs/promises";

import {
  readJson,
  reviewToolNames,
  skillPath,
  skillToolNames,
} from "./plugin-files.mjs";

const protocolVersion = "2025-06-18";
const { url: endpoint } = (await readJson("plugins/opencloud/.mcp.json"))
  .mcpServers.opencloud;

let sessionId;
let nextId = 1;

async function post(method, params) {
  const id = nextId++;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "mcp-protocol-version": protocolVersion,
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  sessionId ??= response.headers.get("mcp-session-id") ?? undefined;

  const body = await response.text();
  const messages = (response.headers.get("content-type") ?? "").includes(
    "text/event-stream",
  )
    ? body
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => JSON.parse(line.slice(5)))
    : [JSON.parse(body)];
  const message = messages.find((candidate) => candidate.id === id);
  if (!message) throw new Error(`${method}: no response`);
  if (message.error) {
    throw new Error(`${method}: ${message.error.code} ${message.error.message}`);
  }
  return message.result;
}

async function notify(method) {
  await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "mcp-protocol-version": protocolVersion,
      "mcp-session-id": sessionId,
    },
    body: JSON.stringify({ jsonrpc: "2.0", method }),
    signal: AbortSignal.timeout(20_000),
  });
}

async function listAll(method, key) {
  const items = [];
  let cursor;
  do {
    const result = await post(method, cursor ? { cursor } : {});
    items.push(...result[key]);
    cursor = result.nextCursor;
  } while (cursor);
  return items;
}

const failures = [];
try {
  const initialized = await post("initialize", {
    protocolVersion,
    capabilities: {},
    clientInfo: { name: "opencloud-plugin-live-check", version: "1.0.0" },
  });
  await notify("notifications/initialized");

  if (initialized.serverInfo?.name !== "OpenCloud") {
    failures.push(
      `server name is ${initialized.serverInfo?.name}, not OpenCloud`,
    );
  }

  const tools = new Map(
    (await listAll("tools/list", "tools")).map((tool) => [tool.name, tool]),
  );
  const skillTools = skillToolNames(await readFile(skillPath, "utf8"));
  const reviewTools = reviewToolNames(
    await readJson("plugins/opencloud/.codex-plugin/plugin.json"),
  );
  for (const [source, names] of [
    ["the skill", skillTools],
    ["the review cases", reviewTools],
  ]) {
    for (const name of names) {
      if (!tools.has(name)) failures.push(`${source} names ${name}, which the server lacks`);
    }
  }

  // OpenAI's directory review requires explicit safety annotations.
  for (const tool of tools.values()) {
    for (const hint of ["readOnlyHint", "destructiveHint", "openWorldHint"]) {
      if (typeof tool.annotations?.[hint] !== "boolean") {
        failures.push(`${tool.name} has no explicit ${hint}`);
      }
    }
  }

  const resources = await listAll("resources/list", "resources");
  if (!resources.some((resource) => resource.name === "opencloud-skill")) {
    failures.push("the server has no opencloud-skill resource");
  }

  console.log(
    `${endpoint}: ${tools.size} tools; the skill names ${skillTools.length} and the review cases ${reviewTools.length}.`,
  );
} finally {
  if (sessionId) {
    await fetch(endpoint, {
      method: "DELETE",
      headers: { "mcp-session-id": sessionId },
      signal: AbortSignal.timeout(20_000),
    }).catch(() => {});
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✘ ${failure}`);
  process.exit(1);
}
console.log(
  "✔ Every tool the skill and review cases name is live and annotated, and so is opencloud-skill.",
);
