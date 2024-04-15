document.addEventListener('DOMContentLoaded', function() {
    setupInputs('newton');

    document.getElementById('methodSelector').addEventListener('change', function() {
        setupInputs(this.value);
    });
});

function setupInputs(method) {
    const inputArea = document.getElementById('inputArea');
    inputArea.innerHTML = '';

    let html = `<input type="text" id="functionInput" placeholder="Ingrese la función f(x)">`;

    if (method === 'newton') {
        html += `<input type="text" id="derivativeInput" placeholder="Derivada f'(x)" readonly>
                 <input type="number" id="initialGuess" placeholder="Valor inicial">`;
    } else if (method === 'secant') {
        html += `<input type="number" id="initialGuess" placeholder="Primer valor inicial">
                 <input type="number" id="secondGuess" placeholder="Segunda aproximación">`;
    } else {
        html += `<input type="number" id="lowerBound" placeholder="Límite inferior">
                 <input type="number" id="upperBound" placeholder="Límite superior">`;
    }

    html += `<button onclick="calculate('${method}')">Calcular</button>`;

    inputArea.innerHTML = html;
}

function calculate(method) {
    const f = document.getElementById('functionInput').value;
    const initialGuess = document.getElementById('initialGuess') ? parseFloat(document.getElementById('initialGuess').value) : null;
    const lowerBound = document.getElementById('lowerBound') ? parseFloat(document.getElementById('lowerBound').value) : null;
    const upperBound = document.getElementById('upperBound') ? parseFloat(document.getElementById('upperBound').value) : null;
    const secondGuess = document.getElementById('secondGuess') ? parseFloat(document.getElementById('secondGuess').value) : null;

    switch (method) {
        case 'newton':
            calculateNewton(f, initialGuess);
            break;
        case 'falsePosition':
            calculateFalsePosition(f, lowerBound, upperBound);
            break;
        case 'bisection':
            calculateBisection(f, lowerBound, upperBound);
            break;
        case 'secant':
            calculateSecant(f, initialGuess, secondGuess);
            break;
    }
}
