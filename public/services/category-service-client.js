(function () {
    angular
        .module('OrgApp')
        .factory('categoryService', categoryService);

    function categoryService($http) {
        return {
            getCategories: getCategories,
            update: update,
            getOSDSiteTree: getOSDSiteTree
        };

        function getCategories() {
            var url = "/api/cats";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
        function update(newTree){
            var url = "/api/updateCats";
            var tree = newTree;
            return $http.post(url, tree )
                .then(function(response){
                    return response.data;
                })
        }

        function getOSDSiteTree(){
            var url = "/api/cats/osd";
            return $http.get(url)
                .then(function (response) {
                    console.log(response);
                    return response.data;
                });
        }
    }
})();