(function () {
    angular
        .module('OrgApp')
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'visualization.html',
                controller: 'budgetController',
                controllerAs: 'model'
            })
    }

})();