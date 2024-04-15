function calculateNewton(f, initialGuess) {
    const results = [];
    let x = initialGuess;
    let fx, dfx, xPrev, error;

    const func = math.compile(f);
    const derivative = math.derivative(f, 'x').toString();
    const deriv = math.compile(derivative);

    // Actualiza el campo de derivada automáticamente
    document.getElementById('derivativeInput').value = derivative;

    // Iterar hasta que se cumplan los criterios de parada
    do {
        fx = func.evaluate({ x });
        dfx = deriv.evaluate({ x });

        if (Math.abs(dfx) < 1e-6) {
            alert('Error: derivada muy cercana a cero en x = ' + x);
            return;
        }

        xPrev = x;
        x = x - fx / dfx;
        error = Math.abs(x - xPrev);

        results.push({ iteration: results.length, xPrev, fx, dfx, x, error });
    } while (error > 1e-6 && results.length < 50);

    displayResults(results, 'newton');
    drawGraph(func);
}

function calculateFalsePosition(f, lowerBound, upperBound) {
    const results = [];
    let xLower = lowerBound;
    let xUpper = upperBound;
    let fLower = math.evaluate(f, { x: xLower });
    let fUpper = math.evaluate(f, { x: xUpper });
    let xRoot, fRoot, error;
    let iteration = 0;

    // Asegúrate de que fLower y fUpper tengan signos opuestos
    if (fLower * fUpper > 0) {
        alert("La falsa posición requiere un cambio de signo en el intervalo.");
        return;
    }
    do {
        xRoot = xUpper - (fUpper * (xLower - xUpper)) / (fLower - fUpper);
        fRoot = math.evaluate(f, { x: xRoot });

        if (fLower * fRoot < 0) {
            xUpper = xRoot;
            fUpper = fRoot;
        } else if (fRoot * fUpper < 0) {
            xLower = xRoot;
            fLower = fRoot;
        } else {
            // Esto maneja el caso raro donde encontramos la raíz exacta.
            break;
        }

        error = Math.abs(xRoot - (xUpper - (fUpper * (xLower - xUpper)) / (fLower - fUpper)));
        results.push({ iteration, xLower, xUpper, xRoot, fRoot, error });

        iteration++;
    } while (error > 1e-6 && iteration < 50);

    displayResults(results, 'falsePosition');
    drawGraph(math.compile(f));
}

function calculateBisection(f, lowerBound, upperBound) {
    const results = [];
    let xLower = lowerBound;
    let xUpper = upperBound;
    let xMid, fLower, fMid, fUpper, error;
    let iteration = 0;

    const func = math.compile(f);

    // Asegúrate de que fLower y fUpper tengan signos opuestos
    fLower = func.evaluate({ x: xLower });
    fUpper = func.evaluate({ x: xUpper });
    if (fLower * fUpper > 0) {
        alert("El método de bisección requiere un cambio de signo en el intervalo.");
        return;
    }

    do {
        xMid = (xLower + xUpper) / 2;
        fMid = func.evaluate({ x: xMid });

        if (fLower * fMid < 0) {
            xUpper = xMid;
            fUpper = fMid;
        } else if (fMid * fUpper < 0) {
            xLower = xMid;
            fLower = fMid;
        } else if (fMid === 0) {
            // Encontramos la raíz exacta
            break;
        }

        error = Math.abs((xUpper - xLower) / xMid);
        results.push({
            iteration,
            xLower,
            xUpper,
            xMid,
            fMid,
            error
        });

        iteration++;
    } while (error > 1e-6 && iteration < 50);

    displayResults(results, 'bisection');
    drawGraph(func);
}

function calculateSecant(f, x0, x1) {
    const results = [];
    let xPrev = x0;
    let x = x1;
    let fxPrev, fx, xTemp, error;
    let iteration = 0;

    const func = math.compile(f);

    do {
        fxPrev = func.evaluate({ x: xPrev });
        fx = func.evaluate({ x: x });

        if (Math.abs(fx - fxPrev) < 1e-6) {
            alert('Error: División por cero o aproximación muy cercana en la secante.');
            return;
        }

        xTemp = x;
        x = x - (fx * (x - xPrev)) / (fx - fxPrev);
        xPrev = xTemp;

        error = Math.abs(x - xPrev);

        results.push({ iteration, xPrev, fxPrev, x, fx, error });
        iteration++;
    } while (error > 1e-6 && iteration < 50);

    displayResults(results, 'secant');
    drawGraph(func);
}

function displayResults(results, method) {
    const outputTable = document.getElementById('outputTable');
    let tableHTML = '';

    switch(method) {
        case 'newton':
            tableHTML += '<table border="1"><tr><th>Iteración</th><th>x Previo</th><th>f(x)</th><th>f\'(x)</th><th>x Nuevo</th><th>Error</th></tr>';
            results.forEach(result => {
                tableHTML += `<tr>
                    <td>${result.iteration}</td>
                    <td>${result.xPrev.toFixed(6)}</td>
                    <td>${result.fx.toFixed(6)}</td>
                    <td>${result.dfx.toFixed(6)}</td>
                    <td>${result.x.toFixed(6)}</td>
                    <td>${result.error.toFixed(6)}</td>
                </tr>`;
            });
            break;
        case 'falsePosition':
            tableHTML += '<table border="1"><tr><th>Iteración</th><th>x Inferior</th><th>x Superior</th><th>x Raíz</th><th>f(x Raíz)</th><th>Error</th></tr>';
            results.forEach(result => {
                tableHTML += `<tr>
                    <td>${result.iteration}</td>
                    <td>${result.xLower.toFixed(6)}</td>
                    <td>${result.xUpper.toFixed(6)}</td>
                    <td>${result.xRoot.toFixed(6)}</td>
                    <td>${result.fRoot.toFixed(6)}</td>
                    <td>${result.error.toFixed(6)}</td>
                </tr>`;
            });
            break;
        case 'bisection':
            tableHTML += '<table border="1"><tr><th>Iteración</th><th>x Inferior</th><th>x Superior</th><th>x Medio</th><th>f(x Medio)</th><th>Error</th></tr>';
            results.forEach(result => {
                tableHTML += `<tr>
                    <td>${result.iteration}</td>
                    <td>${result.xLower.toFixed(6)}</td>
                    <td>${result.xUpper.toFixed(6)}</td>
                    <td>${result.xMid.toFixed(6)}</td>
                    <td>${result.fMid.toFixed(6)}</td>
                    <td>${result.error.toFixed(6)}</td>
                </tr>`;
            });
            break;
        case 'secant':
            tableHTML += '<table border="1"><tr><th>Iteración</th><th>x Previo</th><th>f(x Previo)</th><th>x Actual</th><th>f(x Actual)</th><th>Error</th></tr>';
            results.forEach(result => {
                tableHTML += `<tr>
                    <td>${result.iteration}</td>
                    <td>${result.xPrev.toFixed(6)}</td>
                    <td>${result.fxPrev.toFixed(6)}</td>
                    <td>${result.x.toFixed(6)}</td>
                    <td>${result.fx.toFixed(6)}</td>
                    <td>${result.error.toFixed(6)}</td>
                </tr>`;
            });
            break;
    }

    tableHTML += '</table>';
    outputTable.innerHTML = tableHTML;
}

function drawGraph(func) {
    // Genera puntos para la función en un rango
    const xValues = math.range(-10, 10, 0.1).toArray();
    const yValues = xValues.map(function(x) {
        return func.evaluate({ x: x });
    });

    // Datos para la gráfica
    const trace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        name: 'f(x)'
    };

    const layout = {
        title: 'Gráfica de f(x)',
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' }
    };

    Plotly.newPlot('outputGraph', [trace], layout);
}
