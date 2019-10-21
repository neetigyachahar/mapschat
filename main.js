var xhttp = new XMLHttpRequest();
var data = '';
var zone_name = '';
var zone = 0;
var chat_count = 0;
var str;
var first = 0;
var chats = {
  Neetigya: ['Hey there! 😃', 'Wassup', 'Actullay I am looking for some help.', 'Which floor are you on right now?','Can you please check if there is any class going in 711, I have my next class over there and I am at ground floor.', 'Okay!', 'Thank you! I was feeling lazy to check. 😅', 'bye!'],
  Harish: ['Hi!', 'All Good', 'Okay! What is it?', "I'm on 6th floor.", "Well...Okay! Wait!", 'No one in class!', "That's okay.", 'bye']
}
var chat;
var locateglobe ={lat:12.971432,lng:79.160235};
var icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
const online = io('https://quiet-woodland-66529.herokuapp.com/online');
var iochat = io.connect('https://fathomless-refuge-64458.herokuapp.com/globalChat');

const sjt = io('https://quiet-woodland-66529.herokuapp.com/sjt', {autoConnect: false});
sjt.close();
const tt = io('https://quiet-woodland-66529.herokuapp.com/tt', {autoConnect: false});
tt.close();
const smv = io('https://quiet-woodland-66529.herokuapp.com/smv', {autoConnect: false});
smv.close();

online.emit('getOnline');


var map = new google.maps.Map(document.getElementById('map'), {
  zoom: document.documentElement.clientWidth>1000 ? 16 : 15,
  center: {lat:12.971432,lng:79.160235},
  disableDefaultUI: document.documentElement.clientWidth>1000 ? false : true,
  mapTypeId: 'terrain',
  style: [{elementType: 'labels.text.stroke', stylers: [{color: '#000000'}]}]
});




var important_locations = {
  sjt: [12.971084, 79.163833],
  tt: [12.970712, 79.159513],
  smv: [12.969257, 79.157726]
};


// {lat:12.971084,lng:79.163833}
//sjt functions-----------------------------------------
function sjtio(x){
  switch(x){
    case 1:
      {
        sjt.open();
        online.emit('getOnline');
        break;
      }
    case 0:
      {
        sjt.close();
        online.emit('getOnline');
        break;
      }
  }

}

  var sjtcir = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: {lat:12.971084,lng:79.163833},
      radius: 0
    });


    var sjtinfo = new google.maps.InfoWindow({
      content: ""
    });
    var sjtmarker = new google.maps.Marker({
      position:{lat:12.971084,lng:79.163833},
      map: map,
      title: 'SJT'
    });
    sjtmarker.addListener('click', function() {
      sjtinfo.open(map, sjtmarker);
    });


//sjt functions end ---------------------------------


//tt functions-----------------------------------------

function ttio(x){
  switch(x){
    case 1:
      {
        tt.open();
        online.emit('getOnline');
        break;
      }
    case 0:
      {
        tt.close();
        online.emit('getOnline');
        break;
      }
  }
}

var ttcir = new google.maps.Circle({
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  map: map,
  center: {lat:12.970712,lng:79.159513},
  radius: 0
});

var ttinfo = new google.maps.InfoWindow({
  content: ""
});
var ttmarker = new google.maps.Marker({
  position:  {lat:12.970712,lng:79.159513},
  map: map,
  title: 'Technology Tower'
});
ttmarker.addListener('click', function() {
  ttinfo.open(map, ttmarker);
});

//tt functions end -----------------------------------------

//smv functions -----------------------------------------


function smvio(x){
  switch(x){
    case 1:
      {
        smv.open();
        online.emit('getOnline');
        break;
      }
    case 0:
      {
        smv.close();
        online.emit('getOnline');
        break;
      }
  }
}

      var smvcir = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: {lat:12.96925,lng: 79.15772},
        radius: 0
      });

      var smvinfo = new google.maps.InfoWindow({
        content: ""
      });
      var smvmarker = new google.maps.Marker({
        position:  {lat:12.96925,lng: 79.15772},
        map: map,
        title: 'SMV'
      });
      smvmarker.addListener('click', function() {
        smvinfo.open(map, smvmarker);
      });
//smv functions ends -----------------------------------------------

online.on('onlineData', data=>{
  data = JSON.parse(data);
  var check = $('#online span').text();
    $('#online span').text(data.online);
    for(var loca in important_locations){
        var latlng = {
            lat:  parseFloat(important_locations[loca][0]),
            lng:  parseFloat(important_locations[loca][1])
        }
        var message = `<div style='color: black;'>Online: ${data[loca]}</div>`;
        popup(loca, message);
        console.log("latlng: "+JSON.stringify(latlng));
        console.log("data[local]: "+data[loca]);
        console.log("loca: "+loca);
        circles(latlng, data[loca], loca);
    }

    if(check != data.online){
      circleonoff(locateglobe); 
    }
});


 function callme(){
    var list = [];
    var dist = 0;
    console.log("ye hai bhaishab: "+document.getElementById('source').options[document.getElementById('source').options.selectedIndex].value == "start");
    if(document.getElementById('source').options[document.getElementById('source').options.selectedIndex].value == "start"){
      alert("Select a source");
      return;
    }
    if(document.getElementById('destination').options[document.getElementById('destination').options.selectedIndex].value == "dest"){
      alert("Select a destination");
      return;
    }
    console.log(window.location.href);
    var query = window.location.href+"?id=1"+"&src="+document.getElementById('source').options[document.getElementById('source').options.selectedIndex].value+
                "&dest="+document.getElementById('destination').options[document.getElementById('destination').options.selectedIndex].value;
        xhttp.onreadystatechange= function(){
            if(this.readyState == 4 && this.status == 200){
                console.log(this.responseText);
                data = JSON.parse(this.responseText);
                console.log("Ye Dekh: "+ data.path[0]);
                for(var i = 0; i< data.path.length; i++){
                    list.push({"lat": data.path[i][0], "lng": data.path[i][1]});
                }
                dist = data.dist;
                var time = (dist/((document.getElementById('travel').options[document.getElementById('travel').options.selectedIndex].value)*60)).toFixed(2);
                document.getElementById('isme').innerHTML = "<br><div id = 'duri'>Distance: "+dist+" m &nbsp&nbspTime: "+time+" min</div>";
                console.log("Duri "+dist);
                console.log("rasta "+list);

                initMap(list);
            }
        };
    xhttp.open('get', query, true);
    xhttp.send();
        };
 
 function initMap(locat) {
        var flightPlanCoordinates = locat;
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        flightPath.setMap(map);
        $('#navigate').click
        (function(){
          flightPath.setMap(null);
        });
    }

 



    var infoWindow;
    infoWindow = new google.maps.InfoWindow;
    var locationmarker = new google.maps.Marker({
      map: map,
      title: 'My location',
      icon: icon,
      animation: google.maps.Animation.DROP
    });
    locationmarker.addListener('click', function() {
      infoWindow.open(map, locationmarker);
    });
    if (navigator.geolocation) {
        var option = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        }
        var watch = navigator.geolocation.watchPosition(success, fail, option);
      } else {
        alert("error2");
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

    function fail() {
        alert("error1");
      handleLocationError(true, infoWindow, map.getCenter());
    }
    function success(){
      console.log('Location Received!');
    }
    function success_demo(position){
      console.log("Here is it: ");
      console.log(position.coords);
        locateglobe = {
          lat:  parseFloat(position.coords.latitude),
          lng:  parseFloat(position.coords.longitude)
        };
        // position.coords.latitude
        console.log("location aayi!");
        infoWindow.setPosition(locateglobe);
        infoWindow.setContent('<div style="color: black;">Your Location!</div>');
        locationmarker.setPosition(locateglobe);
        // infoWindow.open(map);
        // map.setCenter(locateglobe);
        circleonoff(locateglobe);
      }
//code ends

//circle code starts
function circles(cod, online, x){
    console.log(cod);
    online = Math.atan((online+50)/40)*(57.295);
    switch(x){
        case 'sjt': {
            console.log("hahah");
            sjtcir.setCenter(cod);
            sjtcir.setRadius(online);
            break;
        }
        case 'tt': {
            ttcir.setCenter(cod);
            ttcir.setRadius(online);
            break;
        }
        case 'smv': {
            smvcir.setCenter(cod);
            smvcir.setRadius(online);
            break;
        }
    }
}
//code ends

// circleonoff() code starts here

function circleonoff(locate){
  console.log(getDistance(locate, sjtcir.getCenter()));
  console.log(sjtcir.getRadius());
    if(getDistance(locate, sjtcir.getCenter()) < sjtcir.getRadius() ){
        console.log("sjt ke andar aaya");
        sjtio(1);
        zone = 1;
        zone_name = 'SJT';
    }
    else{
        console.log('sjt ke bhaar hai');
        sjtio(0);
        $('#chatBox h3 div').html(`&#x25CF;&nbsp;`);
        $('h3 span').text('Chat Room');
        zone = 0;
    }

    if(getDistance(locate, ttcir.getCenter()) < ttcir.getRadius() ){
      console.log("nachoo");
      console.log("tt ke andar aaya");
      ttio(1);
    }else{
      console.log('tt ke bhaar hai');
      ttio(0);
    }

    if(getDistance(locate, smvcir.getCenter()) < smvcir.getRadius() ){
      console.log("nachoo");
      console.log("smv ke andar aaya");
      smvio(1);
    }else{
      console.log('smv ke bhaar hai');
      smvio(0);
    }
}

var rad = function(x) {
  return x * Math.PI / 180;
};

function  getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat);
  var dLong = rad(p2.lng() - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

//popup

function popup(x, mssg) {
    switch(x){
        case 'sjt': {
            console.log("hahayayah");
            sjtinfo.setContent(mssg);
            break;
        }
        case 'tt': {
            ttinfo.setContent(mssg);
            break;
        }
        case 'smv': {
            smvinfo.setContent(mssg);
            break;
        }
    }
  }

//code ends


//THIS CHAT JS PART

document.addEventListener("DOMContentLoaded", function(event) { 
  //do work

var id = '';
            var flag = 1000;
            console.log("script workinsdsdg");
            
            setInterval(checkLogin, 1000);
            
            function checkLogin(){
                if(zone == 1){
                  if($('#chatBox h3 div').html() != `&#x25CF;&nbsp;${sjtinfo.content.split('>')[1].split(':')[1].split('<')[0].trim()}`){
                    $('#chatBox h3 div').html(`&#x25CF;&nbsp;${sjtinfo.content.split('>')[1].split(':')[1].split('<')[0].trim()}`);
                    $('h3 span').text(zone_name);
                  }
                if($('[name="authorizedIDX"]').length != 0){
                if($('[name="authorizedIDX"]').val().length != flag){
                    flag = $('[name="authorizedIDX"]').val().length;
                    if(flag > 0){
                        id = $('[name="authorizedIDX"]').val();
                        $('#chatpop').attr('class', 'inner');
                    }
                    else{
                        id = "";
                    }
                }
                if(flag == 0){
                    $('#chatpop').attr('class', 'outter');
                }
              }
              else{
                  $('#chatpop').attr('class', 'outter');
              }
            }else{
              $('#chatpop').attr('class', 'outter');
            }
              return;    
            }
            

                    iochat.on('gc', function(msg){

                        msg = JSON.parse(msg);
                        if(msg.id == id){
                            $('.messages').append(`<li class="mine"><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);
                        }else{
                            $('.messages').append(`<li><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);               
                        }
                        $('.messages').scrollTop($('.messages')[0].scrollHeight);
                        $('#chatInput').focus();
                    });
                    
            
                    document.getElementById('chatbtn').addEventListener('click', fire);

                    $('#chatInput').keypress(function (e) {
                    if (e.which == 13) {
                        fire();
                        return false;    //<---- Add this line
                    }
                    });
  
                    $('#nameTaker').keypress(function(e){
                        if(e.which == 13){
                          if(zone == 1){
                            if($('#nameTaker').val().length != 0){
                          $('#chatpop').css('display', 'none');
                          $('#sec').css('display', 'flex');   
                            }
                        }
                      }
                    });
            
                    function fire(){
                        var chat = $('#chatInput').val();
                        var chat = {
                            id: id,
                            text: $('#chatInput').val().trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")
                        };
                        if(chat.text.length == 0){
                            $('#chatInput').val('');
                            $('#chatInput').focus();
                            return 0;
                        }
                        $('#chatInput').val('');
                        chat = JSON.stringify(chat);
                        iochat.emit('gc', chat);
                        console.log('haha');
                    }
            
                    $('#chatpop').click(()=>{
                        if($('#chatpop').attr("class") == "outter"){
                            alert("Get in a circle and set a name to join chat!!");
                            return false;
                        }
                        $('#chatpop').css('display', 'none');
                        $('#sec').css('display', 'flex');
                    });
            
                    $('#head').click(()=>{
                        $('#chatpop').css('display', 'block');
                        $('#sec').css('display', 'none');
                    });
                  });
//CHAT JS ENDS OVER HERE

console.log('I am here');

function getLatLong(address) {
  var geocoder = new google.maps.Geocoder();
  var result = "";
  geocoder.geocode( { 'address': address }, function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
           result[lat] = results[0].geometry.location.Pa;
           result[lng] = results[0].geometry.location.Qa;
       } else {
           result = "Unable to find address: " + status;
       }
       console.log("abcd ");
       console.log(result);
      });
  }

getLatLong('Delhi');



//----------------------------------DEMO--------------------------------------

function demo(){
  sjtinfo.open(map, sjtmarker);
  get_in_zone();
}

function get_in_zone(){
  console.log('I m running');
  var start_point = {lat: 12.9733251, lng: 79.15993879999999};
  var end_point = {lat: 12.971084,  lng: 79.16383};
  var x, y;
  var i = 0.0000000; 

  function go() {
    x = start_point.lat - i;
    y = line(x, start_point, end_point);
    console.log(x, y);
    success_demo({coords: {latitude: x, longitude: y}});
    if (i < 0.00210000) {
        i += 0.00010000;
        if(i > 0.00210000)
        setTimeout(go, 1000);
        else
        setTimeout(go, 500);
    }
    else{
      console.log('kkabhijo');
      console.log($('#chatpop div').text()[$('#chatpop div').text().length - 1].trim());
      function re(){
        if($('#chatpop div').text()[$('#chatpop div').text().length - 1].trim() != '1' &&  $('#chatpop div').text()[$('#chatpop div').text().length - 1].trim() != "2" ){
          setTimeout(re, 50);
          return;
        }else{
          console.log($('#chatpop div').text()[$('#chatpop div').text().length - 1]);
        if( $('#chatpop div').text()[$('#chatpop div').text().length - 1].trim() == "1" ){
          str = 'Neetigya Chahar';
          first = 1;
        }else{
          str = 'Harish';
        }
        console.log(str);
        setTimeout(chat_act, 2000);
      }
    }
    re();
      
    }
}
  go();
}

function chat_act(){
  console.log('kabhijo');
  console.log(str);

  $('#nameTaker').focus();
  var i = 1;
  var kt = 0;

  function go() {
    $('#nameTaker').val(str.slice(0,i));
    if (i <= str.length) {
        i += 1;
        setTimeout(go, 350);
    }
    else{
      setTimeout(()=>{$('#chatpop').click();
      if(str == 'Neetigya Chahar'){
        str = 'Neetigya';
      }
      chat = chats[str];
      
      console.log(chat);
      function wait(){
        if($('#chatpop div').text()[$('#chatpop div').text().length - 1] != "1"){
          iochat.on('gc', function(msg){
            msg = JSON.parse(msg);
            if(msg.id == 'Neetigya Chahar'){
              msg.id = 'Neetigya';
            }
            console.log('HolaBhola');
            console.log(str, msg.id);
                        if(msg.id != str){
                         setTimeout(inside_chat, 1000);
                        }
          });
          if(first == 1)
          setTimeout(inside_chat, 1000);
        }else{
          setTimeout(wait, 1000);
        }
      }
      console.log('HolaBhola');
      console.log($('#chatpop div').text()[$('#chatpop div').text().length - 1]);

      wait();
        }, 1000);
    }
}
  go();

}

function inside_chat(){
  $('#chatInput').focus();
  var str = chat[chat_count];


  if(chat_count >= 8) {
    return;
  }
  var i = 1;

  function go() {
    $('#chatInput').val(str.slice(0,i));
    if (i <= str.length) {
        i += 1;
        setTimeout(go, 100);
    }
    else{
      $('#chatbtn').click();
      chat_count += 1;
    }
}
  go();
}

function line(x, a, b){
  return (((b.lng - a.lng)/(b.lat - a.lat))*(x - a.lat) + a.lng)
}


function toggle(){
  $('#mlbtn').click(()=>{
      $('#ml').attr('style', "display: block; text-align: left;");
      $('#mlbtn').attr('style', "display: none; text-align: left;");
  });
}

function predict(){
  $.ajax({url:`http://localhost:8080/predict`, success: function(resultz){
    $('#chp').attr('style', "display: none;");
    $('#predictInput').attr('style', "display: block;");
    $('#predictInput').text(resultz);
    console.log(resultz);
  }});
}