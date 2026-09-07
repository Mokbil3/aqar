// Adjust this if your backend runs somewhere other than Railway
const API_BASE = "https://aqar-production-b2a2.up.railway.app/api";

// Cloudinary — free image hosting, uploads go straight from the browser
const CLOUDINARY_CLOUD_NAME = "oim2xqmi";
const CLOUDINARY_UPLOAD_PRESET = "aqar_uploads";

let formOptions = null;
let uploadedImages = []; // array of { url, uploading } in display order

function renderImagePreviews() {
    const grid = document.getElementById("image-preview-grid");
    grid.innerHTML = "";

    uploadedImages.forEach((img, index) => {
        const item = document.createElement("div");
        item.className = "image-preview-item" + (img.uploading ? " uploading" : "");

        if (img.previewSrc) {
            const imgEl = document.createElement("img");
            imgEl.src = img.previewSrc;
            item.appendChild(imgEl);
        }

        if (!img.uploading) {
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", () => {
                uploadedImages.splice(index, 1);
                renderImagePreviews();
            });
            item.appendChild(removeBtn);
        }

        grid.appendChild(item);
    });
}

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!data.secure_url) {
        throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
}

function setupImageUpload() {
    document.getElementById("image_files").addEventListener("change", async (e) => {
        const files = Array.from(e.target.files);
        e.target.value = ""; // allow selecting the same file again later

        for (const file of files) {
            const localPreview = URL.createObjectURL(file);
            const entry = { url: null, previewSrc: localPreview, uploading: true };
            uploadedImages.push(entry);
            renderImagePreviews();

            try {
                const url = await uploadToCloudinary(file);
                entry.url = url;
                entry.uploading = false;
            } catch (error) {
                console.error("Image upload failed:", error);
                uploadedImages = uploadedImages.filter((img) => img !== entry);
                showMessage(`One photo failed to upload: ${error.message}`, "error");
            }

            renderImagePreviews();
        }
    });
}

function requireLogin() {
    const token = localStorage.getItem("aqar_token");
    if (!token) {
        window.location.href = "login.html?redirect=add-property.html";
    }
    return token;
}

function populateSelect(selectEl, items, placeholder) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.name_en;
        selectEl.appendChild(opt);
    });
}

function populateFeatures(features) {
    const grid = document.getElementById("features-grid");
    grid.innerHTML = "";

    features.forEach((feature) => {
        const label = document.createElement("label");
        label.className = "feature-check";
        label.innerHTML = `
            <input type="checkbox" value="${feature.id}" class="feature-checkbox">
            <span><i class="${feature.icon_class}"></i> ${feature.name_en}</span>
        `;
        grid.appendChild(label);
    });
}

function setupCascadingSelects() {
    const citySelect = document.getElementById("city_id");
    const districtSelect = document.getElementById("district_id");
    const neighborhoodSelect = document.getElementById("neighborhood_id");

    citySelect.addEventListener("change", () => {
        const cityId = citySelect.value;
        const matchingDistricts = formOptions.districts.filter(
            (d) => String(d.city_id) === cityId
        );

        neighborhoodSelect.innerHTML = '<option value="">Select a district first</option>';
        neighborhoodSelect.disabled = true;

        if (cityId && matchingDistricts.length > 0) {
            populateSelect(districtSelect, matchingDistricts, "Select a district");
            districtSelect.disabled = false;
        } else {
            districtSelect.innerHTML = '<option value="">No districts available</option>';
            districtSelect.disabled = true;
        }
    });

    districtSelect.addEventListener("change", () => {
        const districtId = districtSelect.value;
        const matchingNeighborhoods = formOptions.neighborhoods.filter(
            (n) => String(n.district_id) === districtId
        );

        if (districtId && matchingNeighborhoods.length > 0) {
            populateSelect(neighborhoodSelect, matchingNeighborhoods, "Select a neighborhood");
            neighborhoodSelect.disabled = false;
        } else {
            neighborhoodSelect.innerHTML = '<option value="">No neighborhoods available</option>';
            neighborhoodSelect.disabled = true;
        }
    });
}

async function loadFormOptions() {
    try {
        const res = await fetch(`${API_BASE}/properties/meta/form-options`);
        const data = await res.json();

        if (!data.success) {
            showMessage("Couldn't load form options.", "error");
            return;
        }

        formOptions = data;

        populateSelect(document.getElementById("property_type_id"), data.propertyTypes, "Select a type");
        populateSelect(document.getElementById("city_id"), data.cities, "Select a city");
        populateFeatures(data.features);
        setupCascadingSelects();
    } catch (error) {
        console.error(error);
        showMessage("Couldn't reach the server to load form options.", "error");
    }
}

function showMessage(text, type) {
    const el = document.getElementById("message");
    el.textContent = text;
    el.className = `message ${type}`;
}

function setupFormSubmit(token) {
    document.getElementById("propertyForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const button = document.getElementById("submit-btn");
        button.disabled = true;
        showMessage("", "");

        const uploadedUrls = uploadedImages
            .filter((img) => img.url && !img.uploading)
            .map((img) => img.url);

        const pastedUrls = document.getElementById("image_urls").value
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const imageUrls = [...uploadedUrls, ...pastedUrls];

        const featureIds = Array.from(document.querySelectorAll(".feature-checkbox:checked"))
            .map((cb) => Number(cb.value));

        const payload = {
            title_en: document.getElementById("title_en").value,
            description_en: document.getElementById("description_en").value,
            property_type_id: Number(document.getElementById("property_type_id").value),
            purpose: document.getElementById("purpose").value,
            city_id: Number(document.getElementById("city_id").value),
            district_id: Number(document.getElementById("district_id").value),
            neighborhood_id: Number(document.getElementById("neighborhood_id").value),
            address: document.getElementById("address").value,
            price: Number(document.getElementById("price").value),
            bedrooms: Number(document.getElementById("bedrooms").value),
            bathrooms: Number(document.getElementById("bathrooms").value),
            parking_spaces: Number(document.getElementById("parking_spaces").value),
            area: document.getElementById("area").value ? Number(document.getElementById("area").value) : null,
            year_built: document.getElementById("year_built").value ? Number(document.getElementById("year_built").value) : null,
            furnished: document.getElementById("furnished").checked,
            images: imageUrls,
            feature_ids: featureIds
        };

        try {
            const res = await fetch(`${API_BASE}/properties`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                showMessage("Listing published! Redirecting…", "success");
                setTimeout(() => {
                    window.location.href = `property.html?id=${data.propertyId}`;
                }, 1200);
            } else {
                showMessage(data.message || "Couldn't publish this listing.", "error");
                button.disabled = false;
            }
        } catch (error) {
            console.error(error);
            showMessage("Couldn't reach the server.", "error");
            button.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const token = requireLogin();
    if (!token) return;

    loadFormOptions();
    setupImageUpload();
    setupFormSubmit(token);
});
