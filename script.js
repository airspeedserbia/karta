<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Global Map Project (Email/Password, Firebase Realtime)</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <!-- MarkerCluster CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <style>
      /* Basic Page & Map Styling */
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
      #map {
        height: 100vh;
        width: 100%;
      }
      /* Notifications Container (top-right) */
      #notificationContainer {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 20000;
      }
      .notification {
        margin-bottom: 5px;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        color: #fff;
        opacity: 0.9;
        transition: opacity 0.5s ease;
      }
      .notification.success {
        background-color: #4caf50;
      }
      .notification.error {
        background-color: #f44336;
      }
      /* Authentication UI Overlay */
      #auth-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        z-index: 30000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      #auth-container h2 {
        margin-bottom: 10px;
      }
      #auth-container form {
        margin-bottom: 10px;
      }
      #auth-container input {
        padding: 8px;
        margin: 4px 0;
        width: 250px;
        box-sizing: border-box;
      }
      #auth-container button {
        padding: 8px 16px;
        margin-top: 4px;
        cursor: pointer;
      }
      #auth-container p {
        margin: 5px 0;
      }
      #auth-container a {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
      }
      /* Left Side Menu for Pin List */
      #pinListMenu {
        position: absolute;
        top: 3.5cm;
        left: 0.5cm;
        width: 7cm;
        height: 15cm;
        background: #fff;
        border: 1px solid #ccc;
        overflow-y: auto;
        z-index: 10000;
        padding: 5px;
        font-size: 14px;
      }
      /* Search Container & Results */
      #searchContainer {
        position: absolute;
        top: 10px;
        left: 2cm;
        z-index: 10001;
        width: calc(250px - 1cm);
      }
      #searchBar {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
      }
      #searchResults {
        list-style: none;
        margin: 0;
        padding: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        max-height: 150px;
        overflow-y: auto;
        display: none;
      }
      #searchResults li {
        padding: 5px;
        cursor: pointer;
      }
      #searchResults li:hover {
        background: #f0f0f0;
      }
      /* Layer Selection Container (top-center) */
      #layerSelectContainer {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10001;
      }
      #layerSelectContainer select {
        padding: 5px;
        font-size: 14px;
      }
      #layerButtons {
        display: inline-block;
        margin-left: 30px;
      }
      #layerButtons button {
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
        margin-right: 5px;
      }
      /* Modal for Custom Pin Form */
      #pinFormModal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }
      #pinFormModal .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        width: 320px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
      }
      #pinFormModal label {
        font-weight: bold;
      }
      #pinFormModal input[type="text"],
      #pinFormModal textarea {
        width: 100%;
        margin-bottom: 10px;
        box-sizing: border-box;
      }
      /* Icon Custom Options Layout */
      #iconCustomOptions {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
      }
      #shapeSelection {
        padding-right: 5px;
        border-right: 1px solid #ccc;
      }
      .shape-option {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        cursor: pointer;
        border: 1px solid #ccc;
      }
      #colorSelection {
        padding: 0 5px;
        border-right: 1px solid #ccc;
      }
      #colorSelection table {
        border-collapse: collapse;
      }
      #colorSelection td {
        padding: 0;
        margin: 0;
      }
      .color-option {
        width: 15px;
        height: 15px;
        cursor: pointer;
        border: 1px solid #ccc;
        display: inline-block;
      }
      #iconPreview {
        padding-left: 5px;
      }
      #previewWindow {
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .selected {
        border-color: orange !important;
      }
      /* Enhanced Marker styles for map icons */
      .custom-marker {
        font-size: 10px;
        font-weight: bold;
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .custom-marker:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
      /* Tooltip styling */
      .custom-tooltip {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px;
        border-radius: 3px;
        font-size: 12px;
      }
      /* Context Menu Styling */
      .custom-context-menu {
        text-align: center;
        font-size: 14px;
      }
      .custom-context-menu a {
        display: block;
        padding: 6px 10px;
        color: #333;
        text-decoration: none;
        border-bottom: 1px solid #eee;
      }
      .custom-context-menu a:last-child {
        border-bottom: none;
      }
      .custom-context-menu a:hover {
        background-color: #f9f9f9;
        color: #000;
      }
    </style>
  </head>
  <body>
    <!-- Notification Container -->
    <div id="notificationContainer"></div>

    <!-- Authentication UI Overlay -->
    <div id="auth-container">
      <!-- Sign In Form -->
      <div id="signInContainer">
        <h2>Sign In</h2>
        <form id="signInForm">
          <input type="email" id="signInEmail" placeholder="Email" required />
          <input type="password" id="signInPassword" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <a id="showSignUp" href="#">Sign Up</a>
        </p>
      </div>
      <!-- Sign Up Form -->
      <div id="signUpContainer" style="display: none;">
        <h2>Sign Up</h2>
        <form id="signUpForm">
          <input type="email" id="signUpEmail" placeholder="Email" required />
          <input type="password" id="signUpPassword" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a id="showSignIn" href="#">Sign In</a>
        </p>
      </div>
    </div>

    <!-- Main App Content -->
    <div id="pinListMenu"></div>
    <div id="searchContainer">
      <input type="text" id="searchBar" placeholder="Search location..." />
      <ul id="searchResults"></ul>
    </div>
    <div id="layerSelectContainer">
      <select id="pinLayerSelect"></select>
      <div id="layerButtons">
        <button id="renameLayerBtn">Preimenuj</button>
        <button id="exportLayerBtn">Sačuvaj</button>
        <button id="importLayerBtn">Dodaj</button>
        <button id="deleteLayerBtn">Obriši</button>
      </div>
    </div>
    <div id="map"></div>
    <!-- Hidden File Input for Importing Layers -->
    <input type="file" id="importLayerInput" style="display: none;" accept="application/json" />
    <!-- Modal for Custom Pin Form -->
    <div id="pinFormModal">
      <div class="modal-content">
        <h3 id="modalHeader">Add Custom Pin</h3>
        <label for="pinTitle">Nalogodavac:</label>
        <input type="text" id="pinTitle" placeholder="Naziv firme" required />
        <label for="pinNumber">Kamion (optional):</label>
        <input type="text" id="pinNumber" placeholder="Oznaka kamiona" />
        <label for="pinDescription">Detalji:</label>
        <textarea id="pinDescription" placeholder="Količina, težina.."></textarea>
        <!-- Icon Custom Options Layout -->
        <div id="iconCustomOptions">
          <div id="shapeSelection">
            <div class="shape-option" data-shape="square">
              <div style="width:30px; height:30px; border:1px solid gray;"></div>
            </div>
            <div class="shape-option" data-shape="circle">
              <div style="width:30px; height:30px; border:1px solid gray; border-radius:50%;"></div>
            </div>
          </div>
          <div id="colorSelection">
            <!-- Color table will be generated dynamically -->
          </div>
          <div id="iconPreview">
            <div id="previewWindow"></div>
          </div>
        </div>
        <button id="savePinBtn">Dodaj</button>
        <button id="cancelPinBtn">Otkaži</button>
      </div>
    </div>

    <!-- Load Third-Party Libraries -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    <!-- Firebase SDKs (compat libraries) -->
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-database-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-auth-compat.js"></script>

    <script>
      /**************** Firebase Configuration & Initialization ******************/
      const firebaseConfig = {
        apiKey: "AIzaSyDXfhDG2NhylapRByYpE5leAEuIiyHPdBQ",
        authDomain: "nts-air.firebaseapp.com",
        databaseURL: "https://nts-air.firebaseio.com",
        projectId: "nts-air",
        storageBucket: "nts-air.firebasestorage.app",
        messagingSenderId: "690931555767",
        appId: "1:690931555767:web:506a87b24fad77653f1c32",
        measurementId: "G-7HNTMVW7Z9"
      };
      firebase.initializeApp(firebaseConfig);

      /**************** Notification Function ******************/
      function showNotification(message, type) {
        var container = document.getElementById("notificationContainer");
        var notif = document.createElement("div");
        notif.className = "notification " + (type || "success");
        notif.textContent = message;
        container.appendChild(notif);
        setTimeout(function () {
          notif.style.opacity = 0;
          setTimeout(function () {
            container.removeChild(notif);
          }, 500);
        }, 3000);
      }

      /**************** Authentication UI Handlers ******************/
      const signInForm = document.getElementById("signInForm");
      const signUpForm = document.getElementById("signUpForm");
      const signInContainer = document.getElementById("signInContainer");
      const signUpContainer = document.getElementById("signUpContainer");
      const showSignUpLink = document.getElementById("showSignUp");
      const showSignInLink = document.getElementById("showSignIn");

      // Toggle between Sign In and Sign Up
      showSignUpLink.addEventListener("click", function (e) {
        e.preventDefault();
        signUpContainer.style.display = "block";
        signInContainer.style.display = "none";
      });
      showSignInLink.addEventListener("click", function (e) {
        e.preventDefault();
        signUpContainer.style.display = "none";
        signInContainer.style.display = "block";
      });

      // Sign In handler
      signInForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("signInEmail").value;
        const password = document.getElementById("signInPassword").value;
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            showNotification("Signed in as " + userCredential.user.email, "success");
          })
          .catch((error) => {
            showNotification("Sign-In Error: " + error.message, "error");
          });
      });

      // Sign Up handler
      signUpForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            showNotification("Account created: " + userCredential.user.email, "success");
          })
          .catch((error) => {
            showNotification("Sign-Up Error: " + error.message, "error");
          });
      });

      // Monitor Authentication State
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User signed in — hide auth UI and initialize main app
          document.getElementById("auth-container").style.display = "none";
          console.log("User signed in: ", user.email, user.uid);
          initMapAndRealtime();
        } else {
          // No user — show auth UI
          document.getElementById("auth-container").style.display = "flex";
          console.log("No user signed in.");
        }
      });

      /**************** Main App: Initialization (Mapping & Realtime Database) ******************/
      function initMapAndRealtime() {
        /***** Initialize Map *****/
        var map = L.map("map", {
          center: [45.541, 10.211],
          zoom: 7,
        });
        var baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "Map data © OpenStreetMap contributors"
        });
        baseLayer.addTo(map);
        // (Optional) Remove the demo marker if you do not wish to see it.
        // var demoMarker = L.marker([45.541, 10.211]).addTo(map).bindPopup("Welcome to the Global Map Project!").openPopup();

        // Create two layers: one for vehicle markers and one for custom pins
        var vehicleLayer = L.markerClusterGroup();
        var customPinLayer = L.layerGroup();
        vehicleLayer.addTo(map);
        customPinLayer.addTo(map);
        L.control.layers({ "Base Map": baseLayer }, { "Vozila": vehicleLayer, "Utovari": customPinLayer }).addTo(map);

        /***** Define clearCustomPinMarkers Function *****/
        // This function clears all custom pin markers from the map.
        function clearCustomPinMarkers() {
          customPinLayer.clearLayers();
          customPinMarkers = {};
        }

        /***** Firebase Realtime Database Integration for Pin Layers *****/
        var pinLayers = [];           // Array to store layers (loaded from Firebase)
        var activePinLayerId = null;  // ID of currently active layer
        var activePinLayer = null;    // Currently active layer object
        var customPins = [];          // Shortcut: pointer to active layer's pins

        // Save pinLayers to Firebase (last write wins)
        function savePinLayersToDatabase() {
          firebase.database().ref("globalMapPinLayers").set(pinLayers, function(error) {
            if (error) {
              showNotification("Error saving data: " + error, "error");
            } else {
              showNotification("Changes saved", "success");
            }
          });
        }

        // Load and listen for changes from Firebase
        function loadPinLayersFromDatabase() {
          firebase.database().ref("globalMapPinLayers").on("value", function(snapshot) {
            var data = snapshot.val();
            if (data) {
              pinLayers = data;
            } else {
              var defaultLayer = { id: "layer_default", name: ". nedelja", pins: [] };
              pinLayers = [defaultLayer];
              activePinLayerId = defaultLayer.id;
              savePinLayersToDatabase();
            }
            if (!activePinLayerId) {
              activePinLayerId = pinLayers[0].id;
            }
            activePinLayer = pinLayers.find(function(layer) {
              return layer.id === activePinLayerId;
            }) || pinLayers[0];
            customPins = activePinLayer.pins;
            clearCustomPinMarkers();
            loadPinsToMap();
            updateLayerSelectMenu();
            updatePinListMenu();
          });
        }
        loadPinLayersFromDatabase();

        /***** UI for Layer Selection & Management *****/
        function updateLayerSelectMenu() {
          var select = document.getElementById("pinLayerSelect");
          select.innerHTML = "";
          pinLayers.forEach(function (layer) {
            var opt = document.createElement("option");
            opt.value = layer.id;
            opt.textContent = layer.name;
            if (layer.id === activePinLayerId) opt.selected = true;
            select.appendChild(opt);
          });
          var optNew = document.createElement("option");
          optNew.value = "create_new";
          optNew.textContent = "Nova nedelja";
          select.appendChild(optNew);
        }
        updateLayerSelectMenu();

        document.getElementById("pinLayerSelect").addEventListener("change", function(e) {
          if (e.target.value === "create_new") {
            var layerName = prompt("Enter new layer name:");
            if (layerName) {
              var newLayerId = "layer_" + Date.now();
              var newLayer = { id: newLayerId, name: layerName, pins: [] };
              pinLayers.push(newLayer);
              activePinLayerId = newLayerId;
              activePinLayer = newLayer;
              savePinLayersToDatabase();
              updateLayerSelectMenu();
              clearCustomPinMarkers();
              customPins = activePinLayer.pins;
              loadPinsToMap();
              showNotification("New layer created", "success");
            } else {
              document.getElementById("pinLayerSelect").value = activePinLayerId;
            }
          } else {
            activePinLayerId = e.target.value;
            activePinLayer = pinLayers.find(function(layer) {
              return layer.id === activePinLayerId;
            });
            clearCustomPinMarkers();
            customPins = activePinLayer.pins;
            loadPinsToMap();
          }
        });

        document.getElementById("renameLayerBtn").addEventListener("click", function() {
          var newName = prompt("Enter new name for the current layer:", activePinLayer.name);
          if (newName) {
            activePinLayer.name = newName;
            savePinLayersToDatabase();
            updateLayerSelectMenu();
          }
        });

        document.getElementById("exportLayerBtn").addEventListener("click", function() {
          var dataStr = JSON.stringify(activePinLayer, null, 4);
          var blob = new Blob([dataStr], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = activePinLayer.name.replace(/\s+/g, "_") + ".json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });

        document.getElementById("importLayerBtn").addEventListener("click", function() {
          document.getElementById("importLayerInput").click();
        });

        document.getElementById("importLayerInput").addEventListener("change", function(e) {
          var file = e.target.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function(e) {
            try {
              var importedData = JSON.parse(e.target.result);
              var importedPins = importedData.pins ? importedData.pins : importedData;
              if (Array.isArray(importedPins)) {
                importedPins.forEach(function(pin) {
                  if (typeof pin.tooltipOpened === "undefined") {
                    pin.tooltipOpened = true;
                  }
                  if (activePinLayer.pins.find(function(item) { return item.id === pin.id; })) {
                    pin.id = "pin_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
                  }
                  activePinLayer.pins.push(pin);
                });
                savePinLayersToDatabase();
                clearCustomPinMarkers();
                loadPinsToMap();
                showNotification("Pins imported successfully", "success");
              } else {
                throw new Error("Invalid file format. Expected an object with a 'pins' array.");
              }
            } catch (ex) {
              alert("Error importing file: " + ex.message);
            }
          };
          reader.readAsText(file);
          e.target.value = "";
        });

        document.getElementById("deleteLayerBtn").addEventListener("click", function() {
          if (confirm("Jesi li siguran?")) {
            if (pinLayers.length === 1) {
              alert("Cannot delete the only layer.");
              return;
            }
            pinLayers = pinLayers.filter(function(layer) {
              return layer.id !== activePinLayerId;
            });
            activePinLayer = pinLayers[0];
            activePinLayerId = activePinLayer.id;
            customPins = activePinLayer.pins;
            savePinLayersToDatabase();
            updateLayerSelectMenu();
            clearCustomPinMarkers();
            loadPinsToMap();
            showNotification("Layer deleted", "success");
          }
        });

        /***** Custom Pin Functionality *****/
        var customPinMarkers = {};

        function lightenColor(hex, percent) {
          var num = parseInt(hex.replace("#", ""), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
          return "#" + (0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
                   (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
                   (B < 255 ? (B < 0 ? 0 : B) : 255))
                   .toString(16).slice(1);
        }
        function darkenColor(hex, percent) {
          return lightenColor(hex, -percent);
        }
        function parseIconValue(value) {
          var parts = value.split("-");
          return { color: parts[0], shape: parts[1] };
        }
        // Compute marker size based on map zoom.
        function getMarkerSize() {
          var baseSize = 20;
          var zoomDiff = map.getZoom() - 13;
          var factor = 1.0366;
          return baseSize * Math.pow(factor, zoomDiff);
        }
        // Create a custom marker icon.
        function createMarkerIcon(iconData, pinNumber) {
          var size = getMarkerSize();
          var lighter = lightenColor(iconData.color, 20);
          var darker = darkenColor(iconData.color, 20);
          var inlineStyle =
            "background: " + iconData.color + "; " +
            "background-image: linear-gradient(135deg, " + lighter + ", " + darker + "); " +
            "width:" + size + "px; height:" + size + "px; line-height:" + size + "px; text-align:center;";
          if (iconData.shape === "circle") {
            inlineStyle += "border-radius:" + (size / 2) + "px;";
          }
          var htmlContent = '<div class="custom-marker" style="' + inlineStyle + '">' +
                            (pinNumber || "") + "</div>";
          return L.divIcon({
            html: htmlContent,
            iconSize: [size, size],
            iconAnchor: [size / 2, size]
          });
        }
        // Create and add a custom pin marker.
        function createPinMarker(pin) {
          var iconData = parseIconValue(pin.icon);
          // Normalize unsupported shapes if needed.
          if (iconData.shape === "triangle") {
            iconData.shape = "circle";
          }
          var divIcon = createMarkerIcon(iconData, pin.number);
          var marker = L.marker([pin.lat, pin.lng], {
            icon: divIcon,
            draggable: true
          });
          marker.pinData = pin;
          marker.on("dragend", function(e) {
            var newLatLng = e.target.getLatLng();
            var foundPin = customPins.find(function(item) { return item.id === pin.id; });
            if (foundPin) {
              foundPin.lat = newLatLng.lat;
              foundPin.lng = newLatLng.lng;
              savePinLayersToDatabase();
              updateTooltipPositions();
            }
          });
          marker.on("click", function() {
            togglePinTooltip(pin.id);
          });
          marker.on("contextmenu", function(e) {
            e.originalEvent.preventDefault();
            showContextMenu(pin.id, e.latlng);
          });
          if (pin.tooltipOpened) {
            var infoHtml = '<div style="text-align:left;"><strong>' + pin.title + '</strong><br/>' + pin.description + "</div>";
            marker.bindTooltip(infoHtml, {
              permanent: true,
              direction: "right",
              offset: L.point(3, 5),
              className: "custom-tooltip"
            });
            marker.infoVisible = true;
            marker.originalTooltipContent = infoHtml;
          } else {
            marker.infoVisible = false;
          }
          customPinMarkers[pin.id] = marker;
          customPinLayer.addLayer(marker);
          updateTooltipPositions();
        }
        // Update markers when zoom changes.
        function updateAllMarkerIcons() {
          for (var key in customPinMarkers) {
            var marker = customPinMarkers[key];
            var pin = marker.pinData;
            var iconData = parseIconValue(pin.icon);
            if (iconData.shape === "triangle") {
              iconData.shape = "circle";
            }
            var newIcon = createMarkerIcon(iconData, pin.number);
            marker.setIcon(newIcon);
          }
        }
        function loadPinsToMap() {
          customPins.forEach(function(pin) {
            createPinMarker(pin);
          });
          updatePinListMenu();
        }
        loadPinsToMap();

        map.on("zoomend moveend", function() {
          updateAllMarkerIcons();
          updateTooltipPositions();
        });

        // Update tooltip positions to avoid overlaps.
        function updateTooltipPositions() {
          var visibleMarkers = [];
          for (var key in customPinMarkers) {
            var marker = customPinMarkers[key];
            if (marker.infoVisible && marker.getTooltip()) {
              visibleMarkers.push(marker);
            }
          }
          var tooltips = [];
          visibleMarkers.forEach(function(marker) {
            var defaultOffset = L.point(13, -7);
            var content = marker.getTooltip().getContent();
            marker.unbindTooltip();
            marker.bindTooltip(content, {
              permanent: true,
              direction: "right",
              offset: defaultOffset,
              className: "custom-tooltip"
            });
            marker.openTooltip();
            var tooltipElement = marker.getTooltip().getElement();
            if (tooltipElement) {
              tooltips.push({
                marker: marker,
                offset: defaultOffset,
                rect: tooltipElement.getBoundingClientRect()
              });
            }
          });
          function rectsOverlap(rect1, rect2) {
            return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
          }
          var collisionResolved = false;
          var maxIterations = 10;
          var iteration = 0;
          while (!collisionResolved && iteration < maxIterations) {
            collisionResolved = true;
            iteration++;
            for (var i = 0; i < tooltips.length; i++) {
              for (var j = i + 1; j < tooltips.length; j++) {
                if (rectsOverlap(tooltips[i].rect, tooltips[j].rect)) {
                  var rectA = tooltips[i].rect;
                  var rectB = tooltips[j].rect;
                  var centerA = { x: rectA.left + rectA.width/2, y: rectA.top + rectA.height/2 };
                  var centerB = { x: rectB.left + rectB.width/2, y: rectB.top + rectB.height/2 };
                  var dx = centerB.x - centerA.x;
                  var dy = centerB.y - centerA.y;
                  if (dx === 0 && dy === 0) { dx = 5; dy = 5; }
                  var dist = Math.sqrt(dx*dx + dy*dy);
                  var shiftStep = 10;
                  var shiftX = (dx / dist) * shiftStep;
                  var shiftY = (dy / dist) * shiftStep;
                  tooltips[j].offset = L.point(tooltips[j].offset.x + shiftX, tooltips[j].offset.y + shiftY);
                  var content = tooltips[j].marker.getTooltip().getContent();
                  tooltips[j].marker.unbindTooltip();
                  tooltips[j].marker.bindTooltip(content, {
                    permanent: true,
                    direction: "right",
                    offset: tooltips[j].offset,
                    className: "custom-tooltip"
                  });
                  tooltips[j].marker.openTooltip();
                  var newRect = tooltips[j].marker.getTooltip().getElement().getBoundingClientRect();
                  tooltips[j].rect = newRect;
                  collisionResolved = false;
                }
              }
            }
          }
        }

        // Toggle tooltip visibility on marker click.
        function togglePinTooltip(pinId) {
          var marker = customPinMarkers[pinId];
          if (!marker) return;
          var pin = customPins.find(function(p) { return p.id === pinId; });
          if (!pin) return;
          if (marker.infoVisible) {
            marker.unbindTooltip();
            marker.infoVisible = false;
            pin.tooltipOpened = false;
            savePinLayersToDatabase();
          } else {
            var infoHtml = '<div style="text-align:left;"><strong>' + pin.title + '</strong><br/>' + pin.description + "</div>";
            marker.bindTooltip(infoHtml, {
              permanent: true,
              direction: "right",
              offset: L.point(3,5),
              className: "custom-tooltip"
            });
            marker.infoVisible = true;
            pin.tooltipOpened = true;
            marker.originalTooltipContent = infoHtml;
            savePinLayersToDatabase();
          }
          updateTooltipPositions();
          updatePinListMenu();
        }

        // Display context menu for editing or deleting a pin.
        function showContextMenu(pinId, latlng) {
          var popup = L.popup({ offset: L.point(0, -30) })
                      .setLatLng(latlng)
                      .setContent('<div class="custom-context-menu">' +
                                  '<a href="#" onclick="editPin(\'' + pinId + '\'); return false;">Izmeni</a>' +
                                  '<a href="#" onclick="deletePin(\'' + pinId + '\'); return false;">Obriši</a>' +
                                  "</div>");
          popup.openOn(map);
        }

        // Delete a pin.
        window.deletePin = function(pinId) {
          if (customPinMarkers[pinId]) {
            customPinLayer.removeLayer(customPinMarkers[pinId]);
            delete customPinMarkers[pinId];
          }
          removeCustomPin(pinId);
          map.closePopup();
          updateTooltipPositions();
          updatePinListMenu();
        };

        function removeCustomPin(pinId) {
          activePinLayer.pins = activePinLayer.pins.filter(function(pin) {
            return pin.id !== pinId;
          });
          customPins = activePinLayer.pins;
          savePinLayersToDatabase();
        }

        // Edit a pin (opens the modal populated with the pin's details).
        window.editPin = function(pinId) {
          var pin = customPins.find(function(item) { return item.id === pinId; });
          if (pin) {
            currentEditingPinId = pinId;
            document.getElementById("modalHeader").textContent = "Edit Custom Pin";
            document.getElementById("pinTitle").value = pin.title;
            document.getElementById("pinNumber").value = pin.number;
            document.getElementById("pinDescription").value = pin.description;
            var parts = pin.icon.split("-");
            updateSelectedIconChoices(parts[1], parts[0]);
            var tableHTML = generateColorTable();
            document.getElementById("colorSelection").innerHTML = tableHTML;
            document.querySelectorAll("#colorSelection .color-option").forEach(function(el) {
              el.addEventListener("click", function() {
                var c = this.getAttribute("data-color");
                updateSelectedIconChoices(selectedShape, c);
              });
            });
            document.getElementById("pinFormModal").style.display = "flex";
          }
        };

        var currentEditingPinId = null;
        var currentPinLatLng = null;
        // Set pin location by right-clicking on the map.
        map.on("contextmenu", function(e) {
          currentPinLatLng = e.latlng;
          currentEditingPinId = null;
          document.getElementById("modalHeader").textContent = "Add Custom Pin";
          showPinForm();
        });

        /***** Icon Selection Functions *****/
        var selectedShape = "circle";
        var selectedColor = "blue";
        function updatePreview() {
          var previewWindow = document.getElementById("previewWindow");
          var lighter = lightenColor(selectedColor, 20);
          var darker = darkenColor(selectedColor, 20);
          var style = "background: " + selectedColor + "; background-image: linear-gradient(135deg, " + lighter + ", " + darker + "); width:100px; height:100px; line-height:100px;";
          if (selectedShape === "circle") {
            style += "border-radius:50%;";
          }
          previewWindow.innerHTML = '<div class="custom-marker" style="' + style + '"></div>';
        }
        function updateSelectedIconChoices(shape, color) {
          document.querySelectorAll("#shapeSelection .shape-option").forEach(function(el) {
            el.classList.remove("selected");
            if (el.getAttribute("data-shape") === shape) {
              el.classList.add("selected");
            }
          });
          document.querySelectorAll("#colorSelection .color-option").forEach(function(el) {
            el.classList.remove("selected");
            if (el.getAttribute("data-color") === color) {
              el.classList.add("selected");
            }
          });
          selectedShape = shape;
          selectedColor = color;
          updatePreview();
        }
        document.querySelectorAll("#shapeSelection .shape-option").forEach(function(el) {
          el.addEventListener("click", function() {
            var shape = this.getAttribute("data-shape");
            updateSelectedIconChoices(shape, selectedColor);
          });
        });
        function hslToHex(h, s, l) {
          s /= 100;
          l /= 100;
          var c = (1 - Math.abs(2 * l - 1)) * s;
          var x = c * (1 - Math.abs((h / 60) % 2 - 1));
          var m = l - c / 2;
          var r = 0, g = 0, b = 0;
          if (0 <= h && h < 60) { r = c; g = x; b = 0; }
          else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
          else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
          else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
          else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
          else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        function generateColorTable() {
          var totalCells = 5 * 9;
          var html = "<table>";
          for (var i = 0; i < 5; i++) {
            html += "<tr>";
            for (var j = 0; j < 9; j++) {
              var index = i * 9 + j;
              var hue = (index * 360) / totalCells;
              var color = hslToHex(hue, 100, 50);
              html += "<td><div class='color-option' data-color='" + color + "' style='width:15px; height:15px; background:" + color + "; border:1px solid #ccc;'></div></td>";
            }
            html += "</tr>";
          }
          html += "</table>";
          return html;
        }
        function showPinForm() {
          document.getElementById("pinFormModal").style.display = "flex";
          document.getElementById("pinTitle").value = "";
          document.getElementById("pinNumber").value = "";
          document.getElementById("pinDescription").value = "";
          updateSelectedIconChoices("circle", "blue");
          var tableHTML = generateColorTable();
          document.getElementById("colorSelection").innerHTML = tableHTML;
          document.querySelectorAll("#colorSelection .color-option").forEach(function(el) {
            el.addEventListener("click", function() {
              var c = this.getAttribute("data-color");
              updateSelectedIconChoices(selectedShape, c);
            });
          });
        }
        function hidePinForm() {
          document.getElementById("pinFormModal").style.display = "none";
        }
        // Save (or update) pin when the "Dodaj" button is clicked.
        document.getElementById("savePinBtn").addEventListener("click", function() {
          var title = document.getElementById("pinTitle").value.trim();
          var number = document.getElementById("pinNumber").value.trim();
          var description = document.getElementById("pinDescription").value.trim();
          if (!title) {
            alert("Title is required!");
            return;
          }
          // If adding a new pin, ensure a location was set.
          if (!currentEditingPinId && !currentPinLatLng) {
            alert("No location selected for this pin. Please right-click on the map to select a location.");
            return;
          }
          if (!activePinLayer) {
            alert("No active layer available. Please reload the page.");
            return;
          }
          var iconType = selectedColor + "-" + selectedShape;
          if (currentEditingPinId) {
            var pin = customPins.find(function(item) { return item.id === currentEditingPinId; });
            if (pin) {
              pin.title = title;
              pin.number = number;
              pin.description = description;
              pin.icon = iconType;
              savePinLayersToDatabase();
              if (customPinMarkers[currentEditingPinId]) {
                customPinLayer.removeLayer(customPinMarkers[currentEditingPinId]);
                delete customPinMarkers[currentEditingPinId];
              }
              createPinMarker(pin);
            }
            currentEditingPinId = null;
          } else {
            // Create a new pin using the selected location.
            var pinId = "pin_" + Date.now();
            var pinObj = {
              id: pinId,
              lat: currentPinLatLng.lat,
              lng: currentPinLatLng.lng,
              title: title,
              number: number,
              description: description,
              icon: iconType,
              tooltipOpened: true
            };
            activePinLayer.pins.push(pinObj);
            savePinLayersToDatabase();
            createPinMarker(pinObj);
          }
          hidePinForm();
          updatePinListMenu();
        });
        document.getElementById("cancelPinBtn").addEventListener("click", function() {
          hidePinForm();
        });

        /***** Dynamic Search Bar Functionality *****/
        var searchBar = document.getElementById("searchBar");
        var searchResults = document.getElementById("searchResults");
        searchBar.addEventListener("keyup", function(e) {
          var query = searchBar.value.trim();
          if (query.length < 3) {
            searchResults.style.display = "none";
            return;
          }
          fetch("https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + encodeURIComponent(query))
            .then(function(response) { return response.json(); })
            .then(function(data) {
              searchResults.innerHTML = "";
              if (data.length > 0) {
                data.forEach(function(result) {
                  var li = document.createElement("li");
                  li.textContent = result.display_name;
                  li.addEventListener("click", function() {
                    var lat = parseFloat(result.lat);
                    var lon = parseFloat(result.lon);
                    map.setView([lat, lon], 13);
                    searchResults.style.display = "none";
                  });
                  searchResults.appendChild(li);
                });
                searchResults.style.display = "block";
              } else {
                searchResults.style.display = "none";
              }
            })
            .catch(function(error) {
              console.error(error);
              searchResults.style.display = "none";
            });
        });
        searchBar.addEventListener("keydown", function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            if (searchResults.firstChild) {
              searchResults.firstChild.click();
            }
          }
        });

        /***** Update Pin List Menu *****/
        function updatePinListMenu() {
          var menu = document.getElementById("pinListMenu");
          var sortedPins = customPins.slice().sort(function(a, b) {
            var aNum = parseFloat(a.number),
                bNum = parseFloat(b.number);
            if (!isNaN(aNum) && !isNaN(bNum)) {
              if (aNum !== bNum) return aNum - bNum;
            } else {
              if (a.number < b.number) return -1;
              if (a.number > b.number) return 1;
            }
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            if (a.description < b.description) return -1;
            if (a.description > b.description) return 1;
            return 0;
          });
          var html = "<ul style='list-style:none; padding:0; margin:0;'>";
          sortedPins.forEach(function(pin) {
            var textDecoration = pin.tooltipOpened ? "none" : "line-through";
            var iconData = parseIconValue(pin.icon);
            html += "<li style='padding:2px 0; border-bottom:1px solid #ccc; text-decoration:" + textDecoration + ";'>";
            html += "<span style='display: inline-block; background:" + iconData.color + "; width:15px; height:15px; margin-right: 5px;";
            if (iconData.shape === "circle") {
              html += "border-radius:50%;";
            }
            html += "'></span>";
            html += "<span>" + (pin.number ? pin.number + " " : "") + pin.title + " - " + pin.description + "</span>";
            html += "</li>";
          });
          html += "</ul>";
          menu.innerHTML = html;
        }
      } // End of initMapAndRealtime
    </script>
  </body>
</html>

