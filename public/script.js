const api_key = "815ac1f6";
const DEFAULT_ERROR_MSG =
  "API Call Error: Please double check your url and make sure the server is up.";
const DEFAULT_POSTER_IMG =
  "https://images.unsplash.com/photo-1560109947-543149eceb16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1635&q=80";
const TOMATO_FRESH = `https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg`;
const TOMATO_ROTTEN = `https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg`;

movie_search_form.addEventListener("submit", (event) => {
  event.preventDefault();

  getMovies(movie_search_term.value);
  movie_search_form.reset();
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    getWeatherByLocation,
    handleLocationError
  );
}

function handleLocationError(error) {
  handleError(`Failed to get User Location: ${error.message}`);
}

function getWeatherByLocation({ coords: { latitude: lat, longitude: lon } }) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=92d5eb8167e73362c29c3ab2ce3b9365&units=imperial`;
  fetch(apiURL)
    .then((results) => results.json())
    .then(({ main: { temp }, weather: [weatherInfo] }) => {
      const weatherInfoContainer = document.createElement("div");
      weatherInfoContainer.innerHTML = `
            <p>${Math.floor(temp)}&#8457;</p>
            <p>${weatherInfo.description}</p>
            <img src="https://openweathermap.org/img/wn/${
              weatherInfo.icon
            }@2x.png" />`;
      document.body.prepend(weatherInfoContainer);
      console.log(Math.floor(temp));
      console.log(weatherInfo);
    });
}
// const searchTerm = "The Matrix";
// const promise1 = fetch(
//   `http://www.omdbapi.com/?apikey=${api_key}&t=${searchTerm}`
// );
// const promise2 = fetch(
//   `http://www.omdbapi.com/?apikey=${api_key}&t=${searchTerm}`
// );
// const promise3 = fetch(
//   `http://www.omdbapi.com/?apikey=${api_key}&t=${searchTerm}`
// );

// Promise.all([promise1, promise2, promise3])
//   .then(async ([promise1, promise2, promise3]) => {
//     const p1 = await promise1.json();
//     const p2 = await promise2.json();
//     const p3 = await promise3.json();
//     return [p1, p2, p3];
//   })
//   .then(([promise1, promise2, promise3]) => {
//     console.log(promise1);
//     console.log(promise2);
//     console.log(promise3);
//   });

function getMovies(searchTerm) {
  // go to the movies api using the search term
  // api => URL from docs
  // test API url to understand the shape of the json returned

  let apiURL = `https://sde-final-backend.herokuapp.com/api?location=breakfast&latitude=39.5500194&longitude=-123.438353&radius=40000&sort_by=best_match&limit=20 `;
  fetch(apiURL)
    .then((response) => response.json())
    .then((json_payload) => {
      console.log(json_payload);
      // if (json_payload.Error) {
      //   handleError(json_payload.Error);
      // } else {
      //   showMovies(json_payload);
      // }
    })
    .catch((error) => {
      if (error) {
        // Gracefully handle an error for better user experience
        //     const alert = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        //     <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        //     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        //   </div>`;
        handleError;
      }
    });
}

// when i get the movies back send them to a function to draw em
function showMovies({
  Title: title,
  Year: year,
  Poster: poster,
  Rated: rated,
  Plot: plot,
  Type: type,
  Website: website,
  Ratings: ratings,
}) {
  // get poster, title, synopsis
  // put the card in the container
  const rating = ratings[1].Value ? ratings[1].Value.replace("%", "") : "";

  const cardContainer = document.createElement("div");
  cardContainer.className = "card";
  cardContainer.setAttribute("style", "width: 18rem;");

  cardContainer.innerHTML = `
    <img src="${
      poster ? poster : DEFAULT_POSTER_IMG
    }" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${title} ${year ? `(${year})` : ""}</h5>
        ${
          rated
            ? `<h6 class="card-subtitle mb-2 text-muted">Rated: ${rated}</h6>`
            : ""
        }
        ${
          rating
            ? `<h6 class="card-subtitle mb-2 text-muted"><span>
            ${
              Number(rating) > 60
                ? `<img id="tomato" src="${TOMATO_FRESH}" alt="Rated Fresh" style="width: 20px"/>`
                : `<img id="tomato" src="${TOMATO_ROTTEN}" alt="Rated Rotten" style="width: 20px"/>`
            }
            </span> ${rating}%</h6>`
            : ""
        }
        <p class="card-text">${plot}</p>
        ${
          website != "N/A"
            ? `<a href="${website}" class="card-link">Website</a>`
            : ""
        }
    </div>`;
  movies_container.prepend(cardContainer);
}

function handleError(errorMessage = DEFAULT_ERROR_MSG) {
  const alert_container = document.createElement("div");
  alert_container.classList.add(
    "alert",
    "alert-warning",
    "alert-dismissible",
    "fade",
    "show"
  );
  alert_container.setAttribute("role", "alert");

  alert_container.innerHTML = `
        <strong>${errorMessage}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

  document.body.prepend(alert_container);
}
