import {
    supa
  } from "/js/supabase-setup.js";
  
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