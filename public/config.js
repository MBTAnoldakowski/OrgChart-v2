(function () {
    angular
        .module('OrgApp')
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home.html'
            })
            .when('/budget', {
                templateUrl: 'visualization.html'
            })
            .when('/update', {
                templateUrl: 'upload.template.html'
            })
            .when('/employees', {
                templateUrl: 'employees3.html'
            })
            .when('/procurement', {
                templateUrl: 'procurement.html'
            })
            .when('/kpi', {
                templateUrl: 'kpi.html'
            })
            .when('/approvals', {
                templateUrl: 'approvals.html'
            })
            .when('/auth-vs-dept', {
                templateUrl: 'auth-vs-dept.html'
            })
            .when('/vendor/:vendorName', {
                templateUrl: 'vendor.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor/:vendorName/remove', {
                templateUrl: 'vendorRemove.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor/:vendorName/options', {
                templateUrl: 'vendorOptions.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor', {
                templateUrl: 'vendorUpload.html'
            })
            .when('/auth', {
                templateUrl: 'auth.html'
            })
            .when('/vendors', {
                templateUrl: 'vendor-list.html',
                controller: 'vendorController',
                controllerAs: 'model'
            })
    }
})();