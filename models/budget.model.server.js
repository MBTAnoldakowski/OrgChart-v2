var mongoose = require('mongoose');

var budgetSchema = require('./budget.schema.server');
var budgetModel = mongoose.model('BudgetModel', budgetSchema);

budgetModel.getBudget = getBudget;
module.exports = budgetModel;
console.log('budget model');
function getBudget() {
    console.log('model fetching data');
    return budgetModel.find();
}
