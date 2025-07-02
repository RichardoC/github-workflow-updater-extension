# GitHub Workflow Updater

A VS Code extension that automatically pins GitHub Actions to specific commits for enhanced security.

> **⚠️ Experimental Project**: This extension is entirely experimental and was written by Claude Code. Use at your own discretion.

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

## Development



### Building the Extension

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Compile TypeScript**:
   ```bash
   npm run compile
   ```
   
   Or watch for changes during development:
   ```bash
   npm run watch
   ```

### Testing the Extension

1. **Open in your editor**: Open this project folder in VS Code or Cursor

2. **Launch Extension Development Host**:
   - Press `F5` or use the "Run and Debug" panel
   - Select "Run Extension" configuration
   - This opens a new window with the extension loaded (VS Code window if using VS Code, Cursor window if using Cursor)

3. **Test the functionality**:
   - In the Extension Development Host window, open a GitHub workflow file (`.yml` or `.yaml`)
   - Click the sync button in the editor toolbar
   - The extension should update actions to pinned versions

4. **Refresh the Extension Development Host**:
   After making code changes, you need to refresh the Extension Development Host:
   - **Method 1**: Use Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
     - Type "Developer: Reload Window" and select it
   - **Method 2**: Close and reopen the Extension Development Host window (press `F5` again)
   - **Method 3**: Use the restart button in the Debug toolbar
   - **Note**: In Cursor on macOS, the Extension Development Host works the same as VS Code

### Running Tests

```bash
npm test
```

### Packaging for Distribution

```bash
npm install -g vsce
vsce package
```

This creates a `.vsix` file that can be installed in VS Code or Cursor.

## Installation

### From VS Code Marketplace
*This extension is not yet published to the marketplace.*

### Manual Installation

1. **Download or build the extension**:
   - Either download a `.vsix` file from releases
   - Or build it yourself following the Development section above

2. **Install the `.vsix` file**:
   - Open VS Code or Cursor
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Extensions: Install from VSIX..."
   - Select the `.vsix` file
   - Restart your editor

3. **Configure GitHub token** (optional but recommended):
   - Go to Settings (Code → Preferences → Settings)
   - Search for "GitHub Workflow Updater"
   - Set your GitHub Personal Access Token