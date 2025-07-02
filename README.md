# GitHub Workflow Updater

A VS Code extension that automatically pins GitHub Actions to specific commits for enhanced security.

## Features

- **Automatic Pinning**: Updates GitHub Actions to use commit hashes instead of version tags
- **Latest Version Detection**: Finds the highest semantic version and pins to its commit
- **Private Repository Support**: Configure GitHub token for private repositories
- **Skip Pinning**: Use `# skip-pinning` comment to exclude specific actions
- **Comprehensive Updates**: Updates entire workflow file at once
- **Error Handling**: Continues processing other actions if one fails

## Usage

1. Open a GitHub workflow file (`.yml` or `.yaml`)
2. Click the sync button in the editor toolbar
3. The extension will update all actions to their latest pinned versions

## Configuration

Set your GitHub Personal Access Token in VS Code settings:

```
GitHub Workflow Updater: Github Token
```

This token is required for accessing private repositories and helps avoid rate limits.

## Skip Pinning

To prevent an action from being updated, add a `# skip-pinning` comment:

```yaml
- uses: actions/checkout@main # skip-pinning
```

## Example

**Before:**
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v3.5.1
```

**After:**
```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # tag v4.2.2
- uses: actions/setup-node@8f152de45cc393bb48ce5d89d36b731f54556e65 # tag v4.0.0
```

## Requirements

- VS Code 1.74.0 or higher
- Internet connection for GitHub API access

## Security

This extension enhances security by:
- Pinning actions to specific commits prevents supply chain attacks
- Immutable references ensure consistent behavior
- Following security best practices from StepSecurity

## Installation

1. Install dependencies: `npm install`
2. Compile: `npm run compile`
3. Press F5 to run in Extension Development Host