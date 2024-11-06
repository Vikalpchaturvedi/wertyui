let renderData = document.querySelector(".renderData");

// Fetch Products
async function getData() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        console.log(data); // Debugging line to check the fetched data

        data.forEach(ele => {
            let productMainDiv = document.createElement("div");
            productMainDiv.classList.add("box-main");

            // Create image element
            let createImgEle = document.createElement("img");
            createImgEle.src = ele.image;
            createImgEle.alt = ele.title; // Optional: Adding alt text

            // Create title element
            let createTitle = document.createElement("p");
            createTitle.classList.add("productTitle");
            createTitle.textContent = `${ele.title.slice(0, 35)}...`;

            // Create price element
            let createPriceEle = document.createElement("p");
            createPriceEle.classList.add("price-element");
            createPriceEle.textContent = `Price: ₹${ele.price}`;

            // Add to cart button
            let addToCartBtn = document.createElement("button");
            addToCartBtn.classList.add("btn-element");
            addToCartBtn.textContent = "Add to Cart";
            
            // Checkmark element
            let checkMark = document.createElement("span");
            checkMark.classList.add("checkmark");
            checkMark.innerHTML = "&#10003;"; // Unicode character for checkmark
            checkMark.style.display = "none"; // Initially hidden

            addToCartBtn.addEventListener("click", () => {
                addToCart(ele.id, ele.image, ele.price, ele.title, checkMark, addToCartBtn);
            });

            // Create product link to details page
            let productLink = document.createElement("a");
            productLink.href = `./productDetails.html?id=${ele.id}&title=${encodeURIComponent(ele.title)}&price=${ele.price}&image=${encodeURIComponent(ele.image)}&description=${encodeURIComponent(ele.description)}`;
            productLink.append(createImgEle);

            // Append all elements to the main div
            productMainDiv.append(productLink, createTitle, createPriceEle, addToCartBtn, checkMark);
            renderData.appendChild(productMainDiv);
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Add to Cart Function
function addToCart(id, img, price, title, checkMark, addToCartBtn) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item already exists
    } else {
        cartItems.push({ id, img, price: Number(price), title, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Show checkmark and toast notification
    checkMark.style.display = "inline"; // Show checkmark
    addToCartBtn.textContent = "Added"; // Change button text to 'Added'

    // Update cart count
    updateCartCount(cartItems);

    // Show the toast notification
    showToast("Product added to cart!");

    // Show the popup with checkmark
    showPopup();

    // Optionally: Hide the checkmark after a few seconds
    setTimeout(() => {
        checkMark.style.display = "none";
        addToCartBtn.textContent = "Add to Cart"; // Reset button text
    }, 2000); // Hide after 2 seconds
}

// Show Toast Notification
function showToast(message) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast and remove it after 3 seconds
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => {
            toast.remove();
        }, 500); // Remove after fade-out
    }, 3000); // Show for 3 seconds
}

// Show Popup Notification
function showPopup() {
    // Create a popup container
    let popup = document.createElement("div");
    popup.classList.add("popup");

    // Create a checkmark and message for the popup
    let popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    popupContent.innerHTML = `
        <span class="popup-checkmark">${"&#10003;"}</span>
        <span class="popup-message">Product added to cart!</span>
    `;

    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    // Show the popup
    popup.style.display = "block";
    
    // Fade in the popup
    setTimeout(() => {
        popup.classList.add("show");
    }, 10); // Slight delay for the fade-in effect

    // Hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => {
            popup.remove();
        }, 500); // Remove after fade-out
    }, 3000); // Show for 3 seconds
}

// Update Cart Count Function
function updateCartCount(cartItems) {
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount > 0 ? totalCount : '0';
}

// Handle Search Functionality
function handleSearch() {
    const searchQuery = document.querySelector('.search-bar').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
    );

    renderData.innerHTML = ''; // Clear current products
    displayProducts(filteredProducts); // Display filtered products
}

// Function to display products (used for rendering filtered products)
function displayProducts(products) {
    products.forEach(ele => {
        let productMainDiv = document.createElement("div");
        productMainDiv.classList.add("box-main");

        let createImgEle = document.createElement("img");
        createImgEle.src = ele.image;
        createImgEle.alt = ele.title;

        let createTitle = document.createElement("p");
        createTitle.classList.add("productTitle");
        createTitle.textContent = `${ele.title.slice(0, 35)}...`;

        let createPriceEle = document.createElement("p");
        createPriceEle.classList.add("price-element");
        createPriceEle.textContent = `Price: ₹${ele.price}`;

        let addToCartBtn = document.createElement("button");
        addToCartBtn.classList.add("btn-element");
        addToCartBtn.textContent = "Add to Cart";

        let checkMark = document.createElement("span");
        checkMark.classList.add("checkmark");
        checkMark.innerHTML = "&#10003;";
        checkMark.style.display = "none";

        addToCartBtn.addEventListener("click", () => {
            addToCart(ele.id, ele.image, ele.price, ele.title, checkMark, addToCartBtn);
        });

        let productLink = document.createElement("a");
        productLink.href = `./productDetails.html?id=${ele.id}&title=${encodeURIComponent(ele.title)}&price=${ele.price}&image=${encodeURIComponent(ele.image)}&description=${encodeURIComponent(ele.description)}`;
        productLink.append(createImgEle);

        productMainDiv.append(productLink, createTitle, createPriceEle, addToCartBtn, checkMark);
        renderData.appendChild(productMainDiv);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    getData();
    updateCartCount(JSON.parse(localStorage.getItem('cartItems')) || []);
    document.querySelector('.search-bar').addEventListener('input', handleSearch); // Search event listener
});
