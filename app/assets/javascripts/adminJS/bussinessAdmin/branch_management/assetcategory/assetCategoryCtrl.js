app.controller('assetCategoryCtrl', ['$scope', 'assetCategoryService', 'feeService', 'Flash', 'vndFilter', 'dateFilter', '$modal',
  function($scope, assetCategoryService, feeService, Flash, vndFilter, dateFilter, $modal){

    $scope.open_new = function(){

      var assetCategory_new = $modal.open({
        templateUrl: "adminJS/bussinessAdmin/branch_management/assetcategory/new_edit/_neworedit.html",
        controller: "neworeditassetcategoryCtrl",
        size: 'lg',
        resolve:{
          branch: function(){
            return $scope.branch;
          },
          assetCategory: function(){
            return null;
          }
        }
      });

      assetCategory_new.result.then(function (cate) {
        $scope.categories.push(cate);
      }, function () {

      });
    }

    $scope.open_edit = function(cate){

      var assetCategory_edit = $modal.open({
        templateUrl: "adminJS/bussinessAdmin/branch_management/assetcategory/new_edit/_neworedit.html",
        controller: "neworeditassetcategoryCtrl",
        size: 'lg',
        resolve:{
          branch: function(){
            return $scope.branch;
          },
          assetCategory: function(){
            return JSON.parse(JSON.stringify(cate));;
          }
        }
      });

      assetCategory_edit.result.then(function (cate_edited) {
        for (var i = 0; i < $scope.categories.length; i++) {
          if ($scope.categories[i]._id.$oid == cate_edited._id.$oid){
            $scope.categories[i] = cate_edited;
          }
        };
      }, function (){
      });
    }

  $scope.opendeleteCategory = function (category) {

    var deletecategory = $modal.open({
      templateUrl: 'deletecategory.html',
      controller: 'deletecategoryCtrl',
      size: 'sm'
    });

    deletecategory.result.then(function () {
      $scope.deleteCategory(category);
    }, function () {

    });
  };

  $scope.deleteCategory = function(category) {
    assetCategoryService.destroy(category)
    .success(function() {
      var index = $scope.categories.indexOf(category);
      $scope.categories.splice(index, 1);
      Flash.create('success', "Xóa thành công loại sân: " + category.name, 'myalert');
    })
    .error(function() {

      Flash.create('success', "Lỗi xảy ra khi xóa loại sân : " + category.name + ". Vui lòng thử lại" , 'myalert');
    });
  };

}]);

app.controller('deletecategoryCtrl',['$scope', '$modalInstance', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(false);
  };
}]);