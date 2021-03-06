app.controller('BAeditBranchCtrl', ['$scope', 'geocodingFtry', 'logoFilter',
	'BAbranchService', '$state',
 function($scope, geocodingFtry, logoFilter, branchService, $state) {
	//Dia chi cho tim kiem vi tri
	$scope.address = "";

  $scope.time_list = "0:00 0:30 1:00 1:30 2:00 2:30 3:00 3:30 4:00 4:30 5:00 5:30 6:00 6:30 7:00 7:30 8:00 8:30 9:00 9:30 10:00 10:30 11:00 11:30 12:00 12:30 13:00 13:30 14:00 14:30 15:00 15:30 16:00 16:30 17:00 17:30 18:00 18:30 19:00 19:30 20:00 20:30 21:00 21:30 22:00 22:30 23:00 23:30 24:00".split(" ");


	//Gan form vao scope hien tai
	$scope.$watch('newBranchAddressForm', function(newValue, oldValue, scope) {
		$scope.newBranchAddressForm = newValue;
	});

	//Theo doi neu branch.address thay doi thi cap nhat $scope.address neu no ko dirty
	$scope.$watch('branch.address', function(newValue, oldValue, scope) {

		if (!$scope.address) {
			$scope.address = '';
		}
		//Neu address ko dirty thi lay no la gia tri cua branch.address
		if (!$scope.newBranchAddressForm.address.$dirty) {
			$scope.address = newValue;
		}

	});

	//Bat su kien load map thanh cong
	$scope.$on('mapInitialized', function(event, map) {
		if(map.onstate != 'chinhSuaChiNhanh'){
			return;
		}
		$scope.map = map;
		//Danh dau marker tai vi tri cua branch
		setMarker({
			lat: $scope.branch.coordinates[1],
			lng: $scope.branch.coordinates[0],
		});
	});

	$scope.onSearchPosition = function() {
		$scope.isFinding = true;
		geocodingFtry.latLngForAddress($scope.address).then(function(position) {
			$scope.isFinding = false;
			$scope.error = "";
			setMarker(position);
		}, function() {
			$scope.isFinding = false;
			$scope.error = "Không thể tìm kiếm vị trí bạn muốn tìm. Bạn vui lòng thử lại";
			// Flash.create("danger", "Không thể tìm kiếm vị trí bạn muốn tìm. Bạn vui lòng thử lại");
		});
	};

	$scope.onSearchCurrentPosition = function() {
		geocodingFtry.currentPosition().then(function(position) {
			$scope.error = "";
			setMarker({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		}, function(error) {
			// $scope.isFinding = false;
			$scope.error = "Không thể lấy vị trí hiện tại của bạn";
			// Flash.create("danger", "Không thể lấy vị trí hiện tại của bạn");
		});
	};

	function createMarker(lat, lng, image) {
		var position = new google.maps.LatLng(lat, lng);
		//Lay html
		$("#customMarker").find('.img-avatar').attr("src", logoFilter(image)).html();
		var HtmlLayout = $("#customMarker").html();
		var marker = new RichMarker({
			position: position,
			draggable: true,
			flat: true,
			content: HtmlLayout,
		});
		return marker;
	};

	var marker = null;
	function setMarker(position) {
		$scope.branch.lat = position.lat;
		$scope.branch.lng = position.lng;
		//Bo marker cu
		if (marker) {
			marker.setMap(null);
		}
		//Tao ra marker tai vi tri moi
		marker = createMarker(position.lat, position.lng, "application/placeholder/sporta_icon.png");
		marker.setMap($scope.map);
		$scope.map.setCenter(marker.getPosition());
		$scope.map.setZoom(17);
		//Dang ki su kien dragend cho marker de lay vi tri moi
		google.maps.event.addListener(marker, 'dragend', function() {
			$scope.branch.lat = marker.getPosition().lat();
			$scope.branch.lng = marker.getPosition().lng();
		});
	};

}]);