
var mapsModule = require("nativescript-google-maps-sdk");
var geolocation = require("nativescript-geolocation");
var myPlatform = require( "nativescript-platform" );
var observableModule = require("data/observable"); // data-binding
var AddressListViewModel=require("../../shared/view-models/address-list-view-model");

var mapView, gMap, cur_loc, watchId;

function GoogleMapViewModel(mapView, addressListView){
    mapView=mapView;
    gMap=mapView.gMap;   
    var viewModel = new observableModule.Observable({
        latitude : 0,
        longitude : 0,
        zoom : 2,
        bearing : 0,
        tilt : 0,
        padding :  0
    });
    
    if (nsPlatform.isAndroid()){
        //gMap.setMyLocationEnabled=true;
    }else if (nsPlatform.isIOS()){
        //gMap.myLocationEnabled=true;  
    }
    console.log("Setting a marker...");
    if (!geolocation.isEnabled()) geolocation.enableLocationRequest();
    watchId = geolocation.watchLocation(
        function(loc){ 
            cur_loc=loc;
            console.log("Received location: " + JSON.stringify(loc));
            gMap.clear();
            viewModel.latitude=cur_loc.latitude;
            viewModel.longitude=cur_loc.longitude;
            if(viewModel.zoom<=3) viewModel.zoom=14;             
            var marker = new mapsModule.Marker();
            marker.position = mapsModule.Position.positionFromLatLng(cur_loc.latitude, cur_loc.longitude);
            marker.title = "Where ?";
            marker.snippet = loc.latitude+", "+loc.longitude;
            marker.userData = { index : 1};
            /*
            var marker = new mapsModule.Marker();
                    marker.position = mapsModule.Position.positionFromLatLng(cur_lat, cur_lng);
                    marker.title = element.address;
                    marker.snippet = cur_lat +", "+cur_lng;
                    marker.userData = { index : 1};
                    mapView.addMarker(marker);
            */
            mapView.addMarker(marker);
            /*
            var mmm = new mapsModule.Marker();
                    mmm.position = mapsModule.Position.positionFromLatLng(cur_loc.latitude-0.01, cur_loc.longitude-0.01);
                    mmm.title = "new";
                    mmm.snippet = cur_loc.latitude +", "+cur_loc.longitude;
                    mmm.userData = { index : 1};
                    mapView.addMarker(mmm);
            */
            // finding nearby address within radius 5 mile
            var addressList=new AddressListViewModel(loc.latitude, loc.longitude, mapView);            
            var addressData=new observableModule.fromObject({
                addressList : addressList
            });
            addressListView.bindingContext=addressData;
            console.log(addressList.length+"======");
            addressList.find();
        }, 
        function(e){ console.log("watch Error: " + e.message); }, 
        {desiredAccuracy: 3, updateDistance: 20, minimumUpdateTime : 1000 * 10}
    );

    return viewModel;
}

module.exports=GoogleMapViewModel;
