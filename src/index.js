import axios from 'axios';

import Notiflix from 'notiflix';

const elements = {
  formSearch: document.querySelector('#search-form'),
  btnSearch: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
};

elements.formSearch.addEventListener('submit', handlerBtnSearch);

function handlerBtnSearch(evt) {
  evt.preventDefault();
  const queryValue = evt.target.elements.searchQuery.value;

  fetchPhoto(queryValue)
    .then(data => {
      createMarkup(data.hits);
      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    })
    .catch(err => {});

  console.log(fetchPhoto(queryValue));
}

async function fetchPhoto(queryValue) {
  const params = new URLSearchParams({
    key: '39229790-2ac8c310a6f816e342ff3f472',
    q: queryValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  try {
    const resp = await axios.get('https://pixabay.com/api/', { params });
    if (resp.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
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
  <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200"/>
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
