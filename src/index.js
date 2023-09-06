import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  formSearch: document.querySelector('#search-form'),
  btnSearch: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a');
let queryValue;
let page = 1;
let perPage = 40;

elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');

elements.formSearch.addEventListener('submit', handlerSubmit);
elements.btnLoadMore.addEventListener('click', handlerLoad);

function handlerSubmit(evt) {
  evt.preventDefault();
  queryValue = evt.target.elements.searchQuery.value;
  if (!queryValue) {
    Notiflix.Notify.info('Please enter a value in the search bar');
    return;
  }

  fetchPhoto(queryValue)
    .then(data => {
      //   createMarkup(data.hits);
      if (data.totalHits !== 0) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
      elements.gallery.innerHTML = createMarkup(data.hits);
      gallery.refresh();
      if (data.total !== 0) {
        elements.btnLoadMore.classList.replace('load-more-hidden', 'load-more');
      }
    })
    .catch(error => {
      console.log(error.message);
    });
}

async function fetchPhoto(queryValue) {
  const params = new URLSearchParams({
    key: '39229790-2ac8c310a6f816e342ff3f472',
    q: queryValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page,
  });
  try {
    const resp = await axios.get('https://pixabay.com/api/', { params });
    if (resp.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
    }
    return resp.data;
  } catch (error) {
    console.log(error.message);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
         <a href="${largeImageURL}">
  <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
       ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
       ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
       ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
}

function handlerLoad(evt) {
  page += 1;
  fetchPhoto(queryValue).then(data => {
    createMarkup(data.hits);
    elements.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    gallery.refresh();
    if (page > data.totalHits / perPage) {
      elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
