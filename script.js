// Shopping cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Add event listeners to all Add to Cart buttons on product page
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            const productPrice = parseFloat(productCard.dataset.productPrice);
            
            addToCart(productId, productName, productPrice, 1);
            showToast(`${productName} added to cart!`);
        });
    });
    
    // Add event listeners to all Service Add to Cart buttons
    const availButtons = document.querySelectorAll('.avail-btn');
    availButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.dataset.id;
            const serviceName = this.dataset.name;
            const servicePrice = parseFloat(this.dataset.price);
            
            addToCart(serviceId, serviceName, servicePrice, 1, true);
            showToast(`${serviceName} added to cart!`);
        });
    });
    
    // Buy Now button functionality
    const buyNowButtons = document.querySelectorAll('.buy-btn');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            const productPrice = parseFloat(productCard.dataset.productPrice);
            
            addToCart(productId, productName, productPrice, 1);
            // Redirect to cart page
            window.location.href = 'cart.html';
        });
    });
    
    // Function to add items to cart
    function addToCart(id, name, price, quantity, isService = false) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === id);
        
        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Item doesn't exist, add new item
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity,
                isService: isService
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Function to update cart count display
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Function to show toast notification
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        
        // Create toast if container exists
        if (toastContainer) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            toastContainer.appendChild(toast);
            
            // Show the toast
            toast.style.display = 'block';
            
            // Hide and remove toast after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    toastContainer.removeChild(toast);
                }, 300);
            }, 3000);
        }
    }
});

// Cart page functionality (will execute when on cart.html)
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        
        // Add event listener for remove buttons (delegated)
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('remove-item')) {
                const itemId = e.target.dataset.id;
                removeFromCart(itemId);
            }
        });
        
        // Add event listener for quantity changes (delegated)
        document.addEventListener('change', function(e) {
            if (e.target && e.target.classList.contains('item-quantity')) {
                const itemId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                updateQuantity(itemId, newQuantity);
            }
        });
    }
    
    function displayCart() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty</p>';
            document.getElementById('cart-total').textContent = '₱0.00';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <p>${item.isService ? 'Service' : 'Product'}</p>
                </div>
                <div class="item-price">₱${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <input type="number" min="1" value="${item.quantity}" class="item-quantity" data-id="${item.id}">
                </div>
                <div class="item-total">₱${itemTotal.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
            `;
        });
        
        cartContainer.innerHTML = cartHTML;
        document.getElementById('cart-total').textContent = `₱${total.toFixed(2)}`;
    }
    
    function removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
    
    function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) return;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }
    
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
});

        // Additional cart-specific functions
        document.addEventListener('DOMContentLoaded', function() {
            // Empty cart button functionality
            const emptyCartBtn = document.getElementById('empty-cart');
            if (emptyCartBtn) {
                emptyCartBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to empty your cart?')) {
                        localStorage.removeItem('cart');
                        document.getElementById('cart-items').innerHTML = '<p>Your cart is empty</p>';
                        document.getElementById('cart-total').textContent = '₱0.00';
                        document.getElementById('cart-count').textContent = '0';
                    }
                });
            }
            
            // Checkout button functionality
            const checkoutBtn = document.getElementById('checkout');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', function() {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    if (cart.length === 0) {
                        alert('Your cart is empty!');
                        return;
                    }
                    alert('Thank you for your order! This is where the checkout process would begin.');
                    // In a real application, this would redirect to a checkout page
                });
            }
        });
// Get elements by ID
// Select elements
const hamburgerButton = document.getElementById('hamburger-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

// Function to toggle the mobile menu
function toggleMenu() {
    // Toggle the 'active' class on the mobile menu and hamburger button
    mobileMenu.classList.toggle('active');
    hamburgerButton.classList.toggle('active');
    closeMenu.classList.toggle('active');
}

// Event listener for hamburger button
hamburgerButton.addEventListener('click', toggleMenu);

// Event listener for close button
closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburgerButton.classList.remove('active');
    closeMenu.classList.remove('active');
});


        