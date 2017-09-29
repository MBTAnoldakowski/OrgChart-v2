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
                templateUrl: 'upload.template.html',
                controllerAs: 'model'//,
                /*resolve: {
                    currentUser: checkLoggedIn
                }*/
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
    /*
    function checkLoggedIn($q, $location, userService) {
        var deferred = $q.defer();
        userService.checkLoggedIn()
            .then(function (currentUser) {
                if (currentUser === '0') {
                    deferred.reject();
                    $location.url('/login')
                } else {
                    deferred.resolve(currentUser);
                }
            });
        return deferred.promise;
    }*/
})();