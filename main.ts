// turning-off-01: one funny line from a hopeless tech-support agent.
// Writes exactly one line (no trailing newline) to /output/entry.txt.
// Node stdlib only, no network, no randomness, no Date/time — fully deterministic.

import * as fs from "node:fs";
import * as path from "node:path";

// The winning line (candidate #4, 128 characters): the reboot "worked",
// but the machine now just blinks — and the agent sides with the machine.
const LINE =
  "I turned it off and on again, and now it just blinks at me — honestly, I respect it, that's exactly what I'd do in its position.";

const OUT_DIR = "/output";
const OUT_FILE = path.join(OUT_DIR, "entry.txt");

function main(): void {
  // Validate: 1–199 chars, a single line, no control characters.
  if (LINE.length < 1 || LINE.length > 199) {
    throw new Error(`line length ${LINE.length} is outside 1–199`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("line must be a single line");
  }
  for (const ch of LINE) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("line contains a control character");
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // Write exactly the line bytes — no trailing newline.
  fs.writeFileSync(OUT_FILE, LINE, "utf8");

  // Post-write verification: read the bytes back and confirm they are
  // byte-identical to the line (catches encoding or newline accidents).
  const written = fs.readFileSync(OUT_FILE, "utf8");
  if (written !== LINE) {
    throw new Error("written file does not match the line exactly");
  }
  if (Buffer.byteLength(written, "utf8") === 0) {
    throw new Error("written file is empty");
  }
}

main();
