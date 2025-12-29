// firebase-simple.js - Updated for Firebase v9+
console.log('Loading Firebase v9+ setup...');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBECUAi9qcZhefjDSFCoLdG8fQG3prT4Ys",
  authDomain: "cocktail-bar-33d37.firebaseapp.com",
  projectId: "cocktail-bar-33d37",
  storageBucket: "cocktail-bar-33d37.firebasestorage.app",
  messagingSenderId: "798631206220",
  appId: "1:798631206220:web:1e24177eee7b6b388e03e9",
  measurementId: "G-B2N9YF1R8P"
};

// Global Firebase variables
let firebaseApp = null;
let firestoreDB = null;
let firebaseAvailable = false;

// Initialize Firebase
function initializeFirebase() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded. Loading from CDN...');
            return false;
        }
        
        // Initialize Firebase v8 way (since we're using CDN)
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firestoreDB = firebase.firestore();
        firebaseAvailable = true;
        
        console.log('✅ Firebase initialized successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        return false;
    }
}

// Check if Firebase is available
function isFirebaseAvailable() {
    return firebaseAvailable && firestoreDB !== null;
}

// Save order to Firebase
async function saveOrderToFirebase(order) {
    if (!isFirebaseAvailable()) {
        console.log('Firebase not available, skipping cloud save');
        return null;
    }
    
    try {
        // Add timestamp
        order.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        order.createdAt = new Date().toISOString();
        
        // Save to Firestore
        const docRef = await firestoreDB.collection('orders').add(order);
        console.log('✅ Order saved to Firebase with ID:', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        return null;
    }
}

// Get orders from Firebase
async function getOrdersFromFirebase() {
    if (!isFirebaseAvailable()) {
        console.log('Firebase not available, returning empty array');
        return [];
    }
    
    try {
        const snapshot = await firestoreDB.collection('orders')
            .orderBy('timestamp', 'desc')
            .get();
        
        const orders = [];
        snapshot.forEach(doc => {
            const order = doc.data();
            order.firebaseId = doc.id;
            orders.push(order);
        });
        
        console.log(`✅ Got ${orders.length} orders from Firebase`);
        return orders;
    } catch (error) {
        console.error('❌ Error getting orders from Firebase:', error);
        return [];
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Firebase...');
    setTimeout(() => {
        initializeFirebase();
        
        // Make functions globally available
        window.firebaseAvailable = isFirebaseAvailable();
        window.saveOrderToFirebase = saveOrderToFirebase;
        window.getOrdersFromFirebase = getOrdersFromFirebase;
    }, 1000);
});
