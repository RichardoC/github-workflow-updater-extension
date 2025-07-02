import * as yaml from 'yaml';

export interface WorkflowAction {
    line: number;
    original: string;
    repository: string;
    fullPath: string;
    currentRef: string;
    currentComment: string;
    hasSkipPinning: boolean;
    indentation: string;
}

export interface UpdateResult {
    line: number;
    original: string;
    updated: string;
    repository: string;
    oldVersion: string;
    newVersion: string;
    newCommit: string;
}

export class WorkflowParser {
    private static readonly ACTION_REGEX = /^(\s*)(?:-\s+)?uses:\s+([^@\s]+)@([^\s#]+)(?:\s*#\s*(.*))?$/;
    private static readonly REUSABLE_WORKFLOW_REGEX = /^([^\/]+\/[^\/]+)\/\.github\/workflows\/.*$/;
    private static readonly SUB_ACTION_REGEX = /^([^\/]+\/[^\/]+)\/(.+)$/;
    private static readonly SKIP_PINNING_REGEX = /skip-pinning/i;

    static parseWorkflow(content: string): WorkflowAction[] {
        const lines = content.split('\n');
        const actions: WorkflowAction[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(this.ACTION_REGEX);
            
            if (match) {
                const [, indentation, fullPath, ref, comment = ''] = match;
                const hasSkipPinning = this.SKIP_PINNING_REGEX.test(comment);
                
                // Extract repository name for reusable workflows and sub-actions
                let repository = fullPath.trim();
                const reusableWorkflowMatch = fullPath.match(this.REUSABLE_WORKFLOW_REGEX);
                const subActionMatch = fullPath.match(this.SUB_ACTION_REGEX);
                
                if (reusableWorkflowMatch) {
                    // Reusable workflow: owner/repo/.github/workflows/workflow.yml -> owner/repo
                    repository = reusableWorkflowMatch[1];
                } else if (subActionMatch && !fullPath.includes('.github/workflows')) {
                    // Sub-action: owner/repo/sub-action -> owner/repo
                    repository = subActionMatch[1];
                }
                
                actions.push({
                    line: i,
                    original: line,
                    repository: repository,
                    fullPath: fullPath.trim(),
                    currentRef: ref.trim(),
                    currentComment: comment.trim(),
                    hasSkipPinning,
                    indentation: indentation
                });
            }
        }

        return actions;
    }

    static updateActionLine(
        action: WorkflowAction, 
        newVersion: string, 
        newCommit: string
    ): string {
        // Skip if has skip-pinning comment
        if (action.hasSkipPinning) {
            return action.original;
        }

        // Format: uses: repo@commit # tag version
        const standardizedComment = `tag ${newVersion}`;
        const isDashFormat = action.original.includes('- uses:');
        
        if (isDashFormat) {
            return `${action.indentation}- uses: ${action.fullPath}@${newCommit} # ${standardizedComment}`;
        } else {
            return `${action.indentation}uses: ${action.fullPath}@${newCommit} # ${standardizedComment}`;
        }
    }

    static applyUpdates(content: string, updates: UpdateResult[]): string {
        const lines = content.split('\n');
        
        // Sort updates by line number in descending order to avoid index shifting
        const sortedUpdates = updates.sort((a, b) => b.line - a.line);
        
        for (const update of sortedUpdates) {
            if (update.line < lines.length) {
                lines[update.line] = update.updated;
            }
        }
        
        return lines.join('\n');
    }

    static extractVersionFromComment(comment: string): string {
        // Try to extract version from comment like "tag v1.2.3" or "v1.2.3"
        const versionMatch = comment.match(/(?:tag\s+)?(v?\d+\.\d+\.\d+(?:[.-]\w+)*)/i);
        return versionMatch ? versionMatch[1] : '';
    }

    static normalizeVersion(version: string): string {
        // Normalize version for comparison by ensuring consistent v prefix
        if (!version) return '';
        return version.startsWith('v') ? version : `v${version}`;
    }

    static areVersionsEqual(version1: string, version2: string): boolean {
        return this.normalizeVersion(version1) === this.normalizeVersion(version2);
    }

    static isWorkflowFile(filePath: string): boolean {
        return /\.(yml|yaml)$/.test(filePath) && 
               (filePath.includes('.github/workflows/') || filePath.includes('workflows/'));
    }

    static validateWorkflowSyntax(content: string): { valid: boolean; error?: string } {
        try {
            const parsed = yaml.parse(content);
            
            // Basic validation - check if it has workflow structure
            if (!parsed || typeof parsed !== 'object') {
                return { valid: false, error: 'Invalid YAML structure' };
            }
            
            if (!parsed.jobs || typeof parsed.jobs !== 'object') {
                return { valid: false, error: 'No jobs found in workflow' };
            }
            
            return { valid: true };
        } catch (error) {
            return { valid: false, error: `YAML parse error: ${error}` };
        }
    }
}