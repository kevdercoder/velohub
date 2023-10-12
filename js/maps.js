import {
  supa
} from "/js/supabase-setup.js";

async function showMaps() {
    const { data: maps, error } = await supa.from("maps").select();
    maps.forEach(maps => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = maps.id;


      let distance = localStorage.getItem('btnFilterDistance');
      let altitude = localStorage.getItem('btnFilterAltitude');
      let listType = localStorage.getItem('btnList');

console.log(distance);


      if (distance == 20 && maps.distance <= 20) {
        console.log(maps.distance);
      } else if (distance == 50) {
        console.log('fünfzig')
      } else if (distance == 100) {
        console.log('hundert')
      } else if (distance == 200) { 
        console.log('hundertplus')
      }
      
    
      sectionMaps.innerHTML = `
        <div class="maps-img-container">
          <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${maps.map_img}" alt="image-alt">
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
          <div class="maps-filters">${maps.altitude}</div>
        </div>
      `;

      document.body.appendChild(sectionMaps);
  
      const hr = document.createElement('hr');
      hr.className = 'maps-seperator';
      document.body.appendChild(hr);
    })


    // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelector('.skeleton-loading');
  skeletonLoading.style.display = 'none';



const sectionMapsList = document.querySelectorAll('.container-maps');

sectionMapsList.forEach((sectionMaps) => {
  sectionMaps.addEventListener('click', () => {

    localStorage.setItem('mapId', sectionMaps.id)
    // Handle the click event here
    console.log(`Clicked on ${sectionMaps.id}`);
    window.location.href = `single-map.html?${sectionMaps.id}`;
  });

});
  }

  export { showMaps };

  

  async function displayMap() {
    const { data: maps, error } = await supa.from("maps").select();
    maps.forEach(maps => {
      let singleMapContainer = document.createElement('section');
      singleMapContainer.className = 'container-single-map';
      singleMapContainer.id = maps.id;

      if (localStorage.getItem('mapId') == maps.id) {
      
      singleMapContainer.innerHTML = `
          <img class="single-map-big" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${maps.map_img}" alt="image-alt">
        <div class="container-flex">
          <div>
          <h2 id="single-map-name">${maps.map_name}</h2>
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
          <div class="maps-filters">${maps.altitude}</div>
          </div>
          <button id="btn-track-finished">Beendet</button>
        </div>
        <section>
        <a href="/geojson/gpx/20-50km+flach_R01.gpx" download>
          <button id="btn-gpx">Download .gpx</button>
          </a>
          <button id="btn-add-community">Community-Tour planen</button>
        </section>
        <section>
          <p class="single-map-description">${maps.description}</p>
        </section>
      `;

      document.body.appendChild(singleMapContainer);
      let btnTrackFinished = document.getElementById('btn-track-finished');


      async function checkRiddenMap() {
      if (supa.auth.user() === null) {
        btnTrackFinished.style.display = 'none';
      } else {
        const { user, error } = await supa.auth.user();
        if (error) {
          console.log("Error getting user information:", error.message);
        } else {
          const { data: existingData, error: existingError } = await supa
            .from("user_ridden_maps")
            .select("*")
            .eq("maps_id", maps.id)
            .eq("user_id", supa.auth.user().id);
      
          if (existingError) {
            console.log("Error getting existing data:", existingError.message);
          } else if (existingData.length > 0) {
            btnTrackFinished.id = 'finished-map';
            btnTrackFinished.removeEventListener('click', addRiddenMap);
          } else {
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
        if (error) {
        } else {
          const { data, error } = await supa
            .from("user_ridden_maps")
            .insert({
              maps_id: maps.id,
              maps_name: maps.map_name,
              user_id: supa.auth.user().id
            });

            btnTrackFinished.id = 'finished-map'
            btnTrackFinished.removeEventListener('click', addRiddenMap);
      
          if (error) {
            console.log("Error inserting data:", error.message);
          } else {
            console.log("Data inserted successfully:", data);
          }
        }
      }
  }
    });

    // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelector('.skeleton-loading');
  /*skeletonLoading.style.display = 'none';*/

  console.log(localStorage.getItem('mapId'));
}

  export { displayMap };


