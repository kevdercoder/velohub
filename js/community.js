import { supa } from "/js/supabase.js";

async function community() {
  try {
    const { data: tour_x, error } = await supa.from("tour_x").select('*');

    if (error) {
      throw error;
    }

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

      const { data: user } = await supa.from("user").select('*').eq('user_id', tour.user_id);

      const userName = user[0].name;
      const userFirstName = user[0].first_name;
      const userImg = user[0].user_img;

      const formattedDateTime = formatDateTime(tour.start_time);

      const sectionMaps = document.createElement('section');
      sectionMaps.classList.add('container-community');
      sectionMaps.innerHTML = `
        <div>
          <img class="user-picture" src="${userImg}" alt="image-alt">
        </div>
        <div class="container-details">
          <h2>${userFirstName} ${userName}'s Tour</h2>
          <ul>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${formattedDateTime.formattedDate}</p>
            </li>
            <li class="maps-distance">
              <img src="/img/icon-distance.svg" alt="image-alt">
              <p>${formattedDateTime.formattedTime}</p>
            </li>
          </ul>
        </div>
      `;

      const hr = document.createElement('hr');
      hr.className = 'maps-seperator';

      sectionMaps.addEventListener('click', () => {
        const mapId = tour.maps_id;
        localStorage.setItem('clickedMapId', mapId);
        window.location.href = 'community-maps.html';
      });

      fragment.appendChild(sectionMaps);
      fragment.appendChild(hr);
    }

    mainElement.appendChild(fragment);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('de-DE', options);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return { formattedDate, formattedTime };
}

export { community };
