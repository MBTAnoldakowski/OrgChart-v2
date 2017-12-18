(function () {
    angular
        .module('OrgApp')
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/home.html'
            })
            .when('/budget', {
                templateUrl: './templates/visualization.html'
            })
            .when('/old', {
                templateUrl: './templates/deprecated.html'
            })
            .when('/update', {
                templateUrl: './templates/upload.template.html'
            })
            .when('/employees', {
                templateUrl: './templates/employees3.html'
            })
            .when('/procurement', {
                templateUrl: './templates/procurement.html'
            })
            .when('/kpi', {
                templateUrl: './templates/kpi.html'
            })
            .when('/approvals', {
                templateUrl: './templates/newApprovals.html'
            })
            .when('/old-approvals', {
                templateUrl: './templates/notUpdatedApprovals.html'
            })
            .when('/auth-vs-dept', {
                templateUrl: './templates/auth-vs-dept.html'
            })
            .when('/vendor/:vendorName', {
                templateUrl: './templates/vendor/vendor.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor/:vendorName/remove', {
                templateUrl: './templates/vendor/vendorRemove.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor/:vendorName/options', {
                templateUrl: './templates/vendor/vendorOptions.html',
                controller: 'vendorPageController',
                controllerAs: 'model'
            })
            .when('/vendor', {
                templateUrl: './templates/vendor/vendorUpload.html'
            })
            .when('/extra', {
                templateUrl: './templates/new-depts.html'
            })
            .when('/auth', {
                templateUrl: './templates/auth.html'
            })
            .when('/newAuth', {
                templateUrl: './templates/old-vs-new-auth-tree.html'
            })
            .when('/circle', {
                templateUrl: './templates/circle.html'
            })
            .when('/vendors', {
                templateUrl: './templates/vendor/vendor-list.html',
                controller: 'vendorController',
                controllerAs: 'model'
            })
            .when('/categories', {
                templateUrl: './templates/categories.html'
            })
            .when('/category-edit', {
                templateUrl: './templates/category-edit.html',
                controller: 'categoryController',
                controllerAs: 'model'
            })
            .when('/refreshOSDdata', {
                templateUrl: './templates/refresh.html',
                controller: 'categoryController',
                controllerAs: 'model'
            })
            .when('/category-upload', {
                templateUrl: './templates/category-icon-upload.html',
                controller: 'categoryUploadController',
                controllerAs: 'model'
            })
    }
})();