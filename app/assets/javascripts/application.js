//= require_tree .
// require jquery
// require jquery_ujs
// require jquery.ui.all

var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var kates = "";
var comments = ""
var markers = new Array(); 
var marker;
var markerscount = 0;
var bool="true";
var markername = "";
var infoboxoptions = {
                disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(0, -50)
                ,zIndex: null
                ,closeBoxMargin: "-12px 0px"
                ,boxStyle: { 
                background: "#272441"
                  ,opacity: 0.90
                  ,width: "280px"
                }
                ,infoBoxClearance: new google.maps.Size(1, 1)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
};
var infowindow = new InfoBox(infoboxoptions); 
//init the map for the hole site
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var myOptions = {
    zoom: 13,
    center: new google.maps.LatLng(53.566822,10.005798),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    zoomControlOptions:{
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    disableDefaultUI:true
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions)
  directionsDisplay.setMap(map);
}

function createeditmaps(kategorie){
  $(document).ready(function() {
    kategoriedropdownmenu(kategorie);
    mapeventlistern(true)
  });
}

function mapeventlistern(){
        google.maps.event.addListener(map, 'click', function(event) {
      checkmarkertitle(event.latLng)
    });
    google.maps.event.addListener(infowindow, 'closeclick',function(event){
      marker.setMap(null);
      bool="true";
    });

}
function addMarker(location) {
  markername = "marker"+markerscount

      var image = new google.maps.MarkerImage("/blanko.png",
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(67, 82),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(0, 32)
      );
    marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      visible: true,
      icon: image
     });
  infowindowcontent = '<div id="titleform">'+
                      '<div id="boxup"><div id="boxup2"' + 
                      '<form id="formbox"><input id="'+markername+'form" name="title" value="Name" type="text" size="30" maxlength="30">Kategorien: '+kates+
                      '</div></div><div id="boxdown">' +
                      '<textarea id="comments'+markername+'" class="commentsbox" name="comments" cols="30" rows="5">Beschreibung</textarea><br>'+
                      '<input style="display:block;z-index:150" type="button" id="setmarkertitle" value="OK" onclick="setMarkerTitle('+markerscount+')">'+
                      '</form></div></div>';
  infowindow.setContent(infowindowcontent);
  infowindow.open(map,marker);
  google.maps.event.addListener(marker, 'dblclick', function(event) {
    //alert("test")
  });

  google.maps.event.addListener(marker, 'dragend', function() {
    $('#kat'+markername).find('#lat').html(""+marker.getPosition().lat());
    $('#kat'+markername).find('#lng').html(""+marker.getPosition().lng());
    //alert('kat'+markername);
  });
  markers.push(marker);
  bool="false";
  markerscount+=1
}


//save the marker
function savemap(){
  $(document).ready(function() {   
    var data = new Array();
    var count = 0;
    $("#saveme").click(function () {

      $('.group').each(function(index) {
        //alert($(this).find("div").find("#lng").text())
        var tmp = new Array();
        //alert($(this).find("div").find("select").val());
        tmp.push($(this).find("h3").find("input").val());
        tmp.push($(this).find("div").find("select").val());
        tmp.push($(this).find("div").find("textarea").val());
        tmp.push($(this).find("div").find("#lat").text());
        tmp.push($(this).find("div").find("#lng").text());
        data.push(tmp);
      }); 
      var mark = JSON.stringify(data);
      //alert(mark)
      mname = $("#mapnametext").val();
      var jso = JSON.parse('{"markers":' + mark +', "mapname":"'+ mname +'"}')
      //alert(jso);
      if($('.group').find("h3").find("input").val() != "undefined"){
        $.ajax({
          type: "PUT",
          url: "/map/getmarker/",
          data : jso,
          dataType: 'json',
          async:false,
          error: function(msg) { alert( "Error:" + msg) },
          success: function(strData){window.location.replace("/map/show/"+strData.id)}
        });      
      }else{
        alert('Bitte Fuegen sie Punkte hinzu');
        return false;
      }
    });
  });
};


function showmap(marker){
  var data = JSON.parse(marker);
  var c = 0;
    $(document).ready(function() {
    $.each(data, function() {
      var pos = new google.maps.LatLng(this.lat,this.lng)
      var image = new google.maps.MarkerImage(this.markerbild,
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(67, 82),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(0, 32));
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: false,
        visible: true,
        icon: image
      });
      var arr =  new Array();
      var infoboxoptions  = {
                disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(0, -50)
                ,position: pos
                ,zIndex: null
                ,closeBoxMargin: "-12px 0px"
                ,boxStyle: { 
                background: "#272441"
                  ,opacity: 0.90
                  ,width: "280px"
                }
                ,infoBoxClearance: new google.maps.Size(1, 1)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
      };
      arr.push(infoboxoptions);
      var infowindow = new InfoBox(arr.pop()); 
      var infocontent = '<div id="infowhie">' +
                        '<div id="infotitle">' + this.name + 
                        '<br/>von <a href="/user/'+this.userid+'">'+ this.user + '</a>' +
                        '<br/>in <a href="/map/show/'+this.mapid+'">'+this.kname+'</a>' +
                        '</div>'+
                        '<div id="infobeschreibugn">'+ this.beschreibung + '</div>' +
                        '<iframe src="http://www.facebook.com/plugins/like.php?href='+ window.location.pathname +'&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=recommend&amp;font=arial&amp;colorscheme=light&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>'
                        '</div>'

      infowindow.setContent(infocontent);
      //
      google.maps.event.addListener(marker, 'click', function(event) {
        infowindow.open(map,marker);
      });
    });
  });
}


//////helper methoden//////

// kategorien aus rails uebergebn und in ein dropdown menu uerbegeben

function kategoriedropdownmenu(kategorie){
  k = "";
  $.each(kategorie,function( intIndex, objValue ){ k += '<option value="'+objValue+'">'+objValue+'</option>'});
  kates += '<select id="kates">'+ k +'</select>'
}

function checkmarkertitle(el){
      if (bool=="true") {
        addMarker(el);
      }else{
        $(function() {
          $( "#dialog-message" ).dialog({
            modal: true,
            buttons: {Ok: function(){$( this ).dialog( "close" );}},
            closeText: 'hide'
          });
        });
      }
}

function usermenu(kat){
  $('#content').append('<div id="kattitle">Kategorien Filter</div>');
var data = JSON.parse(kat);
  $.each(data, function() {
    $('#content').append(
      '<h3><a href="#">'+ this.name + '</a></h3><div></div>'
      );
  });
};

function setMarkerTitle(markerid){
  kat = $('#kates').val()
  if ($('#'+markername+'form').val()==""){
        $(function() {
          $( "#dialog-message" ).dialog({
            modal: true,
            buttons: {Ok: function(){$( this ).dialog( "close" );}},
            closeText: 'hide'
          });
        });
  }else{
  marker.setDraggable(true);
  marker.setTitle($('#'+markername+'form').val());
  kates2 = kates
  $('#markerlist').append('<div class="group" id=kat'+markername+' >'+
                          '<h3><a href="#">Marker Name: <input id="markertitle" name="title" type="text" size="10" maxlength="30" value="'+ $('#'+markername+'form').val()+'"></a></h3><div>'+
                          ''+ kates +''+
                          '<textarea id="comments" style="width:200px;height:50px;" name="comments" cols="10" rows="5">'+ $('#comments'+markername).val()+'</textarea><br>'+
                          '<div id="lat" style="display: none;"> '+marker.getPosition().lat() + "</div>"+
                          '<div id="lng" style="display: none;"> '+marker.getPosition().lng() +   "</div>"+
                          '<input style="display:block;z-index:150" type="button" id="deletmarker" value="Loeschen" onclick="deletemarker(kat'+markername+','+markerid +')">'+
                          '</div></div>'
                          ).accordion('destroy').accordion({header: "h3",collapsible: true, active: false,navigation: true ,autoHeight: false }).sortable({header:"h3"});
  $('#setmarkertitle').attr('onclick','').unbind('click');
  $('#setmarkertitle').css("color","grey");
  bool="true";
  $('#kates').attr("id","kates"+markername);
  $('#kates'+markername).val(kat)
    $('#kat'+markername).mouseenter(function(){
      markers[markerid].setAnimation(google.maps.Animation.BOUNCE);
    }).mouseleave(function(){
        markers[markerid].setAnimation(null);
    });
  setTimeout(function(){infowindow.close(map,marker);},50);
  };
}
function deletemarker(name,markerid){
  markers[markerid].setMap(null);
  $(name).remove()
  $('#markerlist').accordion('destroy').accordion({header: "h3",collapsible: true, active: false }).sortable({header:"h3"});
}

function welle(){
$("#bottom").hover(function(){
 $(this).stop().animate({"bottom" : "0px"});
}, function(){
 $(this).stop().animate({"bottom": "-40"});
});
}

//Suche 
var addressField = document.getElementById('search_address');

var geocoder = new google.maps.Geocoder();
function search() {
    geocoder.geocode(
        {'address': document.getElementById('search_address').value}, 
        function(results, status) { 
            if (status == google.maps.GeocoderStatus.OK) { 
                var loc = results[0].geometry.location;
                // use loc.lat(), loc.lng()
                var erg = new google.maps.LatLng(loc.lat(),loc.lng());
                map.panTo(erg);
                smoothZoom(map, 19, map.getZoom());
               // setTimeout("map.setZoom(18)",1000);
            } 
            else {
                alert("Not found: " + status); 
            } 
        }
    );
};

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
            return;
        }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            self.smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  