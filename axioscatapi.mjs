
//  * - If you've done everything correctly up to this point, this should be simple.
//  * - If it is not simple, take a moment to re-evaluate your original code.
//  * - Hint: Axios has the ability to set default headers. Use this to your advantage
//  *   by setting a default header with your API key so that you do not have to
//

4//axios has already been imported for you within index.js.
import axios from 'axios';
//Change all of your fetch() functions to axios!
 //send it manually with all of your requests! You can also set a default base URL!
axios.defaults.headers.common['x-api-key'] = "live_VZ7H6vgqwRXJc8QPVY1YNJF8PzbET8Q0pSK2vnVsmEQz5PxBbE0bOScu6363mzQJ";
axios.defaults.baseURL = 'https://api.thecatapi.com/v1';

// Request interceptor to log time between request and response
axios.interceptors.request.use(config => {
    console.log('Request started at:', new Date().toLocaleTimeString());
    document.body.style.cursor = 'progress'; 
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to log time between request and response
axios.interceptors.response.use(response => {
    console.log('Response received at:', new Date().toLocaleTimeString());
    document.body.style.cursor = 'default'; // Set cursor to default
    return response;
}, error => {
    return Promise.reject(error);
});

// Function to update progress bar
function updateProgress(progressEvent) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentCompleted + '%';
}

async function initialLoadWithAxios() {
    const breedSelect = document.getElementById('breedSelect');
    const response = await axios.get('/breeds');
    const data = response.data;

    data.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });

    breedSelect.addEventListener('change', handleBreedSelectWithAxios);
}

async function handleBreedSelectWithAxios(event) {
   const selectedText = evt.target.options[evt.target.selectedIndex].text;
    const response = await axios.get(`breeds/search?q=${selectedText}&attach_image=1`) 
    const data = response.data;

    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = ''; 
    const infoDump = document.getElementById('infoDump');
    infoDump.innerHTML = ''; 
    data.forEach(cat => {
        // Creating carousel item
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        // Create image element
        const image = document.createElement('img');
        image.src = cat.url;
        image.alt = cat.breeds[0].name; 
        carouselItem.appendChild(image);

        // Append carousel item to carousel
        carousel.appendChild(carouselItem);
        
        // Create informational section
        const info = document.createElement('div');
        info.classList.add('info');
        info.innerHTML = `<h2>${cat.breeds[0].name}</h2>
       <p>${cat.breeds[0].description}</p>`;
        infoDump.appendChild(info);
    });
}

// Call initialLoadWithAxios function to start the process
initialLoadWithAxios();
