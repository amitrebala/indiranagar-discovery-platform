#!/bin/bash

# Kill any hanging Vitest processes
pkill -f vitest 2>/dev/null || true

# Also kill any Node processes with test in the command
pkill -f "node.*test" 2>/dev/null || true

# Clean exit
exit 0