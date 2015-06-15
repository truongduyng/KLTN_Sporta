app.controller('shareVenueCtrl', ['$scope', 'FileUploader', '$cookies', '$state', 'shareVenueService', 'Flash', 'geocodingService',
	function($scope, FileUploader, $cookies, $state, shareVenueService, Flash, geocodingService) {
		$scope.venue = {
			name: '',
			phone: '',
			address: '',
			description: '',
		};

		$scope.uploader = new FileUploader();

		//filter for image
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function(item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		$scope.uploader.onCompleteAll = function() {
			onUploadedAllImage();
		};

		function onUploadedAllImage() {
			$scope.venue.name = "";
			$scope.venue.description = "";
			$scope.venue.phone = "";
			$scope.venue.address = "";
			$scope.uploader.clearQueue();
			Flash.create("success", "Cảm ơn bạn đã chia sẽ nơi chơi thể thao với mọi người ", 'myalert');
			$state.go("venueDetail", {
				id: $scope.venue._id.$oid,
			});
		};

		$scope.uploader.onBeforeUploadItem = function(file) {
			file.headers = {
				'X-CSRF-TOKEN': $cookies.get('XSRF-TOKEN'),
			};
			file.url = "/venues/" + $scope.venue._id.$oid + '/add_photo.json';
		};

		//Gui yeu cau
		$scope.onSendVenue = function() {
			// //Cho test do ko co mang de load map
			// $scope.venue.latitude = '106.3405307';
			// $scope.venue.longitude = '10.3581198';
			// console.log("venue: ", $scope.venue);
			console.log("venue before create: ", $scope.venue);
			shareVenueService.create($scope.venue)
				.success(function(data) {
					//Sau khi tao ra venue,kiem tra xem co image hay ko
					//neu co thi tien hanh upload
					if (!$scope.uploader.queue || $scope.uploader.queue.length == 0) {
						onUploadedAllImage();
					}
					$scope.uploader.uploadAll();
				}).error(function(data, status) {
					if (status == '401') {
						$scope.$emit("onRequireLogin");
					} else {
						// Flash.create("danger", "Lỗi xảy ra khi post, bạn vui lòng thử lại", 'myalert');
					}
				});
		};


		//Cho tim kiem tren ban do
		//Bat su kien load map thanh cong
		$scope.$on('mapInitialized', function(event, map) {
			$scope.map = map;
		});
		$scope.address = ""; //Dia chi cho tim vi tri
		
		$scope.onSearchPosition = function() {
			$scope.isFinding = true;
			geocodingService.latLngForAddress($scope.address).then(function(position) {
				$scope.isFinding = false;
				$scope.error = "";
				setMarker(position);
			}, function() {
				$scope.isFinding = false;
				$scope.error = "Không thể tìm kiếm vị trí bạn muốn tìm. Bạn vui lòng thử lại";
				Flash.create("danger", "Không thể tìm kiếm vị trí bạn muốn tìm. Bạn vui lòng thử lại", 'myalert');
			});
		};

		$scope.onSearchCurrentPosition = function() {
			// $scope.isFinding = true;
			geocodingService.currentPosition().then(function(position) {
				//$scope.isFinding = false;
				$scope.error = "";
				setMarker({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			}, function(error) {
				// $scope.isFinding = false;
				$scope.error = "Không thể lấy vị trí hiện tại của bạn";
				Flash.create("danger", "Không thể lấy vị trí hiện tại của bạn",'myalert');
			});
		};

		function createMarker(lat, lng) {
			// console.log(document.getElementById("customMarker").outerHTML);
			var position = new google.maps.LatLng(lat, lng);
			var image = "PlaceHolder";
			// var HtmlLayout =
			// 	"<div  style='position: relative; width:100px; height:100px;'>" + "<img style='display:block; left:15px; top:7px; position:absolute; z-index:10s' class='img-circle width='70px' height='70px'" + "src='" + image + "' >" + "<img style='display:block;z-index: 100;'' width='100px' height='100px'" + "src='/assets/application/placeholder/marker_layout.png'></div>";
			var HtmlLayout = document.getElementById("customMarker").innerHTML;
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
			$scope.venue.latitude = position.lat;
			$scope.venue.longitude = position.lng;
			//Bo marker cu
			if (marker) {
				marker.setMap(null);
			}
			//Tao ra marker tai vi tri moi
			marker = createMarker(position.lat, position.lng);
			marker.setMap($scope.map);
			$scope.map.setCenter(marker.getPosition());
			$scope.map.setZoom(15);
			//Dang ki su kien dragend cho marker de lay vi tri moi
			google.maps.event.addListener(marker, 'dragend', function() {
				$scope.venue.latitude = marker.getPosition().lat();
				$scope.venue.longitude = marker.getPosition().lng();
				console.log("new Venue when dragend: ", $scope.venue);
			});
		};

	}
]);
