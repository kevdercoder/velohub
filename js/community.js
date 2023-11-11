import {
  supa
} from "/js/supabase.js";


async function community() {
  try {
    let {
      data: tour_x,
      error
    } = await supa.from("tour_x").select('*');

    if (error) {
      throw error;
    }

      // Sort tours by start time
  tour_x.sort((a, b) => {
    let dateA = new Date(a.start_time);
    let dateB = new Date(b.start_time);
    return dateA - dateB;
  });

    let mainElement = document.querySelector('main');
    let fragment = document.createDocumentFragment();

    for (let tour of tour_x) {

      let {
        data: user
      } = await supa.from("user").select('*').eq('user_id', tour.user_id);

      let userName = user[0].name;
      let userFirstName = user[0].first_name;
      let userImg = user[0].user_img;

      let formattedDateTime = formatDateTime(tour.start_time);

      let sectionMaps = document.createElement('section');
      sectionMaps.classList.add('container-community');
      sectionMaps.id = tour.id;
      sectionMaps.innerHTML = `
        <div>
          <img class="user-picture" src="${userImg}" alt="image-alt">
        </div>
        <div class="container-details">
          <h2>${userFirstName} ${userName}s Tour</h2>
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

      let hr = document.createElement('hr');
      hr.className = 'maps-seperator';

      fragment.appendChild(sectionMaps);
      fragment.appendChild(hr);
    }

    mainElement.appendChild(fragment);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

  let sectionMapsList = document.querySelectorAll('.container-community');

  console.log(sectionMapsList);

  sectionMapsList.forEach((sectionMaps) => {
    sectionMaps.addEventListener('click', () => {

      localStorage.setItem('communityId', sectionMaps.id)
      window.location.href = `community-maps.html?${sectionMaps.id}`;
      console.log(`Clicked on ${sectionMaps.id}`);
    });
  });

       // Hide skeleton-loading after maps are loaded
       let skeletonLoading = document.querySelectorAll('.skeleton-loading');
       skeletonLoading.forEach(element => {
         element.style.display = 'none';
       });


  // Add padding to the bottom of the page
  let div = document.createElement('div');
  div.className = 'container-padding-750'
  document.querySelector('main').appendChild(div);
}

export { community };




async function displayCommunityMap() {
  let {
    data: tour_x,
    error
  } = await supa
    .from("tour_x",)
    .select(`
  *,
  maps_id, 
  maps (*)
`)

const { data: participant, errors } = await supa.from("tour_participant").select('*');

console.log(participant);

  tour_x.forEach(tour => {
    let singleMapContainer = document.createElement('section');
    singleMapContainer.className = 'container-single-map';
    singleMapContainer.id = tour.id;

    let formattedDateTime = formatDateTime(tour.start_time);
    let participantCount = participant.filter(p => p.tour_id === tour.id).length;


    if (localStorage.getItem('communityId') == tour.id && window.location.href.includes('community-maps.html')) {

      singleMapContainer.innerHTML = `
      <div id="map" class="single-map-big"></div>
          <button id="shuffle-again">Nochmals mischen</button>
        <div class="container-flex">
          <div>
          <h2 id="single-map-name">${tour.maps.map_name}</h2>
          <ul class="maps-margin-bottom">
            <li class="maps-distance">
              <img src="/img/icon-calendar.svg" alt="image-alt">
              <p>${formattedDateTime.formattedDate}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-clock.svg" alt="image-alt">
              <p>${formattedDateTime.formattedTime}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-participants.svg" alt="image-alt">
              <p>${participantCount}</p>
            </li>
          </ul>
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

let map

initMap = function() {

    map = new google.maps.Map(document.getElementById("map"), {
    mapId: "67a32317a1bc4a60",
    zoom: 10,
    center: { lat: 46.946383444981336, lng: 7.442313596894101 },
    mapTypeId: "roadmap",
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  });

  fetch(`https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${tour.maps.gpx_data}`)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(doc => {
      console.log("Successfully fetched and parsed XML data");

      var points = [];
      var bounds = new google.maps.LatLngBounds();

      const nodes = [...doc.getElementsByTagName('trkpt')];
      nodes.forEach(node => {
        var lat = node.getAttribute("lat");
        var lon = node.getAttribute("lon");

        var p = new google.maps.LatLng(lat, lon);
        points.push(p);
        bounds.extend(p);
      });

      var poly = new google.maps.Polyline({
        path: points,
        strokeColor: "#f99a52",
        strokeOpacity: 0.8,
        strokeWeight: 4
      });

      poly.setMap(map);
      console.log("Polyline set on the map");

      // fit bounds to track
      map.fitBounds(bounds);
      console.log("Map bounds set");
    })
    .catch(error => {
      console.error("Error fetching or parsing XML data:", error);
    });
};

document.querySelector('main').appendChild(singleMapContainer);



      //if (tour.user_id === supa.auth.user().id) {
      //  document.getElementById('btn-community-participate').style.display = 'none';
      //}

      async function participate() {
 
         // Check if user is already a participant
         let existingParticipant = await supa
         .from("tour_participant")
         .select("*");
     
     console.log(existingParticipant.data);
     
     let userAlreadyEnrolled = false;
     
     for (let participant of existingParticipant.data) {
         if (participant.user_id === supa.auth.user().id && participant.tour_id === tour.id)  {
             userAlreadyEnrolled = true;
             break;
         }
     }
     
     if (userAlreadyEnrolled) {
         alert('Du bist bereits eingeschrieben!');
     } else if (supa.auth.user() === null) {
      window.location.href = '/user-login.html';
     } else {
         await supa
             .from("tour_participant")
             .insert({
                 tour_id: tour.id,
                 user_id: supa.auth.user().id,
             });
     }
      };

      document.getElementById('btn-community-participate').addEventListener('click', () => {
        console.log('clicked');
        participate();
      });  

    }
  });
    // Initialize Google Maps
    initMap();
}


export { displayCommunityMap };



function formatDateTime(dateTimeString) {
  let date = new Date(dateTimeString);
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  let formattedDate = date.toLocaleDateString('de-DE', options);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let formattedTime = `${hours}:${minutes}`;
  return {
    formattedDate,
    formattedTime
  };

}