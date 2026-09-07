// Adjust this if your backend runs somewhere other than localhost:5000
const API_BASE = "https://aqar-production-b2a2.up.railway.app/api";
// Carried over from the homepage's search box, which has a property-type
// dropdown that properties.html doesn't show as a visible filter field.
let propertyTypeFromHome = "";

function formatNumber(value) {
    return Number(value).toLocaleString("en-US");
}

function renderCards(properties) {
    const grid = document.getElementById("listing-grid");

    if (properties.length === 0) {
        grid.innerHTML = '<p class="listing-status">No properties match your search.</p>';
        return;
    }

    grid.innerHTML = "";

    properties.forEach((property) => {
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
                <ul class="property-card-facts">
                    <li><i class="fas fa-bed"></i>${property.bedrooms}</li>
                    <li><i class="fas fa-bath"></i>${property.bathrooms}</li>
                    <li><i class="fas fa-ruler-combined"></i>${formatNumber(property.area)} sq ft</li>
                </ul>
                <p class="property-card-price">${property.currency} ${formatNumber(property.price)}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

async function loadAllProperties() {
    try {
        const res = await fetch(`${API_BASE}/properties`);
        const data = await res.json();

        if (!data.success) {
            showError("Couldn't load properties.");
            return;
        }

        renderCards(data.properties);
    } catch (error) {
        console.error("Failed to load properties:", error);
        showError("Couldn't reach the server. Check your connection and try again.");
    }
}

async function runSearch() {
    const purpose = document.getElementById("filter-purpose").value;
    const city = document.getElementById("filter-city").value.trim();
    const minPrice = document.getElementById("filter-min-price").value;
    const maxPrice = document.getElementById("filter-max-price").value;
    const bedrooms = document.getElementById("filter-bedrooms").value;

    const params = new URLSearchParams();
    if (purpose) params.set("purpose", purpose);
    if (city) params.set("city", city);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (propertyTypeFromHome) params.set("property_type", propertyTypeFromHome);

    const grid = document.getElementById("listing-grid");
    grid.innerHTML = '<p class="listing-status">Searching…</p>';

    try {
        const res = await fetch(`${API_BASE}/properties/search?${params.toString()}`);
        const data = await res.json();

        if (!data.success) {
            showError("Search failed.");
            return;
        }

        renderCards(data.properties);
    } catch (error) {
        console.error("Search failed:", error);
        showError("Couldn't reach the server. Check your connection and try again.");
    }
}

function clearFilters() {
    document.getElementById("filter-purpose").value = "";
    document.getElementById("filter-city").value = "";
    document.getElementById("filter-min-price").value = "";
    document.getElementById("filter-max-price").value = "";
    document.getElementById("filter-bedrooms").value = "";
    loadAllProperties();
}

function showError(message) {
    const grid = document.getElementById("listing-grid");
    grid.innerHTML = `<p class="listing-status">${message}</p>`;
}

function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const hasParams = [...params.keys()].length > 0;

    if (!hasParams) return false;

    if (params.get("purpose")) document.getElementById("filter-purpose").value = params.get("purpose");
    if (params.get("city")) document.getElementById("filter-city").value = params.get("city");
    if (params.get("property_type")) {
        propertyTypeFromHome = params.get("property_type");
    }
    if (params.get("min_price")) document.getElementById("filter-min-price").value = params.get("min_price");
    if (params.get("max_price")) document.getElementById("filter-max-price").value = params.get("max_price");
    if (params.get("bedrooms")) document.getElementById("filter-bedrooms").value = params.get("bedrooms");

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const cameFromSearch = applyFiltersFromURL();
    if (cameFromSearch) {
        runSearch();
    } else {
        loadAllProperties();
    }
    document.getElementById("filter-apply").addEventListener("click", runSearch);
    document.getElementById("filter-clear").addEventListener("click", clearFilters);
});
