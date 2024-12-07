# Print Job Scheduler

[![CI](https://github.com/cinnamennen/schedule/actions/workflows/ci.yml/badge.svg)](https://github.com/cinnamennen/schedule/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/cinnamennen/schedule/branch/main/graph/badge.svg)](https://codecov.io/gh/cinnamennen/schedule)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI tool for optimizing print job schedules around operator availability and machine constraints.

## Quality Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for consistent formatting
- 80% code coverage requirement
- Automated CI/CD pipeline

## Features

- Job Management
  - Create and manage print jobs with duration
  - Flexible time input format (e.g., "15m", "5h12m", "1d5m")
  - All times stored in a consistent base unit
- Downtime Management (Coming Soon)
  - Define operator unavailability periods
  - Simple daily patterns (e.g., lunch breaks)
  - Weekly patterns (e.g., weekends)
- Machine Configuration (Coming Soon)
  - Setup time requirements
  - Teardown/spindown time requirements
- Schedule Optimization (Coming Soon)
  - Global queue optimization
  - Timeline visualization
  - Alternative schedules with trade-offs

## Installation

```bash
# Clone the repository
git clone https://github.com/cinnamennen/schedule.git

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Usage

```bash
# Add a job
pnpm start job add "Large Banner" "2h30m"
# or with named arguments
pnpm start job add -n "Large Banner" -d "2h30m"

# List all jobs
pnpm start job list

# Edit a job
pnpm start job edit <id> -n "New Name" -d "3h"

# Remove a job
pnpm start job remove <id>
```

## Development

```bash
# Run in development mode with watch
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting and type checking
pnpm check

# Fix linting and formatting issues
pnpm fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
