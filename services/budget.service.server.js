var app = require('../express');
var budgetModel = require('../models/budget.model.server');

app.get('/api/budget', getBudget);

function getBudget(req, res) {

    console.log('server-side service fetching budget data');
    budgetModel
        .getBudget()
        .then(function (budgets) {
            res.json(budgets);
        });

}
