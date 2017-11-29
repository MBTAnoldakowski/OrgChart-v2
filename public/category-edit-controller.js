(function () {
    angular
        .module('OrgApp')
        .controller('categoryController', categoryController);

    function categoryController(categoryService, $location) {
        var model = this;

        model.getTree = function () {
            categoryService
                .getCategories()
                .then(function (cats) {
                    model.tree = cats;
                });
        };

        model.getOSDTree = function () {
            categoryService
                .getOSDSiteTree()
                .then(function (cats) {
                    console.log(cats);
                    model.tree = cats;
                });
        };

        model.submit = function () {
            var tree = model.tree;
            categoryService
                .update(tree)
                .then(function () {
                    location.href = "/#!/categories"
                })
        };

        model.addContract = function (cat) {
            cat._children.push({"code": "Contract #", "name": "Contract Name", "link": "Link to Contract"});
        };

        model.removeContract = function (category, contract) {
            for (i in category._children) {
                if (category._children[i].name === contract.name) {
                    category._children.splice(i, 1);
                }
            }
        };

        model.removeCategory = function (category) {
            for (i in model.tree.children) {
                if (model.tree.children[i].name === category.name) {
                    model.tree.children.splice(i, 1);
                }
            }
        };

        model.addCategory = function () {
            model.tree.children.push({
                "name": "Category Name",
                "code": "Cat Code",
                "isParent": true,
                "_children": [{"code": "Contract #", "name": "Contract Name", "link": "Link to Contract"}]
            })
        };

        function init() {

            model.getTree();
        }

        init();

    }
})();