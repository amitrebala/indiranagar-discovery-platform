# Vercel Auto-Fix System with BMAD Methodology

A comprehensive automated system for monitoring and fixing Vercel deployment failures using Claude Code and the BMAD-METHOD framework for systematic, story-driven development.

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   ./setup-vercel-auto-fix.sh
   ```

2. **Test the system:**
   ```bash
   ./test-auto-fix.sh
   ```

3. **Start monitoring (optional):**
   ```bash
   ./start-monitoring.sh &
   ```

## 📋 Overview

This system provides multiple ways to automatically detect and fix Vercel deployment failures using the **BMAD-METHOD** (Behavior-driven, Multi-agent, Agentic Development) framework:

- **Manual trigger** - Run BMAD development agent fixes on demand
- **Continuous monitoring** - Check deployments every 5 minutes with BMAD recovery  
- **Webhook receiver** - React instantly to deployment failures with BMAD agents
- **GitHub Actions** - Automated BMAD-driven fixes in CI/CD pipeline

### 🎯 BMAD Methodology Integration

The system uses the BMAD-METHOD framework for:
- **Story-Driven Development**: Each fix attempt creates a comprehensive development story
- **Systematic Error Resolution**: Structured approach to deployment recovery
- **Iterative Fix-Deploy-Verify**: Continuous improvement cycles until success
- **Agent-Based Architecture**: Specialized development agents for different scenarios
- **Context-Engineered Solutions**: Rich context preservation between fix attempts

## 🛠 Components

### Core Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `vercel-auto-fix.sh` | Main BMAD auto-fix engine | `./vercel-auto-fix.sh <project-id>` |
| `bmad-dev-agent.sh` | BMAD development agent | `./bmad-dev-agent.sh execute <error_info> <deployment_id> <attempt>` |
| `monitor-vercel.sh` | Continuous monitoring daemon | `./monitor-vercel.sh start <project-id>` |
| `webhook-receiver.sh` | HTTP webhook endpoint | `./webhook-receiver.sh start` |
| `setup-vercel-auto-fix.sh` | Complete system setup | `./setup-vercel-auto-fix.sh` |

### Helper Scripts (Auto-generated)

| Script | Purpose |
|--------|---------|
| `test-auto-fix.sh` | Quick system test |
| `start-monitoring.sh` | Start monitoring with saved config |
| `start-webhook.sh` | Start webhook with saved config |

### GitHub Actions with BMAD Integration

- **Workflow**: `.github/workflows/vercel-auto-fix.yml`
- **Triggers**: Every 10 minutes, manual dispatch, repository events
- **Features**: BMAD development agent activation, story-driven fixes, systematic recovery
- **Agent Role**: Developer agent specialized in emergency deployment recovery
- **Methodology**: Complete BMAD workflow with comprehensive error analysis

## 🔧 Configuration

### Prerequisites

- **Required**: `jq`, `curl`, `netcat`
- **Required**: Vercel API token
- **Required**: Claude Code installed
- **Optional**: GitHub repository for Actions

### Environment Variables

```bash
# Required
VERCEL_TOKEN="your_vercel_api_token"

# BMAD Configuration
MAX_FIX_ATTEMPTS=10             # Max fix attempts (default: 10 for BMAD)
BMAD_ENABLED=1                  # Enable BMAD methodology (default: 1)
STORY_DIR=".bmad-stories"       # Directory for BMAD development stories

# Optional
CLAUDE_CODE_PATH="claude-code"  # Path to Claude Code binary
DEBUG=1                         # Enable debug logging
CHECK_INTERVAL=300              # Monitoring interval in seconds
WEBHOOK_PORT=3001               # Webhook receiver port
BMAD_AGENT_MODE="developer"     # BMAD agent mode
```

### Setup Process

1. **Get Vercel API Token:**
   - Visit: https://vercel.com/account/tokens
   - Create token with appropriate permissions

2. **Find Project ID:**
   ```bash
   # Option 1: Vercel CLI
   vercel ls
   
   # Option 2: API call
   curl -H "Authorization: Bearer $VERCEL_TOKEN" \
        https://api.vercel.com/v9/projects
   ```

3. **Run Setup:**
   ```bash
   ./setup-vercel-auto-fix.sh
   ```

## 📖 Usage Patterns

### 1. One-Time Fix (Reactive)

```bash
# Basic usage
./vercel-auto-fix.sh your-project-id

# With team ID
./vercel-auto-fix.sh your-project-id your-team-id

# Using test script
./test-auto-fix.sh
```

### 2. Continuous Monitoring (Proactive)

```bash
# Start monitoring daemon
./start-monitoring.sh &

# Check status
./monitor-vercel.sh status

# View logs
tail -f monitor-vercel.log

# Stop monitoring
./monitor-vercel.sh stop
```

### 3. Webhook Integration (Real-time)

```bash
# Start webhook receiver
./start-webhook.sh &

# Check status
./webhook-receiver.sh status

# Test webhook
./webhook-receiver.sh test ERROR deploy_123 prj_456

# Stop webhook receiver
./webhook-receiver.sh stop
```

**Vercel Webhook Setup:**
1. Go to Vercel Dashboard → Project Settings → Git
2. Add webhook URL: `http://your-server:3001/webhook`
3. Select "Deployment" events

### 4. GitHub Actions (Automated)

The system automatically:
- Runs every 10 minutes
- Checks latest deployment status
- Extracts error logs if deployment failed
- Runs Claude Code to analyze and fix issues
- Commits and pushes fixes
- Waits for new deployment to complete

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_PROJECT_ID` - Your project ID
- `VERCEL_TEAM_ID` - Your team ID (optional)

## 🔍 How It Works - BMAD Methodology

### 1. Error Detection & Analysis

1. **Fetch latest deployment** from Vercel API
2. **Check deployment state** - look for ERROR status
3. **Extract comprehensive error logs** from deployment events
4. **Classify error patterns** using BMAD analysis:
   - 🔴 **CRITICAL**: TypeScript compilation errors, missing dependencies
   - 🟡 **HIGH**: Import/export failures, module resolution issues
   - 🟢 **MEDIUM**: Linting violations, code quality issues

### 2. BMAD Story Creation

1. **Generate development story** with complete context
2. **Include technical specifications** and error analysis
3. **Define systematic recovery procedures**
4. **Set acceptance criteria** and success metrics
5. **Provide step-by-step implementation guidance**

### 3. BMAD Development Agent Execution

1. **Activate specialized agent** (Developer role)
2. **Execute story-driven development** workflow
3. **Apply systematic error resolution**:
   - Phase 1: Analysis & Planning (5 min max)
   - Phase 2: Implementation (targeted fixes)
   - Phase 3: Quality Assurance & Commit
4. **Verify each fix** with comprehensive testing

### 4. Iterative Fix-Deploy-Verify Cycle

1. **Deploy fixed code** via git push
2. **Monitor deployment progress** with detailed tracking
3. **Analyze new deployment state**:
   - ✅ **SUCCESS**: Mission complete
   - ❌ **FAILURE**: Extract new errors, create new story, iterate
4. **Continue cycle** up to 10 attempts with learning between iterations

### 5. Context Preservation & Learning

- **Story files** preserve complete context between attempts
- **Error patterns** are analyzed and categorized
- **Previous fixes** inform subsequent iterations
- **Success patterns** optimize future recovery efforts

### Error Analysis

The system focuses on these common Vercel deployment issues:

- **TypeScript Errors**: Type mismatches, missing imports
- **Build Failures**: Configuration problems, dependency issues  
- **Module Errors**: Import/export statement problems
- **Syntax Errors**: Code parsing failures
- **Environment Issues**: Missing variables or configuration

## 📊 Monitoring & Logs - BMAD Enhanced

### Log Files

- `monitor-vercel.log` - Monitoring daemon logs with BMAD context
- `webhook-receiver.log` - Webhook receiver logs
- `.bmad-stories/` - BMAD development story files
- Individual script output to stdout/stderr with BMAD annotations

### BMAD Story Management

```bash
# View BMAD stories for a deployment
./bmad-dev-agent.sh summary <deployment_id>

# Clean up BMAD stories
./bmad-dev-agent.sh cleanup <deployment_id>

# Verify BMAD fixes
./bmad-dev-agent.sh verify
```

### Status Commands

```bash
# System overview with BMAD status
./setup-vercel-auto-fix.sh status

# Individual service status
./monitor-vercel.sh status
./webhook-receiver.sh status

# View recent activity and BMAD stories
./monitor-vercel.sh stats
ls -la .bmad-stories/
tail -f *.log
```

### Statistics Tracking

The monitoring system tracks:
- Total checks performed
- BMAD fix attempts made
- Successful BMAD recoveries
- Success rate percentage
- BMAD story generation count
- Iterative fix cycles completed
- Runtime statistics

## 🔧 Troubleshooting

### Common Issues

1. **"Claude Code not found"**
   - Install Claude Code: https://docs.anthropic.com/en/docs/claude-code
   - Set `CLAUDE_CODE_PATH` environment variable

2. **"Unauthorized" API responses**
   - Check `VERCEL_TOKEN` permissions
   - Verify token hasn't expired

3. **"No error logs found"**
   - Some failures don't produce accessible logs
   - May be infrastructure issues rather than code problems

4. **Rate limiting**
   - Vercel API: 100 requests/hour on free tier
   - Add delays between API calls if needed

### Debug Mode

Enable verbose output:
```bash
export DEBUG=1
./vercel-auto-fix.sh your-project-id
```

### Manual Intervention

If auto-fix fails repeatedly:
1. Check the extracted error logs
2. Review the Claude Code prompts used
3. Manually analyze the deployment failure
4. Consider infrastructure or configuration issues

## 💰 Cost Considerations

- **Vercel API**: 100 requests/hour on free tier
- **Claude Code**: Usage-based pricing per session
- **GitHub Actions**: 2000 minutes/month on free tier

Monitor usage and adjust polling frequency accordingly.

## 🔒 Security

- Store API tokens securely in environment variables
- Use GitHub Secrets for CI/CD tokens
- Webhook receiver includes basic validation
- All commits are properly attributed

## 🛡 Limitations

- Only fixes code-related deployment failures
- Cannot resolve infrastructure or service issues
- Limited by Claude Code's analysis capabilities
- Requires proper error logs from Vercel API
- May not handle complex multi-step fixes

## 📚 Advanced Configuration

### Custom Fix Prompts

Modify the prompt generation in `vercel-auto-fix.sh`:

```bash
create_fix_prompt() {
    local error_info="$1"
    local deployment_id="$2"
    
    cat << EOF
Your custom prompt here...
$error_info
EOF
}
```

### Integration with Other Tools

The scripts can be integrated with:
- Slack notifications
- Discord webhooks  
- Email alerts
- Custom monitoring systems
- CI/CD pipelines

### Webhook Customization

The webhook receiver supports:
- Custom port configuration
- Project filtering
- Team-specific handling
- Custom response formats

## 🤝 Contributing

The system is designed to be extensible:

1. **Add new error types** to parsing logic
2. **Enhance fix prompts** for better Claude Code results
3. **Integrate additional APIs** for broader monitoring
4. **Extend webhook functionality** for more triggers

## 📄 License

This system is provided as-is for educational and development purposes. Modify and distribute freely according to your needs.