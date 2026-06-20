// ===================== PRODUCT SEARCH FEATURE =====================
// Select search input, product cards, counter text, and "no result {s" message
document.addEventListener("DOMContentLoaded", () => {
const productSearch = document.querySelector("#product-search");
const productCards = document.querySelectorAll(".product-card");
const productCount = document.querySelector("#product-count");
const noResults = document.querySelector("#no-results");
const lightbox = document.querySelector("#lightbox");


// ===================== UPDATE PRODUCT COUNT =====================
// Updates how many products are visible after filtering
function updateProductCount() {
    if (!productCount) {
        return; // stop if element does not exist
    }

    // Count only visible (not hidden) product cards
    const visibleCards = [...productCards].filter((card) => !card.hidden).length;

    // Update text dynamically
    productCount.textContent = `${visibleCards} product${visibleCards === 1 ? "" : "s"} showing`;

    // Show "no results" message if nothing is visible
    if (noResults) {
        noResults.hidden = visibleCards !== 0;
    }
}


// ===================== SEARCH FILTER LOGIC =====================
// Runs whenever user types in the search bar
if (productSearch && productCards.length > 0) {
    productSearch.addEventListener("input", () => {

        const searchTerm = productSearch.value.trim().toLowerCase();

        // Loop through all product cards and filter them
        productCards.forEach((card) => {

            const text = card.textContent.toLowerCase();
           const category = (card.dataset.category || "").toLowerCase();
            // Hide card if it doesn't match search term
            card.hidden = !text.includes(searchTerm) && !category.includes(searchTerm);
        });

        updateProductCount(); // refresh count after filtering
    });

    // Run once on page load
    updateProductCount();
}


// ===================== LIGHTBOX IMAGE VIEWER =====================
// Opens product images in a popup modal (lightbox)
if(lightbox){
document.querySelectorAll("[data-lightbox]").forEach((image) => {
    image.addEventListener("click", () => {
        const lightboxImage = lightbox.querySelector("img");
        const lightboxCaption = lightbox.querySelector("p");

        // Set clicked image into lightbox
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        // Show caption using alt text
        lightboxCaption.textContent = image.alt;

        // Open modal
        lightbox.showModal();
    });
});


// ===================== CLOSE LIGHTBOX =====================
// Close button inside modal
document.querySelectorAll("[data-close-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
        lightbox.close();
    });
});
}

// ===================== FORM MESSAGE HANDLER =====================
// Displays success or error messages below forms
function showFormMessage(form, message, type = "success") {

    const response = form.querySelector(".form-response");

    response.textContent = message;
    response.className = `form-response ${type}`;
    response.hidden = false;
}


// ===================== FORM SUBMISSION (ENQUIRY + CONTACT) =====================
document.querySelectorAll("form[data-form-type]").forEach((form) => {

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            showFormMessage(form, "Please complete all required fields correctly.", "error");
            return;
        }

        const formType = form.dataset.formType;
        const formData = new FormData(form);
        const name = formData.get("name");

        // ================= ENQUIRY FORM =================
        if (formType === "enquiry") {
            showFormMessage(
                form,
                `Thank you, ${name}. Your enquiry has been received. Buhle's Bakery will contact you to confirm your order.`
            );

            form.reset();
        }

        // ================= CONTACT FORM =================
        if (formType === "contact") {

            const subject = encodeURIComponent("Website contact message");

            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${formData.get("email")}\n\nMessage:\n${formData.get("message")}`
            );

            const mailtoLink =
                `mailto:hello@buhlesbakery.co.za?subject=${subject}&body=${body}`;

            showFormMessage(
                form,
                `Thank you, ${name}. Your message is ready to email. If your email app does not open, send it to hello@buhlesbakery.co.za.`
            );

            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 150);

            form.reset();
        }
    });
});
});