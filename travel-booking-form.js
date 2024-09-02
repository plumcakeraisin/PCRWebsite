let destinationCount = 1;

const rateCard = {
    HatchBack: { dailyRate: 1000, driverBata: 200, dailyKmLimit: 250, extraKmRate: 10, dailyTimeLimit: 12 },
    Sedan: { dailyRate: 1500, driverBata: 225, dailyKmLimit: 250, extraKmRate: 12, dailyTimeLimit: 12 },
    SUV: { dailyRate: 2000, driverBata: 250, dailyKmLimit: 250, extraKmRate: 14, dailyTimeLimit: 12 },
    Tempo: { dailyRate: 2500, driverBata: 300, dailyKmLimit: 250, extraKmRate: 16, dailyTimeLimit: 12 },
    UrbanCruiser: { dailyRate: 5000, driverBata: 350, dailyKmLimit: 250, extraKmRate: 18, dailyTimeLimit: 12 },
    Caravan: { dailyRate: 10000, driverBata: 400, dailyKmLimit: 250, extraKmRate: 20, dailyTimeLimit: 12 }
};

function initializeAutocomplete() {
    const startingPointInput = document.getElementById('startingPoint');
    const destination1Input = document.getElementById('destination1');

    const startingPointAutocomplete = new google.maps.places.Autocomplete(startingPointInput);
    const destination1Autocomplete = new google.maps.places.Autocomplete(destination1Input);

    startingPointAutocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
    destination1Autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
}

function addDestination() {
    destinationCount++;
    const newDestination = document.createElement('div');
    newDestination.classList.add('destination-field');
    newDestination.innerHTML = `<label for="destination${destinationCount}">Destination ${destinationCount}:</label>
                                <input type="text" id="destination${destinationCount}" name="destination${destinationCount}"><br>`;
    document.getElementById('additionalDestinations').appendChild(newDestination);

    // Add Google Maps autocomplete to the new destination field
    const newDestinationInput = document.getElementById(`destination${destinationCount}`);
    const newDestinationAutocomplete = new google.maps.places.Autocomplete(newDestinationInput);
    newDestinationAutocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
}

function calculateTotalDistanceAndFare() {
    const service = new google.maps.DistanceMatrixService();
    const startingPoint = document.getElementById('startingPoint').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate the number of days (+1 to include the start date)
    
    let destinations = [];
    for (let i = 1; i <= destinationCount; i++) {
        const destinationValue = document.getElementById(`destination${i}`).value;
        if (destinationValue) {
            destinations.push(destinationValue);
        }
    }

    if (destinations.length > 0) {
        // Include the return to the starting point
        const waypoints = [startingPoint].concat(destinations, startingPoint);

        let totalDistance = 0;
        let requests = [];

        for (let i = 0; i < waypoints.length - 1; i++) {
            requests.push(
                new Promise((resolve, reject) => {
                    service.getDistanceMatrix(
                        {
                            origins: [waypoints[i]],
                            destinations: [waypoints[i + 1]],
                            travelMode: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.METRIC,
                        },
                        (response, status) => {
                            if (status === 'OK') {
                                const distance = response.rows[0].elements[0].distance.value; // meters
                                resolve(distance);
                            } else {
                                reject(`Error calculating distance: ${status}`);
                            }
                        }
                    );
                })
            );
        }

        Promise.all(requests)
            .then(distances => {
                totalDistance = distances.reduce((acc, curr) => acc + curr, 0) / 1000; // Convert to kilometers
                const vehicleRates = rateCard[vehicleType];
                const dailyKmLimit = days * vehicleRates.dailyKmLimit;

                let fare;
                if (dailyKmLimit >= totalDistance) {
                    fare = days * (vehicleRates.dailyRate + vehicleRates.driverBata);
                } else {
                    fare = days * (vehicleRates.dailyRate + vehicleRates.driverBata) + (totalDistance - dailyKmLimit) * vehicleRates.extraKmRate;
                }

                document.getElementById('result').innerHTML = `Total Distance: ${totalDistance.toFixed(2)} km<br>Estimated Fare: ₹${fare.toFixed(2)}`;
            })
            .catch(error => {
                document.getElementById('result').innerText = error;
            });
    } else {
        document.getElementById('result').innerText = 'Please enter at least one destination.';
    }
}

google.maps.event.addDomListener(window, 'load', initializeAutocomplete);
