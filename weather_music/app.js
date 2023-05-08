function getLocation() {
    const locationInput = document.getElementById('location-input');
    const location = locationInput.value;
  
    if (location) {
      const apiKey = '97b7e2c3a2de4ff79d2133853230805';
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Do something with the weather data
        })
        .catch(error => {
          console.error(`Error getting weather data: ${error.message}`);
        });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          const apiKey = '97b7e2c3a2de4ff79d2133853230805';
          const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
  
          fetch(url)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              // Do something with the weather data
            })
            .catch(error => {
              console.error(`Error getting weather data: ${error.message}`);
            });
        },
        error => {
          console.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  