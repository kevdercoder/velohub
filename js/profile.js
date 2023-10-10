import {
    supa
  } from "/js/supabase-setup.js";

  async function displayProfile() {
    const { data: user, error } = await supa.from("user").select();
    user.forEach(user => {
      console.log(user)
    })
}

  export { displayProfile };
