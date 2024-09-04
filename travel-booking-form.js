document.getElementById('travel-booking-form').innerHTML = `
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

google.maps.event.addDomListener(window, 'load', initializeAutocomplete);

function calculateTotalDistanceAndFare() {
    const service = new google.maps.DistanceMatrixService();
    const startingPoint = document.getElementById('startingPoint').value;
    const vehicleType = document.getElementById('vehicle
