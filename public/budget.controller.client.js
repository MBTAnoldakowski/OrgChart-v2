(function () {
    angular
        .module('OrgApp')
        .controller('budgetController', budgetController);

    function budgetController(budgetService) {
        var model = this;
        console.log('in controller');

        function init() {
            console.log('controller initializing!');
            budgetService
                .getBudget()
                .then(renderBudget);
        }

        function renderBudget(budgets) {
            model.budgets = budgets;
            console.log(budgets);
        }

        init();
    }
})
();