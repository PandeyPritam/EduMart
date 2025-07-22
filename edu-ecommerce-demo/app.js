// Educational eCommerce Website JavaScript
class EduMart {
  constructor() {
    this.currentUser = null;
    this.currentPage = 'home';
    this.cart = [];
    this.products = [];
    this.users = [];
    this.orders = [];
    this.categories = [];
    
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.renderNavigation();
    this.showPage('home');
    this.checkAuthStatus();
  }

  // Data Management
  loadData() {
    const data = {
      "products": [
        {
          "id": 1,
          "title": "Complete Web Development Course",
          "description": "Master HTML, CSS, JavaScript, PHP, and MySQL with hands-on projects",
          "price": 2499,
          "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
          "category": "Web Development",
          "rating": 4.8,
          "reviews": 156
        },
        {
          "id": 2,
          "title": "Data Structures & Algorithms PDF",
          "description": "Comprehensive guide to DSA with examples in multiple programming languages",
          "price": 799,
          "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
          "category": "Computer Science",
          "rating": 4.6,
          "reviews": 89
        },
        {
          "id": 3,
          "title": "Digital Marketing Masterclass",
          "description": "Learn SEO, Social Media Marketing, PPC, and Analytics",
          "price": 1999,
          "image": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400",
          "category": "Marketing",
          "rating": 4.7,
          "reviews": 234
        },
        {
          "id": 4,
          "title": "Python Programming eBook",
          "description": "From basics to advanced Python concepts with practical examples",
          "price": 599,
          "image": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
          "category": "Programming",
          "rating": 4.9,
          "reviews": 312
        },
        {
          "id": 5,
          "title": "Graphic Design Fundamentals",
          "description": "Master Adobe Creative Suite and design principles",
          "price": 1799,
          "image": "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400",
          "category": "Design",
          "rating": 4.5,
          "reviews": 178
        },
        {
          "id": 6,
          "title": "Machine Learning Course",
          "description": "Complete ML course with Python, TensorFlow, and real projects",
          "price": 3499,
          "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
          "category": "AI/ML",
          "rating": 4.8,
          "reviews": 267
        },
        {
          "id": 7,
          "title": "Business Analytics PDF Guide",
          "description": "Learn data analysis, visualization, and business intelligence",
          "price": 899,
          "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
          "category": "Business",
          "rating": 4.4,
          "reviews": 145
        },
        {
          "id": 8,
          "title": "Mobile App Development",
          "description": "Build iOS and Android apps using React Native and Flutter",
          "price": 2799,
          "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
          "category": "Mobile Development",
          "rating": 4.7,
          "reviews": 198
        }
      ],
      "users": [
        {
          "id": 1,
          "name": "Admin User",
          "email": "admin@edumart.com",
          "role": "admin"
        },
        {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com",
          "role": "user"
        },
        {
          "id": 3,
          "name": "Jane Smith",
          "email": "jane@example.com", 
          "role": "user"
        }
      ],
      "categories": [
        "Web Development",
        "Computer Science", 
        "Marketing",
        "Programming",
        "Design",
        "AI/ML",
        "Business",
        "Mobile Development"
      ],
      "orders": [
        {
          "id": 1,
          "userId": 2,
          "items": [{"productId": 1, "quantity": 1, "price": 2499}],
          "total": 2499,
          "status": "completed",
          "date": "2025-07-20"
        },
        {
          "id": 2,
          "userId": 3,
          "items": [{"productId": 4, "quantity": 1, "price": 599}, {"productId": 2, "quantity": 1, "price": 799}],
          "total": 1398,
          "status": "completed", 
          "date": "2025-07-19"
        }
      ]
    };

    this.products = data.products;
    this.users = data.users;
    this.categories = data.categories;
    this.orders = data.orders;

    // Load cart from localStorage
    const savedCart = localStorage.getItem('edumart_cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation
    document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
    document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    document.getElementById('exploreBtn').addEventListener('click', () => this.showPage('products'));

    // Login modal
    document.getElementById('loginSubmit').addEventListener('click', () => this.handleLogin());
    document.getElementById('quickAdmin').addEventListener('click', () => this.quickLogin('admin'));
    document.getElementById('quickUser').addEventListener('click', () => this.quickLogin('user'));

    // Product search and filter
    document.getElementById('productSearch').addEventListener('input', (e) => this.filterProducts());
    document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterProducts());

    // Cart
    document.getElementById('checkoutBtn').addEventListener('click', () => this.showPage('checkout'));

    // Admin tabs
    document.getElementById('admin-tabs').addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-admin-tab')) {
        this.showAdminTab(e.target.getAttribute('data-admin-tab'));
      }
    });

    // Modal close on background click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
      }
    });
  }

  // Authentication
  showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
  }

  handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const role = document.querySelector('input[name="loginRole"]:checked').value;
    
    if (!email) {
      this.showToast('Please enter an email', 'error');
      return;
    }

    // Find or create user
    let user = this.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: this.users.length + 1,
        name: email.split('@')[0],
        email: email,
        role: role
      };
      this.users.push(user);
    }

    this.currentUser = user;
    localStorage.setItem('edumart_user', JSON.stringify(user));
    
    document.getElementById('loginModal').classList.add('hidden');
    this.renderNavigation();
    this.showToast(`Welcome, ${user.name}!`, 'success');
    
    if (user.role === 'admin') {
      this.showPage('admin');
    } else {
      this.showPage('home');
    }
  }

  quickLogin(role) {
    const user = this.users.find(u => u.role === role);
    this.currentUser = user;
    localStorage.setItem('edumart_user', JSON.stringify(user));
    
    document.getElementById('loginModal').classList.add('hidden');
    this.renderNavigation();
    this.showToast(`Welcome, ${user.name}!`, 'success');
    
    if (role === 'admin') {
      this.showPage('admin');
    } else {
      this.showPage('home');
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('edumart_user');
    this.renderNavigation();
    this.showPage('home');
    this.showToast('Logged out successfully', 'success');
  }

  checkAuthStatus() {
    const savedUser = localStorage.getItem('edumart_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.renderNavigation();
    }
  }

  // Navigation
  renderNavigation() {
    const navLinks = document.getElementById('nav-links');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (this.currentUser) {
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      
      if (this.currentUser.role === 'admin') {
        navLinks.innerHTML = `
          <li><a href="#" onclick="app.showPage('home')" class="hover:text-[var(--color-primary)]">Home</a></li>
          <li><a href="#" onclick="app.showPage('admin')" class="hover:text-[var(--color-primary)]">Dashboard</a></li>
        `;
      } else {
        navLinks.innerHTML = `
          <li><a href="#" onclick="app.showPage('home')" class="hover:text-[var(--color-primary)]">Home</a></li>
          <li><a href="#" onclick="app.showPage('products')" class="hover:text-[var(--color-primary)]">Products</a></li>
          <li><a href="#" onclick="app.showPage('cart')" class="hover:text-[var(--color-primary)] flex items-center gap-1">
            Cart <span class="bg-[var(--color-primary)] text-[var(--color-btn-primary-text)] rounded-full px-2 py-1 text-xs">${this.cart.length}</span>
          </a></li>
          <li><a href="#" onclick="app.showPage('orders')" class="hover:text-[var(--color-primary)]">Orders</a></li>
          <li><a href="#" onclick="app.showPage('profile')" class="hover:text-[var(--color-primary)]">Profile</a></li>
        `;
      }
    } else {
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      navLinks.innerHTML = `
        <li><a href="#" onclick="app.showPage('home')" class="hover:text-[var(--color-primary)]">Home</a></li>
        <li><a href="#" onclick="app.showPage('products')" class="hover:text-[var(--color-primary)]">Products</a></li>
      `;
    }
  }

  // Page Management
  showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    const pageElement = document.getElementById(`${page}-section`);
    if (pageElement) {
      pageElement.classList.remove('hidden');
      this.currentPage = page;
    }

    // Render page content
    switch(page) {
      case 'home':
        this.renderHome();
        break;
      case 'products':
        this.renderProducts();
        break;
      case 'cart':
        this.renderCart();
        break;
      case 'checkout':
        this.renderCheckout();
        break;
      case 'orders':
        this.renderOrders();
        break;
      case 'profile':
        this.renderProfile();
        break;
      case 'admin':
        if (this.currentUser?.role === 'admin') {
          this.renderAdmin();
        } else {
          this.showPage('home');
          this.showToast('Access denied', 'error');
        }
        break;
    }
  }

  // Home Page
  renderHome() {
    const featuredGrid = document.getElementById('featured-grid');
    const featuredProducts = this.products.slice(0, 6);
    
    featuredGrid.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
  }

  // Products Page
  renderProducts() {
    this.populateCategoryFilter();
    this.displayProducts(this.products);
  }

  populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
      this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filtered = this.products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                           product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    
    this.displayProducts(filtered);
  }

  displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');
  }

  createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="product-image" />
        <div class="product-info">
          <div class="category-badge">${product.category}</div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span>${product.rating} (${product.reviews} reviews)</span>
          </div>
          <div class="product-price">₹${product.price}</div>
          <div class="flex gap-8">
            <button onclick="app.showProductDetail(${product.id})" class="btn btn--outline btn--sm flex-1">
              View Details
            </button>
            ${this.currentUser && this.currentUser.role === 'user' ? 
              `<button onclick="app.addToCart(${product.id})" class="btn btn--primary btn--sm flex-1">
                Add to Cart
              </button>` : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  // Product Detail Modal
  showProductDetail(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productDetailModal');
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    modal.innerHTML = `
      <div class="modal__content card w-full max-w-2xl">
        <div class="card__body">
          <div class="flex justify-between items-start mb-16">
            <h3 class="text-2xl font-semibold">${product.title}</h3>
            <button onclick="this.parentElement.parentElement.parentElement.parentElement.classList.add('hidden')" 
                    class="btn btn--outline btn--sm">×</button>
          </div>
          <div class="grid md:grid-cols-2 gap-16">
            <img src="${product.image}" alt="${product.title}" class="w-full rounded-lg" />
            <div>
              <div class="category-badge mb-8">${product.category}</div>
              <p class="text-[var(--color-text-secondary)] mb-16">${product.description}</p>
              <div class="product-rating mb-16">
                <span class="stars">${stars}</span>
                <span>${product.rating} (${product.reviews} reviews)</span>
              </div>
              <div class="text-2xl font-bold text-[var(--color-primary)] mb-16">₹${product.price}</div>
              ${this.currentUser && this.currentUser.role === 'user' ? 
                `<button onclick="app.addToCart(${product.id}); this.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('hidden')" 
                         class="btn btn--primary btn--full-width">
                  Add to Cart
                </button>` : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
    
    modal.classList.remove('hidden');
  }

  // Cart Management
  addToCart(productId) {
    if (!this.currentUser || this.currentUser.role !== 'user') {
      this.showToast('Please login as user to add items to cart', 'error');
      return;
    }

    const existingItem = this.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ productId, quantity: 1 });
    }
    
    this.saveCart();
    this.renderNavigation();
    this.showToast('Item added to cart', 'success');
  }

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.renderCart();
        this.renderNavigation();
      }
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.saveCart();
    this.renderCart();
    this.renderNavigation();
    this.showToast('Item removed from cart', 'success');
  }

  saveCart() {
    localStorage.setItem('edumart_cart', JSON.stringify(this.cart));
  }

  renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotal = document.getElementById('cart-total');

    if (this.cart.length === 0) {
      cartEmpty.classList.remove('hidden');
      cartSummary.classList.add('hidden');
      cartItems.innerHTML = '';
      return;
    }

    cartEmpty.classList.add('hidden');
    cartSummary.classList.remove('hidden');

    let total = 0;
    cartItems.innerHTML = this.cart.map(item => {
      const product = this.products.find(p => p.id === item.productId);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.title}" class="cart-item-image" />
          <div class="cart-item-info">
            <h4>${product.title}</h4>
            <div class="cart-item-price">₹${product.price}</div>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="app.updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" class="quantity-input" 
                   onchange="app.updateCartQuantity(${item.productId}, parseInt(this.value))" />
            <button class="quantity-btn" onclick="app.updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
          </div>
          <button onclick="app.removeFromCart(${item.productId})" class="btn btn--outline btn--sm">Remove</button>
        </div>
      `;
    }).join('');

    cartTotal.textContent = `₹${total}`;
  }

  // Checkout Process
  renderCheckout() {
    if (this.cart.length === 0) {
      this.showPage('cart');
      this.showToast('Your cart is empty', 'error');
      return;
    }

    const checkoutSteps = document.getElementById('checkout-steps');
    let total = 0;
    
    this.cart.forEach(item => {
      const product = this.products.find(p => p.id === item.productId);
      total += product.price * item.quantity;
    });

    checkoutSteps.innerHTML = `
      <div class="checkout-step active">
        <div class="step-header">
          <div class="step-number">1</div>
          <div class="step-title">Order Summary</div>
        </div>
        <div class="flex flex-col gap-8">
          ${this.cart.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            return `
              <div class="flex justify-between items-center">
                <span>${product.title} × ${item.quantity}</span>
                <span class="font-semibold">₹${product.price * item.quantity}</span>
              </div>
            `;
          }).join('')}
          <div class="border-t pt-8 flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹${total}</span>
          </div>
        </div>
      </div>
      
      <div class="checkout-step">
        <div class="step-header">
          <div class="step-number">2</div>
          <div class="step-title">Payment Method</div>
        </div>
        <div class="payment-methods">
          <div class="payment-method selected" onclick="this.parentElement.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected')); this.classList.add('selected')">
            <span>💳</span>
            <span>Credit/Debit Card</span>
          </div>
          <div class="payment-method" onclick="this.parentElement.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected')); this.classList.add('selected')">
            <span>🏦</span>
            <span>Net Banking</span>
          </div>
          <div class="payment-method" onclick="this.parentElement.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected')); this.classList.add('selected')">
            <span>📱</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
      
      <div class="checkout-step">
        <div class="step-header">
          <div class="step-number">3</div>
          <div class="step-title">Complete Payment</div>
        </div>
        <button onclick="app.processPayment(${total})" class="btn btn--primary btn--lg btn--full-width">
          Pay ₹${total} - Razorpay Simulation
        </button>
      </div>
    `;
  }

  processPayment(total) {
    // Simulate payment processing
    this.showToast('Processing payment...', 'info');
    
    setTimeout(() => {
      // Create order
      const order = {
        id: this.orders.length + 1,
        userId: this.currentUser.id,
        items: this.cart.map(item => {
          const product = this.products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          };
        }),
        total: total,
        status: 'completed',
        date: new Date().toISOString().split('T')[0]
      };
      
      this.orders.push(order);
      this.cart = [];
      this.saveCart();
      this.renderNavigation();
      
      this.showToast('Payment successful! Order placed.', 'success');
      this.showPage('orders');
    }, 2000);
  }

  // Orders Page
  renderOrders() {
    const ordersList = document.getElementById('orders-list');
    const userOrders = this.orders.filter(order => order.userId === this.currentUser?.id);
    
    if (userOrders.length === 0) {
      ordersList.innerHTML = '<div class="status status--info">No orders found.</div>';
      return;
    }

    ordersList.innerHTML = userOrders.map(order => `
      <div class="card">
        <div class="card__body">
          <div class="flex justify-between items-start mb-16">
            <div>
              <h4 class="font-semibold">Order #${order.id}</h4>
              <p class="text-[var(--color-text-secondary)]">${order.date}</p>
            </div>
            <span class="status-${order.status}">${order.status}</span>
          </div>
          <div class="flex flex-col gap-8">
            ${order.items.map(item => {
              const product = this.products.find(p => p.id === item.productId);
              return `
                <div class="flex justify-between">
                  <span>${product.title} × ${item.quantity}</span>
                  <span>₹${item.price * item.quantity}</span>
                </div>
              `;
            }).join('')}
            <div class="border-t pt-8 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹${order.total}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Profile Page
  renderProfile() {
    const profileInfo = document.querySelector('#profile-info .card__body');
    profileInfo.innerHTML = `
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" value="${this.currentUser.name}" readonly />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" value="${this.currentUser.email}" readonly />
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <input type="text" class="form-control" value="${this.currentUser.role}" readonly />
      </div>
    `;
  }

  // Admin Dashboard
  renderAdmin() {
    this.showAdminTab('dashboard');
  }

  showAdminTab(tab) {
    // Update tab buttons
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-admin-tab="${tab}"]`).classList.add('active');

    // Hide all admin pages
    document.querySelectorAll('.admin-page').forEach(page => {
      page.classList.add('hidden');
    });

    // Show selected admin page
    document.getElementById(`admin-${tab}`).classList.remove('hidden');

    // Render content
    switch(tab) {
      case 'dashboard':
        this.renderAdminDashboard();
        break;
      case 'products':
        this.renderAdminProducts();
        break;
      case 'users':
        this.renderAdminUsers();
        break;
      case 'orders':
        this.renderAdminOrders();
        break;
      case 'analytics':
        this.renderAdminAnalytics();
        break;
    }
  }

  renderAdminDashboard() {
    const dashboard = document.getElementById('admin-dashboard');
    dashboard.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div class="admin-stat-card">
          <div class="admin-stat-number">${this.products.length}</div>
          <div class="admin-stat-label">Total Products</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-number">${this.users.filter(u => u.role === 'user').length}</div>
          <div class="admin-stat-label">Total Users</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-number">${this.orders.length}</div>
          <div class="admin-stat-label">Total Orders</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-number">₹${this.orders.reduce((sum, order) => sum + order.total, 0)}</div>
          <div class="admin-stat-label">Total Revenue</div>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-16 mt-16">
        <div class="card">
          <div class="card__body">
            <h4 class="font-semibold mb-16">Recent Orders</h4>
            ${this.orders.slice(-3).map(order => {
              const user = this.users.find(u => u.id === order.userId);
              return `
                <div class="flex justify-between items-center py-8 border-b border-[var(--color-border)] last:border-b-0">
                  <div>
                    <div class="font-medium">Order #${order.id}</div>
                    <div class="text-sm text-[var(--color-text-secondary)]">${user.name}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold">₹${order.total}</div>
                    <div class="status-${order.status}">${order.status}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <h4 class="font-semibold mb-16">Popular Categories</h4>
            ${this.categories.slice(0, 5).map(category => {
              const count = this.products.filter(p => p.category === category).length;
              return `
                <div class="flex justify-between items-center py-4">
                  <span>${category}</span>
                  <span class="font-semibold">${count} products</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderAdminProducts() {
    const table = document.getElementById('admin-products-table');
    table.innerHTML = `
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.products.map(product => `
              <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.category}</td>
                <td>₹${product.price}</td>
                <td>${product.rating}</td>
                <td>
                  <button onclick="app.editProduct(${product.id})" class="btn btn--outline btn--sm mr-2">Edit</button>
                  <button onclick="app.deleteProduct(${product.id})" class="btn btn--outline btn--sm">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add product button functionality
    document.getElementById('addProductBtn').onclick = () => this.showAddProductModal();
  }

  renderAdminUsers() {
    const table = document.getElementById('admin-users-table');
    table.innerHTML = `
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            ${this.users.map(user => {
              const userOrders = this.orders.filter(o => o.userId === user.id).length;
              return `
                <tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.role}</td>
                  <td>${userOrders}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderAdminOrders() {
    const table = document.getElementById('admin-orders-table');
    table.innerHTML = `
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${this.orders.map(order => {
              const user = this.users.find(u => u.id === order.userId);
              return `
                <tr>
                  <td>#${order.id}</td>
                  <td>${user.name}</td>
                  <td>${order.items.length} items</td>
                  <td>₹${order.total}</td>
                  <td><span class="status-${order.status}">${order.status}</span></td>
                  <td>${order.date}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderAdminAnalytics() {
    // Create sales chart
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Sample data for the last 7 days
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString());
      data.push(Math.floor(Math.random() * 10000) + 5000); // Random sales data
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Sales (₹)',
          data: data,
          borderColor: 'rgb(33, 128, 141)',
          backgroundColor: 'rgba(33, 128, 141, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales Analytics - Last 7 Days'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Product Management
  showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.innerHTML = `
      <div class="modal__content card w-full max-w-lg">
        <div class="card__body">
          <h3 class="text-xl font-semibold mb-16">Add New Product</h3>
          <form id="addProductForm" class="flex flex-col gap-16">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" id="productTitle" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="productDescription" class="form-control" rows="3" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price (₹)</label>
                <input type="number" id="productPrice" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="productCategory" class="form-control" required>
                  <option value="">Select Category</option>
                  ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input type="url" id="productImage" class="form-control" required />
            </div>
            <div class="flex gap-8">
              <button type="submit" class="btn btn--primary flex-1">Add Product</button>
              <button type="button" onclick="this.closest('.modal').classList.add('hidden')" class="btn btn--outline flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    modal.classList.remove('hidden');
    
    document.getElementById('addProductForm').onsubmit = (e) => {
      e.preventDefault();
      this.addProduct();
    };
  }

  addProduct() {
    const newProduct = {
      id: Math.max(...this.products.map(p => p.id)) + 1,
      title: document.getElementById('productTitle').value,
      description: document.getElementById('productDescription').value,
      price: parseInt(document.getElementById('productPrice').value),
      category: document.getElementById('productCategory').value,
      image: document.getElementById('productImage').value,
      rating: 4.0,
      reviews: 0
    };
    
    this.products.push(newProduct);
    document.getElementById('addProductModal').classList.add('hidden');
    this.renderAdminProducts();
    this.showToast('Product added successfully', 'success');
  }

  editProduct(id) {
    // Simulate edit functionality
    this.showToast('Edit functionality would open a similar modal', 'info');
  }

  deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== id);
      this.renderAdminProducts();
      this.showToast('Product deleted successfully', 'success');
    }
  }

  // Utility Functions
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize the application
const app = new EduMart();