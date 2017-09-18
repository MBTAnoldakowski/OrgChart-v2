(function () {
    angular
        .module('OrgApp',[])
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'budgetController',
                controllerAs: 'model'
            })
    }

})();