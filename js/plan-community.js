import { supa } from "/js/supabase-setup.js";

let currentYear;
let currentMonth;

function generateCalendar(year, month) {
  currentYear = year;
  currentMonth = month;

  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOfMonth = new Date(year, month, 1 - 1).getDay();

  let calendarBody = document.getElementById('calendar-body');
  calendarBody.innerHTML = '';

  let date = 1;

  for (let i = 0; i < 6; i++) {
    let row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      let cell = document.createElement('td');

      if (i === 0 && j < firstDayOfMonth) {
        let filler = document.createTextNode('');
        cell.appendChild(filler);
      } else if (date <= daysInMonth) {
        cell.textContent = date;

        let today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
          cell.classList.add('today', 'selected'); // Add 'selected' class to today's cell
          generateTimeSlots(); // Generate time slots for today
        }

        cell.addEventListener('click', function () {
          if (this.classList.contains('today')) {
            let selectedDate = new Date(year, month, parseInt(this.textContent));
            let now = new Date();
            let maxSelectableDate = new Date(now);
            maxSelectableDate.setHours(now.getHours() + 48);

            if (selectedDate <= maxSelectableDate) {
              generateTimeSlots();

              // Remove 'selected' class from previously selected date
              let selectedCell = document.querySelector('.selected');
              if (selectedCell) {
                selectedCell.classList.remove('selected');
              }

              // Add 'selected' class to the newly selected date
              this.classList.add('selected');
            }
          }
        });

        date++;
      } else {
        cell.classList.add('disabled'); // Disable dates beyond the current month
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }

  let currentMonthYear = document.getElementById('current-month-year');
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthYear.textContent = `${monthNames[month]} ${year}`;
}

function generateTimeSlots() {
  let timeSlotSelect = document.getElementById('time-slot');
  timeSlotSelect.innerHTML = '';

  let now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();

  for (let hour = 6; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour > currentHour || (hour === currentHour && minute >= currentMinute)) {
        let option = document.createElement('option');
        let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        option.value = time;
        option.textContent = time;
        timeSlotSelect.appendChild(option);
      }
    }
  }
}

document.getElementById('prev-month').addEventListener('click', function () {
  currentMonth--;
  if (currentMonth < 0) {
    currentYear--;
    currentMonth = 11;
  }
  generateCalendar(currentYear, currentMonth);
});

document.getElementById('next-month').addEventListener('click', function () {
  currentMonth++;
  if (currentMonth > 11) {
    currentYear++;
    currentMonth = 0;
  }
  generateCalendar(currentYear, currentMonth);
});

let today = new Date();
generateCalendar(today.getFullYear(), today.getMonth());
generateTimeSlots();

let planRideButton = document.getElementById('plan-ride-button');
planRideButton.addEventListener('click', planRide);

function planRide() {
  // Assuming you have elements to capture date, time, and map details
  let selectedTime = document.getElementById('time-slot').value;
  let test = document.querySelector('.selected');
  if (test) {
    let testest = test.textContent;
    console.log('Selected Date:', testest);
  } else {
    console.log('No date selected');
  }
  console.log('Selected Time:', selectedTime);
  console.log('Selected Date:', test.textContent);
  let testest = test.textContent;

  // Save the ride details to the Supabase table 'tour_x'
  saveRideDetails(selectedTime, testest);
}

async function saveRideDetails(selectedTime, testest) {
  try {
    let day = parseInt(testest);
    let year = currentYear;
    let month = currentMonth;

    // Check if the selected day is greater than the number of days in the current month
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    if (day > daysInCurrentMonth) {
      // If so, increment the month and adjust the year
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    let formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const { data, error } = await supa
      .from('tour_x')
      .insert([
        {
          start_time: formattedDate + ' ' + selectedTime,
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
