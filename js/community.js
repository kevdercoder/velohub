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

    let sectionMaps = document.createElement('section');

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

    displayOverview(userName);

    // Add an event listener to the sectionMaps element
    sectionMaps.addEventListener('click', () => {
      // Assuming you have a function to show map details, replace `showMapDetails` with your actual function
      showMapDetails(tour); // Pass the relevant tour data to showMapDetails
    });


    async function showMapDetails(tour) {
      const { data: tour_x, error } = await supa.from("tour_x").select('*');

  if (error) {
    console.error("Error fetching tour_x data:", error);
    return;
  }

  for (const tour of tour_x) {
    const { data: maps, error: userError } = await supa.from('maps').select('*').eq('id', tour.maps_id);

    console.log(maps[0].id)

    if (userError) {
      console.error("Error fetching user data:", userError);
      return;
    }

    function displayCommunityMap() {
      sectionMaps.innerHTML = `
      <div class="">
      <div>
      <img class="user-picture" src="/img/profile-picture01.png" alt="image-alt">
      </div>
        <div class="maps-margin">
          <h2> ${maps[0].id}</h2>
        </div>
        </div>
      `;
    }
      
    }
  }



    document.body.appendChild(sectionMaps);
    const hr = document.createElement('hr');
    hr.className = 'maps-seperator';

    document.querySelector('main').appendChild(sectionMaps);
    document.querySelector('main').appendChild(hr);
  }
}

export { community };
