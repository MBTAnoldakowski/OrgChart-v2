(function () {
    angular
        .module('OrgApp')
        .factory('vendorService', vendorService);

    function vendorService($http) {
        return {
            getVendors: getVendors
        }
        function getVendors() {
            var url = "/api/vendor-list";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();