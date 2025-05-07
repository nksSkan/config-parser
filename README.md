# Config Parser

Lightweight configuration file parser for Node.js

## Development Setup

### Requirements
- Node.js v16 or higher
- npm (comes with Node.js)

### Installation
1. Clone the repository
2. Navigate to project directory
3. Install dependencies:
    npm install

### Starting Development
    npm start <file-path>

### Running Tests
    npm test

### Project Structure
config-parser/
├── lib/                    # Core parser source code
│   └── ConfigParser.js
│   └── texts.js            # Text constants and error messages
│   └── theme.js            # CLI styling (colors, emojis)
├── __tests__/              # Test files
│   └── ConfigParser.test.js
├── bin/                    # CLI entry point
│   └── cli.js
├── package.json            # Project metadata and dependencies
├── MainTest.conf           # Example configuration file (test fixture)
├── test2.conf
└── README.md