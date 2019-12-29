/**
 * Class for handling google map API library
 * @implements MainApp
 */
class GoogleMapLib extends MainApp {
  constructor(
  ) {
    super();

    // Japan default location
    this.defaultPosition = {
      lat: 35.6804,
      lng: 139.7690
    };

    this.imageBaseUrl ='http://127.0.0.1:8000/static/assets/images/';

    /*
    asahi = dark blue
    coke = red
    kirin = light red
    */
    this.iconList = {
        asahi: this.imageBaseUrl + 'dark_blue.png',
        coke: this.imageBaseUrl + 'dark_red.png',
        kirin: this.imageBaseUrl + 'light_red.png'
    }

    // Create map object
    this._mapObj = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(
        this.defaultPosition.lat,
        this.defaultPosition.lng
      ),
      zoom: 14
    });
//    this.currentPos = this.getCurrentPos();
    this.filterCategory = 0;
    this.markers = [];
    this.loadMapData();
  }

  /**
   * Map map object getter
   */
  get map() {
    return this._mapObj;
  }

  /**
   * Gets the location of the device using the navigator geolocation.
   * If the navigator has problem locating the device coordinates, then it will return
   * the coordinate from the cebu city hall
   *
   * @return {Object} location
   */
  getCurrentPos() {
    if (navigator.geolocation) {
      var currentPos = navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          return pos;
        },
        () => {
          // return pre-set position if geolocation was unable to get the current coordinates
          return this.defaultPosition;
        }
      );
    }
    return this.defaultPosition;
  }

  /**
   * Clear all markers from the map.
   * If deletePermanenty is set to true, then it will completely delete all the markers from the
   * memory
   * @param {*} deletePermanently
   */
  clearMarkers(deletePermanently = false) {
    if (this.markers.length > 0) {
      this.markers.forEach(function(markerObj) {
        markerObj.setMap(null);
      });
    }

    if (deletePermanently) {
      this.markers = [];
    }

    return true;
  }

  /**
   * Show all markers that where hidden temporarily from the map
   */
  showAllMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach(markerObj => {
        markerObj.setMap(this.map);
      });
    }
  }

  /**
   * Load all marker data from the backend which will be rendered in the map object
   * @param {*} passedCategory
   */
  loadMapData(passedCategory = 0) {
    let vendingMachinesEndpoint = this.restEndpoint + "vending_machines";
//    alert(vendingMachinesEndpoint);
//
//    if (passedCategory > 0) {
//      restaurantsEndpoint = this.restEndpoint + "restaurants/" + passedCategory;
//    }
//
    axios.get(vendingMachinesEndpoint).then(response => {
      // Delete Previous Markers
      this.clearMarkers(true);

      // Render Markers
      response.data.forEach((markerData, idx) => {

        var mapPoint = new google.maps.LatLng(
          parseFloat(markerData.lat),
          parseFloat(markerData.long)
        );

        var marker = new google.maps.Marker({
          map: this.map,
          position: mapPoint,
          icon: this.iconList[markerData.brand]
        });
        this.markers.push(marker);

        this.markers.forEach(function(markerObj, markerId) {
          markerObj.setMap(null);
        });


        this.markers.forEach(markerObj => {
          markerObj.setMap(this.map);
        });

//        var infoWindow = this.createInfoWindow(markerData);
//
//        marker.addListener("click", () => {
//          if (this.activeWindow) {
//            var directionsService = new google.maps.DirectionsService();
//            var directionsDisplay = new google.maps.DirectionsRenderer();
//
//            directionsDisplay.setMap(null);
//            this.activeWindow.close();
//          }
//          infoWindow.open(this.map, marker);
//          this.activeWindow = infoWindow;
//        });

      });
    });
  }

}

/**
 * This method is called when initalizing the google map
 */
function initializeCustomLib() {
  var objGoogleMapLib = new GoogleMapLib();
}
