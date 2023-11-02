import {
    supa
  } from "/js/supabase-setup.js";

  /* Programm to display the maps in the list view */
async function community() {
  const {
    data: tour_x,
    error
  } = await supa.from("tour_x").select();
  tour_x.forEach(tour_x => {

    console.log(tour_x.id)

    displayOverview();

    async function displayOverview() {
      sectionMaps.innerHTML = `
        <div class="maps-margin">
          <h2>${tour_x.id}</h2>
        </div>
      `;
    }

    
  })
}

export { community };