(function () {
    angular
        .module('OrgApp')
        .controller('vendorController', vendorController);

    function vendorController(vendorService,$scope) {
        var model = this;
        var vendorFiles = [];
        var vendorNames =[];

        function init() {
            vendorService
                .getVendors()
                .then(function (vendors) {
                    vendorFiles = vendors;
                    makeList(vendorFiles);
                });
        }
        init();
        function makeList(array){
            for(a in array){
                if(array[a]!== 'configuration' && array[a] !== 'tooltip')
                vendorNames.push(array[a].substring(0,array[a].length-4));
            }
            model.vendors = vendorNames;
        }
    }
})();