app.controller('ticketCtrl', ['$scope', '$http', 'tickets', 'ticket_id', 'branch', 'Auth', '$modal', 'dt', 'Flash', function($scope, $http, tickets, ticket_id, branch, Auth, $modal, dt, Flash){

  $scope.branch = branch;
  $scope.hour_begin_list = [];
  $scope.hour_end_list = [];
  $scope.dt = dt;
  var dt_now = new Date().toJSON().slice(0,10);

  for (var i = 0; i < tickets.tickets.length; i++) {
    if(tickets.tickets[i]._id.$oid == ticket_id){
      $scope.ticket = tickets.tickets[i];
      $scope.price = tickets.tickets[i].price;
      break;
    }
  }

  $scope.update_price = function(){
    $scope.price = tickets.calculate_price($scope.hour_begin,$scope.hour_end,branch, $scope.ticket.asset_id.$oid);
  }

  // build $scope.hour_end_list
  $scope.update_hour_end = function(firstrun){
    $scope.hour_end_list = [];
    var float_hour_begin = tickets.change_time_to_float($scope.hour_begin);
    var max_time_length = float_hour_begin + 4;

    for (var i = 0; i < tickets.tickets.length; i++) {
      if(tickets.tickets[i].asset_id.$oid == $scope.ticket.asset_id.$oid && tickets.tickets[i] != $scope.ticket){
        var begintime = tickets.change_time_to_float(tickets.tickets[i].begin_use_time.slice(11,16));
        if(float_hour_begin < begintime && begintime < max_time_length)
          max_time_length = begintime;
      }
    };

    for (var i = float_hour_begin+1; i <= max_time_length; i+=0.25) {
      if(i>24.0) break;
      $scope.hour_end_list.push(tickets.hourtoview(i));
    };
    if ($scope.hour_end_list.length) {

      if(firstrun){
        $scope.hour_end = tickets.hourtoview(hour_end);
      }
      else{
        $scope.hour_end = $scope.hour_end_list[0];
        $scope.price = tickets.calculate_price($scope.hour_begin,$scope.hour_end,branch, $scope.ticket.asset_id.$oid);
      }
      return true;
    }
    else{
      return false;
    }
  };

  //==============================================================================
  var timenow = dt.toJSON().slice(0,10) == dt_now? tickets.change_time_to_float(new Date().getHours() + ':' + new Date().getMinutes()) : dt.toJSON().slice(0,10) < dt_now? 24 : 0 ;

  var hour_begin = tickets.change_time_to_float($scope.ticket.begin_use_time.slice(11,16));
  var hour_end = tickets.change_time_to_float($scope.ticket.end_use_time.slice(11,16))? tickets.change_time_to_float($scope.ticket.end_use_time.slice(11,16)) : 24;

  if (hour_begin-timenow < -10.0/60 ) {
    $scope.hour_begin_list.push(tickets.hourtoview(hour_begin));
    $scope.hour_begin = $scope.hour_begin_list[0];
    $scope.hour_end_list.push(tickets.hourtoview(hour_end));
    $scope.hour_end = $scope.hour_end_list[0];
  } else {
    // build time data
    var min_begin_time = customroundtime(timenow);
    var max_end_time = tickets.change_time_to_float($scope.branch.branch.end_work_time);
    for (var i = 0; i < tickets.tickets.length; i++) {

      if(tickets.tickets[i].asset_id.$oid == $scope.ticket.asset_id.$oid && tickets.tickets[i]._id.$oid != $scope.ticket._id.$oid){

        var endtime = tickets.change_time_to_float(tickets.tickets[i].end_use_time.slice(11,16));
        var begintime = tickets.change_time_to_float(tickets.tickets[i].begin_use_time.slice(11,16));

        if(hour_begin >= endtime && endtime > min_begin_time)
          min_begin_time = endtime;
        if(hour_end <= begintime && begintime < max_end_time)
          max_end_time = begintime;
      }
    };

    for (var i = min_begin_time; i <= max_end_time -1; i+=0.25) {
      $scope.hour_begin_list.push(tickets.hourtoview(i));
    };
    if ($scope.hour_begin_list.length) {
      $scope.hour_begin = tickets.hourtoview(hour_begin);
    }
    $scope.update_hour_end(true);
  }

  //=============================================================================
  function customroundtime(time){
    var fraction = time - Math.floor(time);
    return fraction > 0.5? fraction > 0.75? Math.ceil(time):Math.floor(time)+0.5 : fraction > 0.25? Math.floor(time)+0.5:Math.floor(time);
  }
  //=============================================================================

  $scope.close_modal = function(){
    $scope.$close();
    $('#miniedit').css('display','none');
  };

  $scope.update_ticket = function(new_hour_begin, new_hour_end){
    Auth.currentUser().then(function(user) {

      if (user.role_name == 'user'){
        if ( hour_begin-timenow < -10.0/60) {
          var message = '<strong>Hey!</strong> Không thể xóa vé đã qua!';
          Flash.create('danger', message, 'myalert');
          $scope.close_modal();
          return false;
        }

        if($scope.ticket.user_id == null || $scope.ticket.user_id.$oid != Auth._currentUser._id.$oid){
          var message = '<strong>Hey!</strong> Không thể xóa vé của người khác!';
          Flash.create('danger', message, 'myalert');
          $scope.close_modal();
          return false;
        }
      }

      var begintime = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),new_hour_begin.split(":")[0],new_hour_begin.split(":")[1]);
      var endtime = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),new_hour_end.split(":")[0],new_hour_end.split(":")[1]);
      tickets.update({
        ticket_id: ticket_id,
        begin_use_time: begintime,
        end_use_time: endtime,
        price: $scope.price
      });
      $scope.close_modal();

    }, function(error) {
      $modal.open({
        templateUrl: 'appJS/auth/_login.html',
        controller: 'authCtrl'
      });
    });
}

}]);