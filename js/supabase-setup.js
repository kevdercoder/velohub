console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://jxqqxtyepipnutkjzefu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cXF4dHllcGlwbnV0a2p6ZWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyMzA5MjUsImV4cCI6MjAxMTgwNjkyNX0.aqu3LOLkiTA8ZXD9fH9xzj5JdCy368CtmRhnfZQXabo'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }