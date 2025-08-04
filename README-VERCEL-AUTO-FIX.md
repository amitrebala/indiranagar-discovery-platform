# Vercel Auto-Fix System

A comprehensive automated system for monitoring and fixing Vercel deployment failures using Claude Code.

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

This system provides multiple ways to automatically detect and fix Vercel deployment failures:

- **Manual trigger** - Run fixes on demand
- **Continuous monitoring** - Check deployments every 5 minutes  
- **Webhook receiver** - React instantly to deployment failures
- **GitHub Actions** - Automated fixes in CI/CD pipeline

## 🛠 Components

### Core Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `vercel-auto-fix.sh` | Main auto-fix engine | `./vercel-auto-fix.sh <project-id>` |
| `monitor-vercel.sh` | Continuous monitoring daemon | `./monitor-vercel.sh start <project-id>` |
| `webhook-receiver.sh` | HTTP webhook endpoint | `./webhook-receiver.sh start` |
| `setup-vercel-auto-fix.sh` | Complete system setup | `./setup-vercel-auto-fix.sh` |

### Helper Scripts (Auto-generated)

| Script | Purpose |
|--------|---------|
| `test-auto-fix.sh` | Quick system test |
| `start-monitoring.sh` | Start monitoring with saved config |
| `start-webhook.sh` | Start webhook with saved config |

### GitHub Actions

- **Workflow**: `.github/workflows/vercel-auto-fix.yml`
- **Triggers**: Every 10 minutes, manual dispatch, repository events
- **Features**: Automatic error detection, Claude Code integration, commit fixes

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

# Optional
MAX_FIX_ATTEMPTS=3              # Max fix attempts (default: 3)
CLAUDE_CODE_PATH="claude-code"  # Path to Claude Code binary
DEBUG=1                         # Enable debug logging
CHECK_INTERVAL=300              # Monitoring interval in seconds
WEBHOOK_PORT=3001               # Webhook receiver port
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

## 🔍 How It Works

### Error Detection

1. **Fetch latest deployment** from Vercel API
2. **Check deployment state** - look for ERROR status
3. **Extract error logs** from deployment events
4. **Parse common error types**:
   - TypeScript type errors
   - Build configuration issues
   - Missing dependencies
   - Import/export problems
   - Syntax errors

### Fix Process

1. **Create detailed prompt** with error information
2. **Run Claude Code** with comprehensive fix instructions
3. **Validate fixes** with linting and type checking
4. **Commit changes** with descriptive messages
5. **Trigger new deployment** via git push
6. **Monitor results** until completion

### Error Analysis

The system focuses on these common Vercel deployment issues:

- **TypeScript Errors**: Type mismatches, missing imports
- **Build Failures**: Configuration problems, dependency issues  
- **Module Errors**: Import/export statement problems
- **Syntax Errors**: Code parsing failures
- **Environment Issues**: Missing variables or configuration

## 📊 Monitoring & Logs

### Log Files

- `monitor-vercel.log` - Monitoring daemon logs
- `webhook-receiver.log` - Webhook receiver logs
- Individual script output to stdout/stderr

### Status Commands

```bash
# System overview
./setup-vercel-auto-fix.sh status

# Individual service status
./monitor-vercel.sh status
./webhook-receiver.sh status

# View recent activity
./monitor-vercel.sh stats
tail -f *.log
```

### Statistics Tracking

The monitoring system tracks:
- Total checks performed
- Fix attempts made
- Successful fixes
- Success rate percentage
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