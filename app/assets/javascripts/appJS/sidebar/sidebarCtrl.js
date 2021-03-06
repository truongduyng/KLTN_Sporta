app.controller('sidebarCtrl', ['$scope', '$modal', 'clubsFtry', '$state', 'Auth', function($scope, $modal, clubsFtry, $state, Auth) {

  Auth.currentUser().then(function(user) {
    $scope.user = user;
    $scope.loadClubs();
  }, function(error) {});

  $scope.$on('devise:new-session', function(e, user) {
    $scope.user = user;
    $scope.loadClubs();
  });

  $scope.$on('devise:new-registration', function(e, user) {
    $scope.user = user;
    $scope.loadClubs();
  });

  $scope.$on('devise:login', function(e, user) {
    $scope.user = user;
    $scope.loadClubs();
  });

  $scope.$on('devise:logout', function(e, user) {
    $scope.user = {};
    $scope.clubs = [];
  });

  $scope.$on('onChangeUserProfile', function(event, user) {
    angular.copy(user, $scope.user);
  });

  $scope.loadClubs = function() {
    clubsFtry.index().success(function(data) {
      $scope.clubs = clubsFtry.clubs;
    })
  }

  $scope.opennewclub = function() {
    var newclubmodal = $modal.open({
      templateUrl: 'appJS/sidebar/_new_club.html',
      controller: 'newclubmodalCtrl'
    });

    newclubmodal.result.then(function(club) {
      console.log(club);
      clubsFtry.create(club).success(function(result) {
        $state.go('club', {
          club_id: result.id.$oid,
          club_post_id: null
        });
      });
    }, function() {});
  }

  $scope.gotoclub = function(club_id) {
    $state.go('club', {
      club_id: club_id,
      club_post_id: null
    });
  }

  $scope.isbussinessadmin = function() {
    if ($scope.user) {
      return _.some($scope.user.roles, function(role) {
        return role == 'bussiness admin';
      });
    } else {
      return false;
    }
  };

  $scope.isSystemAdmin = function() {
    if ($scope.user) {
      return _.some($scope.user.roles, function(role) {
        return role == 'system admin';
      });
    } else {
      return false;
    }
  };

  //Cho so thich
  $scope.openInterestModal = function() {
    var interestModalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalIntereset.html',
      controller: 'InterestModalCtrl',
      size: "sm",
      resolve: {
        currentUser: function() {
          return $scope.user;
        }
      }
    });
    interestModalInstance.result.then(function() {
      $scope.$root.$broadcast('onChangeInterestEvent');
    }, function() {
      $scope.$root.$broadcast('onChangeInterestEvent');
    });
  };

}]);


app.controller('InterestModalCtrl', ['$scope', '$modalInstance', 'currentUser', 'tagService',
  function($scope, $modalInstance, currentUser, tagService) {
    $scope.searchedText = "";
    $scope.isLoading = true;
    tagService.index().success(function() {

      $scope.isLoading = false;
      listTags = tagService.tags;
      console.log("listTags: ", listTags);
      //chi lay dsanh sach tag ma nguoi dung chua co
      $scope.listTags = _.filter(listTags, function(newTag) {
        findedTag = _.find(currentUser.interests, function(oldTag) {
          if (oldTag._id.$oid == newTag._id.$oid) {
            return true;
          }
        });
        if (findedTag) {
          return false;
        }
        return true;
      });

      $scope.currentUser = currentUser;
      console.log("currentUser: ", $scope.currentUser);

      $scope.addInterest = function(tag) {
        $scope.currentUser.interests.splice($scope.currentUser.interests.length, 0, tag);

        deletedTag = _.find($scope.listTags, function(item) {
          return item._id.$oid == tag._id.$oid;
        });
        $scope.listTags.splice($scope.listTags.indexOf(deletedTag), 1);

        tagService.addInterest(tag);
      };

      $scope.deleteInterest = function(tag) {
        $scope.listTags.splice(0, 0, tag);
        $scope.currentUser.interests.splice($scope.currentUser.interests.indexOf(tag), 1);
        tagService.deleteInterest(tag);
      };

    });

  }
]);