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
        } else {
            vendorName = decodeURI(window.location.href.split('/vendor/')[1].toString());

        }
        $scope.vendor = vendorName;

    }
})();