document.addEventListener('DOMContentLoaded', function() {
    // Admin password (in real app, this would be server-side)
    const ADMIN_PASSWORD = "1234";
    let currentOrderId = null;
    
    // DOM Elements
    const passwordSection = document.getElementById('passwordSection');
    const ordersDashboard = document.getElementById('ordersDashboard');
    const adminPasswordInput = document.getElementById('adminPassword');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshOrdersBtn = document.getElementById('refreshOrders');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    const deleteOrderBtn = document.getElementById('deleteOrderBtn');
    const markCompleteBtn = document.getElementById('markComplete');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const selectAllCheckbox = document.getElementById('selectAll');
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
        } else {
            alert('Incorrect password! Please try again.');
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    });
    
    // Allow Enter key for password submission
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
        
        // Add status to orders if not present
        orders = orders.map((order, index) => {
            if (!order.status) {
                order.status = 'pending';
                order.id = index + 1;
            }
            return order;
        });
        
        // Save back with status
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
        
        updateStatistics(orders);
        renderOrdersTable(orders);
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
    
    // Render orders table
    function renderOrdersTable(orders) {
        if (orders.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersTableBody.innerHTML = '';
            return;
        }
        
        noOrdersMessage.style.display = 'none';
        
        // Sort by timestamp (newest first)
        orders.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        
        const tableHTML = orders.map((order, index) => `
            <tr data-order-id="${order.id || index}">
                <td><input type="checkbox" class="order-checkbox" data-order-id="${order.id || index}"></td>
                <td>${order.timestamp || 'Unknown time'}</td>
                <td><strong>${order.name || 'Guest'}</strong></td>
                <td>${order.drink || 'Not specified'}</td>
                <td>${order.extras ? order.extras.join(', ') : 'None'}</td>
                <td>${order.specialInstructions || 'None'}</td>
                <td><span class="status ${order.status || 'pending'}">${order.status || 'pending'}</span></td>
                <td class="action-cell">
                    <button class="view-btn" onclick="viewOrderDetails(${order.id || index})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${order.status !== 'completed' ? `
                        <button class="complete-btn" onclick="markOrderComplete(${order.id || index})">
                            <i class="fas fa-check"></i> Complete
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
        
        ordersTableBody.innerHTML = tableHTML;
    }
    
    // View order details
    window.viewOrderDetails = function(orderIndex) {
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const order = orders.find(o => o.id === orderIndex) || orders[orderIndex];
        
        if (!order) {
            alert('Order not found!');
            return;
        }
        
        currentOrderId = order.id || orderIndex;
        
        const detailsHTML = `
            <h3>Order #${currentOrderId}</h3>
            <p><strong>Customer Name:</strong> ${order.name || 'Guest'}</p>
            <p><strong>Order Time:</strong> ${order.timestamp || 'Unknown'}</p>
            <p><strong>Drink:</strong> ${order.drink || 'Not specified'}</p>
            <p><strong>Extras:</strong> ${order.extras ? order.extras.join(', ') : 'None'}</p>
            <p><strong>Special Instructions:</strong> ${order.specialInstructions || 'None'}</p>
            <p><strong>Status:</strong> <span class="status ${order.status || 'pending'}">${order.status || 'pending'}</span></p>
        `;
        
        orderDetailsContent.innerHTML = detailsHTML;
        orderDetailsModal.style.display = 'flex';
    };
    
    // Mark order as complete
    window.markOrderComplete = function(orderIndex) {
        if (!confirm('Mark this order as complete?')) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const order = orders.find(o => o.id === orderIndex) || orders[orderIndex];
        
        if (order) {
            order.status = 'completed';
            localStorage.setItem('cocktailOrders', JSON.stringify(orders));
            loadOrders();
            
            // Close modal if open
            if (orderDetailsModal.style.display === 'flex' && currentOrderId === (order.id || orderIndex)) {
                orderDetailsModal.style.display = 'none';
            }
        }
    };
    
    // Complete order from modal
    completeOrderBtn.addEventListener('click', function() {
        if (currentOrderId !== null) {
            window.markOrderComplete(currentOrderId);
        }
    });
    
    // Delete order from modal
    deleteOrderBtn.addEventListener('click', function() {
        if (!confirm('Are you sure you want to delete this order?')) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        const filteredOrders = orders.filter(order => order.id !== currentOrderId);
        
        localStorage.setItem('cocktailOrders', JSON.stringify(filteredOrders));
        orderDetailsModal.style.display = 'none';
        loadOrders();
    });
    
    // Mark selected orders as complete
    markCompleteBtn.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.order-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Please select orders to mark as complete');
            return;
        }
        
        if (!confirm(`Mark ${checkboxes.length} order(s) as complete?`)) return;
        
        const orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        
        checkboxes.forEach(checkbox => {
            const orderId = parseInt(checkbox.dataset.orderId);
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'completed';
            }
        });
        
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
        loadOrders();
        selectAllCheckbox.checked = false;
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
    });
    
    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
    
    // Refresh orders
    refreshOrdersBtn.addEventListener('click', loadOrders);
    
    // Modal close functionality
    const closeModalBtn = document.querySelector('#orderDetailsModal .close-modal');
    closeModalBtn.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
        }
    });
    
    // Initialize
    checkAuth();
});