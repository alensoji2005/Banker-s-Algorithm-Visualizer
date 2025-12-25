// js/ui.js

/**
 * Creates the HTML tables for user input.
 * @param {number} p - Number of processes
 * @param {number} r - Number of resources
 */
export function createTables(p, r) {
    document.getElementById('available-table').innerHTML = createVectorTable('available', r);
    document.getElementById('max-table').innerHTML = createMatrixTable('max', p, r);
    document.getElementById('allocation-table').innerHTML = createMatrixTable('allocation', p, r);
}

/**
 * Gathers all inputs from the HTML tables.
 * @throws {Error} if Allocation > Max for any process.
 */
export function getInputs(p, r) {
    const available = getVectorInput('available', r);
    const max = getMatrixInput('max', p, r);
    const allocation = getMatrixInput('allocation', p, r);
    
    // Calculate need matrix and validate inputs
    const need = Array(p).fill(null).map(() => Array(r));

    for (let i = 0; i < p; i++) {
        for (let j = 0; j < r; j++) {
            if (allocation[i][j] > max[i][j]) {
                // --- THIS IS THE NEW VALIDATION ---
                throw new Error(`Input Error: Process P${i} has Allocation (${allocation[i][j]}) > Max (${max[i][j]}) for Resource R${j}.`);
            }
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    
    return { available, max, allocation, need, numProcesses: p, numResources: r };
}


// --- Helper Functions ---

function createVectorTable(id, r) {
    let header = '<th></th>';
    for (let j = 0; j < r; j++) {
        header += `<th>R${j}</th>`;
    }
    let body = '<tr><td>Available</td>';
    for (let j = 0; j < r; j++) {
        body += `<td><input type="number" id="${id}-${j}" value="0" min="0"></td>`;
    }
    body += '</tr>';
    return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;
}

function createMatrixTable(id, p, r) {
    let header = '<th></th>';
    for (let j = 0; j < r; j++) {
        header += `<th>R${j}</th>`;
    }
    let body = '';
    for (let i = 0; i < p; i++) {
        body += `<tr><td>P${i}</td>`;
        for (let j = 0; j < r; j++) {
            body += `<td><input type="number" id="${id}-${i}-${j}" value="0" min="0"></td>`;
        }
        body += '</tr>';
    }
    return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;
}

function getVectorInput(id, r) {
    const vector = [];
    for (let j = 0; j < r; j++) {
        const val = parseInt(document.getElementById(`${id}-${j}`).value);
        if (isNaN(val)) throw new Error(`Invalid input for Available R${j}.`);
        vector.push(val);
    }
    return vector;
}

function getMatrixInput(id, p, r) {
    const matrix = [];
    for (let i = 0; i < p; i++) {
        const row = [];
        for (let j = 0; j < r; j++) {
            const val = parseInt(document.getElementById(`${id}-${i}-${j}`).value);
            if (isNaN(val)) throw new Error(`Invalid input for ${id} P${i}, R${j}.`);
            row.push(val);
        }
        matrix.push(row);
    }
    return matrix;
}