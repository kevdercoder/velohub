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
    // Handle the click event here
    console.log(`Clicked on ${sectionMaps.id}`);
    window.location.href = `single-map.html?${sectionMaps.id}`;
  });

  console.log(sectionMaps.id)


});
}

  export { showMaps };