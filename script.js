let cart = [];
const foodData = [
    { id: 1, name: "Avocado Toast", category: "Veg", price: 299, rating: 4.8, img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&h=700&fit=crop" },
    { id: 2, name: "Spicy Beef Burger", category: "Non-Veg", price: 349, rating: 4.9, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop" },
    { id: 3, name: "Berry Smoothie Bowl", category: "Desserts", price: 249, rating: 4.7, img: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=500&h=800&fit=crop" },
    { id: 4, name: "Grilled Salmon", category: "Non-Veg", price: 599, rating: 4.9, img: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500&h=600&fit=crop" },
    { id: 5, name: "Matcha Latte", category: "Drinks", price: 149, rating: 5.0, img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1000&auto=format&fit=crop" },
    { id: 6, name: "Margherita Pizza", category: "Veg", price: 399, rating: 4.5, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop" },
    { id: 7, name: "Chocolate Lava Cake", category: "Desserts", price: 199, rating: 5.0, img: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=650&fit=crop" },
    { id: 8, name: "Iced Caramel Macchiato", category: "Drinks", price: 179, rating: 4.8, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=700&fit=crop" },
    { id: 9, name: "Caesar Salad", category: "Veg", price: 249, rating: 4.4, img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=550&fit=crop" },
    { id: 10, name: "Chicken Tikka", category: "Non-Veg", price: 379, rating: 4.8, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop" },
    { id: 11, name: "Adrak Chai", category: "Drinks", price: 20, rating: 4.8, img: "https://www.flavorsofmumbai.com/wp-content/uploads/2016/07/ginger-tea-recipe16.jpg?w=500&h=500&fit=crop" }
];

const grid = document.getElementById('masonryGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

let currentData = [...foodData];
let favorites = JSON.parse(localStorage.getItem('savor_favorites')) || [];


const savedTheme = localStorage.getItem('savor_theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon();

function renderSkeletons() {
    grid.innerHTML = Array(8).fill(
        `<div class="food-card skeleton glass">
            <div class="sk-img"></div>
            <div class="sk-text"></div>
            <div class="sk-text short"></div>
        </div>`
    ).join('');
}

function renderCards(data) {
    grid.innerHTML = '';
    
    if(data.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No dishes found.</p>';
        return;
    }

    data.forEach(item => {
        const isFav = favorites.includes(item.id);
        const card = document.createElement('div');
        card.className = 'food-card glass';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${item.id})">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <div class="overlay" onclick="openModal(${item.id})">
                    <button class="view-btn">View Details</button>
                </div>
            </div>
            <div class="card-info">
                <div class="card-title-row" onclick="openModal(${item.id})">
                    <h3 class="card-title">${item.name}</h3>
                    <span class="card-price">₹${item.price}</span>
                </div>
                <div class="card-meta" onclick="openModal(${item.id})">
                    <span class="category">${item.category}</span>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${item.rating}</span>
                </div>
                <button class="card-order-btn" onclick="addToCart(${item.id}); event.stopPropagation();">
                    <i class="fa-solid fa-shopping-bag"></i> Order Now
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleFavorite = (e, id) => {
    e.stopPropagation(); 
    const index = favorites.indexOf(id);
    let msg = "";
    
    if(index === -1) {
        favorites.push(id);
        msg = "Added to Favorites ❤️";
    } else {
        favorites.splice(index, 1);
        msg = "Removed from Favorites 💔";
    }
    
    localStorage.setItem('savor_favorites', JSON.stringify(favorites));
    renderCards(currentData); 
    showToast(msg);
};

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

const modal = document.getElementById('foodModal');
const closeBtn = document.querySelector('.close-btn');

window.openModal = (id) => {
    const item = foodData.find(f => f.id === id);
    if (!item) return;

    document.getElementById('modalImg').src = item.img;
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalCategory').textContent = item.category;
    document.getElementById('modalPrice').textContent = `₹${item.price}`;
    
    const modalOrderBtn = document.querySelector('.modal-info .order-btn');
    
    const newBtn = modalOrderBtn.cloneNode(true);
    modalOrderBtn.parentNode.replaceChild(newBtn, modalOrderBtn);
    
    newBtn.onclick = () => {
        addToCart(item.id);
        modal.classList.remove('active'); 
    };
    
    modal.classList.add('active');
};

closeBtn.onclick = () => modal.classList.remove('active');
window.onclick = (e) => { if(e.target === modal) modal.classList.remove('active'); }

function updateView() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const sortValue = sortSelect.value;

    currentData = foodData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        
        if (activeFilter === 'Favs') {
            return matchesSearch && favorites.includes(item.id);
        } else {
            const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
            return matchesSearch && matchesFilter;
        }
    });

    if (sortValue === 'price-low') {
        currentData.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        currentData.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'rating') {
        currentData.sort((a, b) => b.rating - a.rating);
    }

    renderCards(currentData);
}

searchInput.addEventListener('input', updateView);
sortSelect.addEventListener('change', updateView);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateView();
    });
});

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('savor_theme', newTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if(htmlEl.getAttribute('data-theme') === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}
renderSkeletons();
setTimeout(() => {
    renderCards(currentData);
}, 1000); 

function addToCart(id) {
    const item = foodData.find(f => f.id === id);
    cart.push(item);
    updateCartUI();
    showToast(`${item.name} added to cart! 🛒`);
}

function updateCartUI() {
    const cartList = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
    
    cartList.innerHTML = cart.map((item, index) => `
        <div class="bill-row">
            <span>${item.name}</span>
            <span>₹${item.price} 
                <i class="fa-solid fa-trash" style="margin-left:10px; cursor:pointer; color:#ff385c" onclick="removeFromCart(${index})"></i>
            </span>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('gstAmount').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('totalBill').textContent = `₹${total.toFixed(2)}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');

if(cartToggle) {
    cartToggle.onclick = () => cartSidebar.classList.add('active');
}
if(closeCart) {
    closeCart.onclick = () => cartSidebar.classList.remove('active');
}
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');

    if (cartToggle) {
        cartToggle.onclick = (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            console.log("Cart opened!");
        };
    }

    if (closeCart) {
        closeCart.onclick = () => {
            cartSidebar.classList.remove('active');
        };
    }
});

const resForm = document.getElementById('reservationForm');

if (resForm) {
    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = resForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = "Confirming...";
        btn.disabled = true;

        setTimeout(() => {
            showToast("Table Reserved Successfully! 🥂");
            btn.textContent = originalText;
            btn.disabled = false;
            resForm.reset();
        }, 1500);
    });
}
function openPaymentGateway() {
    if (cart.length === 0) {
        showToast("Cart is empty! Add items first 🛒");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const paymentModal = document.getElementById('paymentModal');
    document.getElementById('paymentTotal').textContent = `₹${total.toFixed(2)}`;
    paymentModal.classList.add('active');
    
    cartSidebar.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = openPaymentGateway;
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = paymentForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = "Processing Payment...";
            btn.disabled = true;

            setTimeout(() => {
                document.getElementById('paymentModal').classList.remove('active');
                showToast("Payment Successful! 🎉 Order Placed!");
                
                cart = [];
                updateCartUI();
                
                btn.textContent = originalText;
                btn.disabled = false;
                paymentForm.reset();
            }, 2500);
        });
    }

    const closePayment = document.querySelector('.close-payment');
    if (closePayment) {
        closePayment.onclick = () => {
            document.getElementById('paymentModal').classList.remove('active');
        };
    }
});