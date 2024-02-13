(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    function FoundItems() {
        return {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                searchTitle: '@',
                onRemove: '&',
                warning: '@'
            },
        }
    }
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;

        narrowCtrl.found = [];
        narrowCtrl.fixSearchTerm = '';
        narrowCtrl.warning = '';

        narrowCtrl.onSearch = function(searchTerm){
            narrowCtrl.fixSearchTerm = searchTerm;
            if(!searchTerm) {
                narrowCtrl.found = [];
                narrowCtrl.warning = 'Nothing found';
            } else {
                MenuSearchService.getMatchedMenuItems(searchTerm)
                .then(function (res){
                    if(res.length !== 0){
                        narrowCtrl.warning = '';
                        narrowCtrl.found = res;
                    } else {
                        narrowCtrl.found = [];
                        narrowCtrl.warning = 'Nothing found';
                    }
                })
                .catch(function (error){
                    console.log(error);
                });
            }
        }

        narrowCtrl.removeItem = function(index) {
            narrowCtrl.found.splice(index, 1);
        }
    };

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            var foundItems = [];
            return $http({
                method: 'GET',
                url: (ApiBasePath + '/menu_items.json')
            })
            .then(function(response){
                for (const key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        for (var index = 0; index < response.data[key].menu_items.length; index++) {
                            if(response.data[key].menu_items[index].description.search(searchTerm.toLowerCase()) !== -1){
                                foundItems.push(response.data[key].menu_items[index])
                            }
                        }
                    }
                  }
                // console.log(foundItems);
                  return foundItems;
            });
        };
    };

})();