#!/usr/bin/env node
/*
 * 8x assignment — agent capture.
 *
 * Command Code exposes no "prompt submitted" hook event. Its four lifecycle
 * events are PreToolUse, PostToolUse, Stop and SessionStart, and every one of
 * them receives `transcript_path` on stdin. So the turn is captured at `Stop`
 * (end of turn) by reading the session transcript, which stores the user's
 * message verbatim next to the assistant's reply.
 *
 * Writes one file per session to .agent-logs/, named
 *   YYYY-MM-DD_HH-MM-SS_<session-id>.md
 *
 * Hook mode   : payload on stdin (Stop / SessionStart). Never blocks: always
 *               exits 0 and prints nothing, so the turn is unaffected.
 * Backfill    : `node capture-turn.mjs --backfill <transcript.jsonl>` extracts a
 *               whole session that ran before the hook was installed, using the
 *               exact same extraction path.
 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const PROJECT_NAME = "8x-assignment";
const TOOL_NAME = "command-code";
const LOG_DIR_NAME = ".agent-logs";

/* ------------------------------------------------------------------ utils */

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function author(cwd) {
  if (process.env.AGENT_LOG_AUTHOR) return process.env.AGENT_LOG_AUTHOR;
  try {
    return (
      execFileSync("git", ["config", "user.name"], { cwd, encoding: "utf8" }).trim() ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

function fileStamp(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "1970-01-01_00-00-00";
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}` +
    `_${p(d.getUTCHours())}-${p(d.getUTCMinutes())}-${p(d.getUTCSeconds())}`
  );
}

function shortId(id) {
  return String(id).slice(0, 8);
}

function noteError(projectDir, error) {
  // Never let a capture failure break or noisy-up the session it is recording.
  try {
    const dir = join(projectDir, LOG_DIR_NAME);
    mkdirSync(dir, { recursive: true });
    const line = `${new Date().toISOString()}\t${error?.stack || error}\n`;
    writeFileSync(join(dir, ".capture-errors.log"), line, { flag: "a" });
  } catch {
    /* nothing left to do */
  }
}

/* ------------------------------------------------------- transcript parse */

function parseTranscript(path) {
  const raw = readFileSync(path, "utf8");
  let header = null;
  const entries = [];

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue; // transcripts are append-only; a torn line is skipped, not fatal
    }
    if (obj.type === "session") header = obj;
    else if (obj.type === "message" && obj.message) entries.push(obj);
  }

  return { header, entries };
}

function textOf(entry) {
  const content = entry?.message?.content;
  if (!Array.isArray(content)) return null;
  const parts = content
    .filter((b) => b && b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .filter((t) => t.trim() !== "");
  return parts.length ? parts.join("\n\n") : null;
}

/*
 * A turn opens on every user entry that carries real text. Tool results also
 * arrive as role=user, but they hold only tool_result blocks, so they are
 * skipped and stay part of the turn that is already open.
 */
function buildTurns(entries, sessionModel) {
  const turns = [];
  let current = null;

  for (const entry of entries) {
    const role = entry?.message?.role;
    if (role === "user") {
      const prompt = textOf(entry);
      if (prompt) {
        current = { prompt, promptTs: entry.timestamp, assistant: [] };
        turns.push(current);
      }
    } else if (role === "assistant" && current) {
      current.assistant.push(entry);
    }
  }

  return turns.map((turn, index) => {
    const withText = turn.assistant.filter((a) => textOf(a));
    const final = withText[withText.length - 1];
    const lastAny = turn.assistant[turn.assistant.length - 1];

    let response = "";
    let responseTs = turn.promptTs;

    if (final) {
      response = textOf(final);
      responseTs = final.timestamp;
    } else {
      // Turn ended on tool use with no closing prose — keep whatever text exists.
      response = turn.assistant.map((a) => textOf(a)).filter(Boolean).join("\n\n");
      if (lastAny) responseTs = lastAny.timestamp;
    }

    return {
      num: index + 1,
      prompt: turn.prompt,
      promptTs: turn.promptTs,
      response,
      responseTs,
      model: (lastAny?.model || final?.model || sessionModel || "unknown").trim(),
    };
  });
}

/* ------------------------------------------------------------ log writing */

function splitFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { frontmatter: null, body: text };
  return { frontmatter: match[1], body: text.slice(match[0].length) };
}

/*
 * This is only the fallback for a fresh checkout: the sidecar counter is
 * gitignored while the logs are committed. It cannot be a plain marker match.
 * A captured response can quote a log entry verbatim, including at column 0
 * inside a fenced block, and one such quote inflates the count — after which
 * every real turn past that index is sliced away. Entries we write are
 * numbered from 1 with no gaps and name their session, so only a contiguous
 * run of headers for THIS session counts.
 */
function countLogged(body, sessionShortId) {
  const header = new RegExp(
    `^\\[LOG_ENTRY type=PROMPT num=(\\d+) session=${sessionShortId}\\]$`,
    "gm",
  );
  let expected = 1;
  for (const match of body.matchAll(header)) {
    if (Number(match[1]) !== expected) break;
    expected += 1;
  }
  return expected - 1;
}

function readStateFile(statePath) {
  if (!existsSync(statePath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readState(statePath, sessionId) {
  const logged = readStateFile(statePath)?.[sessionId]?.logged;
  return Number.isFinite(logged) ? logged : null;
}

function renderEntry(turn) {
  const s = shortId(turn.sessionId);
  return (
    `[LOG_ENTRY type=PROMPT num=${turn.num} session=${s}]\n` +
    `timestamp: ${turn.promptTs}\n` +
    `model: ${turn.model}\n\n` +
    `${turn.prompt}\n\n\n` +
    `[LOG_ENTRY type=RESPONSE num=${turn.num} session=${s}]\n` +
    `timestamp: ${turn.responseTs}\n` +
    `model: ${turn.model}\n\n` +
    `${turn.response || "(no assistant text in this turn)"}\n\n\n`
  );
}

function writeSessionLog({ projectDir, session, turns, cwd }) {
  const logDir = join(projectDir, LOG_DIR_NAME);
  mkdirSync(logDir, { recursive: true });

  const sessionId = session.id;
  const date = (session.timestamp || new Date().toISOString()).slice(0, 10);
  const path = join(logDir, `${fileStamp(session.timestamp)}_${sessionId}.md`);

  const statePath = join(logDir, ".capture-state.json");
  const previous = existsSync(path)
    ? splitFrontmatter(readFileSync(path, "utf8")).body
    : `# Session Log - ${date}\n\n` +
      `Session: \`${shortId(sessionId)}\` | Project: \`${PROJECT_NAME}\` | Author: \`${author(cwd)}\`\n\n` +
      `---\n\n`;

  // The sidecar counter is authoritative when present; the in-file marker count
  // is the fallback for a fresh checkout, where the sidecar is not committed.
  const alreadyLogged =
    readState(statePath, sessionId) ?? countLogged(previous, shortId(sessionId));
  const pending = turns.slice(Math.max(alreadyLogged, 0));

  let body = previous;
  for (const turn of pending) {
    body += renderEntry({ ...turn, sessionId });
  }

  // Deliberately not recounted from `body`: a response that quotes a log entry
  // inflates a body recount and the following turn is then sliced away. What
  // has been written is the known count plus this run's appends.
  const total = Math.max(alreadyLogged, 0) + pending.length;
  const model = turns.find((t) => t.model)?.model || "unknown";
  const first = turns[0]?.promptTs || session.timestamp;
  const last = turns[turns.length - 1]?.promptTs || session.timestamp;

  const frontmatter = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `author: ${author(cwd)}`,
    `model: ${model}`,
    `tool: ${TOOL_NAME}`,
    `project: ${PROJECT_NAME}`,
    `total_exchanges: ${total}`,
    `first_prompt_time: ${first}`,
    `last_prompt_time: ${last}`,
    "---",
    "",
  ].join("\n");

  const tmp = `${path}.tmp`;
  writeFileSync(tmp, frontmatter + body);
  renameSync(tmp, path); // atomic: never leave a half-written log

  const state = readStateFile(statePath);
  state[sessionId] = { logged: total, path };
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);

  return { path, appended: pending.length, total };
}

/* --------------------------------------------------------------- commands */

function runBackfill(transcriptPath) {
  const projectDir = process.env.COMMANDCODE_PROJECT_DIR || process.cwd();
  const { header, entries } = parseTranscript(transcriptPath);
  if (!header) throw new Error(`no session header in ${transcriptPath}`);

  const turns = buildTurns(entries, null);
  const result = writeSessionLog({
    projectDir,
    session: header,
    turns,
    cwd: header.cwd || projectDir,
  });
  process.stderr.write(
    `backfilled ${result.appended}/${result.total} turns -> ${result.path}\n`,
  );
}

function runHook(payload) {
  const projectDir =
    process.env.COMMANDCODE_PROJECT_DIR || payload.cwd || process.cwd();
  const transcriptPath = payload.transcript_path;

  // SessionStart can fire before the transcript exists. Initialise the file so
  // the session is visible immediately; turns land at each Stop.
  if (!transcriptPath || !existsSync(transcriptPath)) {
    const session = {
      id: payload.session_id || "unknown",
      timestamp: new Date().toISOString(),
    };
    writeSessionLog({ projectDir, session, turns: [], cwd: payload.cwd || projectDir });
    return;
  }

  const { header, entries } = parseTranscript(transcriptPath);
  const session = header || {
    id: payload.session_id || "unknown",
    timestamp: new Date().toISOString(),
  };

  const turns = buildTurns(entries, null);
  writeSessionLog({ projectDir, session, turns, cwd: payload.cwd || projectDir });
}

function main() {
  const argv = process.argv.slice(2);
  const backfillIndex = argv.indexOf("--backfill");

  if (backfillIndex !== -1) {
    runBackfill(argv[backfillIndex + 1]);
    return;
  }

  const raw = readStdin();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (error) {
    noteError(process.cwd(), `unparseable hook payload: ${error.message}`);
    return;
  }

  runHook(payload);
}

try {
  main();
} catch (error) {
  noteError(process.env.COMMANDCODE_PROJECT_DIR || process.cwd(), error);
}
process.exit(0); // a capture failure must never affect the turn
