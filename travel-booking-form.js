// Inject the travel booking form HTML into the #content div
document.getElementById('content').innerHTML = `
<div class="container">
    <h2>Travel Booking Form</h2>
    <form id="travelForm">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" name="startDate" required>

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" name="endDate" required>

        <label for="startingPoint">Starting Point:</label>
        <input type="text" id="startingPoint" name="startingPoint" required>

        <label for="destination1">Destination 1:</label>
        <input type="text" id="destination1" name="destination1" required>

        <div id="additionalDestinations"></div>

        <span class="more-destinations" onclick="addDestination()">+ Add More Destinations</span>

        <label for="vehicleType">Vehicle Type:</label>
        <select id="vehicleType" name="vehicleType" required>
            <option value="HatchBack">HatchBack</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Tempo">Tempo</option>
            <option value="UrbanCruiser">UrbanCruiser</option>
            <option value="Caravan">Caravan</option>
        </select>

        <input type="button" value="Calculate Total Distance and Fare" onclick="calculateTotalDistanceAndFare()">
    </form>

    <div id="result"></div>
</div>
`;

let destinationCount = 1;

// Add a new destination input field
function addDestination() {
    destinationCount++;
    const newDestination = document.createElement('div');
    newDestination.classList.add('destination-field');
    newDestination.innerHTML = `
        <label for="destination${destinationCount}">Destination ${destinationCount}:</label>
        <input type="text" id="destination${destinationCount}" name="destination${destinationCount}"><br>`;
    document.getElementById('additionalDestinations').appendChild(newDestination);
}

// Calculate the total distance and fare based on user input
function calculateTotalDistanceAndFare() {
    const service = new google.maps.DistanceMatrixService();
    const startingPoint = document.getElementById('startingPoint').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let destinations = [];
    for (let i = 1; i <= destinationCount; i++) {
        const destinationValue = document.getElementById(`destination${i}`).value;
        if (destinationValue) {
            destinations.push(destinationValue);
        }
    }

    if (destinations.length > 0) {
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
                                const distance = response.rows[0].elements[0].distance.value;
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
                totalDistance = distances.reduce((acc, curr) => acc + curr, 0) / 1000;
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
