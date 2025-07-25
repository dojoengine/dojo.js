# Release Process with Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versions and releases across multiple packages, with support for different versioning strategies on different branches.

## Overview

- **Main branch**: Stable releases (1.5.0, 1.6.0, etc.)
- **Release branches** (`release/*`): Patch releases and release candidates
- **Feature branches**: Prerelease versions for testing

## Creating Changesets

When you make changes that should be included in a release:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the version bump type (major, minor, patch)
3. Write a summary for the changelog

## Release Workflow

### Automatic Branch Detection

The release workflow automatically detects your branch and applies the appropriate versioning strategy:

- On `main`: Standard releases
- On `release/*`: Prereleases with RC tags (e.g., 1.6.0-rc.0)
- On other branches: Prereleases with branch name tags

### Manual Release Process

1. **Trigger the Release Workflow**
   - Go to Actions → "Publish packages and create tags"
   - Click "Run workflow"
   - Select options:
     - `release_type`: Choose "auto" for automatic detection or specify manually
     - `prerelease_tag`: Custom tag for prereleases (default: "rc")
     - `dry_run`: Test the release without publishing

2. **What Happens**
   - Changesets are consumed and versions are bumped
   - For non-main branches: Enters prerelease mode automatically
   - Commits version changes
   - Publishes to npm
   - Creates git tags
   - Triggers GitHub releases

### Release Types

- **auto**: Automatically determines strategy based on branch
- **prerelease**: Force prerelease mode with custom tag
- **patch/minor/major**: Force specific version bump

## Branch Strategies

### Main Branch
Standard releases following semver:
```
1.5.0 → 1.6.0 (minor)
1.6.0 → 1.6.1 (patch)
1.6.1 → 2.0.0 (major)
```

### Release Branches
For maintenance and release candidates:
```
release/1.6 → 1.6.0-rc.0 → 1.6.0-rc.1 → 1.6.0
release/1.5 → 1.5.1, 1.5.2 (patches only)
```

### Feature Branches
For testing features before merge:
```
feat/new-api → 1.7.0-feat-new-api.0
fix/bug-123 → 1.6.1-fix-bug-123.0
```

## Local Commands

```bash
# Create a changeset
pnpm changeset

# Version packages locally (consumes changesets)
pnpm version

# Publish to npm (after versioning)
pnpm release

# Dry run to see what would be published
pnpm release:dry-run
```

## Best Practices

1. **Always create changesets** for changes that affect the public API
2. **Use conventional commit messages** for better tracking
3. **Test prereleases** on feature/release branches before merging
4. **Don't commit version changes manually** - let the workflow handle it
5. **Review changeset summaries** - they become your changelog

## Troubleshooting

### No packages to release
- Ensure you have uncommitted changesets in `.changeset/`
- Check that packages aren't ignored in `.changeset/config.json`

### Prerelease versions not working
- Verify you're not on the main branch
- Check if `.changeset/pre.json` exists (indicates prerelease mode)

### Version conflicts
- Don't manually edit package.json versions
- Let changesets handle all version bumps
- If needed, delete `.changeset/pre.json` and start fresh