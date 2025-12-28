document.addEventListener('DOMContentLoaded', function() {
    // Cocktails Data
    const cocktails = [
        {
            id: 1,
            name: "Mojito",
            tag: "Refreshing & Minty",
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop",
            ingredients: [
                { name: "White Rum", amount: "50ml" },
                { name: "Fresh Lime Juice", amount: "25ml" },
                { name: "Mint Leaves", amount: "10 leaves" },
                { name: "Sugar Syrup", amount: "20ml" },
                { name: "Soda Water", amount: "Top up" },
                { name: "Ice", amount: "Crushed" }
            ],
            instructions: "1. Muddle mint leaves with sugar syrup and lime juice. 2. Add rum and crushed ice. 3. Top with soda water. 4. Garnish with mint sprig and lime wheel."
        },
        {
            id: 2,
            name: "Cosmopolitan",
            tag: "Classic & Fruity",
            image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop",
            ingredients: [
                { name: "Vodka", amount: "45ml" },
                { name: "Triple Sec", amount: "15ml" },
                { name: "Cranberry Juice", amount: "30ml" },
                { name: "Lime Juice", amount: "15ml" },
                { name: "Ice", amount: "Cubes" }
            ],
            instructions: "1. Shake all ingredients with ice. 2. Strain into chilled cocktail glass. 3. Garnish with lime twist or orange peel."
        },
        {
            id: 3,
            name: "Old Fashioned",
            tag: "Strong & Bold",
            image: "https://images.unsplash.com/photo-1585621386287-5e439b7bed71?w=400&h=400&fit=crop",
            ingredients: [
                { name: "Bourbon Whiskey", amount: "60ml" },
                { name: "Sugar Cube", amount: "1 piece" },
                { name: "Angostura Bitters", amount: "3 dashes" },
                { name: "Orange Peel", amount: "1 twist" },
                { name: "Ice", amount: "Large cube" }
            ],
            instructions: "1. Muddle sugar cube with bitters. 2. Add whiskey and ice. 3. Stir gently for 30 seconds. 4. Express orange peel over drink and use as garnish."
        },
        {
            id: 4,
            name: "Margarita",
            tag: "Zesty & Salty",
            image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop",
            ingredients: [
                { name: "Tequila", amount: "50ml" },
                { name: "Lime Juice", amount: "25ml" },
                { name: "Triple Sec", amount: "20ml" },
                { name: "Agave Syrup", amount: "15ml" },
                { name: "Salt", amount: "For rim" }
            ],
            instructions: "1. Rim glass with salt. 2. Shake all ingredients with ice. 3. Strain into glass over fresh ice. 4. Garnish with lime wheel."
        },
        {
            id: 5,
            name: "Espresso Martini",
            tag: "Coffee & Creamy",
            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop",
            ingredients: [
                { name: "Vodka", amount: "50ml" },
                { name: "Coffee Liqueur", amount: "30ml" },
                { name: "Fresh Espresso", amount: "30ml" },
                { name: "Simple Syrup", amount: "10ml" },
                { name: "Coffee Beans", amount: "3 for garnish" }
            ],
            instructions: "1. Shake all ingredients vigorously with ice. 2. Strain into chilled martini glass. 3. Garnish with three coffee beans floating on top."
        },
        {
            id: 6,
            name: "Piña Colada",
            tag: "Tropical & Creamy",
            image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop",
            ingredients: [
                { name: "White Rum", amount: "60ml" },
                { name: "Pineapple Juice", amount: "90ml" },
                { name: "Coconut Cream", amount: "30ml" },
                { name: "Crushed Ice", amount: "1 cup" },
                { name: "Pineapple Wedge", amount: "For garnish" }
            ],
            instructions: "1. Blend all ingredients with crushed ice until smooth. 2. Pour into hurricane glass. 3. Garnish with pineapple wedge and cherry."
        }
    ];

    // Current flipped card
    let currentFlippedCard = null;

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
                        <img src="${cocktail.image}" alt="${cocktail.name}" class="cocktail-image">
                        <h3 class="cocktail-name">${cocktail.name}</h3>
                        <p class="cocktail-tag">${cocktail.tag}</p>
                        <p class="flip-hint">Click to see recipe</p>
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
                        <p class="flip-hint">Click to flip back</p>
                    </div>
                </div>
            `;
            
            // Add click event for flipping
            card.addEventListener('click', function(e) {
                // Don't flip if clicking on the back's scrollable area
                if (e.target.closest('.card-back') && e.target.tagName !== 'P' && !e.target.classList.contains('flip-hint')) {
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
                } else {
                    currentFlippedCard = null;
                }
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
    const closeModalX = document.querySelector('.close-modal');

    // Update order preview
    function updateOrderPreview() {
        const name = document.getElementById('name').value || 'Guest';
        const drink = drinkSelect.value;
        const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
            .map(cb => cb.nextElementSibling.textContent);
        const instructions = document.getElementById('specialInstructions').value;
        
        const drinkName = drinkSelect.options[drinkSelect.selectedIndex].text;
        
        let previewHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Drink:</strong> ${drinkName || 'Not selected'}</p>
        `;
        
        if (extras.length > 0) {
            previewHTML += `<p><strong>Extras:</strong> ${extras.join(', ')}</p>`;
        }
        
        if (instructions) {
            previewHTML += `<p><strong>Special Instructions:</strong> ${instructions}</p>`;
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
                timestamp: new Date().toLocaleString()
            };
            
            // Save order to localStorage (simulating server storage)
            saveOrder(formData);
            
            // Show success modal
            successModal.style.display = 'flex';
            
            // Reset form
            orderForm.reset();
            updateOrderPreview();
        });
    }

    // Save order to localStorage
    function saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem('cocktailOrders')) || [];
        orders.push(order);
        localStorage.setItem('cocktailOrders', JSON.stringify(orders));
        
        // Log to console (for demo)
        console.log('New Order:', order);
        console.log('All Orders:', orders);
    }

    // Modal functionality
    function initModal() {
        // Close modal on X click
        closeModalX.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
        
        // Close modal on button click
        closeModalBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    // Initialize everything
    generateCocktailCards();
    initFormListeners();
    initModal();
    updateOrderPreview();
});