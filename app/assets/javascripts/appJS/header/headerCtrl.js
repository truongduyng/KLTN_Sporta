app.controller('headerCtrl', ['$scope', '$http','$state',
  function($scope, $http, $state){
    var branches = [];
    $http.get("/searchnameadd/all").success(function(data){
      for (i=0;i<data.length; i++) {
        branches.push({"label": data[i].name + ", " + data[i].address, "value": data[i].url});
      }
    });
    $("#search_box").autocomplete({
      source: branches,
      select: function (event, item) {
      $state.go('booking', {branch_url_alias: item.item.value});
    }
  });
}]);