services.factory('tickets',['$http','Auth', 'Flash','$state', function($http, Auth, Flash, $state){

  var object = {
    tickets: [],
    bussiness_owner: null,
    // dispatcher: new WebSocketRails('localhost:3001/websocket'),
    dispatcher: new WebSocketRails('128.199.176.52:3001/websocket'),
    channel: null
  };

  object.getTickets = function(ticket_query) {

    for (var i = 0; i < object.tickets.length; i++) {
      object.clearviewTicket(object.tickets[i]._id.$oid);
    };

    return $http.get('/tickets/'+ticket_query.date+'/'+ticket_query.branch_id + '.json').success(function(data){

      angular.copy(data, object.tickets);

      for (var i = 0; i < object.tickets.length; i++) {
        object.viewTicket(object.tickets[i]);
      };

      object.check_td_in_past(ticket_query.date);

    });
  };

  object.create = function(ticket){
    return $http.post('tickets.json', ticket).success(function(data){
      Flash.create('success', "Yeh! Đặt sân thành công.", 'myalert');
    }).error(function(errors){
      console.log(errors);
      Flash.create('danger', "Sân này đã được đặt bởi người khác hoặc quá trình thất bại. Xin thử lại!", 'myalert');
    });
  };

  object.update = function(ticket_update){
    return $http.post('tickets/update.json',ticket_update).success(function(data){
      Flash.create('success', "Yeh! Cập nhật thành công.", 'myalert');
    })
    .error(function(){
      Flash.create('danger', '<strong>Ops!</strong> Không thể cập nhật vé này.', 'myalert');
    });
  };

  object.update_status = function(ticket_update){
    return $http.post('tickets/update_status.json',ticket_update).success(function(data){
      Flash.create('success', "Yeh! Cập nhật thành công.", 'myalert');
    })
    .error(function(){
      Flash.create('danger', '<strong>Ops!</strong> Không thể cập nhật vé này.', 'myalert');
    });
  };

  object.delete = function(ticket_id){
    return $http.delete('/tickets/'+ ticket_id).success(function(data){

    })
    .error(function(data){
      Flash.create('danger', '<strong>Gruh!</strong> Không thể xóa vé ở trạng thái này!', 'myalert');
    });
  };

  object.hourtoview = function(hour){
    if (hour-Math.floor(hour) > 0)
      return Math.floor(hour) + ':' + (hour-Math.floor(hour))*60;
    else
      return  Math.floor(hour)+ ':00';
  };

  object.change_time_to_float = function(mytime){
    if (mytime != null) {
      var time_split = mytime.split(":");
      return parseFloat(time_split[0]) + (parseFloat(time_split[1])/60.0);
    };
    return null;
  };

  object.calculate_price = function(time_begin, time_end, branch, asset_id){
    var hbegin = object.change_time_to_float(time_begin);
    var hend = object.change_time_to_float(time_end);
    for(i=0; i < branch.assets.length; i++){
      if(branch.assets[i]._id.$oid == asset_id){

        for(j=0; j<branch.asset_categories.length; j++){
          if(branch.asset_categories[j]._id.$oid == branch.assets[i].asset_category_id.$oid){

            var result_price = 0;

            for(t=0;t<branch.asset_categories[j].fees.length;t++){
              var begin_time_fee = object.change_time_to_float(branch.asset_categories[j].fees[t].begin_time);
              var end_time_fee = object.change_time_to_float(branch.asset_categories[j].fees[t].end_time);
              if (begin_time_fee<=hbegin && hbegin < end_time_fee){
                if(hend <= end_time_fee){
                  result_price += branch.asset_categories[j].fees[t].price*(hend-hbegin);
                }
                else{
                  result_price += branch.asset_categories[j].fees[t].price*(end_time_fee-hbegin);
                  hbegin = end_time_fee;
                }
              }
            }
            return Math.ceil(result_price);
          }
        }
      }
    }
  }

  object.check_ticket_status = function(now){
    for (var i = 0; i < object.tickets.length; i++) {

      if(object.tickets[i].status == 'new' && now.getTime() > new Date(object.tickets[i].begin_use_time).getTime() + 1000*60*10){
        object.update_status({
          ticket_id: object.tickets[i]._id.$oid,
          status: "over"
        });
      }

      if(object.tickets[i].status == 'doing' && now.getTime() > new Date(object.tickets[i].end_use_time).getTime()){
        object.update_status({
          ticket_id: object.tickets[i]._id.$oid,
          status: "waiting"
        });
      }
    };
  }

  //Check time to change color of tr --------------------------------------
  object.check_td_in_past = function(date){
    var datenow = new Date();

    if (date < datenow.toJSON().slice(0,10)) {
      $("table.tablebooking tbody tr.time_td").each(function(index){
        $(this).addClass('inthepast');
      });
    } else {

      if (date > datenow.toJSON().slice(0,10)) {
        $("table.tablebooking tbody tr.time_td").each(function(index){
          $(this).removeClass('inthepast');
        });
      } else {

        var timenow = object.change_time_to_float(datenow.getHours() + ':' + datenow.getMinutes());
        $("table.tablebooking tbody tr.time_td").each(function(index){
          if ($(this).attr('time') < timenow) {
            $(this).addClass('inthepast');
          } else {
            $(this).removeClass('inthepast');
          }
        });
      }
    }
  };

  object.viewTicket = function(ticket){

    var begintime = object.change_time_to_float(ticket.begin_use_time.slice(11,16));

    if (ticket.begin_use_time.slice(0,10) == ticket.end_use_time.slice(0,10)){
      var endtime = object.change_time_to_float(ticket.end_use_time.slice(11,16));
    }
    else{
      var endtime = 24.0;
    }

    switch(begintime-Math.floor(begintime)){
      case 0.5:
      var ticket_td = $('td#td_'+Math.floor(begintime)+'_30_'+ticket.asset_id.$oid)[0];
      break;
      case 0.25:
      var ticket_td = $('td#td_'+Math.floor(begintime)+'_15_'+ticket.asset_id.$oid)[0];
      break;
      case 0.75:
      var ticket_td = $('td#td_'+Math.floor(begintime)+'_45_'+ticket.asset_id.$oid)[0];
      break;
      default:
      var ticket_td = $('td#td_'+begintime+'_'+ticket.asset_id.$oid)[0];
    };

    $('.calendar_content').append($("<div id='"+ ticket._id.$oid + "' class='ticket'><span> "+ ticket.customer_name + "</span><br><span class='private_info' style = 'display: none;'>" +"SĐT: <strong>" +ticket.customer_phone + "</strong><br></span><span>" + ticket.begin_use_time.slice(11,16) + ' - '+ ticket.end_use_time.slice(11,16) + "</span>,<span> Giá: <strong>" + ticket.price + "</strong></span></div>").click(function(event){
      $('#minibooking').css('display','none');
      $('div#ticket_temp').removeClass('ticket_new');
      $('#miniedit').css('display','inline');
      $('span#time_ticket').html(ticket.begin_use_time.slice(11,16)+ ' - '+ticket.end_use_time.slice(11,16));
      $('p#price_ticket').html('Giá: '+ ticket.price);
      $('p#ticket_id_hidden').html(ticket._id.$oid);

        if(event.offsetY == undefined) // this works for Firefox
        {
          eventoffsetY = event.pageY-$('div#' + ticket._id.$oid).offset().top;
        }
        else
        {
          eventoffsetY = event.offsetY;
        }

        var edit_top = event.pageY - $(window).scrollTop()- $('#miniedit').height() - eventoffsetY -10;

        var edit_right = $(window).width() - event.pageX - $('#miniedit').width()/2;
        edit_top = edit_top>0? edit_top : 0;
        edit_right = edit_right>0? edit_right : 0;
        $('#miniedit').css({top: edit_top, right: edit_right});
      })
    );

    //

    $('div#' + ticket._id.$oid).css({
      top: ticket_td.offsetTop+2,
      width: ticket_td.offsetWidth-3,
      left: ticket_td.offsetLeft,
      height: ticket_td.offsetHeight*4*(endtime-begintime)-3
    });


    if(Auth._currentUser != null){

      if (Auth._currentUser._id.$oid == object.bussiness_owner)
        $('div#' + ticket._id.$oid + ' span.private_info').css('display', 'inline');
    };

    switch(ticket.status) {
      case "new":

      if(Auth._currentUser != null && $state.current.name ==='ticket_management' && Auth._currentUser._id.$oid == object.bussiness_owner){

        $('.calendar_content').append(
          $("<i class='fa fa-arrow-circle-o-right ticket_status_icon' id='" + ticket._id.$oid + "_i'></i>").click(function(){
            object.update_status({
              ticket_id: ticket._id.$oid,
              status: "doing"
            });
          })
          );

        $('i#' + ticket._id.$oid + '_i').css({
          top: ticket_td.offsetTop + $('div#' + ticket._id.$oid).height() - $('i#' + ticket._id.$oid + '_i').height() + 3,
          left: ticket_td.offsetLeft + $('div#' + ticket._id.$oid).width()- $('i#' + ticket._id.$oid + '_i').width()
        });
      };

      $('div#'+ticket._id.$oid).addClass('ticket_new');
      break;

      case "doing":
      //doing
      $('div#'+ticket._id.$oid).addClass('ticket_doing');
      break;

      case "over":
      $('div#'+ticket._id.$oid).remove();
      break;

      case "waiting":
      if(Auth._currentUser != null && Auth._currentUser._id.$oid == object.bussiness_owner && $state.current.name ==='ticket_management'){

        $('.calendar_content').append(
          $("<i class='fa fa-check-circle-o ticket_status_icon' id='" + ticket._id.$oid + "_i'></i>").click(function(){
            object.update_status({
              ticket_id: ticket._id.$oid,
              status: "done"
            });
          })
          );

        $('i#' + ticket._id.$oid + '_i').css({
          top: ticket_td.offsetTop + $('div#' + ticket._id.$oid).height() - $('i#' + ticket._id.$oid + '_i').height() + 3,
          left: ticket_td.offsetLeft + $('div#' + ticket._id.$oid).width()- $('i#' + ticket._id.$oid + '_i').width()
        });
      }
      $('div#'+ticket._id.$oid).addClass('ticket_waiting');
      break;

      case "done":
      $('div#'+ticket._id.$oid).addClass('ticket_done');
      break;
      default: break;
    }
  };

  object.clearviewTicket = function(ticket_id){
    $('div#'+ ticket_id).remove();
    $('i#'+ ticket_id +'_i').remove();
  };

  return object;
}]);