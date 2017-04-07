var GoogleMapViewModel=require("../../shared/view-models/google-map-view-model");

var page, addressListView;

function onLoad(args){
  page=args.object;
  addressListView=page.getViewById("addressList");
}

function onMapReady(args) {
  var mapView = args.object;
  var googlemap=new GoogleMapViewModel(mapView, addressListView);
  mapView.bindingContext=googlemap;  
}

function onMarkerSelect(args) {
   console.log("Clicked on " +args.marker.title);
}
 
function onCameraChanged(args) {
    console.log("Camera changed: " + JSON.stringify(args.camera));     
}

exports.onLoad=onLoad;
exports.onMapReady = onMapReady;
exports.onMarkerSelect = onMarkerSelect;
exports.onCameraChanged = onCameraChanged;