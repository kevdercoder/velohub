import {
  supa
} from "/js/supabase-setup.js";

async function showMaps() {
    const { data: maps, error } = await supa.from("maps").select();
    maps.forEach(maps => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = maps.id;
      
      sectionMaps.innerHTML = `
        <div>
          <img class="maps-map-small" src="${maps.map_img}" alt="image-alt">
        </div>
        <div class="maps-margin">
          <h2>${maps.map_name}</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${maps.distance}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-up.svg" alt="image-alt">
              <p>${maps.altitude_up}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-down.svg" alt="image-alt">
              <p>${maps.altitude_down}</p>
            </li>
          </ul>
          <div class="maps-filters">${maps.altitude}</div>
        </div>
      `;

      document.body.appendChild(sectionMaps);
  
      const hr = document.createElement('hr');
      hr.className = 'maps-seperator';
      document.body.appendChild(hr);
    });

    // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelector('.skeleton-loading');
  skeletonLoading.style.display = 'none';


  console.log(localStorage.getItem('btnFilterDistance'));
  console.log(localStorage.getItem('btnFilterAltitude'));
  console.log(localStorage.getItem('btnList'));


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
          <img class="single-map-big" src="${maps.map_img}" alt="image-alt">
        <div class="container-flex">
          <div>
          <h2 id="single-map-name">${maps.map_name}</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${maps.distance}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-up.svg" alt="image-alt">
              <p>${maps.altitude_up}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-down.svg" alt="image-alt">
              <p>${maps.altitude_down}</p>
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
  }
    });

    // Hide skeleton-loading after maps are loaded
  let skeletonLoading = document.querySelector('.skeleton-loading');
  /*skeletonLoading.style.display = 'none';*/

  console.log(localStorage.getItem('mapId'));
}

  export { displayMap };