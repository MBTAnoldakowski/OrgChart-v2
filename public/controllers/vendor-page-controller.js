(function () {
    angular
        .module('OrgApp')
        .controller('vendorPageController', vendorPageController);

    function vendorPageController(vendorService, $scope) {
        var model = this;
        var vendorName = "";
        if (decodeURI(window.location.href.split('/vendor/')[1].toString().indexOf("options") !== -1)) {
            vendorName = decodeURI(window.location.href.split('/vendor/')[1].toString());
            vendorName = vendorName.split('/options')[0];
        }
        if (decodeURI(window.location.href.split('/vendor/')[1].toString().indexOf("remove") !== -1)) {
            vendorName = decodeURI(window.location.href.split('/vendor/')[1].toString());
            console.log(vendorName);
            vendorName = vendorName.split('/remove')[0];
            console.log(vendorName);
        } else {
            vendorName = decodeURI(window.location.href.split('/vendor/')[1].toString());

        }
        $scope.vendor = vendorName;
        $scope.$removeVendor = function () {
            vendorService
                .removeVendor(vendorName)
                .then(function (vendors) {
                    return vendors;
                });
        }
    }
})();