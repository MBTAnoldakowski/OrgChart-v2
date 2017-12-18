(function () {
    angular
        .module('OrgApp')
        .controller('categoryUploadController', categoryUploadController);

    function categoryUploadController(categoryService) {
        var model = this;

        model.getTree = function () {
            categoryService
                .getCategories()
                .then(function (cats) {
                    model.tree = cats;
                });
        };

        function init() {
            model.getTree();
        }

        init();
    }
})();