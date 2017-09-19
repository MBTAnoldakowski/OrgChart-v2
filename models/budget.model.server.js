var mongoose = require('mongoose');

var budgetSchema = require('./budget.schema.server');
var budgetModel = mongoose.model('BudgetModel', budgetSchema);

budgetModel.getBudget = getBudget;
budgetModel.findBudgetById = findBudgetById;

module.exports = budgetModel;
console.log('budget model');
function getBudget() {
    console.log('model fetching data');
    return budgetModel.find();
}
function findBudgetById(bid) {
    console.log('model fetching id data');
    return budgetModel.find({dept: bid});
}