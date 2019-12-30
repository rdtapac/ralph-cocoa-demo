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
      lat: 35.6905761,
      lng: 139.7022638
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
        kirin: this.imageBaseUrl + 'light_red.png',
        suntory: this.imageBaseUrl + 'light_blue.png'
    }

    // Create map object
    this._mapObj = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(
        this.defaultPosition.lat,
        this.defaultPosition.lng
      ),
      zoom: 17
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

        console.log(this.iconList[markerData.brand])

        this.markers.forEach(function(markerObj, markerId) {
          markerObj.setMap(null);
        });


        this.markers.forEach(markerObj => {
          markerObj.setMap(this.map);
        });


        var infoWindow = this.createInfoWindow(markerData);

        marker.addListener("click", () => {
          if (this.activeWindow) {
            this.activeWindow.close();
          }
          infoWindow.open(this.map, marker);
          this.activeWindow = infoWindow;
        });

      });
    });
  }



  /**
   * Wrap info object inside a div col with md-12 class
   * @param {Object} objToWrap
   */
  wrapDivInfoContainer(objToWrap) {
    var objContainerDiv = document.createElement("div");
    objContainerDiv.className = "col-md-12";
    objContainerDiv.append(objToWrap);
    return objContainerDiv;
  }

  /**
   * Create contents inside the marker's info balloon object which will be shown
   * when a marker is clicked
   * @param {*} markerData
   * @return {!Object} InfoWindow
   */
  createInfoWindow(markerData) {
    // console.log(markerData);
    var vendingMachineInfo = markerData.vending_machine_info;

    var infoWindow = new google.maps.InfoWindow();

    var infoDialog = document.createElement("div");
    infoDialog.className = "row";

    // create name elem and append
    var mapLabel = document.createElement("h3");
    mapLabel.textContent = vendingMachineInfo.brand;
    infoDialog.append(this.wrapDivInfoContainer(mapLabel));

    // create address elem and append
    var addressElem = document.createElement("p");
    addressElem.className = "mt-4";
    addressElem.textContent = markerData.address;
    infoDialog.append(this.wrapDivInfoContainer(addressElem));

    // create maker name elem and append
    var makerNameElem = document.createElement("span");
    makerNameElem.className = "mt-4";
    makerNameElem.textContent = "自販機管理メーカー (maker):  " + markerData.vending_machine_info.maker;
    infoDialog.append(this.wrapDivInfoContainer(makerNameElem));

    // create merchant elem and append
    var merchantElem = document.createElement("span");
    merchantElem.className = "mt-4";
    merchantElem.textContent = "商品名 (Merchant Name):  " + markerData.vending_machine_info.merchant;
    infoDialog.append(this.wrapDivInfoContainer(merchantElem));

    // create price elem and append
    var priceElem = document.createElement("span");
    priceElem.className = "mt-4";
    priceElem.textContent = "価格 (Price):  " + markerData.vending_machine_info.price;
    infoDialog.append(this.wrapDivInfoContainer(priceElem));

    // create temp elem and append
    var tempElem = document.createElement("span");
    tempElem.className = "mt-4";
    tempElem.textContent = "温度 (Warm/Cold):  " + markerData.vending_machine_info.temp;
    infoDialog.append(this.wrapDivInfoContainer(tempElem));

//    var imgElem = document.createElement("img");
//    imgElem.src = "https://firebasestorage.googleapis.com/v0/b/podpics-01.appspot.com/o/enquete%2F241120%2FA1M4ZXnpzZdpsELszvbv8Jqd9ji2%2Fi_uFqv4mPjIgEtsTaJ.jpg?alt=media&token=4f469b4b-413d-4aa5-a507-2c5ace3ee137"
//    imgElem.height = "200";
//    infoDialog.append(this.wrapDivInfoContainer(imgElem));
    // Image handler
    if (markerData.vending_machine_info.images) {
        var divCardDeck = document.createElement('div');
        divCardDeck.className = "card-deck";
        markerData.vending_machine_info.images.forEach((imgElemSrc, idx) => {
            var divCardElem = document.createElement('div');
            divCardElem.className = "card";
            var divCardImg = document.createElement("img");
            divCardImg.className = "card-img-top";
            divCardImg.src = imgElemSrc;
             divCardImg.width = "80";
            divCardElem.append(divCardImg);
             divCardDeck.append(divCardElem);
        });
        infoDialog.append(divCardDeck);
    }


//    // create total visit elem and append
//    var totalVisitElem = document.createElement("div");
//    totalVisitElem.className = "mt-4 font-weight-bold";
//    totalVisitElem.textContent = "Total Visit: " + markerData.total_visit;
//    infoDialog.append(this.wrapDivInfoContainer(totalVisitElem));

    // create control footer
//    var footerElemContainer = document.createElement("div");
//    footerElemContainer.className = "mt-3";

//
//    footerElemContainer.appendChild(btnGetDirections);
//
//    // Create visit and order button for info window
//    var visitAndOrder = document.createElement("button");
//    visitAndOrder.textContent = "Visit and Order";
//    visitAndOrder.setAttribute("class", "btn btn-warning btn-sm mr-3");
//
//    // Initialize modal load
//    if (this.objRestaurantOrderHandler) {
//      visitAndOrder.addEventListener("click", () => {
//        this.objRestaurantOrderHandler.initializeOrderModal(
//          markerData.id,
//          this
//        );
//        this.activeWindow.close();
//      });
//    } else {
//      console.log(
//        "[WARNING] :: this.objRestaurantOrderHandler property must be set"
//      );
//    }
//    footerElemContainer.appendChild(visitAndOrder);
//    infoDialog.append(this.wrapDivInfoContainer(footerElemContainer));
//
//    // Create delete button for info window
//    var btnDeleteRestaurant = document.createElement("button");
//    btnDeleteRestaurant.textContent = "Delete";
//    btnDeleteRestaurant.setAttribute("class", "btn btn-danger btn-sm mr-3");
//
//    btnDeleteRestaurant.addEventListener("click", () => {
//      this.objRestaurantEditHandler.delete(markerData.id, this);
//    });
//
//    footerElemContainer.appendChild(btnDeleteRestaurant);

    // set the dialog contents to info window
    infoWindow.setContent(infoDialog);

    return infoWindow;
  }


}

/**
 * This method is called when initalizing the google map
 */
function initializeCustomLib() {
  var objGoogleMapLib = new GoogleMapLib();
}
