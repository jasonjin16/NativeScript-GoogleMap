var applicationModule = require("application");
if(applicationModule.ios) {
  GMSServices.provideAPIKey("AIzaSyBRvDnz4dZ2MTUYxCRjSlwffSFRwkQypGo");
}
applicationModule.start({ moduleName: "views/google-map/google-map" });
