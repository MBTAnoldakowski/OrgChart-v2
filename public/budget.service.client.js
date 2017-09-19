(function () {
    angular
        .module('OrgApp')
        .factory('budgetService', budgetService);

    function budgetService($http) {
        console.log('budget service client');
        var api = {
            getBudget: getBudget
        };
        return api;

        function getBudget() {
            var url = "/api/budget";
            console.log('client service fetching budget data');
            return $http.get(url)
                .then(function (response) {
                    console.log(response);
                    return response.data;
                }, function (error){
                    return error;
                })
        }
    }
})();