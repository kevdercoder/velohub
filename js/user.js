import {
    supa
  } from "/js/supabase-setup.js";

  async function displayProfile() {
    const { data: user, error } = await supa.from("user").select();
    user.forEach(user => {
       if(user.user_id === supa.auth.user().id){
        document.getElementById('user-name').innerHTML = user.first_name + " " + user.name;
       }
    })
}

  export { displayProfile };


  async function displayRiddenMaps() {
    const { data, error } = await supa
        .from("user_ridden_maps")
        .select("*")
        .eq("maps_id", maps.id)
        .eq("user_id", supa.auth.user().id);

        if (data.length > 0) {
          
        }
    } 
  

  export { displayRiddenMaps };