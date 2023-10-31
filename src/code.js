import axios from "axios";
import Notiflix from "notiflix";

const BASE_URL = "https://pixabay.com/api/";
let page = 1;

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadBtn = document.querySelector(".load-more");

form.addEventListener("submit", handlerQuery);
loadBtn.addEventListener("click", handlerLoadMore);


async function handlerQuery(evt) {
    evt.preventDefault();

    const response = await fetchBack()
        try{
          page = 1;
            console.log(response);
        if (response.data.totalHits === 0) {
          gallery.innerHTML = "";
            loadBtn.classList.add("load-hidden")
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            gallery.innerHTML = albumMurkup(response.data.hits); 
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
            }
            if (page < response.data.totalHits/40) {
                   loadBtn.classList.remove("load-hidden")
            } else {
              loadBtn.classList.add("load-hidden")
            }

  } catch(error) {
    console.log(error);
  }

}

function albumMurkup(data) {
   return  data.map((elem, idx,arr)=>`<div class="photo-card">
  <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${elem.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
       <span>${elem.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
       <span>${elem.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
       <span>${elem.downloads}</span>
    </p>
  </div>
</div>`).join("");    
}



async function handlerLoadMore(evt) {
    page += 1;
    
   const response = await fetchBack(page)
  try { 
            console.log(response);
       
            gallery.insertAdjacentHTML("beforeend", albumMurkup(response.data.hits)); 
            
            if (page >= response.data.totalHits/40) {
                console.log("word");
              loadBtn.classList.add("load-hidden");
                    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            }
             }
  catch (error) {
    console.log(error);
  }    
}


function fetchBack(page = 1) {
    return axios.get(BASE_URL, {
        params: {
            key: "40348092-da5e0a767129707faba1470d8",
            q: form.elements.searchQuery.value,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            per_page: 40,
            page,
        }
    });
}


