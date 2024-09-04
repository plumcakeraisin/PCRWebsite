// Inject the navbar HTML into the #navbar div
document.getElementById('navbar').innerHTML = `
<div class="navbar" id="myNavbar">
    <a href="#home">Home</a>
    <a href="#book">Book a Taxi</a>
    <a href="#contact">Contact Us</a>
    <a href="#about">About Us</a>
    <a href="javascript:void(0);" class="icon" onclick="toggleNavbar()">
        &#9776;
    </a>
</div>
`;

// Function to toggle the navbar for mobile view
function toggleNavbar() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
