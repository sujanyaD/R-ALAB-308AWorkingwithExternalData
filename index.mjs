import * as Carousel from "./carousel.mjs";
//import axios from "axios";
// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
// const getFavouritesBtn = document.getElementById("getFavouritesBtn");
axios.defaults.headers.common['x-api-key'] = "live_VZ7H6vgqwRXJc8QPVY1YNJF8PzbET8Q0pSK2vnVsmEQz5PxBbE0bOScu6363mzQJ";
// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_VZ7H6vgqwRXJc8QPVY1YNJF8PzbET8Q0pSK2vnVsmEQz5PxBbE0bOScu6363mzQJ";
axios(" https://api.thecatapi.com/v1/images/search")
  .then(x => {
    console.log(x);
  },
    (error) => {
      // Failure: anything outside of status 2XX
      console.log("Unsuccessful response...");
      throw error;
    }
  );
// 1. Create an async function "initialLoad" that does the following:
async function initialLoad() {

  //   Retrieve a list of breeds from the cat API using fetch().
  const response = await fetch('https://api.thecatapi.com/v1/breeds');
  const breeds = await response.json();
  // Select the breed dropdown
  const breedSelect = document.getElementById('breedSelect');
  // Create new <options> for each breed and append them to breedSelect
  breeds.forEach(breed => {
    //popultion option from dropdown
    const option = document.createElement('option');
    //Each option should have a value attribute equal to the id of the breed.
    option.value = breed.id;
    //   Each option should display text equal to the name of the breed.
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
  const id = breedSelect.options[0].value;
  updateCarousel(id);
}
// This function should execute immediately.
document.addEventListener("DOMContentLoaded", (evt) => {
  initialLoad();

  console.log("DOM fully Loaded and Parsed");
});
//......................................................................
//2. Create an event handler for breedSelect that does the following: 
async function onslectBreed(evt) {
  // get the selected value 
  // const id = evt.target.value;
  const selectedText = evt.target.options[evt.target.selectedIndex].text;
  // Make sure your request is receiving multiple array items!
  updateCarousel(selectedText);
}
//Check the API documentation if you're only getting a single object.
const input = document.getElementById('breedSelect');
input.addEventListener("change", onslectBreed)
console.log(input);

//Use the other data you have been given to create an informational section within the infoDump element.
async function fetchCatData(catBreed) {
  // getting filtered data by Id
  // Retrieve information on the selected breed from the cat API using fetch().
  //  await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${catBreed}`);

  // return fetch(`https://api.thecatapi.com/v1/breeds/search?q=${catBreed}`)
  return fetch(`https://api.thecatapi.com/v1/breeds/search?q=${catBreed}&attach_image=1`)
    .then(response => response.json())
    .then(data => data);
}
function updateCarousel(breed) {
  const carousel = document.querySelector('.carousel');
  const carouselInner = document.getElementById('carouselInner')
  // Each new selection should clear, re-populate, and restart the Carousel.
  Carousel.clear();

  fetchCatData(breed)
    .then(data => {
      //For each object in the response array, creating a new element for the carousel.
      data.forEach(cat => {
        getCatImageData(cat.reference_image_id)
          .then(data => {
            const resimg = data;
            const carouselItem = Carousel.createCarouselItem(resimg.url, "no image", resimg.id)
            carousel.appendChild(carouselItem);
            carouselInner.appendChild(carouselItem);
          });
      });
    });
}
// gfetching images by passing imageid 
async function getCatImageData(imgID) {
  return fetch(`https://api.thecatapi.com/v1/images/${imgID}`)
    .then(response => response.json())
    .then(data => data);
}

const breedimgselect = document.getElementById('breedSelect');
// document.getElementById('breedSelect').addEventListener('change', onslectBreed);
breedimgselect.addEventListener('change', onslectBreed);

//To practice posting data, we'll create a system to "favourite" certain images.
//This function is used within Carousel.js to add the event listener as items are created.
// const favouriteButton = document.querySelector('.favourite-button');
// favouriteButton.addEventListener('click', favourite(imgID));


//* 8.To practice posting data, we'll create a system to "favourite" certain images.
//The skeleton of this function has already been created for you.
// This is why we use the export keyword for this function.
export async function favourite(imgId) {
  // your code here
  const data = {
    "image_id": imgId,
    "sub_id": "my-user-1234"
  };
  axios.post('https://api.thecatapi.com/v1/favourites', data)
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

}
