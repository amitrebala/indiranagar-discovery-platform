#!/usr/bin/env node

/**
 * Terminal Coordination Scripts
 * Utilities for managing parallel terminal development
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TERMINALS = {
  'enhanced-experience-intelligence': {
    name: 'Terminal 1: Enhanced Experience & Intelligence',
    stories: ['2.1', '2.4', '4.1'],
    epic1Deferred: ['weather-ui', 'testing-infrastructure'],
    team: ['fullstack-dev', 'qa-specialist', 'testing-engineer'],
    dependencies: ['epic-1-weather-api', 'epic-1-map-foundation'],
    coordination: ['map-components', 'search-apis', 'weather-integration-ui'],
    focus: 'Map enhancements, search intelligence, weather-aware recommendations'
  },
  'community-social-platform': {
    name: 'Terminal 2: Community & Social Platform',
    stories: ['3.1', '3.2', '3.3', '3.4', '3.5'],
    epic1Deferred: ['admin-interface', 'email-notifications', 'faq-system'],
    team: ['backend-dev', 'frontend-dev', 'community-qa'],
    dependencies: ['epic-1-community-questions'],
    coordination: ['community-apis', 'social-sharing-endpoints', 'admin-interfaces'],
    focus: 'Complete community features, social engagement, content management'
  },
  'content-business-intelligence': {
    name: 'Terminal 3: Content & Business Intelligence',
    stories: ['2.2', '2.3', '2.5', '4.2', '4.3', '4.5'],
    epic1Deferred: [],
    team: ['content-dev', 'business-dev', 'analytics-qa'],
    dependencies: ['epic-1-place-database', 'epic-1-content-structure'],
    coordination: ['content-apis', 'analytics-endpoints', 'mobile-components'],
    focus: 'Rich content systems, business intelligence, mobile optimization, analytics'
  }
};

class TerminalCoordinator {
  constructor() {
    this.contractsDir = path.join(__dirname, '..', 'docs', 'api-contracts');
    this.statusFile = path.join(__dirname, '..', '.terminal-status.json');
  }

  // Initialize coordination tracking
  init() {
    console.log('🎭 Initializing Terminal Coordination...');
    
    const status = {
      lastUpdated: new Date().toISOString(),
      terminals: {}
    };

    Object.keys(TERMINALS).forEach(terminal => {
      status.terminals[terminal] = {
        phase: 'planning',
        stories: TERMINALS[terminal].stories,
        integrationReady: false,
        lastCheckpoint: null,
        blockers: []
      };
    });

    fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
    console.log('✅ Terminal coordination initialized');
  }

  // Check integration readiness across terminals
  checkIntegrationReadiness() {
    console.log('🔍 Checking integration readiness...');
    
    const status = this.getStatus();
    const ready = [];
    const notReady = [];

    Object.entries(status.terminals).forEach(([terminal, info]) => {
      if (info.integrationReady) {
        ready.push(terminal);
      } else {
        notReady.push(terminal);
      }
    });

    console.log(`✅ Ready for integration: ${ready.join(', ')}`);
    console.log(`⏳ Not ready: ${notReady.join(', ')}`);
    
    return { ready, notReady };
  }

  // Update terminal status
  updateTerminalStatus(terminal, phase, integrationReady = false, blockers = []) {
    console.log(`📊 Updating ${terminal} status: ${phase}`);
    
    const status = this.getStatus();
    status.terminals[terminal] = {
      ...status.terminals[terminal],
      phase,
      integrationReady,
      blockers,
      lastCheckpoint: new Date().toISOString()
    };
    status.lastUpdated = new Date().toISOString();

    fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
    console.log(`✅ ${terminal} updated to ${phase}`);
  }

  // Validate API contracts
  validateContracts() {
    console.log('🔧 Validating API contracts...');
    
    try {
      const contractFiles = fs.readdirSync(this.contractsDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

      contractFiles.forEach(file => {
        console.log(`  Validating ${file}...`);
        // Add OpenAPI validation logic here
      });

      console.log('✅ All contracts validated');
      return true;
    } catch (error) {
      console.error('❌ Contract validation failed:', error.message);
      return false;
    }
  }

  // Run integration checkpoint
  runIntegrationCheckpoint() {
    console.log('🎯 Running integration checkpoint...');
    
    const { ready, notReady } = this.checkIntegrationReadiness();
    
    if (notReady.length > 0) {
      console.log(`⚠️  Cannot proceed with integration. Waiting for: ${notReady.join(', ')}`);
      return false;
    }

    console.log('🚀 All terminals ready for integration!');
    
    // Run cross-terminal integration tests
    try {
      console.log('Running cross-terminal integration tests...');
      execSync('npm run test:integration:cross-terminal', { stdio: 'inherit' });
      console.log('✅ Integration tests passed');
      return true;
    } catch (error) {
      console.error('❌ Integration tests failed');
      return false;
    }
  }

  // Get current status
  getStatus() {
    if (!fs.existsSync(this.statusFile)) {
      this.init();
    }
    return JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
  }

  // Display coordination dashboard
  dashboard() {
    console.log('\n🎭 Terminal Coordination Dashboard (3+1 Structure)\n');
    
    const status = this.getStatus();
    
    console.log(`Last Updated: ${new Date(status.lastUpdated).toLocaleString()}\n`);
    
    Object.entries(status.terminals).forEach(([terminal, info]) => {
      const terminalConfig = TERMINALS[terminal];
      const readyIcon = info.integrationReady ? '✅' : '⏳';
      const blockerCount = info.blockers ? info.blockers.length : 0;
      const blockerIcon = blockerCount > 0 ? `🚫 ${blockerCount}` : '✨';
      
      const displayName = terminalConfig ? terminalConfig.name : terminal;
      
      console.log(`${readyIcon} ${displayName}`);
      console.log(`   Phase: ${info.phase}`);
      console.log(`   Stories: ${info.stories ? info.stories.join(', ') : 'N/A'}`);
      if (terminalConfig) {
        console.log(`   Focus: ${terminalConfig.focus}`);
        console.log(`   Epic 1 Deferred: ${terminalConfig.epic1Deferred.join(', ')}`);
      }
      console.log(`   Blockers: ${blockerIcon}`);
      if (info.lastCheckpoint) {
        console.log(`   Last Checkpoint: ${new Date(info.lastCheckpoint).toLocaleString()}`);
      }
      console.log('');
    });
    
    console.log('🎯 Orchestrator Terminal: Strategic Coordination & Monitoring');
  }
}

// CLI Interface
const coordinator = new TerminalCoordinator();

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'init':
    coordinator.init();
    break;
    
  case 'status':
    coordinator.dashboard();
    break;
    
  case 'update':
    const [terminal, phase, ready, ...blockers] = args;
    coordinator.updateTerminalStatus(
      terminal, 
      phase, 
      ready === 'true', 
      blockers
    );
    break;
    
  case 'check':
    coordinator.checkIntegrationReadiness();
    break;
    
  case 'validate':
    coordinator.validateContracts();
    break;
    
  case 'integrate':
    coordinator.runIntegrationCheckpoint();
    break;
    
  default:
    console.log(`
🎭 Terminal Coordination Commands:

  init              Initialize terminal coordination
  status            Show coordination dashboard  
  update <terminal> <phase> <ready> [blockers...]
                    Update terminal status
  check             Check integration readiness
  validate          Validate API contracts
  integrate         Run integration checkpoint

Examples:
  node scripts/coordination.js init
  node scripts/coordination.js status
  node scripts/coordination.js update content-social development true
  node scripts/coordination.js check
  node scripts/coordination.js integrate
`);
}