const express = require('express');
const app = express();

// Array to store history in memory
const history = [];

// Middleware to parse mathematical operations from URL
app.get('/:operation/:values', (req, res, next) => {
    const { operation, values } = req.params;
    const numbers = values.split('/').map(Number);
    req.operation = operation;
    req.values = numbers;
    next();
}, (req, res) => {
    const { operation, values } = req;
    const question = values.join(` ${operation} `);
    let answer;
    switch (operation) {
        case 'plus':
            answer = values.reduce((acc, num) => acc + num, 0);
            break;
        case 'minus':
            answer = values.reduce((acc, num) => acc - num);
            break;
        case 'into':
            answer = values.reduce((acc, num) => acc * num, 1);
            break;
        case 'divided':
            answer = values.reduce((acc, num) => acc / num);
            break;
        default:
            res.status(400).json({ error: 'Invalid operation' });
            return;
    }

    history.push({ question, answer });
    if (history.length > 20) {
        history.shift();
    }

    res.json({ question, answer });
});

// Route to get history
app.get('/history', (req, res) => {
    res.json(history);
});

// Route to display API documentation
app.get('/documentation', (req, res) => {
    const documentationHtml = `
        <!-- Your HTML documentation here -->
    `;
    res.send(documentationHtml);
});

// Universal route for handling 404
app.get('*', (req, res) => {
    res.status(404).send('404 Page Not Found');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
