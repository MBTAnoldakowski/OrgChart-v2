var app = require('../express');
var budgetModel = require('../models/budget.model.server');

app.get('/api/budget', getBudget);
app.get('/api/budget/:bid', findBudgetById);
function getBudget(req, res) {
    console.log('server-side service fetching budget data');
    budgetModel
        .getBudget()
        .then(function (budgets) {
            res.json(budgets);
        });

}
function findBudgetById(req, res) {
    console.log('server-side service fetching id budget data');
    var bid = req.params.bid;
    budgetModel
        .findBudgetbyId(bid)
        .then(function (b) {
            res.json(b);
        });

}
