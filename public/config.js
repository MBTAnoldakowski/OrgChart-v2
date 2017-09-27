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
            .when('/update',{
                templateUrl: 'upload.template.html',
                controllerAs: 'model',
                controller: 'uploadController'
            })
            .when('/employees',{
                templateUrl: 'employees3.html'
        })
            .when('/procurement',{
                templateUrl: 'procurement.html'
            })
            .when('/kpi',{
                templateUrl: 'kpi.html'
            })
    }

})();