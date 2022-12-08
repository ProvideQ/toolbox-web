// Copyright (c) 2015 Tomas Enarsson https://github.com/mobenar/mobenga-gml MIT license
// Slightly modified version


/**
 * Parses GML string.
 *
 * @param {String} gml
 * @returns {Object}
 * @throws {SyntaxError}
 */
export function parseGML(gml) {

    let json = ('{\n' + gml + '\n}')
        .replace(/^(\s*)(\w+)\s*\[/gm, '$1"$2": {')
        .replace(/^(\s*)]/gm, '$1},')
        .replace(/^(\s*)(\w+)\s+(".+")$/gm, '$1"$2": $3,')
        .replace(/^(\s*)(\w+)\s+(.+)$/gm, '$1"$2": "$3",')
        .replace(/,(\s*)}/g, '$1}');

    let graph = {};
    let nodes = [];
    let edges = [];
    let i = 0;
    let parsed;

    json = json.replace(/^(\s*)"node"/gm, function (all, indent) {

        return (indent + '"node[' + (i++) + ']"');
    });

    i = 0;

    json = json.replace(/^(\s*)"edge"/gm, function (all, indent) {

        return (indent + '"edge[' + (i++) + ']"');
    });

    try {
        parsed = JSON.parse(json);
    }
    catch (err) {
        throw new SyntaxError('bad format');
    }

    if (!isObject(parsed.graph)) {
        throw new SyntaxError('no graph tag');
    }

    forIn(parsed.graph, function (key, value) {
        const matches = key.match(/^(\w+)\[(\d+)]$/);
        let name;
        let i;

        if (matches) {
            name = matches[1];
            i = parseInt(matches[2], 10);

            if (name === 'node') {
                nodes[i] = value;
            }
            else if (name === 'edge') {
                edges[i] = value;
            }
            else {
                graph[key] = value;
            }
        }
        else {
            graph[key] = value;
        }
    });

    graph.nodes = nodes;
    graph.edges = edges;

    return graph;
}

function isObject(value) {

    return (value && Object.prototype.toString.call(value) === '[object Object]');
}

function forIn(object, callback) {

    Object.keys(object).forEach(function (key) {

        callback(key, object[key]);
    });
}