# Print Job Scheduler

A CLI tool for optimizing print job schedules around operator availability and machine constraints.

## Overview

This tool helps printing companies optimize their job queue by:

- Minimizing total queue execution time
- Working around operator downtime periods
- Accounting for machine setup/teardown times
- Providing alternative schedules that trade execution time for operational flexibility

## Core Features

### Job Management

- Create and manage print jobs with:
  - Job name
  - Duration (flexible time units: minutes, hours, days)
  - Resource requirements (future feature)
- Flexible time input format (e.g., "15m", "5h12m", "1d5m")
- All times stored in a consistent base unit internally

### Downtime Management

- Define periods when operators are unavailable:
  - Simple daily patterns (e.g., lunch breaks)
  - Weekly patterns (e.g., weekends)
  - One-off exceptions to regular patterns
- Easy modification of downtime schedules

### Machine Configuration

- Single machine setup
- Configuration for:
  - Setup time requirements
  - Teardown/spindown time requirements

### Schedule Optimization

- Global queue optimization for minimal total execution time
- Visualization of schedules with:
  - Timeline view of jobs and downtime
  - Alternative schedules with different trade-offs
  - Efficiency vs. flexibility comparisons
- Future support for resource-based job grouping

### Data Storage

- Local database using LowDB
- Persistent storage of:
  - Jobs and their details
  - Downtime patterns
  - Machine configuration
  - Schedule history

## Technical Details

- Built with TypeScript and Node.js
- CLI interface using Yargs with colored output
- Local JSON-based database
- Terminal-based schedule visualization

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
yarn install

# Build the project
yarn build

# Run in development mode
yarn dev
```

## Usage

Run commands using `yarn start`:

```bash
# Add a job
yarn start job add "Large Banner" "2h30m"
# or with named arguments
yarn start job add -n "Large Banner" -d "2h30m"

# List all jobs
yarn start job list

# Edit a job
yarn start job edit <id> -n "New Name" -d "3h"

# Remove a job
yarn start job remove <id>
```

For development, use `yarn dev` to run with watch mode.

## Development Status

Currently in initial development phase. Core features and data models being defined.

## Future Enhancements

- Resource-based job grouping
- Extended visualization options
- Schedule export/import
- Historical analytics
- Possible Web API Integration (if feasible with printer systems):
  - Potential for remote job ingestion
  - Schedule synchronization if supported
  - Integration with existing printer management systems
  - Note: API integration depends on printer system capabilities and protocols
