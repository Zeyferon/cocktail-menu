document.addEventListener('DOMContentLoaded', function() {
    // Admin password
    const ADMIN_PASSWORD = "1234";
    let currentOrderId = null;
    let currentFirebaseId = null;
    
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
    
    // ===========================================
    // FIREBASE FUNCTIONS
    // ===========================================
    
    // Check if Firebase is available
    let firebaseAvailable = false;
    
    // Try to initialize Firebase
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            firebaseAvailable = true;
            console.log('Firebase is available in admin');
        }
    } catch (error) {
        console.log('Firebase not available in admin:', error);
    }
    
    // Get orders from Firebase (or localStorage as fallback)
    async function loadOrders() {
        let orders = [];
        
        if (firebaseAvailable) {
            // Try to get from Firebase
            try {
                const snapshot = await firebase.firestore().collection('orders').orderBy('timestamp', 'desc').get();
                orders = [];
                
                snapshot.forEach(doc => {
                    const order = doc.data();
                    order.firebaseId = doc.id; // Store Firebase document ID
                    orders.push(order);
                });
                
                console.log('Got', orders.length, 'orders from Firebase');
                
                // Also save to localStorage for offline access
                localStorage.setItem('cocktailOrders', JSON.stringify(orders));
            } catch (error) {
                console.error('Error getting orders from Firebase:', error);
                // Fallback to localStorage
                orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
            }
        } else {
            // Fallback to localStorage
            orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
            console.log('Got', orders.length, 'orders from localStorage (Firebase not available)');
        }
        
        // Ensure all orders have required fields
        orders = orders.map((order, index) => {
            if (!order.id) order.id = Date.now() + index;
            if (!order.status) order.status = 'pending';
            return order;
        });
        
        updateStatistics(orders);
        renderOrdersList(orders);
    }
    
    // Update order status in Firebase
    async function updateOrderStatus(firebaseId, status) {
        if (!firebaseAvailable) return false;
        
        try {
            await firebase.firestore().collection('orders').doc(firebaseId).update({
                status: status,
                updatedAt: new Date().toISOString()
            });
            console.log('Order status updated in Firebase:', firebaseId, '->', status);
            return true;
        } catch (error) {
            console.error('Error updating order status in Firebase:', error);
            return false;
        }
    }
    
    // Delete order from Firebase
    async function deleteOrderFromFirebase(firebaseId) {
        if (!firebaseAvailable) return false;
        
        try {
            await firebase.firestore().collection('orders').doc(firebaseId).delete();
            console.log('Order deleted from Firebase:', firebaseId);
            return true;
        } catch (error) {
            console.error('Error deleting order from Firebase:', error);
            return false;
        }
    }
    
    // ===========================================
    // END OF FIREBASE FUNCTIONS
    // ===========================================
    
    // Update statistics
    function updateStatistics(orders) {
        const today = new Date().toLocaleDateString();
        const todayOrdersCount = orders.filter(order => {
            const orderDate = order.timestamp ? new Date(order.timestamp).toLocaleDateString() : '';
            return orderDate === today;
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
            let time = '--:--';
            try {
                if (order.timestamp) {
                    const date = new Date(order.timestamp);
                    if (!isNaN(date.getTime())) {
                        time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                }
            } catch (e) {
                console.log('Error parsing time:', e);
            }
            
            return `
                <div class="order-item ${order.status}" onclick="viewOrderDetails('${order.id}', ${order.firebaseId ? `'${order.firebaseId}'` : 'null'})">
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
    window.viewOrderDetails = async function(orderId, firebaseId) {
        // Get orders from localStorage (they should be synced from Firebase)
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        
        // Find the order by ID or Firebase ID
        const order = orders.find(o => 
            (firebaseId && o.firebaseId === firebaseId) || 
            (!firebaseId && o.id == orderId)
        );
        
        if (!order) {
            alert('Order not found!');
            return;
        }
        
        currentOrderId = order.id || orderId;
        currentFirebaseId = firebaseId || order.firebaseId;
        
        const detailsHTML = `
            <p>
                <strong>Order ID:</strong> 
                <span>#${order.id || orderId}</span>
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
                <strong>Language:</strong> 
                <span>${order.language || 'en'}</span>
            </p>
            <p>
                <strong>Status:</strong> 
                <span class="status ${order.status}">${order.status}</span>
            </p>
            ${order.firebaseId ? `<p><strong>Firebase ID:</strong> <span>${order.firebaseId}</span></p>` : ''}
        `;
        
        orderDetailsContent.innerHTML = detailsHTML;
        orderDetailsModal.style.display = 'flex';
    };
    
    // Mark order as complete
    completeOrderBtn.addEventListener('click', async function() {
        if (!currentOrderId && !currentFirebaseId) return;
        
        if (!confirm('Mark this order as complete?')) return;
        
        let success = false;
        
        // Try to update in Firebase first
        if (currentFirebaseId) {
            success = await updateOrderStatus(currentFirebaseId, 'completed');
        }
        
        if (success) {
            // Update localStorage
            let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
            const orderIndex = orders.findIndex(o => 
                (currentFirebaseId && o.firebaseId === currentFirebaseId) || 
                (!currentFirebaseId && o.id == currentOrderId)
            );
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'completed';
                localStorage.setItem('cocktailOrders', JSON.stringify(orders));
            }
            
            // Reload orders
            await loadOrders();
            orderDetailsModal.style.display = 'none';
            
            // Vibrate on success
            if (navigator.vibrate) navigator.vibrate(100);
        } else {
            // Fallback to localStorage only
            const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
            const orderIndex = orders.findIndex(o => o.id == currentOrderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'completed';
                localStorage.setItem('cocktailOrders', JSON.stringify(orders));
                
                // Reload orders
                await loadOrders();
                orderDetailsModal.style.display = 'none';
                
                if (navigator.vibrate) navigator.vibrate(100);
            } else {
                alert('Could not update order status. Please try again.');
            }
        }
    });
    
    // Delete order
    deleteOrderBtn.addEventListener('click', async function() {
        if (!currentOrderId && !currentFirebaseId) return;
        
        if (!confirm('Are you sure you want to delete this order?')) return;
        
        let success = false;
        
        // Try to delete from Firebase first
        if (currentFirebaseId) {
            success = await deleteOrderFromFirebase(currentFirebaseId);
        }
        
        // Update localStorage regardless
        let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        orders = orders.filter(order => {
            if (currentFirebaseId && order.firebaseId === currentFirebaseId) {
                return false;
            }
            if (!currentFirebaseId && order.id == currentOrderId) {
                return false;
            }
            return true;
        });
        
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
        
        if (success || !currentFirebaseId) {
            orderDetailsModal.style.display = 'none';
            await loadOrders();
            
            // Vibrate on delete
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else {
            alert('Could not delete order from Firebase, but removed from local storage.');
            orderDetailsModal.style.display = 'none';
            await loadOrders();
        }
    });
    
    // Clear completed orders
    clearCompletedBtn.addEventListener('click', async function() {
        if (!confirm('Clear all completed orders? This will only clear from local storage.')) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const pendingOrders = orders.filter(order => order.status !== 'completed');
        
        if (pendingOrders.length === orders.length) {
            alert('No completed orders to clear!');
            return;
        }
        
        localStorage.setItem('cocktailOrders', JSON.stringify(pendingOrders));
        await loadOrders();
        
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
        currentFirebaseId = null;
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
            currentOrderId = null;
            currentFirebaseId = null;
        }
    });
    
    // Auto-refresh orders every 30 seconds when dashboard is open
    setInterval(() => {
        if (ordersDashboard.style.display === 'block') {
            loadOrders();
        }
    }, 30000);
    
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
                currentFirebaseId = null;
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
