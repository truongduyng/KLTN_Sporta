app.controller('bookingCtrl', ['$scope', '$http', 'Auth', '$modal', 'tickets','branch', '$interval','Flash', function($scope, $http, Auth, $modal, tickets, branch, $interval, Flash){

  $scope.signedIn = Auth.isAuthenticated;
  $scope.$on('$viewContentLoaded',function(event){
    $('#sidebar').css({display: 'none'});
    $('#sidebar').removeClass('col-sm-2');
    $('#main-content').removeClass('col-sm-10');
    $('#main-content').addClass('col-sm-12');
    timeline();
  });

  $scope.rate = 4;
  $scope.isReadonly = false;
  $scope.mindate = new Date();
  $scope.dt = new Date();
  $scope.dt_end_everyweek_booking = $scope.dt;
  $scope.showtimeline = true;
  $scope.td_height = 20; //height of td


  $scope.branch = branch.data;
  $scope.work_time = [];
  for (var i = tickets.change_time_to_float($scope.branch.branch.begin_work_time); i < tickets.change_time_to_float($scope.branch.branch.end_work_time); i++) {
    $scope.work_time.push(i);
  };

  tickets.channel =  tickets.dispatcher.subscribe($scope.branch.branch._id.$oid);
  tickets.bussiness_owner = $scope.branch.owner.$oid;
  tickets.getTickets({date: $scope.dt.toJSON().slice(0,10), branch_id: $scope.branch.branch._id.$oid});

  $scope.date_change = function(){
    $scope.close_minibooking();
    $scope.close_miniedit();
    $scope.dt_end_everyweek_booking = $scope.dt;
    if ($scope.dt.toJSON().slice(0,10) == new Date().toJSON().slice(0,10))
      $scope.showtimeline = true;
    else
      $scope.showtimeline = false;
    tickets.getTickets({date: $scope.dt.toJSON().slice(0,10), branch_id: $scope.branch.branch._id.$oid});
  };

  $scope.fast_book_open = function(hour,asset_id,event){
    //repair data
    if (repair_data(hour, asset_id)) {
      // display dialog booking
      display_booking_dialog(hour, event);
    }
    else{
      $scope.close_minibooking();
    }
  };

  $scope.asset_cate_details = function(asset_cate_id){
    for(j=0; j< $scope.branch.asset_categories.length; j++){
      if($scope.branch.asset_categories[j]._id.$oid == asset_cate_id){
        return $scope.branch.asset_categories[j].name;
      }
    }
  }

  function repair_data(hour, asset_id){
    $scope.asset_id = asset_id;
    $scope.hour_begin = tickets.hourtoview(hour);
    $scope.hour_end_list = [];

    var timenow = $scope.dt.toJSON().slice(0,10) == new Date().toJSON().slice(0,10)? tickets.change_time_to_float(new Date().getHours() + ':' + new Date().getMinutes()) : $scope.dt.toJSON().slice(0,10) < new Date().toJSON().slice(0,10)? 24 : 0 ;

    if(Auth._currentUser != null){

      if (((Auth._currentUser.roles.indexOf('user') > -1) && (hour-timenow) < -10.0/60)) return false;
      if (Auth._currentUser._id.$oid == tickets.bussiness_owner){
        Flash.create("danger", "Hãy vào trang quản lý để đặt, sửa hay xóa lịch đặt trong doanh nghiệp của bạn.", "myalert");
        return false;
      }
    }

    var max_time_length = hour + 4;
    for (var i = 0; i < tickets.tickets.length; i++) {
      if(tickets.tickets[i].asset_id.$oid == asset_id){
        var begintime = tickets.change_time_to_float(tickets.tickets[i].begin_use_time.slice(11,16));
        var endtime = tickets.change_time_to_float(tickets.tickets[i].end_use_time.slice(11,16));
        if(begintime <= hour && hour < endtime) return false;
        if(hour < begintime && begintime < max_time_length)
          max_time_length = begintime;
      }
    };

    for (var i = hour+1; i <= max_time_length; i+=0.25) {
      if(i>24.0) break;
      $scope.hour_end_list.push(tickets.hourtoview(i));
    };

    if ($scope.hour_end_list.length) {
      $scope.hour_end = $scope.hour_end_list[0];
      $scope.price = tickets.calculate_price($scope.hour_begin,$scope.hour_end,$scope.branch, $scope.asset_id);
      return true;
    }
    else{
      return false;
    }
  }

  function display_booking_dialog(hour,element){
    if(hour < 23.5){
      if (Auth._currentUser != null) {
        $scope.customer_name = Auth._currentUser.fullname;
        $scope.customer_phone = Auth._currentUser.phone;
      };
      $scope.showtimeintd(hour, element, false); //clear content in td

      $scope.close_miniedit();

      $('div#ticket_temp').css({'top': element.currentTarget.offsetTop,'width': element.currentTarget.offsetWidth-3, 'left': element.currentTarget.offsetLeft,'height': $scope.td_height*4-3});

      $('div#ticket_temp').addClass('ticket_new');
      $('#minibooking').css('display','inline');


      var booking_height = $('#minibooking').height()>0? $('#minibooking').height(): 165;
      var booking_top = element.pageY - $(window).scrollTop()- booking_height - 30;
      var booking_right = $(window).width() - element.pageX - 200;
      booking_top = booking_top>0? booking_top : 0;
      booking_right = booking_right>0? booking_right :0;
      $('#minibooking').css({top: booking_top, right: booking_right});
    }
  }

  $scope.update_hour_end = function(){
    var hbegin = tickets.change_time_to_float($scope.hour_begin);
    var hend = tickets.change_time_to_float($scope.hour_end);
    $scope.price = tickets.calculate_price($scope.hour_begin,$scope.hour_end,$scope.branch, $scope.asset_id);
    $('div#ticket_temp').css('height', $scope.td_height*4*(hend-hbegin)-3);
  }

  $scope.close_minibooking = function(){
    $('#minibooking').css('display','none');
    $('div#ticket_temp').removeClass('ticket_new');
  };

  $scope.close_miniedit = function(){
    $('#miniedit').css('display','none');
  };

  $scope.ticket_create = function(dt,hour_begin,hour_end){
    Auth.currentUser().then(function(user) {
      var begintime = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),hour_begin.split(":")[0],hour_begin.split(":")[1]);
      var endtime = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),hour_end.split(":")[0],hour_end.split(":")[1]);

      $scope.dt_end_everyweek_booking.setHours(23,59,59,999);

      tickets.create({
        begin_use_time: begintime,
        end_use_time: endtime,
        price: $scope.price,
        status: "new",
        branch_id: $scope.branch.branch._id.$oid,
        asset_id: $scope.asset_id,
        date_end_everyweek_booking: $scope.dt_end_everyweek_booking,
        customer_name: $scope.customer_name,
        customer_phone: $scope.customer_phone
      });

      $scope.close_minibooking();
      $scope.iseveryweek = false;
      $('div.everyweek').css('display', 'none');
      $scope.dt_end_everyweek_booking = $scope.dt;

    }, function(error) {
      $scope.close_minibooking();
      $modal.open({
        templateUrl: 'appJS/auth/_login.html',
        controller: 'authCtrl'
      });
    }
    );
};
  //
  $scope.ticket_delete = function(){
    Auth.currentUser().then(function(user) {

      for (var i = 0; i < tickets.tickets.length; i++) {
        if(tickets.tickets[i]._id.$oid == $('p#ticket_id_hidden').html()){
          var ticket_del = tickets.tickets[i];
          break;
        }
      }

      var timenow = $scope.dt.toJSON().slice(0,10) == new Date().toJSON().slice(0,10)? tickets.change_time_to_float(new Date().getHours() + ':' + new Date().getMinutes()) : $scope.dt.toJSON().slice(0,10) < new Date().toJSON().slice(0,10)? 24 : 0 ;

      var hour_begin = tickets.change_time_to_float(ticket_del.begin_use_time.slice(11,16));

      if (user.roles.indexOf('user') > -1){
        if (hour_begin-timenow < -10.0/60) {
          var message = '<strong>Gruh!</strong> Không thể xóa vé đã qua!';
          Flash.create('danger', message, 'myalert');
          $scope.close_miniedit();
          return false;
        }

        if(ticket_del.user_id == null || ticket_del.user_id.$oid != Auth._currentUser._id.$oid){
          var message = '<strong>Gruh!</strong> Không thể xóa vé của người khác!';
          Flash.create('danger', message, 'myalert');
          $scope.close_miniedit();
          return false;
        }
      }

      tickets.delete($('p#ticket_id_hidden').html());
      $scope.close_miniedit();
    },function(error){
      $modal.open({
        templateUrl: 'appJS/auth/_login.html',
        controller: 'authCtrl'
      });
    });
};

  //
  $scope.ticket_edit = function(){
    $scope.close_miniedit();
    var ticket_update = $modal.open({
      templateUrl: "appJS/ticket/_ticket_update.html",
      controller: "ticketCtrl",
      resolve: {
        ticket_id: function(){
          return $('p#ticket_id_hidden').html();
        },
        branch: function(){
          return $scope.branch;
        },
        dt: function(){
          return $scope.dt;
        }
      }
    });
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.viewweekbooking = function(){
    if ($scope.iseveryweek)
      $('div.everyweek').css('display', 'inline');
    else
      $('div.everyweek').css('display', 'none');
  }

  var previouscolor = '';
  $scope.showtimeintd = function(hour,element,show){
    $td = $(element.currentTarget);
    $th = $td.closest('table').find('th').eq($td.index()+1);
    if(show){
      previouscolor = $(element.currentTarget).css('background-color');
      $(element.currentTarget).css('background-color','#cee0f4');
      $(element.currentTarget).html('<strong>'+ $th.html() +'</strong>'+', '+'<strong>'+ tickets.hourtoview(hour) + '</strong>');
    }
    else{
      $(element.currentTarget).css('background-color',previouscolor);
      $(element.currentTarget).html("");
    }
  }

  $scope.hoveringOver = function(value) {
    $scope.overstar = value;
    $scope.ishoverstar = true;
  };

  //Real time -------------------------------------------------------------
  tickets.channel.bind('create_ticket', function(ticket) {
    if ($scope.dt.toJSON().slice(0,10) == ticket.begin_use_time.slice(0,10)){
      tickets.tickets.push(ticket);
      tickets.viewTicket(ticket);
    }
  });

  tickets.channel.bind('update_ticket', function(ticket) {
    if ($scope.dt.toJSON().slice(0,10) == ticket.begin_use_time.slice(0,10)){
      tickets.clearviewTicket(ticket._id.$oid);
      for (var i = 0; i < tickets.tickets.length; i++) {
        if (tickets.tickets[i]._id.$oid == ticket._id.$oid) {
          tickets.tickets[i] = ticket;
          tickets.viewTicket(ticket);
          break;
        }
      };
    }
  });

  tickets.channel.bind('delete_ticket', function(ticket_id) {

    tickets.clearviewTicket(ticket_id);
    for (var i = 0; i < tickets.tickets.length; i++) {
      if (tickets.tickets[i]._id.$oid == ticket_id) {
        tickets.tickets.splice(i,1);
        break;
      }
    };

  });

  //Timeline---------------------------------------------------------------
  function timeline(){

    if($scope.branch.assets.length * 190 < $('.calendar_content').width()){
      $('.tablebooking').css({width: $('.calendar_content').width()});
    }else{
      $('.tablebooking').css({width: 50 + $scope.branch.assets.length * 190});
    }

    var work_time_length = $scope.work_time[$scope.work_time.length-1]-$scope.work_time[0];

    var scrollheight = $scope.td_height * 4 * work_time_length;
    $('hr.timeline').css({width: $('.tablebooking').width()});


    var top_timeline = 45 + Math.floor((parseInt($scope.dt.getHours())*60+parseInt($scope.dt.getMinutes()) - $scope.work_time[0]*60)*scrollheight/(60*work_time_length)); // 23 is height of th

    $('hr.timeline').animate({top: top_timeline},'fast');

    $interval(function(){
      top_timeline += Math.floor(1/(60*work_time_length)*scrollheight);

      if (top_timeline >= scrollheight)
        top_timeline = scrollheight;
      $('hr.timeline').animate({top: top_timeline},'fast');
      tickets.check_td_in_past(new Date().toJSON().slice(0,10));
    },1000*60);
  }
}]);
