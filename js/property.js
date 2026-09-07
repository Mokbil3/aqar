// Adjust this if your backend runs somewhere other than localhost:5000
const API_BASE = "http://localhost:5000/api";

function getPropertyId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function formatNumber(value) {
    return Number(value).toLocaleString("en-US");
}

async function loadProperty() {
    const id = getPropertyId();

    if (!id) {
        showError("No property was specified. Go back and choose a listing from Properties.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/properties/${id}`);
        const data = await res.json();

        if (!data.success) {
            showError(data.message || "This property could not be found.");
            return;
        }

        renderProperty(data.property, data.images, data.features);
    } catch (error) {
        console.error("Failed to load property:", error);
        showError("Couldn't reach the server. Check your connection and try again.");
    }
}

function renderProperty(property, images, features) {
    document.title = `${property.title_en} | Aqar`;

    // Hero image + heading
    const heroImg = document.getElementById("hero-image");
    const primary = images.find((img) => img.is_primary) || images[0];
    if (primary) {
        heroImg.src = primary.image_url;
        heroImg.alt = primary.alt_text_en || property.title_en;
    }

    document.getElementById("property-location").textContent =
        `${property.district}, ${property.city}`;
    document.getElementById("property-title").textContent = property.title_en;

    // Quick facts
    document.getElementById("fact-bedrooms").textContent = `${property.bedrooms} Bedrooms`;
    document.getElementById("fact-bathrooms").textContent = `${property.bathrooms} Bathrooms`;
    document.getElementById("fact-area").textContent = `${formatNumber(property.area)} sq ft`;
    document.getElementById("fact-purpose").textContent =
        property.purpose === "rent" ? "For rent" : "For sale";

    // Description
    document.getElementById("property-description").textContent = property.description_en;

    // Amenities (built from the features the API returned — no hardcoded list)
    const amenitiesList = document.getElementById("amenities-list");
    amenitiesList.innerHTML = "";
    if (features.length === 0) {
        amenitiesList.innerHTML = "<li>No amenities listed for this property yet.</li>";
    } else {
        features.forEach((feature) => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="${feature.icon_class}"></i> ${feature.name_en}`;
            amenitiesList.appendChild(li);
        });
    }

    // Location
    document.getElementById("location-address").textContent =
        property.address || `${property.district}, ${property.city}`;

    // Price card
    document.getElementById("price").textContent =
        `${property.currency} ${formatNumber(property.price)}`;

    const priceLabel = document.getElementById("price-label");
    priceLabel.textContent = property.purpose === "rent" ? "Yearly rent" : "Asking price";

    const perSqftEl = document.getElementById("price-per-sqft");
    if (property.area && Number(property.area) > 0) {
        const perSqft = (property.price / property.area).toFixed(0);
        perSqftEl.textContent = `${property.currency} ${formatNumber(perSqft)} / sq ft`;
    } else {
        perSqftEl.textContent = "";
    }

    // Agent
    const agentName = `${property.agent_first_name || ""} ${property.agent_last_name || ""}`.trim();
    document.getElementById("agent-name").textContent = agentName || "Aqar agent";
    document.getElementById("agent-avatar").src =
        property.agent_avatar || "https://ui-avatars.com/api/?name=Aqar+Agent";

    const callBtn = document.getElementById("call-agent-btn");
    if (property.agent_phone) {
        callBtn.href = `tel:${property.agent_phone}`;
    } else {
        callBtn.style.display = "none";
    }

    const emailBtn = document.getElementById("email-agent-btn");
    if (property.agent_email) {
        emailBtn.href = `mailto:${property.agent_email}?subject=Enquiry about ${encodeURIComponent(property.title_en)}`;
    } else {
        emailBtn.style.display = "none";
    }
}

function showError(message) {
    const main = document.querySelector(".property-layout");
    main.innerHTML = `<p class="error-message">${message}</p>`;
}

document.addEventListener("DOMContentLoaded", loadProperty);
