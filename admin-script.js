document.addEventListener('DOMContentLoaded', function() {
    // Admin password
    const ADMIN_PASSWORD = "1234";
    let currentOrderId = null;
    
    // DOM Elements
    const passwordSection = document.getElementById('passwordSection');
    const ordersDashboard = document.getElementById('ordersDashboard');
    const adminPasswordInput = document.getElementById('adminPassword');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshOrdersBtn = document.getElementById('refreshOrders');
    const ordersList = document.getElementById('ordersList');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    const deleteOrderBtn = document.getElementById('deleteOrderBtn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const closeModalBtn = document.querySelector('.close-modal');
    const stats = {
        totalOrders: document.getElementById('totalOrders'),
        todayOrders: document.getElementById('todayOrders'),
        pendingOrders: document.getElementById('pendingOrders'),
        completedOrders: document.getElementById('completedOrders')
    };
    
    // Check authentication
    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
            passwordSection.style.display = 'none';
            ordersDashboard.style.display = 'block';
            loadOrders();
        }
    }
    
    // Password submission
    submitPasswordBtn.addEventListener('click', function() {
        const password = adminPasswordInput.value.trim();
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            passwordSection.style.display = 'none';
            ordersDashboard.style.display = 'block';
            adminPasswordInput.value = '';
            loadOrders();
            
            // Vibrate on success
            if (navigator.vibrate) navigator.vibrate(100);
        } else {
            alert('Incorrect password!');
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
            
            // Vibrate on error
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    });
    
    // Allow Enter key for password
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitPasswordBtn.click();
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminAuthenticated');
        passwordSection.style.display = 'flex';
        ordersDashboard.style.display = 'none';
    });
    
    // Load orders from localStorage
    function loadOrders() {
        let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        
        // Ensure all orders have required fields
        orders = orders.map((order, index) => {
            if (!order.id) order.id = Date.now() + index;
            if (!order.status) order.status = 'pending';
            return order;
        });
        
        // Sort by time (newest first)
        orders.sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeB - timeA;
        });
        
        updateStatistics(orders);
        renderOrdersList(orders);
    }
    
    // Update statistics
    function updateStatistics(orders) {
        const today = new Date().toLocaleDateString();
        const todayOrdersCount = orders.filter(order => {
            return order.timestamp && order.timestamp.includes(today);
        }).length;
        
        const pendingCount = orders.filter(order => order.status === 'pending').length;
        const completedCount = orders.filter(order => order.status === 'completed').length;
        
        stats.totalOrders.textContent = orders.length;
        stats.todayOrders.textContent = todayOrdersCount;
        stats.pendingOrders.textContent = pendingCount;
        stats.completedOrders.textContent = completedCount;
    }
    
    // Render orders list for mobile
    function renderOrdersList(orders) {
        if (orders.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersList.innerHTML = '';
            return;
        }
        
        noOrdersMessage.style.display = 'none';
        
        const listHTML = orders.map(order => {
            // Get first letter for avatar
            const firstLetter = order.name ? order.name.charAt(0).toUpperCase() : 'G';
            
            // Format time
            const time = order.timestamp ? 
                new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                '--:--';
            
            return `
                <div class="order-item ${order.status}" data-order-id="${order.id}" onclick="viewOrderDetails(${order.id})">
                    <div class="order-header">
                        <div class="order-customer">
                            <div class="customer-avatar">${firstLetter}</div>
                            <div class="customer-info">
                                <h3>${order.name || 'Guest'}</h3>
                                <p class="order-time">${time}</p>
                            </div>
                        </div>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                    <div class="order-details-preview">
                        <p><i class="fas fa-glass-martini-alt"></i> ${order.drink || 'No drink specified'}</p>
                        ${order.extras && order.extras.length > 0 ? 
                            `<p><i class="fas fa-plus-circle"></i> ${order.extras.length} extras</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        ordersList.innerHTML = listHTML;
    }
    
    // View order details
    window.viewOrderDetails = function(orderId) {
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            alert('Order not found!');
            return;
        }
        
        currentOrderId = orderId;
        
        const detailsHTML = `
            <p>
                <strong>Order ID:</strong> 
                <span>#${order.id}</span>
            </p>
            <p>
                <strong>Customer:</strong> 
                <span>${order.name || 'Guest'}</span>
            </p>
            <p>
                <strong>Time:</strong> 
                <span>${order.timestamp || 'Unknown'}</span>
            </p>
            <p>
                <strong>Drink:</strong> 
                <span>${order.drink || 'Not specified'}</span>
            </p>
            <p>
                <strong>Extras:</strong> 
                <span>${order.extras && order.extras.length > 0 ? order.extras.join(', ') : 'None'}</span>
            </p>
            <p>
                <strong>Instructions:</strong> 
                <span>${order.specialInstructions || 'None'}</span>
            </p>
            <p>
                <strong>Status:</strong> 
                <span class="status ${order.status}">${order.status}</span>
            </p>
        `;
        
        orderDetailsContent.innerHTML = detailsHTML;
        orderDetailsModal.style.display = 'flex';
    };
    
    // Mark order as complete
    completeOrderBtn.addEventListener('click', function() {
        if (!currentOrderId) return;
        
        if (!confirm('Mark this order as complete?')) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const orderIndex = orders.findIndex(o => o.id === currentOrderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'completed';
            localStorage.setItem('cocktailOrders', JSON.stringify(orders));
            
            // Close modal
            orderDetailsModal.style.display = 'none';
            
            // Reload orders
            loadOrders();
            
            // Vibrate on success
            if (navigator.vibrate) navigator.vibrate(100);
        }
    });
    
    // Delete order
    deleteOrderBtn.addEventListener('click', function() {
        if (!currentOrderId) return;
        
        if (!confirm('Are you sure you want to delete this order?')) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const filteredOrders = orders.filter(order => order.id !== currentOrderId);
        
        localStorage.setItem('cocktailOrders', JSON.stringify(filteredOrders));
        orderDetailsModal.style.display = 'none';
        loadOrders();
        
        // Vibrate on delete
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    });
    
    // Clear completed orders
    clearCompletedBtn.addEventListener('click', function() {
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const pendingOrders = orders.filter(order => order.status !== 'completed');
        
        if (pendingOrders.length === orders.length) {
            alert('No completed orders to clear!');
            return;
        }
        
        if (!confirm('Clear all completed orders? This cannot be undone.')) return;
        
        localStorage.setItem('cocktailOrders', JSON.stringify(pendingOrders));
        loadOrders();
        
        // Vibrate on clear
        if (navigator.vibrate) navigator.vibrate([100, 30, 100, 30, 100]);
    });
    
    // Refresh orders
    refreshOrdersBtn.addEventListener('click', function() {
        loadOrders();
        
        // Add refresh animation
        this.classList.add('refreshing');
        setTimeout(() => {
            this.classList.remove('refreshing');
        }, 500);
        
        // Vibrate
        if (navigator.vibrate) navigator.vibrate(50);
    });
    
    // Modal close functionality
    closeModalBtn.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
        currentOrderId = null;
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
            currentOrderId = null;
        }
    });
    
    // Keyboard shortcuts for admin
    document.addEventListener('keydown', (e) => {
        // Refresh with R key
        if (e.key === 'r' || e.key === 'R') {
            if (ordersDashboard.style.display === 'block') {
                refreshOrdersBtn.click();
            }
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            if (orderDetailsModal.style.display === 'flex') {
                orderDetailsModal.style.display = 'none';
                currentOrderId = null;
            }
        }
    });
    
    // Initialize
    checkAuth();
    
    // Add CSS for refresh animation
    const style = document.createElement('style');
    style.textContent = `
        .refreshing {
            animation: spin 0.5s ease;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

