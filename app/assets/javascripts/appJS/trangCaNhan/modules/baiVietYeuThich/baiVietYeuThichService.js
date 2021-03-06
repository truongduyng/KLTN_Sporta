app.factory('baiVietYeuThichService', ['$http', '$q', function($http, $q) {
	var o = {
		posts: [],
		total: 0,
	};

	o.get = function(username, text_search, page, per_page) {

		if (text_search) {
			var url = "/posts/" + username + "/" + text_search +"/get_favorite_posts_by_username.json" + "?page=" + page + "&per_page=" + per_page;
		}else{
			var url = "/posts/" + username + "/get_favorite_posts_by_username.json";
		};

		var canceller = $q.defer();
		var cancel = function(reason) {
			canceller.resolve(reason);
		};

		var promise = $http.get(url, {
			timeout: canceller.promise
		}).success(function(data) {
			angular.copy(data.posts, o.posts);
			o.total = data.total;
		});
		return {
			promise: promise,
			cancel: cancel,
		};
	};

	o.unfavorite = function(post) {
		var id = post._id.$oid;
		var url = "/favorite_posts/" + id + "/remove.json";
		return $http.put(url).success(function() {
			var index = o.posts.indexOf(post);
			o.posts.splice(index, 1);
			o.total--;
		});
	};


	return o;
}]);