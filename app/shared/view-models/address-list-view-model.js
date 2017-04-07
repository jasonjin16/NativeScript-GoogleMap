
var mapsModule = require("nativescript-google-maps-sdk");
var ObservableArray=require("data/observable-array").ObservableArray;
var geolocation = require("nativescript-geolocation");
var http=require("http");

function AddressListViewModel(lat, lng, mapView){
    var viewModel=new ObservableArray([]);
    // get address info using web api based on lat, lng
    var result=[];
    result.push({ address : "Barnes & Noble"    });
    result.push({ address : "Charles Pond Dr. Coram, NY 11727"    });
    result.push({ address : "1427 150th St. Whitestone, NY 11357"    });
    result.push({ address : "987 Stewart Ave, Garden City, NY 11530"    });
    result.push({ address : "603 E Main St, Endicott, NY 13760"    });
    result.push({ address : "365 US-46, Rockaway, NJ 07866"    });
    result.push({ address : "438 Elmont Rd, Elmont, NY 11003"    });
    result.push({ address : "W Valley Stream Blvd, NY 11580"    });
    result.push({ address : "282 Glen St, Glen Cove, NY 11542"    });
    result.push({ address : "9 S Mesier Ave, Wappingers Falls, NY 12590"    });
    result.push({ address : "1149 Merrick Ave, North Merrick, NY 11566"    });
    result.push({ address : "54 Catherine Ave. Lancaster, NY 14086"    });
    result.push({ address : "144-14 243rd St, Rosedale, NY 11422"    });
    result.push({ address : "9 Carlton Ave, Port Washington, NY 11050"    });
    result.push({ address : "92 Chapel Rd, Manhasset, NY 11030"    });
    result.push({ address : "26 Yonkers Ave, Yonkers, NY 10701"    });
    result.push({ address : "81 Glenwood Ave, Queenbury, NY 12804"    });

    // finding nearby address within radius 5 mile
    viewModel.find=function(){
        var shift_flag=1;
        viewModel.push({address : "No Address", lat:"", lng:"", distance : ""});
        result.forEach(function(element) {
            // get lat and lng from address 
            var addressTokens=element.address.split(" ");            
            var address="";
            var cur_lat=0, cur_lng=0;
            if(addressTokens.length>0) address=addressTokens[0];
            for(var i=1;i<addressTokens.length; ++i) address=address+"+"+addressTokens[i];
            http.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").then(function (r) {
                //// Argument (r) is JSON!                                
                //console.log(r.results[0]['geometry']['location']['lat']+"==="+address);
                cur_lat=r.results[0]['geometry']['location']['lat'];
                cur_lng=r.results[0]['geometry']['location']['lng']; 

                // calculate distance
                var distance=0;
                distance=calculateDistanceBasedOnLatLng(lat, lng, cur_lat, cur_lng);
                //console.log(address+"==>"+lat+", "+lng+"->"+cur_lat+", "+cur_lng+"="+distance);
                if(distance*1000<=8046){ // 1mile=1609.34m                    
                    if(viewModel.length>0 && shift_flag==1){
                        viewModel.shift(); 
                        shift_flag=0;
                    } 
                    viewModel.push({
                        address : element.address,
                        lat : cur_lat,
                        lng : cur_lng,
                        distance : Math.round(distance*100/1.609)/100
                    });
                    var marker = new mapsModule.Marker();
                    marker.position = mapsModule.Position.positionFromLatLng(cur_lat, cur_lng);
                    marker.title = element.address;
                    marker.snippet = cur_lat +", "+cur_lng;
                    marker.userData = { index : 1};
                    mapView.addMarker(marker);
                }               
            }, function (e) {
                //// Argument (e) is Error!
                console.log(e);
            });            
        });                
    }    
    return viewModel;
}

function calculateDistanceBasedOnLatLng(lat1,lon1,lat2,lon2){  
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1)*(Math.PI/180); 
    var dLon = (lon2-lon1)*(Math.PI/180); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km   
}

module.exports=AddressListViewModel;