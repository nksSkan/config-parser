#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const { EMOJI, STYLE, SEPARATOR } = require('../lib/theme');
const ConfigParser = require('../lib/ConfigParser');
const TEXTS = require('../lib/texts'); 

// ----- Helpers -----
const clearScreen = () => console.clear();
const printSeparator = () => console.log(STYLE.title(SEPARATOR));

const printStructure = (obj, indent = '') => {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            console.log(`${indent}${EMOJI.NODE} ${STYLE.node(key)}:`);
            printStructure(value, indent + '  ');
        } else {
            console.log(`${indent}${EMOJI.ITEM} ${STYLE.item(key)}: ${STYLE.resultValue(JSON.stringify(value))}`);
        }
    }
};

// ----- Menú -----
const showMenu = (rl, config, parser) => {
    clearScreen();
    printSeparator();
    console.log(STYLE.title(TEXTS.WELCOME_TITLE));
    printSeparator();

    console.log(`\n${STYLE.option('Options:')}`);
    console.log(`${STYLE.option('1.')} ${TEXTS.MENU_OPTIONS.LIST_STRUCTURE} ${EMOJI.NODE}`);
    console.log(`${STYLE.option('2.')} ${TEXTS.MENU_OPTIONS.SEARCH_KEYWORD} ${EMOJI.SEARCH}`);
    console.log(`${STYLE.option('3.')} ${TEXTS.MENU_OPTIONS.EXIT} ${EMOJI.EXIT}`);
    printSeparator();

    rl.question('\nSelect an option (1-3): ', (option) => {
        handleOption(option, rl, config, parser);
        });
};

const handleOption = (option, rl, config, parser) => {
    switch (option.trim()) {
      case '1':
        clearScreen();
        console.log(`${EMOJI.NODE} ${STYLE.title(TEXTS.FULL_STRUCTURE_TITLE)}`);
        printStructure(config);
        rl.question(`\n${TEXTS.PRESS_ENTER}`, () => showMenu(rl, config, parser));
        break;
      case '2':
        clearScreen();
        rl.question(`${EMOJI.SEARCH} ${TEXTS.SEARCH_PROMPT} `, (keyword) => {
          const results = parser.search(keyword);
          if (Object.keys(results).length === 0) {
            console.log(`${EMOJI.ERROR} ${TEXTS.NO_RESULTS}`);
          } else {
            console.log(`\n${STYLE.title(TEXTS.RESULTS_TITLE)}`);
            for (const [path, value] of Object.entries(results)) {
              console.log(`${STYLE.resultKey(path)}: ${STYLE.resultValue(JSON.stringify(value))}`);
            }
          }
          rl.question(`\n${TEXTS.PRESS_ENTER}`, () => showMenu(rl, config, parser));
        });
        break;
      case '3':
        clearScreen();
        console.log(`${EMOJI.EXIT} ${TEXTS.EXIT_MESSAGE}\n`);
        rl.close();
        break;
      default:
        clearScreen();
        console.log(`${EMOJI.ERROR} ${TEXTS.INVALID_OPTION}`);
        setTimeout(() => showMenu(rl, config, parser), 1500);
    }
  };

// ----- Inicio -----
const [,, filePath] = process.argv;

if (!filePath) {
    console.error(`${EMOJI.ERROR} ${STYLE.error(TEXTS.USAGE)}`);
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

try {
    const configText = fs.readFileSync(filePath, 'utf-8');
    const parser = new ConfigParser();
    const config = parser.parse(configText);
    showMenu(rl, config, parser);
  } catch (error) {
    console.error(`${EMOJI.ERROR} ${STYLE.error(TEXTS.GENERAL_ERROR)} ${error.message}`);
    rl.close();
  }