app.factory('postDetailService', ['$http', function($http) {
	var o = {
		post: {},
	};

	o.show = function(id) {
		var promise = $http.get("/posts/" + id + ".json").success(function(data) {
			angular.copy(data, o.post);
		});
		return promise;
	};

	o.like = function(){
		var id = o.post._id.$oid;
		var url = "/posts/" + id + "/like.json";
		return $http.put(url).success(function(data){
			if(o.post.likes == null){
				o.post.likes = [];
			}
			o.post.likes.splice(0, 0, data);
			o.post.like_count++;
		});
	};

	o.unlike = function(){
		var id = o.post._id.$oid;
		var url = "/posts/" + id + "/unlike.json";
		return $http.put(url).success(function(data){
			if(o.post.likes == null){
				o.post.likes = [];
			}
			var index = o.post.likes.indexOf(data);
			o.post.likes.splice(index, 1, data);
			o.post.like_count--;
		});
	};

	o.getKFirstLike = function(k){
		var id = o.post._id.$oid;
		var url = "/posts/" + id + "/get_k_first_like/" + k +  ".json";
		return $http.get(url).success(function(data){
			o.post.likes = data.likes;
			o.post.number_of_remains = data.number_of_remains;
			o.post.like_count = o.post.likes.length + o.post.number_of_remains;
		});
	};

	o.getAllLikes = function(post){
		var url = "/posts/" + post._id.$oid + "/get_all_likes.json";
		return $http.get(url);
	};


	o.favorite = function(){
		console.log(o.post);
		var id = o.post._id.$oid;
		var url = "/favorite_posts/" + id + "/add.json";
		return $http.put(url).success(function(){
			console.log("true");
			o.post.isFavorited = true;
		}).error(function(error){
			console.log(error);
		});
	};

	o.unfavorite = function(){
		var id = o.post._id.$oid;
		var url = "/favorite_posts/" + id + "/remove.json";
		return $http.put(url).success(function(){
			o.post.isFavorited = false;
		});
	};

	o.destroy = function(){
		var id = o.post._id.$oid;
		var url = "/posts/" + id + ".json";
		return $http.delete(url);
	};

	//follow and unfollow post
	o.follow = function(){
		var id = o.post._id.$oid;
		var url  = "/posts/" + id + "/follow.json";
		var promise = $http.put(url).success(function(){
			o.post.followed = true;
		});
		return promise;
	};

	o.unfollow = function(){
		var id = o.post._id.$oid;
		var url  = "/posts/" + id + "/unfollow.json";
		var promise = $http.put(url).success(function(){
			o.post.followed = false;
		});
		return promise;
	};

	return o;
}]);