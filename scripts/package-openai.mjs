// Builds the ZIP for the OpenAI plugin directory (ChatGPT and Codex) from
// plugins/opencloud. The archive root is the plugin root, without the Claude
// manifest. Entries are sorted and carry a fixed timestamp, so the same
// sources always give the same bytes.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

import {
  openAiListingProblems,
  openAiPackageFiles,
  pluginRoot,
  readJson,
  repositoryRoot,
} from "./plugin-files.mjs";

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const DOS_TIME = 0; // 00:00:00
const DOS_DATE = (0 << 9) | (1 << 5) | 1; // 1980-01-01
const UTF8_NAMES = 0x0800;
const DEFLATE = 8;

function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const compressed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(UTF8_NAMES, 6);
    local.writeUInt16LE(DEFLATE, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBytes, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(0x0314, 4); // made by Unix, ZIP 2.0
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(UTF8_NAMES, 8);
    central.writeUInt16LE(DEFLATE, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);

    offset += local.length + nameBytes.length + compressed.length;
  }

  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

const manifest = await readJson("plugins/opencloud/.codex-plugin/plugin.json");
const problems = await openAiListingProblems(manifest);
if (problems.length > 0) {
  for (const problem of problems) console.error(`✘ ${problem}`);
  process.exit(1);
}

const files = await openAiPackageFiles();
const entries = await Promise.all(
  files.map(async (name) => ({
    name,
    data: await readFile(path.join(pluginRoot, name)),
  })),
);
const archive = zip(entries);
const output = path.join(
  repositoryRoot,
  "dist",
  `opencloud-${manifest.version}-openai.zip`,
);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, archive);

for (const { name, data } of entries) console.log(`  ${name} (${data.length} bytes)`);
console.log(
  `✔ ${path.relative(repositoryRoot, output)}: ${entries.length} files, ${archive.length} bytes, sha256 ${createHash("sha256").update(archive).digest("hex")}`,
);
