(function () {
    angular
        .module('OrgApp')
        .controller('budgetController', ['$scope', budgetController]);

    function budgetController(budgetService) {
        var model = this;/*
        model.findBudgetById = findBudgetById;
        console.log('in controller');

        function init() {
            console.log('controller initializing!');
            budgetService
                .getBudget()
                .then(renderBudget);
        }

        function renderBudget(budgets) {
            model.budgets = budgets;
            $scope.budget = budgets;
        }

        init();

        function findBudgetById(id){
            for(var i =0; i < model.budgets.length; i++){
                if(model.budgets[i].deptNo == id){
                    console.log(model.budgets[i].deptNo);
                    return model.budgets[i].budgetAmount;
                }
            }
        }
        */
    }
})
();