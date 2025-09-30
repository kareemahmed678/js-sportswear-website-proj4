let userInfo = document.querySelector("#userinfo")
let userData = document.querySelector("#user")
let links = document.querySelector("#links")
let logoutBtn = document.querySelector("#logout")

if (localStorage.getItem("email")){
    links.style.display ="none"
    userInfo.style.display ="flex"
    userData.innerHTML = localStorage.getItem("firstName")
}

logoutBtn.addEventListener("click", function(e){
    e.preventDefault()
    
    localStorage.clear();
    
    cartItems = [];
    favorites = [];
    
    links.style.display ="block"
    userInfo.style.display ="none"

    updateCartCount();
    displayCartDropdown();
    displayFavoritesSlider();
    updateAllHeartIcons();
    initializeAllAddToCartButtons();
    console.log('User logged out - cleared all local storage');
    
    window.location.href = 'index.html';
})

function initializeCartDropdown() {
    let cartLink = document.querySelector("#cartLink")
    let cartDropdown = document.querySelector(".drpdwn_cart")

    if (cartLink && cartDropdown) {
        cartLink.addEventListener("click", function(e){
            e.preventDefault()
            if (cartDropdown.style.display === "none" || cartDropdown.style.display === ""){
                cartDropdown.style.display = "block"
            } 
            else {
                cartDropdown.style.display = "none"
            }
        })
        console.log('Cart dropdown initialized');
    } else {
        console.log('Cart elements not found, retrying...');
        setTimeout(initializeCartDropdown, 100);
    }
}

initializeCartDropdown();


let allProducts = document.querySelector("#products")
let products = [
    { id:7, title: "Backpack 1", imageUrl: "Images/7.avif", price: 450, category: "Accessories" },
    { id:2, title: "Running Shoes 2", imageUrl: "Images/2.avif", price: 180, category: "Footwear" },
    { id:4, title: "Track Jacket 1", imageUrl: "Images/4.avif", price: 250, category: "Clothing" },
    { id:1, title: "Running Shoes 1", imageUrl: "Images/1.avif", price: 120, category: "Footwear" },
    { id:8, title: "Backpack 2", imageUrl: "Images/8.avif", price: 700, category: "Accessories" },
    { id:5, title: "Track Jacket 2", imageUrl: "Images/5.avif", price: 45, category: "Clothing" },
    { id:3, title: "Running Shoes 3", imageUrl: "Images/3.avif", price: 95, category: "Footwear" },
    { id:6, title: "Track Jacket 3", imageUrl: "Images/6.avif", price: 350, category: "Clothing" },
    { id:9, title: "Backpack 3", imageUrl: "Images/9.avif", price: 1200, category: "Accessories" }
]
function drawItems (productsToShow = products){
    if (!allProducts) {
        console.log('Products container not found, skipping drawItems');
        return;
    }
    
    let y = productsToShow.map((item) => {
        return `
            <div class="product-card">
                <div class="card">
                    <div class="card-img-top product-image-container">
                        ${item.imageUrl ? `<img src="${item.imageUrl}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                        <div class="product-image-placeholder" style="display: ${item.imageUrl ? 'none' : 'flex'};">
                            <i class="fas fa-image"></i>
                            <span>No Image</span>
                        </div>
                    </div>

                    <div class="card-body d-flex flex-column text-center">
                        <h4 class="card-title">${item.title}</h4>
                        <p class="card-text"><strong>Price: $${item.price}</strong></p>
                        <p class="card-text mb-3">Category: ${item.category}</p>

                        <div class="d-flex justify-content-center align-items-center">
                            <i class="fas fa-heart"></i>
                            <a class="btn btn-primary ml-2" id="addBtn">Add to Cart</a>
                        </div>
                    </div>
                </div>
            </div>`
    })
    allProducts.innerHTML = y.join('');
}

let currentSearchMode = null;

function showCategoryOptions() {
    document.getElementById('searchByBtn').textContent = 'Search by Category';
    document.getElementById('searchInput').placeholder = 'Search by category...';
    currentSearchMode = 'category';
    document.getElementById('searchInput').value = '';
    drawItems(products);
}

function showNameOptions() {
    document.getElementById('searchByBtn').textContent = 'Search by Product Name';
    document.getElementById('searchInput').placeholder = 'Search by product name...';
    currentSearchMode = 'product';
    document.getElementById('searchInput').value = '';
    drawItems(products);
}


function performSearch() {
    let searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        drawItems(products);
        return;
    }
    
    if (!currentSearchMode) {
        alert('Please select a search option first (Category or Product Name)');
        return;
    }
    
    let filteredProducts = [];
    
    if (currentSearchMode === 'category') {
        filteredProducts = products.filter(item => 
            item.category.toLowerCase().includes(searchTerm)
        );
    } else if (currentSearchMode === 'product') {
        filteredProducts = products.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
    }
    
    drawItems(filteredProducts);
    setTimeout(initializeAllAddToCartButtons, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    let searchBtn = document.getElementById('searchBtn');
    let searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

if (document.querySelector("#products")) {
    drawItems();
    setTimeout(initializeAllAddToCartButtons, 100);
    setTimeout(() => {
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        updateAllHeartIcons();
        addHeartEventListenersForFavorites();
    }, 200);
}
let cartItems = [];
let cartCount = document.querySelector("#cartCount");

function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('loadCartItems - Loaded cart items:', cartItems);
    return cartItems;
}

function saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('saveCartItems - Saved cart items:', cartItems);
}

function addCartButtonEventListeners() {
    let addButtons = document.querySelectorAll('#addBtn');
    addButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(products[index]);
        });
    });
}

function addToCart(product) {
    if (!localStorage.getItem("email")) {
        alert("Please login to add items to cart");
        window.location.href = "login.html";
        return;
    }
    
    loadCartItems();
    
    let existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartItems();
    console.log('Added to cart:', product.title, 'Cart items:', cartItems);
    
    updateCartCount();
    displayCartItems();
    displayCartProductsPage();
    displayCartDropdown(); 
    updateAddToCartButton(product.id, true);
}

function updateCartCount() {
    let totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    let cartCountElement = document.querySelector("#cartCount");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        console.log('Updated cart count element to:', totalItems);
    } 
    else {
        console.log('Cart count element not found!');
    }
    console.log('Updated cart count:', totalItems, 'Cart items:', cartItems);
}

function forceUpdateCartCount() {
    loadCartItems();
    let totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    
    let cartCountElement = document.querySelector("#cartCount") || 
                          document.querySelector(".badge") || 
                          document.querySelector("[id*='cart']");
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        console.log('Force updated cart count to:', totalItems);
    } else {
        console.log('Could not find cart count element with any selector');
        
        setTimeout(() => {
            let retryElement = document.querySelector("#cartCount");
            if (retryElement) {
                retryElement.textContent = totalItems;
                console.log('Retry successful - updated cart count to:', totalItems);
            }
        }, 200);
    }
}

function displayCartItems() {
    let cartItemsContainer = document.querySelector("#cartitems");

    if (!cartItemsContainer) {
        console.log('Cart items container not found, skipping displayCartItems');
        return;
    }

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart empty-icon"></i>
                <div class="empty-title">Your Cart is Empty</div>
                <div class="empty-message">Add some items to get started!</div>
            </div>
        `;
        return;
    }

    let cartItemsHTML = cartItems.map(item => `
        <div class="favorite-item-card">
            <div class="favorite-item-content">
                <p class="favorite-item-name" style="font-size: 16px; width: 200px;">${item.title}</p>
                <p class="favorite-item-price">$${item.price}</p>
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="decreaseQuantity(${item.id})">
                        ${item.quantity === 1 ? '<i class="fas fa-trash"></i>' : '-'}
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
        </div>
    `).join('');

    cartItemsContainer.innerHTML = cartItemsHTML;
}

function displayCartDropdown() {
    let cartDropdownItems = document.querySelector(".drpdwn_cart div");

    if (!cartDropdownItems) {
        console.log('Cart dropdown items container not found, skipping displayCartDropdown');
        return;
    }

    if (cartItems.length === 0) {
        cartDropdownItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart empty-icon"></i>
                <div class="empty-title">Your Cart is Empty</div>
                <div class="empty-message">Add some items to get started!</div>
            </div>
        `;
        return;
    }

    
    let itemsToShow = cartItems.slice(0, 3);
    let cartDropdownHTML = itemsToShow.map(item => `
        <div class="dropdown-item-card">
            <div class="dropdown-item-content">
                <p class="dropdown-item-name">${item.title}</p>
                <p class="dropdown-item-price">$${item.price}</p>
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="decreaseQuantity(${item.id})">
                        ${item.quantity === 1 ? '<i class="fas fa-trash"></i>' : '-'}
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
        </div>
    `).join('');

    if (cartItems.length > 3) {
        cartDropdownHTML += '<p>... and more items</p>';
    }

    cartDropdownItems.innerHTML = cartDropdownHTML;
}

function increaseQuantity(productId) {
    loadCartItems(); 
    
    let item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCartItems();
        updateCartCount();
        displayCartItems();
        displayCartProductsPage();
        displayCartDropdown();
    }
}

function decreaseQuantity(productId) {
    loadCartItems(); 
    
    let item = cartItems.find(item => item.id === productId);
    if (item) {
        if (item.quantity === 1) {
            
            cartItems = cartItems.filter(item => item.id !== productId);
            updateAddToCartButton(productId, false);
        } else {
            
            item.quantity -= 1;
        }
        saveCartItems(); 
        updateCartCount();
        displayCartItems();
        displayCartProductsPage(); 
        displayCartDropdown();
    }
}

function removeFromCart(productId) {
    loadCartItems(); 
    
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCartItems(); 
    updateCartCount();
    displayCartItems();
    displayCartProductsPage(); 
    displayCartDropdown();
    updateAddToCartButton(productId, false);
}

function updateAddToCartButton(productId, isInCart) {
    let addButtons = document.querySelectorAll('#addBtn');
    addButtons.forEach((button, index) => {
        if (products[index].id === productId) {
            if (isInCart) {
                button.textContent = 'Remove from Cart';
                button.className = 'btn btn-danger ml-2';
                button.replaceWith(button.cloneNode(true));
                let newButton = document.querySelectorAll('#addBtn')[index];
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    removeFromCart(productId);
                });
            } 
            else {
                button.textContent = 'Add to Cart';
                button.className = 'btn btn-primary ml-2';
                button.replaceWith(button.cloneNode(true));
                let newButton = document.querySelectorAll('#addBtn')[index];
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    addToCart(products[index]);
                });
            }
        }
    });
}

function initializeAllAddToCartButtons() {
    loadCartItems(); 
    let addButtons = document.querySelectorAll('#addBtn');
    addButtons.forEach((button, index) => {
        let product = products[index];
        let isInCart = cartItems.some(item => item.id === product.id);
        updateAddToCartButton(product.id, isInCart);
    });
}

function initializeCartCount() {
    loadCartItems(); 
    console.log('initializeCartCount - Cart items loaded:', cartItems);
    console.log('initializeCartCount - localStorage cartItems:', localStorage.getItem('cartItems'));
    updateCartCount();
}

initializeCartCount();
displayCartDropdown();
setTimeout(forceUpdateCartCount, 1000);

if (document.querySelector("#cartitems")) {
    displayCartItems();
    setTimeout(addCartButtonEventListeners, 100);
    addHeartEventListenersForFavorites();
    setTimeout(initializeAllAddToCartButtons, 200);
    
    setTimeout(() => {
        favorites.forEach(favItem => {
            updateHeartIcon(favItem.id);
        });
    }, 200);
}


if (document.querySelector("#favoritesContainer")) {
    addHeartEventListenersForFavorites();
}

function displayCartProductsPage() {
    let cartItemsContainer = document.querySelector("#cartItemsContainer");
    let totalPriceElement = document.querySelector("#totalPrice");
    
    if (!cartItemsContainer) return; 
    
    console.log('Cart items:', cartItems); 
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart empty-icon"></i>
                <div class="empty-title">Your Cart is Empty</div>
                <div class="empty-message">Add some items to get started!</div>
            </div>
        `;
        if (totalPriceElement) totalPriceElement.textContent = '0.00';
        return;
    }
    
    let totalPrice = 0;
    let cartItemsHTML = cartItems.map(item => {
        totalPrice += item.price * item.quantity;
        return `
            <div class="cart-item-card">
                <div class="cart-item-content">
                    <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-image" onerror="this.style.display='none'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.title}</div>
                        <div class="cart-item-category">Category: ${item.category}</div>
                        <div class="cart-item-price">Price: $${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="decreaseQuantity(${item.id})">
                                ${item.quantity === 1 ? '<i class="fas fa-trash"></i>' : '-'}
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    if (totalPriceElement) totalPriceElement.textContent = totalPrice.toFixed(2);
}

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function addToFavorites(product) {
    let existingItem = favorites.find(item => item.id === product.id);
    
    if (existingItem) {
        favorites = favorites.filter(item => item.id !== product.id);
        console.log('Removed from favorites:', product.title);
    } else {
        favorites.push(product);
        console.log('Added to favorites:', product.title);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Current favorites:', favorites); 
    
    displayFavoritesSlider();
    updateHeartIcon(product.id);
    addHeartEventListenersForFavorites();
}

function updateHeartIcon(productId) {
    let isFavorited = favorites.find(item => item.id === productId);
    
    
    let mainProductHearts = document.querySelectorAll('#products .fa-heart');
    mainProductHearts.forEach((heart, index) => {
        if (products[index].id === productId) {
            if (isFavorited) {
                heart.style.color = '#ff6b6b';
                heart.classList.add('favorited');
            } else {
                heart.style.color = '#ccc';
                heart.classList.remove('favorited');
            }
        }
    });
    
    
}

function displayFavoritesSlider() {
    let favoritesContainer = document.querySelector("#favoritesContainer");
    if (!favoritesContainer) return;
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart empty-icon" onclick="window.location.href='index.html'" style="cursor: pointer;" title="Go to products to add favorites"></i>
                <div class="empty-title">No Favorites Yet</div>
                <div class="empty-message">Start adding items to your favorites by clicking the heart icon!</div>
            </div>
        `;
        return;
    }
    let favoritesHTML = favorites.map(item => `
        <div class="product-card">
            <div class="card">
                <img class="card-img-top" src="${item.imageUrl}" style="height: 350px;">
                <div class="card-body d-flex flex-column text-center">
                    <h4 class="card-title">${item.title}</h4>
                    <p class="card-text"><strong>Price: $${item.price}</strong></p>
                    <div class="d-flex justify-content-center align-items-center">
                        <i class="fas fa-heart favorite-heart" data-product-id="${item.id}" title="Remove from favorites"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    favoritesContainer.innerHTML = favoritesHTML;
}

function removeFromFavoritesSlider(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Removed from favorites slider:', productId);
    
    displayFavoritesSlider();
    
    
    setTimeout(() => {
        addHeartEventListenersForFavorites();
    }, 100);
    
    updateHeartIcon(productId);
}

function addHeartEventListenersForFavorites() {
    let mainProductHearts = document.querySelectorAll('#products .fa-heart');
    mainProductHearts.forEach((heart, index) => {
        let newHeart = heart.cloneNode(true);
        heart.parentNode.replaceChild(newHeart, heart);
        
        newHeart.addEventListener('click', function(e) {
            e.preventDefault();
            addToFavorites(products[index]);
        });
    });
    
    let favoriteHearts = document.querySelectorAll('.favorite-heart');
    favoriteHearts.forEach((heart) => {
        let newHeart = heart.cloneNode(true);
        heart.parentNode.replaceChild(newHeart, heart);
        
        newHeart.addEventListener('click', function(e) {
            e.preventDefault();
            let productId = parseInt(newHeart.getAttribute('data-product-id'));
            removeFromFavoritesSlider(productId);
        });
    });
}

function updateAllHeartIcons() {
    let mainProductHearts = document.querySelectorAll('#products .fa-heart');
    mainProductHearts.forEach((heart, index) => {
        if (products[index]) {
            let productId = products[index].id;
            let isFavorited = favorites.find(item => item.id === productId);
            
            if (isFavorited) {
                heart.style.color = '#ff6b6b';
                heart.classList.add('favorited');
            } else {
                heart.style.color = '#ccc';
                heart.classList.remove('favorited');
            }
        }
    });
    
    let favoriteHearts = document.querySelectorAll('.favorite-heart');
    favoriteHearts.forEach((heart) => {
        heart.style.color = '#ff6b6b';
        heart.classList.add('favorited');
    });
}

function initializeCartProductsPage() {
    if (document.querySelector("#cartItemsContainer")) {
        loadCartItems(); 
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        console.log('Initializing cart products page...');
        console.log('Cart items from localStorage:', cartItems);
        console.log('Favorites from localStorage:', favorites);
        
        forceUpdateCartCount();
        setTimeout(forceUpdateCartCount, 100);
        setTimeout(forceUpdateCartCount, 500);
        
        displayCartProductsPage();
        displayCartDropdown();
        displayFavoritesSlider();
        updateAllHeartIcons();
        addHeartEventListenersForFavorites();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCartProductsPage);
} 
else {
    initializeCartProductsPage();
}

setTimeout(() => {
    if (document.querySelector("#cartItemsContainer")) {
        console.log('Late initialization attempt...');
        initializeCartProductsPage();
    }
}, 500);

window.addEventListener('load', function() {
    console.log('Window loaded, updating cart count...');
    initializeCartCount();
    initializeAllAddToCartButtons();
    
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    updateAllHeartIcons();
    addHeartEventListenersForFavorites();
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible, updating cart count...');
        initializeCartCount();
        initializeAllAddToCartButtons();
        
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        updateAllHeartIcons();
        addHeartEventListenersForFavorites();
    }
});

window.addEventListener('focus', function() {
    console.log('Window focused, updating cart count...');
    initializeCartCount();
    initializeAllAddToCartButtons();
    
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    updateAllHeartIcons();
    addHeartEventListenersForFavorites();
});