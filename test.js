import * as Carousel from "./carousel.mjs";


async function initialLoad() {
    const breedSelect = document.getElementById('breedSelect');
  
    // Retrieve a list of breeds from the cat API
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    const breeds = await response.json();
  
    // Create new <options> for each breed and append them to breedSelect
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  }
  


  document.getElementById('breedSelect').addEventListener('change', async function(event) {
    const breedId = event.target.value;
    const carousel = document.getElementById('carouselInner');
    const infoDump = document.getElementById('infoDump');
  
    // Clear carousel and infoDump
    clear();
    clearInfoDump();
  
    // Retrieve information on the selected breed from the cat API
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`);
    const breedInfo = await response.json();
  
    // Create carousel elements for each object in the response array
    breedInfo.forEach(info => {
      const carouselItem = createCarouselItem(info.url, info.breeds[0].name, info.id);
      appendCarousel(carouselItem);
    });
  
    // Create and populate informational section in infoDump
    const infoHeader = document.createElement('h2');
    infoHeader.textContent = `Information about ${breedInfo[0].breeds[0].name}`;
  
    const infoList = document.createElement('ul');
    const breed = breedInfo[0].breeds[0];
    for (const key in breed) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${key}:</strong> ${breed[key]}`;
      infoList.appendChild(listItem);
    }
  
    infoDump.appendChild(infoHeader);
    infoDump.appendChild(infoList);
  
    // Restart the carousel
    Carousel.start();
  });
  
  // Function to clear carousel
  function clear() {
    const carousel = document.getElementById('carouselInner');
    while (carousel.firstChild) {
      carousel.removeChild(carousel.firstChild);
    }
  }
  
  // Function to clear infoDump
  function clearInfoDump() {
    const infoDump = document.getElementById('infoDump');
    infoDump.innerHTML = '';
  }
  
  // Function to start the carousel
  function start() {
    const multipleCardCarousel = document.getElementById('carouselExampleControls');
    if (window.matchMedia("(min-width: 768px)").matches) {
      const carousel = new bootstrap.Carousel(multipleCardCarousel, {
        interval: false
      });
      const carouselWidth = $(".carousel-inner")[0].scrollWidth;
      const cardWidth = $(".carousel-item").width();
      let scrollPosition = 0;
      $(".carousel-control-next").unbind();
      $(".carousel-control-next").on("click", function() {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $(".carousel-inner").animate({
            scrollLeft: scrollPosition
          }, 600);
        }
      });
      $(".carousel-control-prev").unbind();
      $(".carousel-control-prev").on("click", function() {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $(".carousel-inner").animate({
            scrollLeft: scrollPosition
          }, 600);
        }
      });
    } else {
      $(multipleCardCarousel).addClass("slide");
    }
  }
  
  // Call this event handler after initialLoad to create the initial carousel
  initialLoad();
  