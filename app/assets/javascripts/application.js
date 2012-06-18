//= require_tree .
//= require jquery
//= require jquery_ujs
//= require jquery.ui.all



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
                ,boxStyle: { 
                  background: "#fff no-repeat"
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
  var myOptions = {
    zoom: 14,
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
    marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: false,
      visible: true,
     });
  infowindowcontent = '<div id="titleform">'+
                      '<form> Title: <br><input id="'+markername+'form" name="title" type="text" size="30" maxlength="30">'+kates+
                      '<textarea id="comments'+markername+'" name="comments" cols="30" rows="5">Enter your comments here...</textarea><br>'+
                      '<input style="display:block;z-index:150" type="button" id="setmarkertitle" value="Speichern" onclick="setMarkerTitle('+markerscount+')">'+
                      '</form></div>';
  infowindow.setContent(infowindowcontent);
  infowindow.open(map,marker);
  google.maps.event.addListener(marker, 'dblclick', function(event) {
    alert("test")
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
        alert($(this).find("div").find("#lng").text())
        var tmp = new Array();
        tmp.push($(this).find("h3").find("input").val());
        tmp.push($(this).find("div").find("p").find("select").val());
        tmp.push($(this).find("div").find("textarea").val());
        tmp.push($(this).find("div").find("#lat").text());
        tmp.push($(this).find("div").find("#lng").text());
        data.push(tmp);
      }); 
      var mark = JSON.stringify(data);
      //alert(mark)
      mname = $("#mapnametext").val();
      var jso = JSON.parse('{"markers":' + mark +', "mapname":"'+ mname +'"}')
      //alert(daten);
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
  $("#content").append("<div id='mardisplay'></div>")
  $(document).ready(function() {
    $.each(data, function() {
      var pos = new google.maps.LatLng(this.lat,this.lng)
      var image = new google.maps.MarkerImage(this.markerbild,
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(32, 40),
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
      $('#'+this.name).click(function(){ map.setCenter(pos); });
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
  marker.setTitle($('#'+markername+'form').val());
  kates2 = kates
  $('#markerlist').append('<div class="group" id=kat'+markername+' >'+
                          '<h3><a href="#"><input id="markertitle" name="title" type="text" size="30" maxlength="30" value="'+ $('#'+markername+'form').val()+'"></a></h3><div>'+
                          '<p>'+ kates +'</p>'+
                          '<textarea id="comments" name="comments" cols="30" rows="5">'+ $('#comments'+markername).val()+'</textarea><br>'+
                          '<div id="lat" style="display: none;"> '+marker.getPosition().lat() + "</div>"+
                          '<div id="lng" style="display: none;"> '+marker.getPosition().lng() + "</div>"+
                          '<input style="display:block;z-index:150" type="button" id="deletmarker" value="Loeschen" onclick="deletemarker(kat'+markername+','+markerid +')">'+
                          '</div></div>'
                          ).accordion('destroy').accordion({header: "h3",collapsible: true, active: false }).sortable({header:"h3"});
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
function bouncemarker(markerid){
markers[markerid].setAnimation(google.maps.Animation.BOUNCE);
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