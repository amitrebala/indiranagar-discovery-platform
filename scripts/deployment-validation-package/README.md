# Vercel Deployment Validation Package with BMAD Integration

This package provides automated pre-commit Vercel deployment validation with BMAD Development Agent integration to prevent failed deployments and eliminate ALL manual error-fixing cycles.

## Features

- 🚀 **Pre-commit Validation**: Validates Vercel deployment locally before commits
- 🤖 **BMAD Development Agent**: Automatically fixes ALL deployment errors
- 🔧 **Intelligent Error Resolution**: BMAD agent systematically resolves issues
- 🎯 **Git Hook Integration**: Automatic validation on every commit
- 📊 **100% Automated**: Zero manual intervention required
- 🔄 **Cross-Project Portable**: Works with any Vercel project
- ✨ **Story-Driven Fixes**: BMAD methodology ensures comprehensive solutions

## Quick Start

1. Copy this entire directory to your project's `scripts/` folder
2. Run the installation script:
   ```bash
   ./scripts/deployment-validation-package/install.sh
   ```

3. Use the safe commit command:
   ```bash
   ./scripts/safe-commit.sh "feat: your commit message"
   ```

## What Gets Installed

- **Pre-deployment validation script** (`vercel-pre-deploy.sh`)
- **Safe commit wrapper** (`safe-commit.sh`)
- **Claude integration script** (`claude-deploy-commit.sh`)
- **Git hooks** (pre-commit validation)
- **CLAUDE.md updates** (deployment standards)

## Commands

### Basic Validation
```bash
# Validate only (no commit)
./scripts/vercel-pre-deploy.sh

# Validate with verbose output
./scripts/vercel-pre-deploy.sh --verbose
```

### Safe Commits
```bash
# Standard safe commit
./scripts/safe-commit.sh "feat: add feature"

# Stage all changes and commit
./scripts/safe-commit.sh -a "fix: bug fix"

# Skip push after commit
./scripts/safe-commit.sh -n "wip: work in progress"

# Force commit without validation (emergency only)
./scripts/safe-commit.sh -f "hotfix: urgent fix"
```

### Claude Integration
```bash
# Commit with Claude Code auto-fix
./scripts/claude-deploy-commit.sh "fix: deployment issues"
```

## How It Works

1. **Local Build Simulation**: Runs `vercel build` locally with production settings
2. **Error Detection**: Captures and categorizes all build errors
3. **BMAD Agent Activation**: When errors found, automatically invokes BMAD Development Agent
4. **Systematic Error Resolution**: BMAD agent fixes ALL issues:
   - TypeScript compilation errors
   - Type definition problems
   - Module resolution failures
   - Import/export mismatches
   - Missing dependencies
   - Syntax errors
   - Build configuration issues
5. **Validation Loop**: Re-validates after each fix cycle
6. **Safe Commit**: Only commits when build passes 100%

## BMAD Development Agent Integration

The package includes full BMAD-METHOD integration:
- Automatic `/dev` command invocation on errors
- Story-driven development approach to fixes
- Systematic error categorization and resolution
- Comprehensive validation before proceeding
- No manual intervention required

## Error Handling

Errors are categorized and logged:
- `.vercel-errors.log` - Parsed error list
- `.vercel-build-output.log` - Full build output
- `.vercel-fixes.log` - Applied fixes

## Requirements

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Git
- Active Vercel project (run `vercel link` if needed)

## Troubleshooting

### Build keeps failing
1. Check `.vercel-build-output.log` for detailed errors
2. Ensure all environment variables are set
3. Try manual validation: `vercel build --prod`

### Git hooks not working
1. Reinstall hooks: `./scripts/install-deployment-hooks.sh`
2. Check hook permissions: `ls -la .git/hooks/`
3. Ensure hooks are executable

### Vercel CLI issues
1. Update Vercel CLI: `npm i -g vercel@latest`
2. Re-link project: `vercel link`
3. Check authentication: `vercel whoami`

## Customization

Edit `vercel-pre-deploy.sh` to customize:
- `MAX_FIX_ATTEMPTS` - Number of auto-fix attempts (default: 3)
- Error detection patterns
- Fix strategies
- Build commands

## Benefits

- ✅ No more failed Vercel deployments
- ✅ No manual log checking
- ✅ Faster development cycles
- ✅ Consistent deployment quality
- ✅ Team-wide deployment standards

## Support

This package is maintained as part of the BMAD-METHOD deployment standards.
For issues or improvements, update the scripts and share across projects.