app.controller('venueDetailCtrl', ['$scope', 'venueDetailService','$modal', 'Flash', 'logoFilter','Auth', '$state', function ($scope, venueDetailService, $modal, Flash, logoFilter, Auth, $state) {

		$scope.signedIn = Auth.isAuthenticated;

		Auth.currentUser().then(function(user){
			$scope.currentUser = user;
		});

		//Update tinh trang user de xet cac quyen them xoa sua
		$scope.$on('devise:new-session', function(e, user) {
			angular.copy(user, $scope.currentUser);
			$state.reload();
		});

		$scope.$on('devise:new-registration', function(e, user) {
			angular.copy(user, $scope.currentUser);
			$state.reload();
		});

		$scope.$on('devise:login', function(e, user) {
			angular.copy(user, $scope.currentUser);
			$state.reload();
		});

		$scope.$on('devise:logout', function(e, user) {
			angular.copy(user, $scope.currentUser);
		});


		$scope.venue = venueDetailService.venue;

		$scope.showImage = function(photo) {
			var modalInstance = $modal.open({
				templateUrl: 'showImageModal.html',
				controller: 'showImageModalCtrl',
				size: 'lg',
				resolve: {
					photo: function() {
						return photo;
					},
					listPhotos: function() {
						return $scope.venue.photos;
					}
				}
			});
		}

		//Su kien khi load map thanh cong
		$scope.$on('mapInitialized', function(event, map) {
			console.log("mapInitialized");
			//Lay anh dai dien cho marker, lua chon 1 trong nhung tam anh nguoi dung up
			var avatar = "notKnow";
			if(map.item.photos != null && map.item.photos.length >= 1){
				avatar = map.item.photos[0].image.thumb.url;
			}

			var marker = createMarker(map.item.coordinates[1], map.item.coordinates[0], avatar);
			marker.setMap(map);
			console.log("marker: ", marker);
			map.setCenter(marker.getPosition());
		});

		function createMarker(lat, lng, image) {
			var position = new google.maps.LatLng(lat, lng);
			//Gan anh cho html layout cua marker
			$("#customMarker").find('.img-avatar').attr("src", logoFilter(image)).html();
			//Lay html
			var HtmlLayout =  $("#customMarker").html();
			var marker = new RichMarker({
				position: position,
				flat: true,
				content: HtmlLayout,
			});
			return marker;
		};

		//Xoa venue
		$scope.onDeleteVenue = function(){
			venueDetailService.destroy($scope.venue).success(function(){
				Flash.create('success',"Xóa thành công chia sẻ địa điểm chơi thể thao", 'myalert');
				$state.go("home");
			});
		};
	}]);