// Adjust this if your backend runs somewhere other than localhost:5000
const API_BASE = "http://localhost:5000/api";

function formatNumber(value) {
    return Number(value).toLocaleString("en-US");
}

function renderFeatured(properties) {
    const grid = document.getElementById("featured-grid");

    if (properties.length === 0) {
        grid.innerHTML = '<p class="listing-status">No properties yet — check back soon.</p>';
        return;
    }

    // Show up to 3 — properties are already ordered featured-first by the API
    const featured = properties.slice(0, 3);

    grid.innerHTML = "";

    featured.forEach((property) => {
        const card = document.createElement("a");
        card.className = "property-card";
        card.href = `property.html?id=${property.id}`;

        const image = property.primary_image || "https://via.placeholder.com/600x400?text=No+Photo";

        card.innerHTML = `
            <img src="${image}" alt="${property.title_en}">
            <div class="property-card-body">
                <span class="property-card-purpose">${property.purpose === "rent" ? "For rent" : "For sale"}</span>
                <h3>${property.title_en}</h3>
                <p class="property-card-location">${property.district}, ${property.city}</p>
                <p class="property-card-price">${property.currency} ${formatNumber(property.price)}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

async function loadFeatured() {
    try {
        const res = await fetch(`${API_BASE}/properties`);
        const data = await res.json();

        if (!data.success) {
            showError("Couldn't load properties.");
            return;
        }

        renderFeatured(data.properties);
    } catch (error) {
        console.error("Failed to load featured properties:", error);
        showError("Couldn't reach the server. Check your connection and try again.");
    }
}

function showError(message) {
    const grid = document.getElementById("featured-grid");
    grid.innerHTML = `<p class="listing-status">${message}</p>`;
}

function wireUpSearch() {
    document.getElementById("home-search").addEventListener("submit", (e) => {
        e.preventDefault();

        const purpose = document.getElementById("search-purpose").value;
        const city = document.getElementById("search-city").value.trim();
        const type = document.getElementById("search-type").value;

        const params = new URLSearchParams();
        if (purpose) params.set("purpose", purpose);
        if (city) params.set("city", city);
        if (type) params.set("property_type", type);

        window.location.href = `properties.html${params.toString() ? "?" + params.toString() : ""}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadFeatured();
    wireUpSearch();
});
