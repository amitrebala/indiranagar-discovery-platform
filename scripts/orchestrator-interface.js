#!/usr/bin/env node

/**
 * Real-Time Strategic Coordination Interface
 * Orchestrator Terminal 4 - Your direct interface for monitoring and coordination
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class OrchestratorInterface {
  constructor() {
    this.statusFile = path.join(__dirname, '..', '.terminal-status.json');
    this.dashboardFile = path.join(__dirname, '..', 'docs', 'orchestrator-dashboard.md');
    this.refreshInterval = 30000; // 30 seconds
    this.isMonitoring = false;
  }

  // Real-time dashboard display
  displayRealTimeDashboard() {
    console.clear();
    console.log('🎯 ORCHESTRATOR TERMINAL 4 - Strategic Coordination Interface');
    console.log('=' .repeat(80));
    console.log(`⏰ ${new Date().toLocaleString()} | Refresh: 30s | Press Ctrl+C to exit\n`);

    // Current terminal status
    this.displayTerminalStatus();
    
    // Critical dependencies and blockers
    this.displayCriticalPath();
    
    // API contract status
    this.displayAPIStatus();
    
    // Performance metrics
    this.displayPerformanceStatus();
    
    // Available commands
    this.displayCommandMenu();
  }

  displayTerminalStatus() {
    console.log('📊 TERMINAL STATUS OVERVIEW');
    console.log('-'.repeat(50));
    
    try {
      const status = JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
      const terminals = status.terminals;
      
      let readyCount = 0;
      let totalCount = Object.keys(terminals).length;
      
      Object.entries(terminals).forEach(([terminalId, info]) => {
        const readyIcon = info.integrationReady ? '✅' : '⏳';
        const phaseIcon = this.getPhaseIcon(info.phase);
        
        if (info.integrationReady) readyCount++;
        
        console.log(`${readyIcon} ${phaseIcon} ${this.getTerminalName(terminalId)}`);
        console.log(`   Phase: ${info.phase} | Stories: ${info.stories ? info.stories.length : 0}`);
        
        if (info.blockers && info.blockers.length > 0) {
          console.log(`   🚫 Blockers: ${info.blockers.join(', ')}`);
        }
      });
      
      console.log(`\n📈 Integration Progress: ${readyCount}/${totalCount} terminals ready\n`);
      
    } catch (error) {
      console.log('❌ Could not load terminal status\n');
    }
  }

  displayCriticalPath() {
    console.log('🎯 CRITICAL PATH & DEPENDENCIES');
    console.log('-'.repeat(50));
    
    console.log('Epic 1 Deferred Items (HIGH PRIORITY):');
    console.log('• Terminal 1: Weather UI → Enables Terminal 3 analytics');
    console.log('• Terminal 2: Admin Interface → Community management');
    console.log('• Terminal 1: Testing Infrastructure → Project-wide quality');
    
    console.log('\nCross-Terminal Dependencies:');
    console.log('• T1 → T3: Map components for mobile optimization');
    console.log('• T3 → T1,T2: Content APIs for rich experiences');
    console.log('• T2 → T3: Community APIs for social features');
    console.log();
  }

  displayAPIStatus() {
    console.log('🔌 API CONTRACT STATUS');
    console.log('-'.repeat(50));
    
    const contracts = [
      { name: 'Enhanced Map APIs', from: 'T1', to: 'T3', status: '⏳' },
      { name: 'Community APIs', from: 'T2', to: 'T3', status: '⏳' },
      { name: 'Content APIs', from: 'T3', to: 'T1,T2', status: '⏳' },
      { name: 'Search APIs', from: 'T1', to: 'T2,T3', status: '⏳' }
    ];
    
    contracts.forEach(contract => {
      console.log(`${contract.status} ${contract.name}: ${contract.from} → ${contract.to}`);
    });
    console.log();
  }

  displayPerformanceStatus() {
    console.log('⚡ PERFORMANCE BASELINE');
    console.log('-'.repeat(50));
    
    console.log('Targets: <2s load | >90 mobile score | <200ms API | >80% test coverage');
    console.log('Current: Not measured (terminals in planning phase)');
    console.log();
  }

  displayCommandMenu() {
    console.log('🎮 ORCHESTRATOR COMMANDS');
    console.log('-'.repeat(50));
    
    const commands = [
      '1. Update Terminal Phase    → npm run coordinate:update <terminal> <phase>',
      '2. Check Integration        → npm run coordinate:check',
      '3. Validate API Contracts   → npm run coordinate:validate',
      '4. Run Integration Tests    → npm run coordinate:integrate',
      '5. Terminal-Specific Tests  → npm run test:terminal:<name>',
      '6. Start Development Mode   → Start all terminals in development',
      '7. Emergency Stop          → Stop all terminal processes'
    ];
    
    commands.forEach(cmd => console.log(cmd));
    console.log('\nType command number or press Ctrl+C to exit monitoring');
  }

  getTerminalName(terminalId) {
    const names = {
      'enhanced-experience-intelligence': 'Terminal 1: Enhanced Experience & Intelligence',
      'community-social-platform': 'Terminal 2: Community & Social Platform', 
      'content-business-intelligence': 'Terminal 3: Content & Business Intelligence'
    };
    return names[terminalId] || terminalId;
  }

  getPhaseIcon(phase) {
    const icons = {
      'planning': '📋',
      'development': '🚧',
      'testing': '🧪',
      'integration': '🔗',
      'complete': '✅'
    };
    return icons[phase] || '❓';
  }

  // Strategic decision making
  analyzeRisks() {
    console.log('\n🚨 RISK ANALYSIS');
    console.log('-'.repeat(50));
    
    const risks = [
      {
        risk: 'Terminal 1 weather UI delay',
        impact: 'HIGH - Blocks Terminal 3 analytics',
        mitigation: 'Proceed with basic analytics, manual weather context'
      },
      {
        risk: 'Terminal 2 admin interface delay', 
        impact: 'HIGH - Cannot manage community questions',
        mitigation: 'Manual email management, temporary admin tools'
      },
      {
        risk: 'API contract conflicts',
        impact: 'CRITICAL - Integration failure',
        mitigation: 'Prioritize by user impact, implement versioned APIs'
      }
    ];
    
    risks.forEach(r => {
      console.log(`⚠️  ${r.risk}`);
      console.log(`   Impact: ${r.impact}`);
      console.log(`   Mitigation: ${r.mitigation}\n`);
    });
  }

  // Execute strategic commands
  executeCommand(commandNum) {
    switch(commandNum) {
      case '1':
        console.log('Available terminals: enhanced-experience-intelligence, community-social-platform, content-business-intelligence');
        console.log('Available phases: planning, development, testing, integration, complete');
        break;
      case '2':
        execSync('npm run coordinate:check', { stdio: 'inherit' });
        break;
      case '3':
        execSync('npm run coordinate:validate', { stdio: 'inherit' });
        break;
      case '4':
        execSync('npm run coordinate:integrate', { stdio: 'inherit' });
        break;
      case '6':
        this.startAllTerminals();
        break;
      case '7':
        this.emergencyStop();
        break;
      default:
        console.log('Invalid command. Please enter 1-7.');
    }
  }

  startAllTerminals() {
    console.log('🚀 Starting all development terminals...');
    
    const terminals = [
      'enhanced-experience-intelligence',
      'community-social-platform', 
      'content-business-intelligence'
    ];
    
    terminals.forEach(terminal => {
      try {
        execSync(`npm run coordinate:update ${terminal} development`, { stdio: 'inherit' });
        console.log(`✅ ${terminal} started in development mode`);
      } catch (error) {
        console.log(`❌ Failed to start ${terminal}`);
      }
    });
  }

  emergencyStop() {
    console.log('🛑 Emergency stop - killing all terminal processes...');
    try {
      execSync('pkill -f "npm run dev" || true', { stdio: 'inherit' });
      execSync('pkill -f "next dev" || true', { stdio: 'inherit' });
      console.log('✅ All terminal processes stopped');
    } catch (error) {
      console.log('⚠️  Some processes may still be running');
    }
  }

  // Start real-time monitoring
  startMonitoring() {
    this.isMonitoring = true;
    console.log('🎯 Starting Orchestrator Terminal 4 - Real-time monitoring active\n');
    
    // Initial display
    this.displayRealTimeDashboard();
    
    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(refreshInterval);
        return;
      }
      this.displayRealTimeDashboard();
    }, this.refreshInterval);

    // Handle user input
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => {
      const input = key.toString().trim();
      
      if (key[0] === 3) { // Ctrl+C
        this.stopMonitoring();
        process.exit(0);
      }
      
      if (input >= '1' && input <= '7') {
        this.executeCommand(input);
        setTimeout(() => this.displayRealTimeDashboard(), 2000);
      }
    });
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('\n🎯 Orchestrator monitoring stopped');
  }
}

// CLI Interface
const orchestrator = new OrchestratorInterface();

const command = process.argv[2];

switch (command) {
  case 'monitor':
    orchestrator.startMonitoring();
    break;
    
  case 'dashboard':
    orchestrator.displayRealTimeDashboard();
    break;
    
  case 'risks':
    orchestrator.analyzeRisks();
    break;
    
  case 'start-all':
    orchestrator.startAllTerminals();
    break;
    
  case 'emergency-stop':
    orchestrator.emergencyStop();
    break;
    
  default:
    console.log(`
🎯 Orchestrator Terminal 4 - Strategic Coordination Interface

Commands:
  monitor         Start real-time monitoring dashboard
  dashboard       Show current dashboard snapshot  
  risks          Analyze current risks and mitigations
  start-all      Start all terminals in development mode
  emergency-stop Emergency stop all terminal processes

Examples:
  node scripts/orchestrator-interface.js monitor
  node scripts/orchestrator-interface.js dashboard
  node scripts/orchestrator-interface.js risks
`);
}