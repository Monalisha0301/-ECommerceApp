
const API_URL = "http://localhost:8080/api";

let products = [];
let cart = [];
let token = localStorage.getItem("token");


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    updateLoginStatus();

    if (token) {
        loadProducts();
    } else {
        document.getElementById("loading").style.display = "none";

        document.getElementById("productsContainer").innerHTML =
            "<p class='login-required'>Please login to view products.</p>";
    }

});


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    const loading = document.getElementById("loading");
    const productContainer =
        document.getElementById("productsContainer");

    loading.style.display = "block";

    try {

        const response = await fetch(
            `${API_URL}/products`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        loading.style.display = "none";

        displayProducts(products);

    } catch (error) {

        console.log(error);

        loading.style.display = "none";

        productContainer.innerHTML =
            "<p class='login-required'>Please login to view products.</p>";
    }
}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(productList) {

    const productContainer =
        document.getElementById("productsContainer");

    const noProducts =
        document.getElementById("noProducts");

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        noProducts.style.display = "block";

        return;
    }

    noProducts.style.display = "none";


    productList.forEach(function (product) {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">
                🛍️
            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    ₹${product.price}
                </p>

                <div class="product-actions">

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})">

                        Add to Cart

                    </button>

                    <button
                        class="delete-product"
                        onclick="deleteProduct(${product.id})">

                        Delete

                    </button>

                </div>

            </div>
        `;


        productContainer.appendChild(card);

    });

}


// ========================================
// REGISTER
// ========================================

async function register() {

    const username =
        document.getElementById("registerUsername").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const role =
        document.getElementById("registerRole").value;


    if (!username || !password) {

        document.getElementById("registerMessage").innerText =
            "Please enter username and password.";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role
                })
            }
        );


        const result = await response.text();


        if (!response.ok) {

            document.getElementById("registerMessage").innerText =
                result;

            return;
        }


        document.getElementById("registerMessage").innerText =
            "Registration successful! Please login.";


        document.getElementById("registerUsername").value = "";
        document.getElementById("registerPassword").value = "";


        setTimeout(function () {
            showLogin();
        }, 1000);


    } catch (error) {

        console.log(error);

        document.getElementById("registerMessage").innerText =
            "Server error. Is Spring Boot running?";
    }

}


// ========================================
// LOGIN
// ========================================

async function login() {

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();


    if (!username || !password) {

        document.getElementById("loginMessage").innerText =
            "Please enter username and password.";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );


        if (!response.ok) {

            document.getElementById("loginMessage").innerText =
                "Invalid username or password.";

            return;
        }


        const data = await response.json();


        // Backend must return:
        // { "token": "JWT_TOKEN" }

        token = data.token;

        localStorage.setItem("token", token);


        document.getElementById("loginMessage").innerText =
            "Login successful!";


        updateLoginStatus();


        setTimeout(function () {

            closeAuth();

            loadProducts();

        }, 700);


    } catch (error) {

        console.log(error);

        document.getElementById("loginMessage").innerText =
            "Server error. Is Spring Boot running?";
    }

}


// ========================================
// ADD PRODUCT - ADMIN
// ========================================

async function addProduct() {

    const name =
        document.getElementById("adminProductName").value;

    const price =
        document.getElementById("adminProductPrice").value;

    const category =
        document.getElementById("adminProductCategory").value;

    const message =
        document.getElementById("adminMessage");

    if (!name || !price || !category) {
        message.innerText = "Please fill all fields.";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        message.innerText = "Please login first.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/products",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    name: name,
                    price: Number(price),
                    category: category
                })
            }
        );

        if (response.ok) {

            const data = await response.json();

            console.log("Product added:", data);

            message.innerText =
                "Product added successfully!";

            document.getElementById("adminProductName").value = "";
            document.getElementById("adminProductPrice").value = "";
            document.getElementById("adminProductCategory").value = "";

            loadProducts();

        } else {

            const error = await response.text();

            console.log("Server error:", error);

            message.innerText =
                "Error adding product: " + response.status;
        }

    } catch (error) {

        console.error("Error:", error);

        message.innerText =
            "Cannot connect to backend.";
    }
}


// ========================================
// DELETE PRODUCT - ADMIN
// ========================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm("Do you want to delete this product?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/products/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            alert("You are not authorized to delete products.");

            return;
        }


        alert("Product deleted successfully!");


        loadProducts();


    } catch (error) {

        console.log(error);

        alert("Error deleting product.");
    }

}


// ========================================
// ADD TO CART
// ========================================

function addToCart(id) {

    const product =
        products.find(function (p) {
            return p.id === id;
        });


    if (!product) {
        return;
    }


    cart.push(product);


    updateCartCount();


    alert(`${product.name} added to cart`);

}


// ========================================
// CART COUNT
// ========================================

function updateCartCount() {

    document.getElementById("cartCount").innerText =
        cart.length;

}


// ========================================
// OPEN CART
// ========================================

function openCart() {

    const cartModal =
        document.getElementById("cartModal");

    cartModal.style.display = "flex";

    displayCart();

}


// ========================================
// CLOSE CART
// ========================================

function closeCart() {

    document.getElementById("cartModal").style.display =
        "none";

}


// ========================================
// DISPLAY CART
// ========================================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">
                Your cart is empty.
            </p>`;

        cartTotal.innerText = "₹0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(function (product, index) {

        total += Number(product.price);


        const item = document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-icon">
                    🛍️
                </div>

                <div>

                    <strong>
                        ${product.name}
                    </strong>

                    <p>
                        ₹${product.price}
                    </p>

                </div>

            </div>


            <button
                onclick="removeFromCart(${index})">

                Remove

            </button>

        `;


        cartItems.appendChild(item);

    });


    cartTotal.innerText =
        `₹${total}`;

}


// ========================================
// REMOVE FROM CART
// ========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartCount();

    displayCart();

}


// ========================================
// CHECKOUT
// ========================================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    alert("Order placed successfully!");


    cart = [];

    updateCartCount();

    displayCart();

}


// ========================================
// SEARCH PRODUCTS
// ========================================

function searchProducts() {

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    const filtered =
        products.filter(function (product) {

            return product.name
                .toLowerCase()
                .includes(search);

        });


    displayProducts(filtered);

}


// ========================================
// CATEGORY FILTER
// ========================================

function filterCategory(category) {

    const buttons =
        document.querySelectorAll(".category");


    buttons.forEach(function (button) {
        button.classList.remove("active");
    });


    event.currentTarget.classList.add("active");


    if (category === "All") {

        displayProducts(products);

        return;
    }


    const filtered =
        products.filter(function (product) {

            return product.category
                .toLowerCase() === category.toLowerCase();

        });


    displayProducts(filtered);

}


// ========================================
// AUTH MODAL
// ========================================

function openAuth(type) {

    document.getElementById("authModal").style.display =
        "flex";


    if (type === "register") {
        showRegister();
    } else {
        showLogin();
    }

}


// ========================================
// CLOSE AUTH
// ========================================

function closeAuth() {

    document.getElementById("authModal").style.display =
        "none";

}


// ========================================
// SHOW LOGIN
// ========================================

function showLogin() {

    document.getElementById("loginForm").style.display =
        "block";

    document.getElementById("registerForm").style.display =
        "none";

}


// ========================================
// SHOW REGISTER
// ========================================

function showRegister() {

    document.getElementById("loginForm").style.display =
        "none";

    document.getElementById("registerForm").style.display =
        "block";

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");

    token = null;

    products = [];

    cart = [];


    updateCartCount();

    updateLoginStatus();


    document.getElementById("productsContainer").innerHTML =
        "<p class='login-required'>Please login to view products.</p>";


    document.getElementById("adminPanel").style.display =
        "none";


    alert("Logged out successfully");

}


// ========================================
// LOGIN STATUS
// ========================================

function updateLoginStatus() {

    const loginButton =
        document.getElementById("loginBtn");

    const logoutButton =
        document.getElementById("logoutBtn");

    const adminPanel =
        document.getElementById("adminPanel");


    if (token) {

        loginButton.style.display = "none";

        logoutButton.style.display = "block";

        /*
         * For now, admin panel is shown after login.
         * Your Spring Security backend still controls
         * whether POST/DELETE is actually allowed.
         */
        adminPanel.style.display = "block";

    } else {

        loginButton.style.display = "block";

        logoutButton.style.display = "none";

        adminPanel.style.display = "none";
    }

}


// ========================================
// SCROLL TO PRODUCTS
// ========================================

function scrollToProducts() {

    document.getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}

