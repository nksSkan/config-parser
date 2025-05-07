const ConfigParser = require('../ConfigParser');
const fs = require('fs');

describe('ConfigParser - Prueba Técnica', () => {
    let parser;

    beforeEach(() => {
        parser = new ConfigParser();
    });

    // --- Caso 1 : ejemplo del assignment ---
    test('should parse assignment example structure', () => {
        // Configuración de prueba (simulando el archivo descrito en la prueba técnica)
        const configText = `
            runtime {
            key1 value1
            key2 value2
            flag1
            system1 {
                prop1 value1
                prop2 value2
                ports 1234 5678 9102
                subsystem1 {
                prop3 value1 value2 value3
                flag2
                }
            }
            more_stuff here
            }
        `;

        // Ejecutar el parser
        const config = parser.parse(configText);

        // Validaciones
        // 1. Sección principal 'runtime'
        expect(config.runtime).toBeDefined();

        // 2. Propiedades directas en 'runtime'
        expect(config.runtime.key1).toBe('value1');
        expect(config.runtime.key2).toBe('value2');
        expect(config.runtime.flag1).toBe(true); // Flag sin valor = true

        // 3. Sección anidada 'system1'
        expect(config.runtime.system1).toBeDefined();
        expect(config.runtime.system1.prop1).toBe('value1');
        expect(config.runtime.system1.prop2).toBe('value2');

        // 4. Array en 'ports'
        expect(config.runtime.system1.ports).toEqual(['1234', '5678', '9102']);

        // 5. Subsistema anidado 'subsystem1'
        expect(config.runtime.system1.subsystem1.prop3).toEqual(['value1', 'value2', 'value3']);
        expect(config.runtime.system1.subsystem1.flag2).toBe(true);

        // 6. Propiedad con guión bajo
        expect(config.runtime.more_stuff).toBe('here');
    });


    // --- Caso 2: Múltiples secciones en raíz ---
    test('should parse multiple root sections', () => {
        const config = parser.parse(`
            runtime {
            server localhost
            }
            runtime2 {
            server2 132.112.0.12
            }
        `);

        expect(config.runtime.server).toBe('localhost');
        expect(config.runtime2.server2).toBe('132.112.0.12');
    });

    // --- Caso 3: Anidamiento profundo ---
    test('should parse deeply nested structures', () => {
        const config = parser.parse(`
            system {
            network {
                ports 80 443
                dns "8.8.8.8"
            }
            features {
                logging on
                debug
            }
            }
        `);
        expect(config.system.network.ports).toEqual(['80', '443']);
        expect(config.system.features.logging).toBe('on');
        expect(config.system.features.debug).toBe(true);
    });

    // --- Caso 4: Seccion vacia ---
    test('should handle empty section in multiple lines', () => {
        expect(parser.parse('section {\n}')).toEqual({ section: {} });
    });

    // --- Caso 5: Llaves desbalanceadas (error) ---
    test('should throw error for unbalanced braces', () => {
        expect(() => parser.parse(`
            system {
                network value
            `)).toThrow('Unbalanced braces');
        });
    });