app.controller('BAbranchCtrl', ['$scope', 'logoFilter', '$location', '$state',
	'BAbranchService', '$modal',
	function($scope, logoFilter, $location, $state, branchService, $modal) {

	//Su kien khi load map thanh cong
	$scope.$on('mapInitialized', function(event, map) {
		//Do su kien mapInitialized duoc goi trong nhieu nest view con nen phai xem xet cho hop ly ko thoi bi loi
		if(map.onstate != 'home'){
			return;
		}

		var marker = createMarker(map.branch.coordinates[1], map.branch.coordinates[0], "application/placeholder/sporta_icon.png");
		marker.setMap(map);
		map.setCenter(marker.getPosition());
	});

	function createMarker(lat, lng, image) {

		var position = new google.maps.LatLng(lat, lng);
		//Gan anh cho html layout cua marker
		$("#customMarker").find('.img-avatar').attr("src", logoFilter(image)).html();
		//Lay html
		var HtmlLayout = $("#customMarker").html();
		var marker = new RichMarker({
			position: position,
			flat: true,
			content: HtmlLayout,
		});
		return marker;
	};

	$scope.branch.isEdit = false;

	//Chinh sua 1 branch
	$scope.onEdit = function(branch){
		//Luu giu ban goc cua branch, neu ma ko save thi phuc hoi lai
		branch.origin = {};
		angular.copy(branch, branch.origin);
		branch.isEdit = true;
	};

	//save branch
	$scope.saveEdittedBranch = function(branch){
		branch.iSaving = true;
		branchService.update(branch).success(function(){
			branch.isSaving = false;
		});
	};

	//Bo chinh sua 1 branch
	$scope.cancelEdit= function(branch){
		//Phuc hoi lai branch ban dau, do ko save
		angular.copy(branch.origin, branch);
		branch.isEdit = false;
	};

	$scope.onDeleteBranch = function(branch) {
			var modalInstance = $modal.open({
				templateUrl: 'deleteBranchModal.html',
				controller: 'BAdeleteBranchCtrl',
				size: '',
				resolve:{
					branch: [function(){
						return branch;
					}]
				}
			});
			//Thanh cong thi xoa chi nhanh ra khoi hien thi
			modalInstance.result.then(function(branch){
				$scope.$root.$broadcast("onDeleteBranchEvent",{
					id: branch._id.$oid,
				});
				$state.go("home");

			});
	};

}]);


app.controller('BAdeleteBranchCtrl',
 ['$scope', 'branch', '$modalInstance', 'BAbranchService',
 function($scope, branch, $modalInstance, branchService) {
	$scope.branch = branch;
	//Xoa chi nhanh
	$scope.deleteBranch = function(){
		branchService.destroy($scope.branch).success(function(){
			 $modalInstance.close(branch);
		});
	};
}]);
