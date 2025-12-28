// google-sheets.js
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // You'll get this later

class GoogleSheetsAPI {
    constructor() {
        this.scriptUrl = GOOGLE_SHEETS_URL;
    }
    
    async saveOrder(order) {
        if (!this.scriptUrl || this.scriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            // Fallback to localStorage if no Google Sheets setup
            this.saveToLocalStorage(order);
            return { success: true, message: 'Saved to localStorage (Google Sheets not configured)' };
        }
        
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'saveOrder',
                    data: order
                })
            });
            
            // Also save to localStorage as backup
            this.saveToLocalStorage(order);
            
            return { success: true, message: 'Order saved to Google Sheets' };
        } catch (error) {
            console.error('Google Sheets error:', error);
            // Fallback to localStorage
            this.saveToLocalStorage(order);
            return { success: true, message: 'Saved to localStorage (fallback)' };
        }
    }
    
    async getOrders() {
        if (!this.scriptUrl || this.scriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            // Fallback to localStorage
            return this.getFromLocalStorage();
        }
        
        try {
            const response = await fetch(`${this.scriptUrl}?action=getOrders`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Merge with localStorage data
            const localOrders = this.getFromLocalStorage();
            const allOrders = [...(data.orders || []), ...localOrders];
            
            // Remove duplicates based on timestamp
            const uniqueOrders = this.removeDuplicates(allOrders);
            
            return uniqueOrders;
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);
            return this.getFromLocalStorage();
        }
    }
    
    saveToLocalStorage(order) {
        let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        orders.push(order);
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
    }
    
    getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('cocktailOrders')) || [];
    }
    
    removeDuplicates(orders) {
        const seen = new Set();
        return orders.filter(order => {
            const key = `${order.timestamp}-${order.name}-${order.drink}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}

// Create global instance
const googleSheetsAPI = new GoogleSheetsAPI();
