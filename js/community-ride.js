import { supa } from "/js/supabase.js";


let mapID = localStorage.getItem('mapId')

async function displayMap() {
  const {
    data: maps,
    error
  } = await supa.from("maps").select();
  maps.forEach(maps => {
    let mapInformation = document.getElementsByClassName('map-information')[0]
    mapInformation.id = maps.id;

    if (mapID == maps.id) {

      mapInformation.innerHTML = `
          <img class="single-map-big" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${maps.map_img}" alt="image-alt">
          <button id="shuffle-again">Nochmals mischen</button>
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
          <div class="maps-filters ${maps.altitude}">${maps.altitude}</div>
          </div>
        </div>
      `;
    

    }
  });
}



//time and date picker
let selectedDate
let selectedTime

function generateDateDropdown() {
  let dateDropdown = document.getElementById('date-dropdown');

  dateDropdown.addEventListener('change', function() {
    selectedDate = new Date(this.value);
    generateTimeDropdown();
  });

  dateDropdown.innerHTML = '';

  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  let dateOptions = [
    { label: formatDate(today), value: formatDate(today) },
    { label: formatDate(tomorrow), value: formatDate(tomorrow) },
    { label: formatDate(dayAfterTomorrow), value: formatDate(dayAfterTomorrow) }
  ];

  dateOptions.forEach(option => {
    let dateOption = document.createElement('option');
    dateOption.value = option.value;
    dateOption.textContent = option.label;
    dateDropdown.appendChild(dateOption);
  });

  // Set today's date as the default selected date
  selectedDate = new Date();
  dateDropdown.value = formatDate(selectedDate);

  // Trigger the change event to update the selected time
  dateDropdown.dispatchEvent(new Event('change'));
}

function generateTimeDropdown() {
  let timeDropdown = document.getElementById('time-dropdown');
  timeDropdown.innerHTML = '';

  let now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();

  let startHour = 6;
  let endHour = 22;
  let startMinute = 0;

  console.log(now.getDate()+ 1)
  console.log(selectedDate)
  console.log(selectedDate.getDate())

  if (selectedDate && selectedDate.getDate() === now.getDate()) {
    startHour = (currentHour < 22) ? currentHour : 22;
    if (currentMinute > 0 && currentMinute <= 45) {
      startMinute = Math.ceil(currentMinute / 15) * 15;
    } else if (currentMinute > 45) {
      startMinute = 0;
      startHour++;
    }
  } else if (selectedDate.getDate() === now.getDate() + 1) {
    // If tomorrow's date is selected, start from 06:00
    startHour = 6;
    endHour = 22;
  }

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = startMinute; minute < 60; minute += 30) {
      let option = document.createElement('option');
      let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      option.value = time;
      option.textContent = time;
      timeDropdown.appendChild(option);
    }
    startMinute = 0; // Reset startMinute for the next hour
  }

  timeDropdown.addEventListener('change', function() {
    selectedTime = this.value;
  });

  if (timeDropdown.options[0]) {
    timeDropdown.value = timeDropdown.options[0].value;
    selectedTime = timeDropdown.value;
  }
}



function formatDate(date) {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

document.getElementById('btn-add-community').addEventListener('click', planRide);

function planRide() {
  if (selectedDate && selectedTime) {
    let formattedDateTime = `${formatDate(selectedDate)} ${selectedTime}`;

    // Assuming you have elements to capture map details
    let mapId = localStorage.getItem('mapId');

    // Save the ride details to the Supabase table 'tour_x'
    saveRideDetails(formattedDateTime, mapId);
  } else {
    console.log('Please select a date and time.');
  }
}



async function saveRideDetails(dateTime) {

  try {
    const { data, error } = await supa
      .from('tour_x')
      .insert([
        {
          start_time: dateTime,
          user_id: supa.auth.user().id,
          maps_id: localStorage.getItem('mapId')
        }
      ]);

    if (error) {
      throw error;
    }

    console.log('Ride details saved successfully:', data);
  } catch (error) {
    console.error('Error saving ride details:', error.message);
  }
}

document.querySelector('.btn-back').innerHTML = 'Zurück';
document.querySelector('#icon-chevron').style.display = 'block';

displayMap();
generateDateDropdown();
generateTimeDropdown();
