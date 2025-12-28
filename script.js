document.addEventListener('DOMContentLoaded', function() {
    // Cocktails Data
    const cocktails = [
        {
            id: 1,
name: "Strawberry Banana Cream",
tag: "Creamy • Tropical • Sweet",
image: "https://i.pinimg.com/1200x/ee/73/34/ee733440c7506d18690696123a608211.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Banana", amount: "1 whole" },
    { name: "Strawberries", amount: "100g" },
    { name: "Piña Colada", amount: "150ml" },
    { name: "Ice", amount: "1 cup" }
],
instructions: "1. Add banana and strawberries to the blender and blend until smooth. 2. Add piña colada and ice, then blend again until creamy. 3. Add vodka last and pulse lightly to combine. 4. Pour into a chilled glass and garnish with sugar or colorful sprinkles."

        },
        {
           id: 2,
name: "Blue Pineapple Lagoon",
tag: "Tropical • Electric • Refreshing",
image: "https://i.pinimg.com/736x/7b/d9/74/7bd97494a9fe81f3e295722e07613425.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Pineapple Juice", amount: "120ml" },
    { name: "Blue Curaçao", amount: "20ml" },
    { name: "Ice", amount: "Cubes" },
    { name: "Ginger Ale", amount: "Optional top" }
],
instructions: "1. Fill a shaker with ice, then add vodka and pineapple juice. 2. Shake well and strain into an ice-filled glass. 3. Slowly pour blue curaçao on top to create a layered effect. 4. Optionally top with ginger ale and serve immediately."

        },
        {
           id: 3,
name: "Malibu Sunset",
tag: "Sweet • Tropical • Smooth",
image: "https://i.pinimg.com/1200x/89/f6/8d/89f68d5c8fcf8c87295738e9b4097c86.jpg",
ingredients: [
    { name: "Malibu", amount: "50ml" },
    { name: "Orange Juice", amount: "120ml" },
    { name: "Strawberry Fanta", amount: "Top up" },
    { name: "Ice", amount: "Cubes" }
],
instructions: "1. Fill a tall glass with ice. 2. Pour in Malibu. 3. Fill with orange juice. 4. Gently top with strawberry Fanta to create a sunset effect. 5. Do not stir and serve immediately."

        },
        {
            id: 4,
name: "Mango Guava Vodka Smash",
tag: "Fresh • Juicy • Tropical",
image: "https://i.pinimg.com/1200x/81/89/6d/81896d52dc3cf64dd4fe42d2f483c432.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Mango Juice", amount: "80ml" },
    { name: "Guava Juice", amount: "80ml" },
    { name: "Fresh Lime Juice", amount: "20ml" },
    { name: "Ice", amount: "Cubes" }
],
instructions: "1. Fill a shaker with ice. 2. Add vodka, mango juice, guava juice, and lime juice. 3. Shake well until chilled. 4. Strain into a glass over ice. 5. Optionally garnish with a lime wedge or sugar rim."

        },
        {
            id: 5,
name: "Green Apple Fizz",
tag: "Fresh • Fizzy • Aesthetic",
image: "https://i.pinimg.com/1200x/fa/dd/1e/fadd1e9427bfa1c5e7daf926a5146694.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Green Apple", amount: "1/2, muddled" },
    { name: "Apple Juice", amount: "100ml" },
    { name: "Ginger Ale", amount: "Top up" },
    { name: "Ice", amount: "Cubes" }
],
instructions: "1. Muddle the green apple in a shaker. 2. Add vodka, apple juice, and ice. 3. Shake well and strain into a glass filled with ice. 4. Top with ginger ale. 5. Optionally garnish with green sprinkles or apple slice."

        },
        {
           id: 6,
name: "Purple Galaxy",
tag: "Sweet • Smooth • Vibrant",
image: "https://i.pinimg.com/736x/9c/5f/a6/9c5fa6ed9307025082e35824f044ba0b.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Grape Juice", amount: "60ml" },
    { name: "Blueberry Juice", amount: "60ml" },
    { name: "Cranberry Juice", amount: "Splash" },
    { name: "Ice", amount: "Cubes" }
],
instructions: "1. Fill a shaker with ice. 2. Add vodka, grape juice, blueberry juice, and a splash of cranberry juice. 3. Shake well until chilled. 4. Strain into a glass over fresh ice. 5. Serve immediately and optionally garnish with berries."

        },
        {
        id: 7,
name: "Watermelon Mojito Remix",
tag: "Refreshing • Fruity • Light",
image: "https://i.pinimg.com/736x/4f/32/e8/4f32e86b53c3d581b610d6c71c392403.jpg",
ingredients: [
    { name: "Vodka", amount: "50ml" },
    { name: "Watermelon Mojito (can)", amount: "120ml" },
    { name: "Fresh Lime Juice", amount: "15ml" },
    { name: "Ice", amount: "Cubes" }
],
instructions: "1. Fill a glass with ice. 2. Pour in vodka and watermelon mojito. 3. Add fresh lime juice. 4. Lightly stir to combine. 5. Serve immediately, optionally garnish with a lime wedge."

},
        {
id: 8,
name: "Frozen Party Slush",
tag: "Big Batch • Fun • Slushy",
image: "https://i.pinimg.com/736x/28/98/28/28982869538c7013bd558cdaf9f05dc5.jpg",
ingredients: [
    { name: "Piña Colada (can)", amount: "150ml" },
    { name: "Strawberry Fanta", amount: "150ml" },
    { name: "Vodka or Malibu", amount: "50ml" },
    { name: "Ice", amount: "2 cups" }
],
instructions: "1. Add ice, piña colada, strawberry Fanta, and vodka or Malibu into a blender. 2. Blend until smooth and slushy. 3. Pour into glasses immediately. 4. Optionally garnish with colorful sprinkles or fruit slices for extra fun."

        },
        {
id: 9,
name: "Margarita",
tag: "Zesty • Salty • Classic",
image: "https://i.pinimg.com/1200x/83/17/ad/8317ad3eed28a28773e98bed3d3aa55b.jpg",
ingredients: [
    { name: "Tequila", amount: "50ml" },
    { name: "Fresh Lime Juice", amount: "25ml" },
    { name: "Triple Sec", amount: "20ml" },
    { name: "Agave Syrup", amount: "15ml" },
    { name: "Salt", amount: "For rim" }
],
instructions: "1. Rim a glass with salt. 2. Fill a shaker with ice, then add tequila, lime juice, triple sec, and agave syrup. 3. Shake well until chilled. 4. Strain into the prepared glass over fresh ice. 5. Garnish with a lime wheel and serve immediately."


        }
    ];

    // Current flipped card
    let currentFlippedCard = null;
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    // Generate cocktail cards
    function generateCocktailCards() {
        const container = document.getElementById('cocktailsContainer');
        
        cocktails.forEach(cocktail => {
            const card = document.createElement('div');
            card.className = 'cocktail-card';
            card.dataset.id = cocktail.id;
            
            // Ingredients list HTML
            const ingredientsHTML = cocktail.ingredients.map(ing => 
                `<li><span>${ing.name}</span><span>${ing.amount}</span></li>`
            ).join('');
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${cocktail.image}" alt="${cocktail.name}" class="cocktail-image" loading="lazy">
                        <h3 class="cocktail-name">${cocktail.name}</h3>
                        <p class="cocktail-tag">${cocktail.tag}</p>
                        <p class="flip-hint">Tap to see recipe</p>
                    </div>
                    <div class="card-back">
                        <h3>${cocktail.name} Recipe</h3>
                        <ul class="ingredients-list">
                            ${ingredientsHTML}
                        </ul>
                        <div class="instructions">
                            <strong>Instructions:</strong>
                            <p>${cocktail.instructions}</p>
                        </div>
                        <p class="flip-hint">Tap to flip back</p>
                    </div>
                </div>
            `;
            
            // Add touch/click event for flipping
            card.addEventListener('click', function(e) {
                // Don't flip if clicking on scrollable content
                if (e.target.closest('.card-back') && 
                    e.target.tagName !== 'P' && 
                    !e.target.classList.contains('flip-hint') &&
                    !e.target.closest('.flip-hint')) {
                    return;
                }
                
                // If there's already a flipped card, flip it back
                if (currentFlippedCard && currentFlippedCard !== this) {
                    currentFlippedCard.classList.remove('flipped');
                }
                
                // Flip this card
                this.classList.toggle('flipped');
                
                // Update current flipped card
                if (this.classList.contains('flipped')) {
                    currentFlippedCard = this;
                    
                    // Scroll the flipped card into view on mobile
                    if (window.innerWidth < 768) {
                        setTimeout(() => {
                            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                    }
                } else {
                    currentFlippedCard = null;
                }
                
                // Close mobile menu if open
                mobileNav.classList.remove('active');
            });
            
            container.appendChild(card);
        });
    }

    // Order form functionality
    const orderForm = document.getElementById('orderForm');
    const drinkSelect = document.getElementById('drink');
    const orderPreview = document.getElementById('orderPreview');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Update order preview
    function updateOrderPreview() {
        const name = document.getElementById('name').value || 'Guest';
        const drink = drinkSelect.value;
        const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
            .map(cb => {
                const label = cb.closest('.checkbox-label').querySelector('span:last-child');
                return label ? label.textContent : '';
            })
            .filter(text => text.trim() !== '');
        
        const instructions = document.getElementById('specialInstructions').value;
        const drinkName = drinkSelect.options[drinkSelect.selectedIndex].text;
        
        let previewHTML = '';
        
        if (drinkName) {
            previewHTML = `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Drink:</strong> ${drinkName}</p>
            `;
            
            if (extras.length > 0) {
                previewHTML += `<p><strong>Extras:</strong> ${extras.join(', ')}</p>`;
            }
            
            if (instructions) {
                previewHTML += `<p><strong>Notes:</strong> ${instructions}</p>`;
            }
        } else {
            previewHTML = '<p class="preview-placeholder">Select a drink to see preview</p>';
        }
        
        orderPreview.innerHTML = previewHTML;
    }

    // Initialize form listeners
    function initFormListeners() {
        // Update preview on any change
        const formInputs = orderForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', updateOrderPreview);
            input.addEventListener('change', updateOrderPreview);
        });
        
        // Form submission
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                drink: drinkSelect.options[drinkSelect.selectedIndex].text,
                extras: Array.from(document.querySelectorAll('input[name="extras"]:checked'))
                    .map(cb => cb.value),
                specialInstructions: document.getElementById('specialInstructions').value,
                timestamp: new Date().toLocaleString(),
                status: 'pending'
            };
            
            // Save order to localStorage
            saveOrder(formData);
            
            // Show success modal
            successModal.style.display = 'flex';
            
            // Vibrate on mobile if supported
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            
            // Reset form after a delay
            setTimeout(() => {
                orderForm.reset();
                updateOrderPreview();
                
                // Close mobile menu if open
                mobileNav.classList.remove('active');
            }, 2000);
        });
    }

    // Save order to localStorage
    function saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        
        // Add unique ID
        order.id = Date.now();
        orders.push(order);
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
        
        // Log for debugging
        console.log('New Order Saved:', order);
    }

    // Modal functionality
    function initModal() {
        // Close modal on button click
        closeModalBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
        
        // Close modal on outside click
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    // Mobile menu functionality
    function initMobileMenu() {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileNav.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    function initHeaderScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Initialize everything
    function init() {
        generateCocktailCards();
        initFormListeners();
        initModal();
        initMobileMenu();
        initHeaderScroll();
        updateOrderPreview();
        
        // Add touch-friendly class for mobile
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }

    // Start the app
    init();
});

