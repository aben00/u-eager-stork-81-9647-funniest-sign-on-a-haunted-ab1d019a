// Funniest Sign on a Haunted Server Room Door
// Writes the single chosen sign line to /output/entry.txt and self-checks
// the competition gate: 1-120 characters, one line, not only whitespace.
// Node 22, stdlib only. Deterministic: same bytes on every run.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const ENTRY =
  "The ghost in Rack 7 has been on call since 2003. He answers the pager before you do. Let him.";

function main(): void {
  // Gate self-check before writing. The gate counts characters, so count
  // Unicode code points (not UTF-16 code units) to match the scorer's
  // UTF-8 text reading.
  const charCount = [...ENTRY].length;
  if (charCount < 1 || charCount > 120) {
    throw new Error(`gate fail: entry is ${charCount} chars, must be 1-120`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("gate fail: entry is only whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("gate fail: entry must be a single line");
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", ENTRY, "utf8");

  // Verify what was actually written.
  const written = readFileSync("/output/entry.txt", "utf8");
  if (written !== ENTRY) {
    throw new Error("verification fail: written bytes differ from ENTRY");
  }
  if (written.length !== ENTRY.length) {
    throw new Error("verification fail: written length differs");
  }
  if ([...written].length !== charCount) {
    throw new Error("verification fail: written char count differs");
  }
  console.log(`wrote /output/entry.txt (${written.length} chars): ${written}`);
}

main();
