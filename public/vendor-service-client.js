(function () {
    angular
        .module('OrgApp')
        .factory('vendorService', vendorService);

    function vendorService($http) {
        return {
            getVendors: getVendors
        };

        function getVendors() {
            var url = "/api/vendor-list";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function removeVendors(vendorName) {
            var url = "/api/remove";
            return $http.delete(url, vendorName)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();