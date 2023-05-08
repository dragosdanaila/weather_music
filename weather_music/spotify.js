import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = '4613c46e17684b0d82138d8d5f5876d6';
const clientSecret = 'a613002505a54453a32172b997423ad9';
const redirectUri = 'file:///C:/Users/Dragos/Desktop/VsCode/weather_music/weather_music/index.html';

spotifyApi.setClientId(clientId);
spotifyApi.setClientSecret(clientSecret);
spotifyApi.setRedirectURI(redirectUri);

function searchPlaylistByLocation() {
    getLocation(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      getWeatherData(latitude, longitude, weatherData => {
        const temperature = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
  
        const query = `${condition} music playlist`;
        getAccessToken(accessToken => {
          searchPlaylist(query, accessToken)
            .then(playlistData => {
              console.log(playlistData);
            })
            .catch(error => {
              console.error(`Error searching for playlist: ${error.message}`);
            });
        });
      });
    });
  }

// This function obtains an access token using the client ID and client secret, and calls the callback function with the access token.
function getAccessToken(callback) {
  const authUrl = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
  };
  const body = 'grant_type=client_credentials';
  fetch(authUrl, {
    method: 'POST',
    headers: headers,
    body: body
  })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token;
      callback(accessToken);
    })
    .catch(error => {
      console.error(`Error getting access token: ${error.message}`);
    });
}

function searchPlaylist(query, accessToken) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'playlist',
          limit: 3,
        },
      };
      axios.get('https://api.spotify.com/v1/search', options)
        .then(response => {
          const playlists = response.data.playlists.items;
          let selectedPlaylist;
          const mood = getMood();
  
          // Select a playlist based on the current weather conditions and mood
          switch (mood) {
            case 'happy':
              selectedPlaylist = 'https://open.spotify.com/playlist/3PvL1w76yVBWtWV6yl37lz?si=04ccb89ac0d24dba';
              break;
            case 'calm':
              selectedPlaylist = 'https://open.spotify.com/playlist/0KzCAgX6p8Tc4YZtTDEXDg?si=dd77ebbb39794375';
              break;
            case 'sad':
              selectedPlaylist = 'https://open.spotify.com/playlist/5boNVShaIuQdJrCxhHEg9B?si=08caffe8334b4f0b';
              break;
            default:
              selectedPlaylist = 'https://open.spotify.com/playlist/7H3Khr8nktUp2twNbmMY1r?si=28352f5015e04946';
              break;
          }
  
          resolve(selectedPlaylist);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

// This function uses the user's location and the OpenWeatherMap API to determine the weather conditions and returns a Promise that resolves with the weather data.
function getWeatherData(latitude, longitude) {
  const apiKey = 'YOUR_WEATHER_API_KEY';
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return {
        temperature: data.current.temp_c,
        condition: data.current.condition.text.toLowerCase()
      };
    })
    .catch(error => {
      console.error(`Error getting weather data: ${error.message}`);
    });
}

// This is the main function that searches for a playlist based on the user's location and the weather data.
function searchPlaylistByLocation() {
  // First, try to get the user's location using the browser's geolocation API.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherData(latitude, longitude)
        .then(weatherData => {
          const condition = weatherData.condition;
          const query = `${condition} music playlist`;
          getAccessToken(accessToken => {
            searchPlaylist(query, accessToken)
              .then(playlistData => {
                console.log(playlistData);
              })
              .catch(error => {
                console.error(`Error searching for playlist: ${error.message}`);
              });
          });
        })
        .catch(error => {
          console.error(`Error getting weather data: ${error.message}`);
        });
    }, error => {
      console.error(`Error getting location: ${error.message}`);
      // If the browser doesn't support geolocation or the user denies permission, ask for a manual location input.
      const locationInput = prompt('Could not get your location. Please enter a location:');
    
      if (locationInput) {
        const query = `${locationInput} music playlist`;
        getAccessToken(accessToken => {
          searchPlaylist(query, accessToken)
            .then(playlistData => {
              console.log(playlistData);
            })
            .catch(error => {
              console.error(`Error searching for playlist: ${error.message}`);
            });
        });
      }
    });
  } else {
    // If the browser doesn't support geolocation or the user denies permission, ask for a manual location input.
    const locationInput = prompt('Could not get your location. Please enter a location:');
    if (locationInput) {
      const query = `${locationInput} music playlist`;
      getAccessToken(accessToken => {
        searchPlaylist(query, accessToken)
          .then(playlistData => {
            console.log(playlistData);
          })
          .catch(error => {
            console.error(`Error searching for playlist: ${error.message}`);
          });
      });
    }
  }
}

// Call the searchPlaylistByLocation function to search for a playlist based on the user's location and the weather data.
searchPlaylistByLocation();
