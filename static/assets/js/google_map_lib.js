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
    infoWindow.setOptions({maxWidth:1200});

    var infoDialog = document.createElement("div");
    infoDialog.className = "row";

    var mapLabel = document.createElement("h3");
    mapLabel.className = "display-4";
    mapLabel.id = 'map-marker-label'
    mapLabel.textContent = vendingMachineInfo.brand;
    infoDialog.append(this.wrapDivInfoContainer(mapLabel));



    var tableInfo = document.createElement("table");
    tableInfo.className = 'table table-bordered table-dark table-sm';
    tableInfo.id = "table-info";
    var tableInfoBody = document.createElement('tbody');

    // Address row
    var tblTRRowAddress = document.createElement('tr');
    tblTRRowAddress.className = 'font-weight-bold';
    var tblTDRowAddressLabel = document.createElement('td');
    tblTDRowAddressLabel.textContent = '住所 (address):';
    tblTRRowAddress.append(tblTDRowAddressLabel);

    var tblTDRowAddressValue = document.createElement('td');
    tblTDRowAddressValue.textContent = markerData.address;;
    tblTRRowAddress.append(tblTDRowAddressValue);

    tableInfoBody.append(tblTRRowAddress);


    // Maker name
    var tblTRMaker = document.createElement('tr');
    var tblTDMakerLabel = document.createElement('td');
    tblTDMakerLabel.className = 'font-weight-bold';
    tblTDMakerLabel.textContent = '自販機管理メーカー (maker):';
    tblTRMaker.append(tblTDMakerLabel);

    var tblTDMakerValue = document.createElement('td');
    tblTDMakerValue.textContent = markerData.vending_machine_info.maker;
    tblTRMaker.append(tblTDMakerValue);

    tableInfoBody.append(tblTRMaker);


    // Merchant name
    var tblTRMerchant = document.createElement('tr');
    var tblTDMerchantLabel = document.createElement('td');
    tblTDMerchantLabel.className = 'font-weight-bold';
    tblTDMerchantLabel.textContent = '商品名 (Merchant Name):';
    tblTRMerchant.append(tblTDMerchantLabel);

    var tblTDMerchantValue = document.createElement('td');
    tblTDMerchantValue.textContent = markerData.vending_machine_info.merchant;
    tblTRMerchant.append(tblTDMerchantValue);

    tableInfoBody.append(tblTRMerchant);


    // Price name
    var tblTRPrice = document.createElement('tr');
    var tblTDPriceLabel = document.createElement('td');
    tblTDPriceLabel.className = 'font-weight-bold';
    tblTDPriceLabel.textContent = '価格 (Price): ';
    tblTRPrice.append(tblTDPriceLabel);

    var tblTDPriceValue = document.createElement('td');
    tblTDPriceValue.textContent = markerData.vending_machine_info.price;
    tblTRPrice.append(tblTDPriceValue);

    tableInfoBody.append(tblTRPrice);

    // Temp
    var tblTRTemp = document.createElement('tr');
    var tblTDTempLabel = document.createElement('td');
    tblTDTempLabel.className = 'font-weight-bold';
    tblTDTempLabel.textContent = '温度 (Warm/Cold): ';
    tblTRTemp.append(tblTDTempLabel);

    var tblTDTempValue = document.createElement('td');
    tblTDTempValue.textContent = markerData.vending_machine_info.temp;
    tblTRTemp.append(tblTDTempValue);

    tableInfoBody.append(tblTRTemp);

    tableInfo.append(tableInfoBody);
    infoDialog.append(this.wrapDivInfoContainer(tableInfo));


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
        infoDialog.append(this.wrapDivInfoContainer(divCardDeck));
    }

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
