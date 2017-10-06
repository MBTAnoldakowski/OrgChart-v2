(function () {
    angular
        .module('OrgApp')
        .controller('vendorPageController', vendorPageController);

    function vendorPageController(vendorService,$scope) {
        var model = this;
        $scope.vendor = decodeURI(window.location.href.split('/vendor/')[1].toString());

    }
})();