const chalk = require('chalk');

// Opciones de emojis para secciones (nodos) y items
const EMOJI_OPTIONS = {
  nodes: {
    default: '📂',
    open: '📁', 
    root: '🌐',    
    package: '📦', 
  },
  items: {
    default: '•',
    arrow: '➡️',
    dash: '─',
    star: '★',
    label: '🏷️'
  }
};

// Selecciona los emojis que prefieras (aquí usamos 'open' para nodos y 'arrow' para items)
const EMOJI = {
  NODE: EMOJI_OPTIONS.nodes.root,
  PACKAGE: EMOJI_OPTIONS.nodes.package,
  ITEM: EMOJI_OPTIONS.items.label,
  SEARCH: '🔍',
  ERROR: '❌',
  EXIT: '🚪'
};

// Estilos con chalk
const STYLE = {
  title: chalk.cyan.bold,
  option: chalk.green,
  resultKey: chalk.yellow.bold,
  resultValue: chalk.blue,
  error: chalk.red,
  node: chalk.green.bold, // Naranja para nodos
  item: chalk.gray                // Gris para items
};

const SEPARATOR = "=".repeat(40); // Línea de 40 "="

module.exports = { EMOJI, STYLE, EMOJI_OPTIONS, SEPARATOR };