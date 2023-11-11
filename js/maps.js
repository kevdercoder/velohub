import {
  supa
} from "/js/supabase.js";

//Global variables
let distance = localStorage.getItem('btnFilterDistance');
let altitude = localStorage.getItem('btnFilterAltitude');

/* Programm to display the maps in the list view */
async function showMaps() {
  const {
    data: maps,
    error
  } = await supa.from("maps").select();
  maps.forEach(maps => {
    let sectionMaps = document.createElement('section');
    sectionMaps.className = 'container-maps';
    sectionMaps.id = maps.id;

    //Filter for the maps which should be displayed
    if (distance == 20 && maps.distance <= 20 && altitude == maps.altitude || distance == 20 && maps.distance <= 20 && altitude == null) {
      displayOverview()
    } else if (distance == 50 && maps.distance <= 50 && maps.distance > 20 && altitude == maps.altitude || distance == 50 && maps.distance <= 50 && maps.distance > 20 && altitude == null) {
      displayOverview()
    } else if (distance == 100 && maps.distance <= 100 && maps.distance > 50 && altitude == maps.altitude || distance == 100 && maps.distance <= 100 && maps.distance > 50 && altitude == null) {
      displayOverview()
    } else if (distance == 200 && maps.distance <= 200 && maps.distance > 100 && altitude == maps.altitude || distance == 200 && maps.distance <= 200 && maps.distance > 100 && altitude == null) {
      displayOverview()
    } else if (distance == null && altitude == maps.altitude) {
      displayOverview()
    } else if (distance == null && altitude == null) {
      displayOverview()
    }

    //Display the maps in the list view
    async function displayOverview() {
      sectionMaps.innerHTML = `
        <div class="maps-img-container">
          <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${maps.map_img}" alt="image-alt">
          <img id="${maps.id}" class="maps-checkmark" style="display: none" src="/img/icon-checkmark-dark.svg" alt="checkmark">
        </div>
        <div class="maps-margin">
          <h2>${maps.map_name}</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${maps.distance}km</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-up.svg" alt="image-alt">
              <p>${maps.altitude_up}m</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-down.svg" alt="image-alt">
              <p>${maps.altitude_down}m</p>
            </li>
          </ul>
          <div class="maps-filters ${maps.altitude}">${maps.altitude}</div>
        </div>
      `;

      document.body.appendChild(sectionMaps);
      const hr = document.createElement('hr');
      hr.className = 'maps-seperator';

      document.querySelector('main').appendChild(sectionMaps);
      document.querySelector('main').appendChild(hr)

      if (supa.auth.user() === null) {
        null
      } else {
        const {
          user,
          error
        } = await supa.auth.user();
        if (error) {
          console.log("Error getting user information:", error.message);
        } else {
          const {
            data: existingData,
            error: existingError
          } = await supa
            .from("done")
            .select("*")
            .eq("maps_id", maps.id)
            .eq("user_id", supa.auth.user().id);

          let list = document.getElementsByClassName("maps-checkmark");

            for (let item of list) {
              if (existingData.length > 0 && existingData[0].maps_id == item.id) {
                item.style.display = 'block';
              }
            }
        }
      }
    }
  })


  // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelectorAll('.skeleton-loading');
  skeletonLoading.forEach(element => {
    element.style.display = 'none';
  });

  // Add padding to the bottom of the page
  let div = document.createElement('div');
  div.className = 'container-padding-750'
  document.body.appendChild(div);


  // Save the id of the clicked map in local storage and redirect to single-map.html
  const sectionMapsList = document.querySelectorAll('.container-maps');

  sectionMapsList.forEach((sectionMaps) => {
    sectionMaps.addEventListener('click', () => {

      localStorage.setItem('mapId', sectionMaps.id)
      window.location.href = `single-map.html?${sectionMaps.id}`;
      console.log(`Clicked on ${sectionMaps.id}`);
      
    });

  });
}

export { showMaps };



async function displayMap() {
  const { data: maps, error } = await supa.from("maps").select();

  if (maps) {
    maps.forEach(mapsData => {
      let singleMapContainer = document.createElement('section');
      singleMapContainer.className = 'container-single-map';
      singleMapContainer.id = mapsData.id;

      if (localStorage.getItem('mapId') == mapsData.id) {

        singleMapContainer.innerHTML = `
          <div id="map" class="single-map-big"></div>
          <button id="shuffle-again">Nochmals mischen</button>
          <div class="container-flex">
            <div>
              <h2 id="single-map-name">${mapsData.map_name}</h2>
              <ul>
                <li class="maps-distance">
                  <img src="/img/icon-distance.svg" alt="image-alt">
                  <p>${mapsData.distance}km</p>
                </li>
                <li class="maps-distance">
                  <img src="/img/icon-up.svg" alt="image-alt">
                  <p>${mapsData.altitude_up}m</p>
                </li>
                <li class="maps-distance">
                  <img src="/img/icon-down.svg" alt="image-alt">
                  <p>${mapsData.altitude_down}m</p>
                </li>
              </ul>
              <div class="maps-filters ${mapsData.altitude}">${mapsData.altitude}</div>
            </div>
            <button id="btn-track-finished">
              <img id="add-track-finished" src="img/icon-add.svg">Beendet</button>
            <div class="break-point"></div>
          </div>
          <section>
            <a href="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${mapsData.gpx_data}" download>
              <button id="btn-gpx">Download .gpx</button>
            </a>
            <a href="/community-ride.html">
              <button id="btn-plan-community">Community-Tour planen</button>
            </a>
          </section>
          <section>
            <p class="single-map-description">${mapsData.description}</p>
          </section>
        `;

        initMap = function() {
          const map = new google.maps.Map(document.getElementById("map"), {
              mapId: "67a32317a1bc4a60",
              zoom: 10,
              center: { lat: 46.946383444981336, lng: 7.442313596894101 },
              mapTypeId: "roadmap",
              zoomControl: false,
              streetViewControl: false,
          });

                fetch(`https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${mapsData.gpx_data}`)
                .then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                //.then(data => console.log(data))
                .then(doc =>
                {
                    var points = [];
                    var bounds = new google.maps.LatLngBounds();
                
                    const nodes = [...doc.getElementsByTagName('trkpt')];
                    nodes.forEach(node =>
                    {
                        var lat = node.getAttribute("lat");
                        var lon = node.getAttribute("lon");
                        //console.log(lat);
                        
                        var p = new google.maps.LatLng(lat, lon);
                        points.push(p);
                        bounds.extend(p);
                    })
                    
                    var poly = new google.maps.Polyline({
                             path: points,
                             strokeColor: "#f99a52",
                             strokeOpacity: 0.8,
                             strokeWeight: 4
                        });
                        poly.setMap(map);
                        // fit bounds to track
                        map.fitBounds(bounds);
                })
              }



        document.body.appendChild(singleMapContainer);

        const referrer = document.referrer;
        if (referrer.includes('overview-maps.html')) {
          document.querySelector('.btn-back').innerHTML = 'Übersicht';
          document.querySelector('#icon-chevron').style.display = 'block';
        } else {
          document.querySelector('.btn-back').innerHTML = 'Home';
          document.querySelector('#back-home').href = 'index.html';
          document.querySelector('#icon-chevron').style.display = 'block';

          const shuffleAgainButton = document.getElementById('shuffle-again');
          shuffleAgainButton.style.display = 'block';

          shuffleAgainButton.addEventListener('click', () => {
            window.location.reload();
          })
        }

        let btnTrackFinished = document.getElementById('btn-track-finished');
        let breakPoint = document.querySelector('.break-point');

        async function checkRiddenMap() {
          if (supa.auth.user() === null) {
            btnTrackFinished.style.display = 'none';
          } else {
            const { user, error } = await supa.auth.user();
            if (error) {
              console.log("Error getting user information:", error.message);
            } else {
              const { data: existingData, error: existingError } = await supa
                .from("done")
                .select("*")
                .eq("maps_id", mapsData.id)
                .eq("user_id", supa.auth.user().id);

              if (existingError) {
                console.log("Error getting existing data:", existingError.message);
              } else if (existingData.length > 0) {
                breakPoint.style.display = 'none';
                btnTrackFinished.style.display = 'flex';
                btnTrackFinished.id = 'finished-map';
                btnTrackFinished.removeEventListener('click', addRiddenMap);

                document.getElementById('add-track-finished').src = 'img/icon-checkmark.svg';
              } else {
                breakPoint.style.display = 'none';
                btnTrackFinished.style.display = 'flex';
                console.log("User has not finished the track yet.");
              }
            }
          }
        }

        checkRiddenMap();

        if (document.contains(document.getElementById('btn-track-finished'))) {
          document.getElementById('btn-track-finished').addEventListener('click', addRiddenMap)
        }

        async function addRiddenMap() {
          const { user, error } = await supa.auth.user();
          if (error) {} else {
            const { data, error } = await supa
              .from("done")
              .insert({
                maps_id: mapsData.id,
                user_id: supa.auth.user().id
              });

            btnTrackFinished.id = 'finished-map'
            btnTrackFinished.removeEventListener('click', addRiddenMap);

            document.getElementById('add-track-finished').src = 'img/icon-checkmark.svg';

            if (error) {
              console.log("Error inserting data:", error.message);
            } else {
              console.log("Data inserted successfully:", data);
            }
          }
        }
      }
    });
  }

  // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelector('.skeleton-loading');
  skeletonLoading.style.display = 'none';

  // Initialize Google Maps
  initMap();
}

export { displayMap };




/* Programm to display the maps in the single-view */

async function shuffleMaps() {
  const { data: maps, error } = await supa.from("maps").select();

  const referrer = document.referrer;
  if (referrer.includes('overview-maps.html')) {

  } else {
    // Fisher-Yates shuffle algorithm
    for (let i = maps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [maps[i], maps[j]] = [maps[j], maps[i]];
  }

  let selectedMapId = null;

  maps.forEach(maps => {
    //Filter for the maps which should be displayed
    if (distance == 20 && maps.distance <= 20 && altitude == maps.altitude || distance == 20 && maps.distance <= 20 && altitude == null) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    } else if (distance == 50 && maps.distance <= 50 && maps.distance > 20 && altitude == maps.altitude || distance == 50 && maps.distance <= 50 && maps.distance > 20 && altitude == null) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    } else if (distance == 100 && maps.distance <= 100 && maps.distance > 50 && altitude == maps.altitude || distance == 100 && maps.distance <= 100 && maps.distance > 50 && altitude == null) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    } else if (distance == 200 && maps.distance <= 200 && maps.distance > 100 && altitude == maps.altitude || distance == 200 && maps.distance <= 200 && maps.distance > 100 && altitude == null) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    } else if (distance == null && altitude == maps.altitude) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    } else if (distance == null && altitude == null) {
      selectedMapId = maps.id;
      localStorage.setItem('mapId', selectedMapId);
      return
    }
  })
}
}

export { shuffleMaps };
        