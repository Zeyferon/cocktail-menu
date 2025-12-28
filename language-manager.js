// language-manager.js
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.translations = translations;
        this.isTranslating = false;
    }
    
    // Initialize language system
    init() {
        this.setLanguage(this.currentLang);
        this.setupLanguageSwitcher();
        this.updateLanguageButton();
    }
    
    // Set language
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update page title
        document.title = this.t('title');
        
        // Translate all elements
        this.translatePage();
        this.updateLanguageButton();
        
        // Update cocktails data with translations
        if (window.updateCocktailsWithTranslation) {
            window.updateCocktailsWithTranslation();
        }
        
        // Update order preview
        if (window.updateOrderPreview) {
            window.updateOrderPreview();
        }
        
        // Dispatch language change event
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
    
    // Get translation for a key
    t(key) {
        return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
    }
    
    // Translate cocktail data
    translateCocktail(cocktail) {
        const translatedCocktail = {
            ...cocktail,
            name: this.t(cocktail.name),
            tag: this.t(cocktail.name + " Tag")
        };
        
        // Translate ingredients
        translatedCocktail.ingredients = cocktail.ingredients.map(ingredient => ({
            name: this.t(ingredient.name),
            amount: this.t(ingredient.amount)
        }));
        
        // Instructions remain the same (they're already in each language in your data)
        return translatedCocktail;
    }
    
    // Translate all elements on page
    translatePage() {
        this.isTranslating = true;
        
        // Add translating class to all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.classList.add('translating');
        });
        
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        // Translate select options
        const drinkSelect = document.getElementById('drink');
        if (drinkSelect) {
            const options = [
                { value: "Strawberry Banana Cream", key: "Strawberry Banana Cream" },
                { value: "Blue Pineapple Lagoon", key: "Blue Pineapple Lagoon" },
                { value: "Malibu Sunset", key: "Malibu Sunset" },
                { value: "Mango Guava Vodka Smash", key: "Mango Guava Vodka Smash" },
                { value: "Green Apple Fizz", key: "Green Apple Fizz" },
                { value: "Purple Galaxy", key: "Purple Galaxy" },
                { value: "Watermelon Mojito Remix", key: "Watermelon Mojito Remix" },
                { value: "Frozen Party Slush", key: "Frozen Party Slush" },
                { value: "Margarita", key: "Margarita" },
                { value: "Coca-Cola & Rum", key: "Coca-Cola & Rum" },
                { value: "Куманёк", key: "Куманёк" },
                { value: "Rum Punch", key: "Rum Punch" },
                { value: "Bloody Mary", key: "Bloody Mary" },
                { value: "Coffee", key: "Coffee" },
                { value: "Tea", key: "Tea" },
                { value: "Juice", key: "Juice" }
            ];
            
            // Update existing options
            for (let i = 1; i < drinkSelect.options.length; i++) {
                const option = drinkSelect.options[i];
                const translation = options.find(o => o.value === option.value);
                if (translation) {
                    option.textContent = this.t(translation.key);
                }
            }
        }
        
        // Update extra ingredients checkboxes
        this.updateExtraIngredients();
        
        // Remove translating class after a delay
        setTimeout(() => {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                el.classList.remove('translating');
            });
            this.isTranslating = false;
        }, 300);
    }
    
    // Update extra ingredients checkboxes
    updateExtraIngredients() {
        const extraLabels = {
            'extra-alcohol': 'extraAlcohol',
            'more-ice': 'moreIce',
            'less-sugar': 'lessSugar',
            'extra-garnish': 'extraGarnish',
            'spicy': 'makeSpicy'
        };
        
        Object.entries(extraLabels).forEach(([value, key]) => {
            const checkbox = document.querySelector(`input[value="${value}"]`);
            if (checkbox) {
                const label = checkbox.closest('.checkbox-label');
                if (label) {
                    const textSpan = label.querySelector('span:last-child:not(.checkbox-custom)');
                    if (textSpan) {
                        textSpan.textContent = this.t(key);
                    }
                }
            }
        });
    }
    
    // Setup language switcher event listeners
    setupLanguageSwitcher() {
        const languageSwitcher = document.getElementById('languageSwitcher');
        const currentLanguageBtn = document.getElementById('currentLanguage');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (!languageSwitcher) return;
        
        // Toggle dropdown on click
        currentLanguageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = languageSwitcher.querySelector('.language-dropdown');
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        });
        
        // Handle language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                this.setLanguage(lang);
                
                // Close dropdown
                const dropdown = languageSwitcher.querySelector('.language-dropdown');
                dropdown.style.display = 'none';
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdown = languageSwitcher.querySelector('.language-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Update language button text
    updateLanguageButton() {
        const currentLanguageBtn = document.getElementById('currentLanguage');
        if (!currentLanguageBtn) return;
        
        const langCodes = {
            en: 'EN',
            ru: 'RU',
            fr: 'FR'
        };
        
        const flagEmojis = {
            en: '🇺🇸',
            ru: '🇷🇺',
            fr: '🇫🇷'
        };
        
        const span = currentLanguageBtn.querySelector('span');
        if (span) {
            span.textContent = langCodes[this.currentLang] || 'EN';
        }
        
        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLang);
        });
    }
}

// Create global instance
const languageManager = new LanguageManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    languageManager.init();
});
