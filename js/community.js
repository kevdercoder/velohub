import { supa } from "/js/supabase-setup.js";

async function community() {
  const { data: tour_x, error } = await supa.from("tour_x").select('*');

  if (error) {
    console.error("Error fetching tour_x data:", error);
    return;
  }

  for (const tour of tour_x) {
    const { data: user, error: userError } = await supa.from("user").select('*').eq('user_id', tour.user_id);

    if (userError) {
      console.error("Error fetching user data:", userError);
      return;
    }

    let sectionMaps = document.createElement('section')

    function displayOverview(userName) {
      sectionMaps.innerHTML = `
        <div class="">
          <div>
            <img class="user-picture" src="/img/profile-picture01.png" alt="image-alt">
          </div>
          <div class="maps-margin">
            <h2> ${userFirstName} ${userName}'s Tour</h2>
            <h3> ${formattedDate} ${formattedTime}</h3>
          </div>
        </div>
      `;
    }

    const userName = user[0].name;
    const userFirstName = user[0].first_name;

    function formatDateTime(dateTimeString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateTimeString);
      const formattedDate = date.toLocaleDateString('de-DE', options);

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      return { formattedDate, formattedTime };
    }

    const startTime = tour.start_time;
    const { formattedDate, formattedTime } = formatDateTime(startTime);

    const formattedDateTimeString = `${formattedDate}, ${formattedTime}`;
    const h3Element = document.createElement('h3');
    h3Element.textContent = formattedDateTimeString;

    document.body.appendChild(sectionMaps);
    const hr = document.createElement('hr');
    hr.className = 'maps-seperator';
    
    document.querySelector('main').appendChild(sectionMaps);
    document.querySelector('main').appendChild(hr);

    displayOverview(userName);

    // Add a click event listener for redirection
    sectionMaps.addEventListener('click', () => {
      const mapId = tour.maps_id; // Assuming tour has a property named maps_id
      localStorage.setItem('clickedMapId', mapId);
      window.location.href = 'community-maps.html'; // Redirect to community-maps.html
    });
  }
}

export { community };





async function showMapDetails() {
  const clickedMapId = localStorage.getItem('clickedMapId');
  
  // Check if a map ID was clicked
  if (!clickedMapId) {
    console.error("No map ID found in local storage");
    return;
  }

  const { data: maps, error: userError } = await supa.from('maps').select('*').eq('id', clickedMapId);

  if (userError) {
    console.error("Error fetching user data:", userError);
    return;
  }

  function displayCommunityMap() {
    document.body.innerHTML = `
      <div class="">
        <div class="maps-margin">
          <h2> ${clickedMapId}</h2>
        </div>
      </div>
    `;

    console.log(maps[0].id);
  }

  // Call displayCommunityMap after fetching the map data
  displayCommunityMap();
}

export { showMapDetails };

