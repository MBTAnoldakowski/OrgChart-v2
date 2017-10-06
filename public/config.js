(function () {
    angular
        .module('OrgApp')
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'visualization.html'
            })
            .when('/update',{
                templateUrl: 'upload.template.html'
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
            .when('/approvals',{
                templateUrl: 'approvals.html'
            })
            .when('/vendor/:vendorName',{
                templateUrl: 'vendor.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor',{
                templateUrl: 'vendorUpload.html'
            })
            .when('/vendors',{
                templateUrl: 'vendor-list.html',
                controller: 'vendorController',
                controllerAs: 'model'
            })
    }
})();