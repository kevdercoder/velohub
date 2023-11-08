import {
  supa
} from "/js/supabase.js";

async function community() {
  try {
    const {
      data: tour_x,
      error
    } = await supa.from("tour_x").select('*');

    if (error) {
      throw error;
    }

    let tourId = tour_x[0].id;
    console.log(tourId);
    const now = new Date();
    const mainElement = document.querySelector('main');

    tour_x.sort((a, b) => {
      const dateA = new Date(a.start_time);
      const dateB = new Date(b.start_time);
      return dateA - dateB;
    });

    const fragment = document.createDocumentFragment();

    for (const tour of tour_x) {
      const startingTime = new Date(tour.start_time);

      if (startingTime < now) {
        continue;
      }

      const {
        data: user
      } = await supa.from("user").select('*').eq('user_id', tour.user_id);

      const userName = user[0].name;
      const userFirstName = user[0].first_name;
      const userImg = user[0].user_img;

      const formattedDateTime = formatDateTime(tour.start_time);

      const sectionMaps = document.createElement('section');
      sectionMaps.classList.add('container-community');
      sectionMaps.id = tour.id;
      sectionMaps.innerHTML = `
        <div>
          <img class="user-picture" src="${userImg}" alt="image-alt">
        </div>
        <div class="container-details">
          <h2>${userFirstName} ${userName}'s Tour</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-calendar.svg" alt="image-alt">
              <p>${formattedDateTime.formattedDate}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-clock.svg" alt="image-alt">
              <p>${formattedDateTime.formattedTime}</p>
            </li>
          </ul>
        </div>
      `;

      const hr = document.createElement('hr');
      hr.className = 'maps-seperator';

      fragment.appendChild(sectionMaps);
      fragment.appendChild(hr);
    }

    mainElement.appendChild(fragment);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

  const sectionMapsList = document.querySelectorAll('.container-community');

  console.log(sectionMapsList);

  sectionMapsList.forEach((sectionMaps) => {
    sectionMaps.addEventListener('click', () => {

      localStorage.setItem('communityId', sectionMaps.id)
      window.location.href = `community-maps.html?${sectionMaps.id}`;
      console.log(`Clicked on ${sectionMaps.id}`);
    });

  });

}



function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('de-DE', options);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return {
    formattedDate,
    formattedTime
  };
}

export {
  community
};


async function displayCommunityMap() {
  const {
    data: tour_x,
    error
  } = await supa
    .from("tour_x")
    .select(`
  *,
  maps_id, 
  maps (*)
`)

  tour_x.forEach(tour => {
    let singleMapContainer = document.createElement('section');
    singleMapContainer.className = 'container-single-map';
    singleMapContainer.id = tour.id;

    if (localStorage.getItem('communityId') == tour.id && window.location.href.includes('community-maps.html')) {

      singleMapContainer.innerHTML = `
          <img class="single-map-big" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${tour.maps.map_img}" alt="image-alt">
          <button id="shuffle-again">Nochmals mischen</button>
        <div class="container-flex">
          <div>
          <h2 id="single-map-name">${tour.maps.map_name}</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${tour.maps.distance}km</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-up.svg" alt="image-alt">
              <p>${tour.maps.altitude_up}m</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-down.svg" alt="image-alt">
              <p>${tour.maps.altitude_down}m</p>
            </li>
          </ul>
          <div class="maps-filters ${tour.maps.altitude}">${tour.maps.altitude}</div>
          </div>
          <button id="btn-track-finished">
          <img id="add-track-finished" src="img/icon-add.svg">Beendet</button>
          <div class="break-point"></div>
        </div>
        <section>
        <a href="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${tour.maps.gpx_data}" download>
          <button id="btn-gpx">Download .gpx</button>
          </a>
          <button id="btn-community-participate">Einschreiben</button>
        </section>
        <section>
          <p class="single-map-description">${tour.maps.description}</p>
        </section>
      `;

      document.body.appendChild(singleMapContainer);

      //if (tour.user_id === supa.auth.user().id) {
      //  document.getElementById('btn-community-participate').style.display = 'none';
      //}

      async function participate() {
 

        console.log(supa.auth.user().id,)
    
        const {
          data,
          error
        } = await supa
          .from("tour_participant")
          .insert({
            user_id: supa.auth.user().id,
          });
    
          if (error) {
            console.error('Error inserting record:', error);
          } else {
            console.log('Record inserted successfully:', data);
          }  
      };

      document.getElementById('btn-community-participate').addEventListener('click', () => {
        console.log('clicked');
        participate();
      });
    }
  });
}





displayCommunityMap();