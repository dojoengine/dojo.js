AGENTS: jj (Jujutsu) Workflow for this repo

Scope: Applies to the whole repository. Use jj as the primary VCS interface; interoperate with Git only when explicitly required.

**Principles**
- Prefer small, stacked changes with `jj new` and `jj describe`.
- Use one workspace per parallel task under `ws/<name>`.
- Keep workspaces lean with per-workspace sparse sets.
- Keep Git interop explicit: use `jj git fetch/push` only when requested.

**Workspaces**
- Create: `jj workspace add --name <name> [-r <rev>] [--sparse-patterns {copy|full|empty}] ws/<name>`
- List: `jj workspace list`
- Rename: `jj workspace rename <new-name>`
- Forget (before removing dir): `jj workspace forget <name>` then `rm -rf ws/<name>`
- Fix stale WC (after history edits elsewhere): `jj workspace update-stale`
- Convention: name workspaces `feat-...`, `bug-...`, `exp-...`. Base from `main` unless otherwise specified.
- Note: `/ws/` is ignored by `.gitignore` so nested workspaces don’t pollute the main workspace.

**Sparse Working Copies**
- Show current: `jj sparse list`
- Minimal set: `jj sparse set --clear --add <path> [--add <path> ...]`
- Add/remove paths: `jj sparse set --add <path> [--remove <path>]`
- Reset to full: `jj sparse reset`
- Edit interactively: `jj sparse edit` (one pattern per line)
- Patterns are prefix-based (not globs). Examples:
  - `--add packages/sdk` includes that subtree
  - `--add docs` includes docs
  - `--add README.md` includes a single file

**Daily Flow**
- Start a change: `jj new [-r <base>]` then edit
- Review: `jj status` and `jj diff` (or `jj diff -r @-..@`)
- Save description: `jj describe -m "<message>"`
- Log: `jj log` (multiple workspaces appear as `<workspace>@`)

**Git Interop**
- Fetch: `jj git fetch [<remote>]` (updates Git refs and imports into jj)
- Push: `jj git push -r <rev> [--allow-new]` (export to Git). Configure targets with `git.fetch` / `git.push` in config when needed.
- Private work stays in jj unless explicitly pushed.

**Recommended Config (optional, safe)**
Add to `.jj/repo/config.toml` or via `jj config set --repo`:

```toml
[aliases]
# Short logs relative to main
l = ["log", "-r", "(main..@):: | (main..@)-"]
# One-change diff
d = ["diff", "-r", "@-..@"]
# Push current change (allow creating a push bookmark)
pp = ["git", "push", "-r", "@", "--allow-new"]

[ui]
# Optional: make `jj` default to a reversed log
default-command = ["log", "--reversed"]
```

Per-user identity (set once):
- `jj config set --user user.name "Your Name"`
- `jj config set --user user.email "you@example.com"`

**Parallel Work Examples**
- Feature vs. fix:
  - `jj workspace add --name feat-x -r main ws/feat-x`
  - `jj workspace add --name bug-123 -r main ws/bug-123`
  - Narrow sparse in each workspace to what you actually touch.
- Ephemeral debug off an old rev:
  - `jj workspace add --name debug-<id> -r <rev> ws/debug-<id>`
  - Inspect, then: `jj workspace forget debug-<id> && rm -rf ws/debug-<id>`

**Troubleshooting**
- Large file snapshot warning (e.g., lockfiles):
  - Workspaces under `ws/` are ignored already; if you still need to raise the limit briefly: `jj --config snapshot.max-new-file-size=<bytes> st` or per-repo via config.
- Stale workspace after rebases: `jj workspace update-stale`
- Git locking/partial clone errors:
  - Ensure this repo is a full Git clone (jj doesn’t support Git partial clones).
  - Avoid running concurrent processes that hold `.git/packed-refs` or `.git/objects` locks.

**Conventions Recap**
- Workspaces live under `ws/` (ignored by Git).
- One `jj new` per task; keep changes small and focused.
- Use sparse to speed up monorepo workflows.
- Use `jj git push` only on request; otherwise keep work jj-local.

