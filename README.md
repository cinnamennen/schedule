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

```bash
# Command structure (preliminary)
schedule [command] [options]
```

## Development Status

Currently in initial development phase. Core features and data models being defined.

## Future Enhancements

- Resource-based job grouping
- Extended visualization options
- Schedule export/import
- Historical analytics
