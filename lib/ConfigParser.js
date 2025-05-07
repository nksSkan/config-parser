const fs = require('fs');

class ConfigParser {
  constructor() {
    this.config = {};
    this.stack = [this.config];
  }
  
    parse(text) {
      this.stack = [this.config]; // Reset para cada parseo
  
      const lines = text.split('\n');
      let i = 0;
      const n = lines.length;
  
      while (i < n) {
        const line = lines[i].trim();
        i++;
  
        if (!line) continue;
  
        // Caso 1: Sección nueva 
        if (line.endsWith('{')) {
          const sectionName = line.slice(0, -1).trim();
          const newSection = {};
          this.stack[this.stack.length - 1][sectionName] = newSection;
          this.stack.push(newSection);
        }
        // Caso 2: Sección vacía en una línea ({ })
        else if (line === '{' || line === '{ }') {
          // Verificar si la siguiente línea es }
          if (i < n && lines[i].trim() === '}') {
            i++; // Saltar la línea de cierre
            continue;
          }
          // Si no, es una llave de apertura normal
          const newSection = {};
          const lastKey = Object.keys(this.stack[this.stack.length - 1]).pop();
          this.stack[this.stack.length - 1][lastKey] = newSection;
          this.stack.push(newSection);
        }
        // Caso 3: Cierre de sección
        else if (line === '}') {
          if (this.stack.length <= 1) throw new Error('Unbalanced braces');
          this.stack.pop();
        }
        // Caso 4: Contenido normal
        else {
          const tokens = line.split(/\s+/);
          const key = tokens[0];
          this.stack[this.stack.length - 1][key] = 
            tokens.length === 1 ? true : 
            tokens.length === 2 ? tokens[1] : 
            tokens.slice(1);
        }
      }
  
      if (this.stack.length !== 1) throw new Error('Unbalanced braces');
      return this.config;
    }
  

  search(keyword) {
    const results = {};
    this._searchRecursive(this.config, [], keyword.toLowerCase(), results);
    return results;
  }

  _searchRecursive(node, currentPath, keyword, results) {
    for (const [key, value] of Object.entries(node)) {
      // Búsqueda en claves
      if (key.toLowerCase().includes(keyword)) {
        const fullPath = currentPath.concat(key).join('.');
        results[fullPath] = value;
      }

      // Buscar en subsecciones
      if (typeof value === 'object' && !Array.isArray(value)) {
        this._searchRecursive(value, currentPath.concat(key), keyword, results);
      }
    }
  }
}

module.exports = ConfigParser;