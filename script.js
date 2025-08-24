// ✅ Tu proyecto en Supabase
const SUPABASE_URL = 'https://okzipvdaavlszsxigchv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwGWYQvKj3UHxNpGIfQk';

// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const mainScreen = document.getElementById('mainScreen');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const googleSignIn = document.getElementById('googleSignIn');
const vetResponse = document.getElementById('vetResponse');
const speakBtn = document.getElementById('speakBtn');
const animalList = document.getElementById('animalList');

// Animales longevos
const animals = [
    {
        name: "🐶 Perro Longevo",
        maxAge: "Hasta 20+ años",
        img: "https://upload.wikimedia.org/wikipedia/commons/5/55/Australian_Shepherd_-_nearly_black.jpg",
        fact: "Con buena dieta y amor, algunos perros viven más de 20 años. El récord es de 31 años."
    },
    {
        name: "🐱 Gato Longevo",
        maxAge: "Hasta 25+ años",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg",
        fact: "El gato más longevo del mundo vivió 38 años. ¡Amor y cuidados marcan la diferencia!"
    },
    {
        name: "🦜 Loro Africano",
        maxAge: "Hasta 70+ años",
        img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Psittacus_erithacus_-London_Zoo%2C_England-8.jpg",
        fact: "Los loros pueden vivir más que sus dueños. Necesitan compañía, estimulación y una dieta rica."
    },
    {
        name: "🐢 Tortuga Gigante",
        maxAge: "Hasta 150+ años",
        img: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Galapagos_hood_racer_snake_and_giant_tortoise.jpg",
        fact: "Algunas tortugas viven más de un siglo. Son símbolo de longevidad y paciencia."
    }
];

// Mostrar animales
function mostrarAnimales() {
    animalList.innerHTML = '';
    animals.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.innerHTML = `
            <img src="${animal.img}" alt="${animal.name}" onerror="this.src='https://via.placeholder.com/200x120?text=Imagen+no+disponible'">
            <h4>${animal.name}</h4>
            <p>${animal.maxAge}</p>
        `;
        animalList.appendChild(card);
    });
}
mostrarAnimales();

// Botón de escuchar
speakBtn.addEventListener('click', () => {
    const texto = vetResponse.textContent;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
});

// Login con Google
googleSignIn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Error:', error.message);
        alert('Hubo un error. Intenta de nuevo.');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Error al salir:', error.message);
});

// Escuchar autenticación
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
        loginScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        userEmail.textContent = session.user.email;

        // Guardar usuario
        await supabaseClient.from('users').upsert({
            id: session.user.id,
            email: session.user.email,
            is_subscribed: false
        }, { onConflict: 'id' });
    }
    if (event === 'SIGNED_OUT') {
        mainScreen.style.display = 'none';
        loginScreen.style.display = 'block';
    }
});

// Verificar sesión al cargar
supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        loginScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        userEmail.textContent = session.user.email;
    }
});
