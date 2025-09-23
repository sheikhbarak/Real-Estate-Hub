// Real Estate Hub - JavaScript Functionality

// Google Maps variables
let map;
let marker;
const propertyAddress = "123 Maple Street, Downtown District, CA 90210";
const propertyCoordinates = { lat: 34.0522, lng: -118.2437 }; // Los Angeles coordinates as example

// Sample seller profiles data
const sellerProfiles = {
    'seller-001': {
        id: 'seller-001',
        name: 'Sarah Johnson',
        title: 'Licensed Real Estate Agent',
        company: 'Premier Properties Group',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0o8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@premierproperties.com',
        experience: '8 years',
        specialties: ['First-time buyers', 'Luxury homes', 'Investment properties'],
        rating: 4.8,
        reviewCount: 127,
        bio: 'Sarah is a dedicated real estate professional with over 8 years of experience helping families find their dream homes. She specializes in luxury properties and has a proven track record of successful transactions.',
        languages: ['English', 'Spanish'],
        certifications: ['ABR', 'CRS', 'GRI'],
        socialMedia: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            facebook: 'https://facebook.com/sarahjohnsonrealtor'
        }
    },
    'seller-002': {
        id: 'seller-002',
        name: 'Michael Chen',
        title: 'Senior Real Estate Broker',
        company: 'Urban Living Realty',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNzY0YmEyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TUM8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 987-6543',
        email: 'michael.chen@urbanliving.com',
        experience: '12 years',
        specialties: ['Urban properties', 'Condominiums', 'Commercial real estate'],
        rating: 4.9,
        reviewCount: 203,
        bio: 'Michael brings over a decade of expertise in urban real estate markets. His deep understanding of city dynamics and market trends makes him the go-to agent for urban properties.',
        languages: ['English', 'Mandarin', 'Cantonese'],
        certifications: ['CCIM', 'SIOR', 'CRE'],
        socialMedia: {
            linkedin: 'https://linkedin.com/in/michaelchen',
            twitter: 'https://twitter.com/michaelchenre'
        }
    },
    'seller-003': {
        id: 'seller-003',
        name: 'Emily Rodriguez',
        title: 'Real Estate Consultant',
        company: 'Riverside Homes',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNGNhZjUwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RVI8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 456-7890',
        email: 'emily.rodriguez@riversidehomes.com',
        experience: '6 years',
        specialties: ['Family homes', 'Suburban properties', 'Relocation services'],
        rating: 4.7,
        reviewCount: 89,
        bio: 'Emily specializes in helping families find the perfect suburban home. Her attention to detail and personalized approach ensures a smooth buying experience for all her clients.',
        languages: ['English', 'Spanish'],
        certifications: ['ABR', 'RRS'],
        socialMedia: {
            linkedin: 'https://linkedin.com/in/emilyrodriguez',
            instagram: 'https://instagram.com/emilyrodriguezrealtor'
        }
    }
};

// Sample property data with seller profiles
const sampleProperties = [
    {
        id: 'prop-001',
        title: 'Beautiful Family Home',
        address: '123 Maple Street, Downtown District, CA 90210',
        price: '$525,000',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        type: 'Single Family',
        yearBuilt: 2018,
        sellerId: 'seller-001',
        images: ['🏠', '🏡', '🏢', '🏘️'],
        description: 'A stunning family home in a desirable neighborhood with modern amenities and beautiful landscaping.',
        features: ['Hardwood floors', 'Granite countertops', 'Stainless steel appliances', 'Private backyard']
    },
    {
        id: 'prop-002',
        title: 'Modern Condo',
        address: '456 Oak Avenue, Midtown, CA 90211',
        price: '$425,000',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        type: 'Condominium',
        yearBuilt: 2020,
        sellerId: 'seller-002',
        images: ['🏢', '🏠', '🏡', '🏘️'],
        description: 'Contemporary condo with city views and premium finishes in the heart of Midtown.',
        features: ['Floor-to-ceiling windows', 'Modern kitchen', 'In-unit laundry', 'Rooftop terrace access']
    },
    {
        id: 'prop-003',
        title: 'Townhouse',
        address: '789 Pine Road, Riverside, CA 90212',
        price: '$475,000',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1650,
        type: 'Townhouse',
        yearBuilt: 2019,
        sellerId: 'seller-003',
        images: ['🏘️', '🏠', '🏡', '🏢'],
        description: 'Spacious townhouse with attached garage and private patio in a family-friendly community.',
        features: ['Two-car garage', 'Private patio', 'Open floor plan', 'Community amenities']
    }
];

// Function to get seller profile by ID
function getSellerProfile(sellerId) {
    return sellerProfiles[sellerId] || null;
}

// Function to get property data by ID
function getPropertyData(propertyId) {
    return sampleProperties.find(prop => prop.id === propertyId) || null;
}

// Function to create seller contact modal
function createSellerContactModal(seller, property) {
    const modal = document.createElement('div');
    modal.className = 'seller-contact-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeSellerContactModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Contact ${seller.name}</h2>
                <button class="modal-close" onclick="closeSellerContactModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="seller-info">
                    <img src="${seller.photo}" alt="${seller.name}" class="seller-photo">
                    <div class="seller-details">
                        <h3>${seller.name}</h3>
                        <p class="seller-title">${seller.title}</p>
                        <p class="seller-company">${seller.company}</p>
                        <div class="seller-rating">
                            ${'★'.repeat(Math.floor(seller.rating))}${'☆'.repeat(5 - Math.floor(seller.rating))}
                            <span>(${seller.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>
                <div class="contact-form">
                    <h4>Send a Message</h4>
                    <form onsubmit="sendSellerMessage(event, '${seller.id}', '${property.id}')">
                        <div class="form-group">
                            <label>Your Name</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Your Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Your Phone</label>
                            <input type="tel" name="phone">
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea name="message" rows="4" placeholder="I'm interested in ${property.title} at ${property.address}. Please contact me to schedule a viewing." required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Send Message</button>
                            <button type="button" class="btn btn-secondary" onclick="closeSellerContactModal()">Cancel</button>
                        </div>
                    </form>
                </div>
                <div class="quick-contact">
                    <h4>Quick Contact</h4>
                    <div class="contact-options">
                        <a href="tel:${seller.phone}" class="contact-btn">
                            <i class="fas fa-phone"></i>
                            Call ${seller.phone}
                        </a>
                        <a href="mailto:${seller.email}" class="contact-btn">
                            <i class="fas fa-envelope"></i>
                            Email ${seller.name}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Function to close seller contact modal
function closeSellerContactModal() {
    const modal = document.querySelector('.seller-contact-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Function to send message to seller
function sendSellerMessage(event, sellerId, propertyId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const messageData = {
        sellerId,
        propertyId,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Store message in localStorage (in a real app, this would be sent to a server)
    const messages = JSON.parse(localStorage.getItem('sellerMessages') || '[]');
    messages.push(messageData);
    localStorage.setItem('sellerMessages', JSON.stringify(messages));
    
    showNotification('Message sent successfully! The seller will contact you soon.', 'success');
    closeSellerContactModal();
}

// Initialize Google Maps
function actualInitMap() {
    try {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps) {
            console.warn('Google Maps API not loaded yet, retrying...');
            setTimeout(actualInitMap, 500);
            return;
        }

        // Check if the map container exists
        const mapContainer = document.getElementById("property-map");
        if (!mapContainer) {
            console.warn('Map container not found');
            return;
        }

        // Initialize the map centered on the property location
        map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: propertyCoordinates,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

    // Add a marker for the property location
    marker = new google.maps.Marker({
        position: propertyCoordinates,
        map: map,
        title: propertyAddress,
        animation: google.maps.Animation.DROP,
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                    <circle cx="20" cy="20" r="8" fill="#fff"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        }
    });

    // Add info window for the marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; max-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Beautiful Family Home</h4>
                <p style="margin: 0; color: #666; font-size: 14px;">${propertyAddress}</p>
                <p style="margin: 5px 0 0 0; color: #ff6b6b; font-weight: bold;">$525,000</p>
            </div>
        `
    });

    // Show info window when marker is clicked
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    // Show info window by default
    infoWindow.open(map, marker);
    
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        // Hide the map container if there's an error
        const mapContainer = document.getElementById("property-map");
        if (mapContainer) {
            mapContainer.style.display = 'none';
        }
    }
}

// Make actualInitMap globally accessible for Google Maps API callback
window.actualInitMap = actualInitMap;

// Function to open full Google Maps in a new tab
function openFullMap() {
    const encodedAddress = encodeURIComponent(propertyAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
}

// Tab functionality for property details
function showTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab panel
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // Add active class to the clicked tab button
    const clickedButton = event.target;
    clickedButton.classList.add('active');

    // If location tab is selected and map exists, resize it
    if (tabName === 'location' && map) {
        setTimeout(() => {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(propertyCoordinates);
        }, 100);
    }
}

// Function to show property details (can be called from property cards)
function showPropertyDetails(propertyData = null) {
    if (propertyData) {
        // Update property details with provided data
        document.getElementById('property-title').textContent = propertyData.title || 'Beautiful Family Home';
        document.getElementById('property-address').textContent = propertyData.address || propertyAddress;
        document.getElementById('property-price').textContent = propertyData.price || '$525,000';
        document.getElementById('full-address').textContent = propertyData.address || propertyAddress;
        
        // Update seller profile if sellerId is provided
        if (propertyData.sellerId) {
            const seller = getSellerProfile(propertyData.sellerId);
            if (seller) {
                populateSellerProfile(seller);
            }
        } else {
            // Use default seller profile
            const defaultSeller = getSellerProfile('seller-001');
            if (defaultSeller) {
                populateSellerProfile(defaultSeller);
            }
        }
    } else {
        // Use default seller profile when no property data is provided
        const defaultSeller = getSellerProfile('seller-001');
        if (defaultSeller) {
            populateSellerProfile(defaultSeller);
        }
    }
    
    showSection('property-details');
    
    // Initialize map if it hasn't been initialized yet
    if (!map && window.google && window.google.maps) {
        setTimeout(initMap, 100);
    }
}

// Function to populate seller profile in the UI
function populateSellerProfile(seller) {
    const sellerPhoto = document.getElementById('seller-photo');
    const sellerName = document.getElementById('seller-name');
    const sellerTitle = document.getElementById('seller-title');
    const sellerCompany = document.getElementById('seller-company');
    const sellerRating = document.getElementById('seller-rating');
    const sellerExperience = document.getElementById('seller-experience');
    const sellerPhoneLink = document.getElementById('seller-phone-link');
    const sellerEmailLink = document.getElementById('seller-email-link');
    
    if (sellerPhoto) sellerPhoto.src = seller.photo;
    if (sellerName) sellerName.textContent = seller.name;
    if (sellerTitle) sellerTitle.textContent = seller.title;
    if (sellerCompany) sellerCompany.textContent = seller.company;
    if (sellerRating) {
        const stars = '★'.repeat(Math.floor(seller.rating)) + '☆'.repeat(5 - Math.floor(seller.rating));
        sellerRating.innerHTML = `${stars} <span>(${seller.reviewCount} reviews)</span>`;
    }
    if (sellerExperience) sellerExperience.textContent = `${seller.experience} experience`;
    if (sellerPhoneLink) sellerPhoneLink.href = `tel:${seller.phone}`;
    if (sellerEmailLink) sellerEmailLink.href = `mailto:${seller.email}`;
}

// Function to handle seller contact
function contactSeller() {
    // Get current property and seller data
    const propertyTitle = document.getElementById('property-title')?.textContent || 'Property';
    const sellerName = document.getElementById('seller-name')?.textContent || 'Seller';
    const sellerId = 'seller-001'; // This would be dynamic based on current property
    
    const seller = getSellerProfile(sellerId);
    const property = { title: propertyTitle };
    
    if (seller) {
        createSellerContactModal(seller, property);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeTheme();
    initializeSearchFunctionality();
    initializePropertyInteractions();
    initializeAccountFeatures();
    initializeCommunityFeatures();
});

// Dark Mode functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav item
    const clickedItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
}

// Search functionality
function initializeSearchFunctionality() {
    const searchBtn = document.querySelector('.search-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.querySelector('.properties-grid');
    
    // Search button functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Add loading animation
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            
            // Simulate search delay
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-search"></i> Search';
                showSearchResults();
            }, 1500);
        });
    }
    
    // View toggle functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.getAttribute('data-view');
            if (viewType === 'list') {
                propertiesGrid.style.gridTemplateColumns = '1fr';
            } else {
                propertiesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            }
        });
    });
    
    // Filter inputs functionality
    const filterInputs = document.querySelectorAll('.filter-group input, .filter-group select');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add visual feedback for active filters
            if (this.value) {
                this.style.borderColor = '#667eea';
                this.style.background = 'rgba(102, 126, 234, 0.05)';
            } else {
                this.style.borderColor = '#e1e5e9';
                this.style.background = 'white';
            }
        });
    });
}

// Property interactions
function initializePropertyInteractions() {
    // Favorite button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('favorite-btn') || e.target.parentElement.classList.contains('favorite-btn')) {
            const btn = e.target.classList.contains('favorite-btn') ? e.target : e.target.parentElement;
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.color = '#ff6b6b';
                showNotification('Property added to favorites!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.color = '#ccc';
                showNotification('Property removed from favorites!');
            }
        }
    });
    
    // Property card hover effects
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Account features
function initializeAccountFeatures() {
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showNotification('Profile editing feature coming soon!');
        });
    }
    
    // View all saved button
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    viewAllBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Viewing all saved properties...');
        });
    });
    
    // Run search buttons
    const runSearchBtns = document.querySelectorAll('.run-search-btn');
    runSearchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Switch to search section and run the saved search
            const searchNavItem = document.querySelector('[data-section="search"]');
            searchNavItem.click();
            
            setTimeout(() => {
                showNotification('Running saved search...');
            }, 500);
        });
    });
    
    // Notification settings
    const notificationCheckboxes = document.querySelectorAll('.notification-settings input[type="checkbox"]');
    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const setting = this.nextElementSibling.textContent;
            if (this.checked) {
                showNotification(`Enabled: ${setting}`);
            } else {
                showNotification(`Disabled: ${setting}`);
            }
        });
    });
    
    // Account settings options
    const settingOptions = document.querySelectorAll('.setting-option');
    settingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const action = this.textContent.trim();
            showNotification(`${action} feature coming soon!`);
        });
    });
}

// Community features
function initializeCommunityFeatures() {
    // Discussion item interactions
    const discussionItems = document.querySelectorAll('.discussion-item');
    discussionItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`Opening discussion: ${title}`);
        });
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.background = 'rgba(102, 126, 234, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = 'rgba(102, 126, 234, 0.05)';
        });
    });
    
    // Category item interactions
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.querySelector('span').textContent;
            showNotification(`Browsing ${category} discussions...`);
        });
    });
    
    // Contributor interactions
    const contributorItems = document.querySelectorAll('.contributor-item');
    contributorItems.forEach(item => {
        item.addEventListener('click', function() {
            const name = this.querySelector('.name').textContent;
            showNotification(`Viewing ${name}'s profile...`);
        });
    });
}

// Utility functions
function showSearchResults() {
    const resultsHeader = document.querySelector('.results-header h2');
    const currentCount = Math.floor(Math.random() * 500) + 800;
    resultsHeader.textContent = `${currentCount} Properties Found`;
    
    // Add animation to property cards
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Initialize dashboard statistics with animation
function initializeDashboard() {
    const stats = [
        { id: 'totalProperties', target: 1247, suffix: '' },
        { id: 'activeSales', target: 89, suffix: '' },
        { id: 'totalRevenue', target: 2.4, suffix: 'M' },
        { id: 'avgPrice', target: 485, suffix: 'K' }
    ];
    
    stats.forEach(stat => {
        animateCounter(stat.id, stat.target, stat.suffix);
    });
}

function animateCounter(elementId, target, suffix) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (suffix === 'M' || suffix === 'K') {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Add some dynamic content updates
function updateDashboardStats() {
    const statValues = document.querySelectorAll('.stat-info h3');
    
    setInterval(() => {
        statValues.forEach(stat => {
            if (stat.textContent.includes(',')) {
                const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
                const newValue = currentValue + Math.floor(Math.random() * 5);
                stat.textContent = newValue.toLocaleString();
            }
        });
    }, 30000); // Update every 30 seconds
}

// Initialize dynamic updates
updateDashboardStats();

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Enhance tab navigation visibility
        const focusedElement = document.activeElement;
        if (focusedElement) {
            focusedElement.style.outline = '2px solid #667eea';
            focusedElement.style.outlineOffset = '2px';
        }
    }
});

// Add loading states for better perceived performance
function addLoadingStates() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });
}

addLoadingStates();

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Property Comparison Functionality
let selectedProperties = [];

function togglePropertyComparison(checkbox, propertyData) {
    if (checkbox.checked) {
        // Add property to comparison
        if (selectedProperties.length < 4) { // Limit to 4 properties
            selectedProperties.push(propertyData);
            updateComparisonDisplay();
        } else {
            checkbox.checked = false;
            showNotification('You can compare up to 4 properties at a time.');
        }
    } else {
        // Remove property from comparison
        selectedProperties = selectedProperties.filter(prop => prop.id !== propertyData.id);
        updateComparisonDisplay();
    }
}

function updateComparisonDisplay() {
    const selectedCount = document.getElementById('selected-count');
    const comparisonContent = document.getElementById('comparison-content');
    const noPropertiesMessage = comparisonContent.querySelector('.no-properties-message');
    const comparisonTableContainer = comparisonContent.querySelector('.comparison-table-container');

    if (selectedCount) {
        selectedCount.textContent = selectedProperties.length;
    }

    if (selectedProperties.length === 0) {
        noPropertiesMessage.style.display = 'block';
        comparisonTableContainer.style.display = 'none';
    } else {
        noPropertiesMessage.style.display = 'none';
        comparisonTableContainer.style.display = 'block';
        populateComparisonTable();
    }
}

function populateComparisonTable() {
    // Property headers
    const propertiesHeader = document.getElementById('comparison-properties-header');
    propertiesHeader.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-property-header">
            <div class="property-image-small">${prop.image}</div>
            <div class="property-title">${prop.title}</div>
            <button class="remove-property-btn" onclick="removePropertyFromComparison('${prop.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    // Prices
    const prices = document.getElementById('comparison-prices');
    prices.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value price-value">${prop.price}</div>
    `).join('');

    // Price per sq ft
    const pricePerSqft = document.getElementById('comparison-price-per-sqft');
    pricePerSqft.innerHTML = selectedProperties.map(prop => {
        const price = parseInt(prop.price.replace(/[$,]/g, ''));
        const sqft = parseInt(prop.sqft.replace(/,/g, ''));
        const pricePerSqFt = Math.round(price / sqft);
        return `<div class="comparison-value">$${pricePerSqFt}</div>`;
    }).join('');

    // Bedrooms
    const bedrooms = document.getElementById('comparison-bedrooms');
    bedrooms.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">${prop.beds}</div>
    `).join('');

    // Bathrooms
    const bathrooms = document.getElementById('comparison-bathrooms');
    bathrooms.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">${prop.baths}</div>
    `).join('');

    // Square footage
    const sqft = document.getElementById('comparison-sqft');
    sqft.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">${prop.sqft} sq ft</div>
    `).join('');

    // Year built
    const year = document.getElementById('comparison-year');
    year.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">${prop.year}</div>
    `).join('');

    // Locations
    const locations = document.getElementById('comparison-locations');
    locations.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value location-value">${prop.address}</div>
    `).join('');

    // Property types
    const types = document.getElementById('comparison-types');
    types.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">${prop.type}</div>
    `).join('');

    // Actions
    const actions = document.getElementById('comparison-actions');
    actions.innerHTML = selectedProperties.map(prop => `
        <div class="comparison-value">
            <button class="btn btn-sm btn-primary" onclick="showPropertyDetails(${JSON.stringify(prop).replace(/"/g, '&quot;')})">
                View Details
            </button>
        </div>
    `).join('');
}

function removePropertyFromComparison(propertyId) {
    // Uncheck the checkbox
    const checkbox = document.getElementById(propertyId);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Remove from selected properties
    selectedProperties = selectedProperties.filter(prop => prop.id !== propertyId);
    updateComparisonDisplay();
}

function clearComparison() {
    // Uncheck all checkboxes
    selectedProperties.forEach(prop => {
        const checkbox = document.getElementById(prop.id);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    
    selectedProperties = [];
    updateComparisonDisplay();
}

// Market Analysis Functionality
function showAnalysisTab(tabName) {
    // Hide all analysis tab panels
    const tabPanels = document.querySelectorAll('.analysis-tab-panel');
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Remove active class from all analysis tab buttons
    const tabButtons = document.querySelectorAll('.analysis-tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab panel
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // Add active class to the clicked tab button
    event.target.classList.add('active');

    // Initialize chart if trends tab is selected
    if (tabName === 'trends') {
        setTimeout(() => {
            initializePriceChart();
        }, 100);
    }
}

function initializePriceChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Sample data for the last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const prices = [420000, 425000, 430000, 435000, 445000, 450000, 460000, 465000, 470000, 475000, 480000, 485000];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find min and max values
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw grid lines and labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels
    months.forEach((month, index) => {
        const x = padding + (index * chartWidth) / (months.length - 1);
        ctx.fillText(month, x, padding + chartHeight + 20);
    });
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const price = minPrice + (priceRange * i) / 5;
        const y = padding + chartHeight - (i * chartHeight) / 5;
        ctx.fillText('$' + Math.round(price / 1000) + 'K', padding - 10, y + 4);
        
        // Grid lines
        if (i > 0) {
            ctx.strokeStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
    }
    
    // Draw price line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    prices.forEach((price, index) => {
        const x = padding + (index * chartWidth) / (prices.length - 1);
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#ff6b6b';
    prices.forEach((price, index) => {
        const x = padding + (index * chartWidth) / (prices.length - 1);
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Investment Calculator
function calculateInvestment() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const downPaymentPercent = parseFloat(document.getElementById('down-payment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const loanTerm = parseFloat(document.getElementById('loan-term').value) || 0;
    const monthlyRent = parseFloat(document.getElementById('monthly-rent').value) || 0;
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;

    // Calculate loan details
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly mortgage payment
    let monthlyMortgage = 0;
    if (monthlyInterestRate > 0) {
        monthlyMortgage = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
        monthlyMortgage = loanAmount / numberOfPayments;
    }

    // Calculate cash flow
    const monthlyCashFlow = monthlyRent - monthlyMortgage - monthlyExpenses;

    // Calculate annual ROI
    const annualCashFlow = monthlyCashFlow * 12;
    const totalCashInvested = downPayment + (monthlyExpenses * 2); // Assume 2 months expenses as buffer
    const annualROI = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    // Update results
    document.getElementById('cash-flow').textContent = `$${monthlyCashFlow.toFixed(0)}`;
    document.getElementById('cash-flow').className = `result-value ${monthlyCashFlow >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('annual-roi').textContent = `${annualROI.toFixed(1)}%`;
    document.getElementById('annual-roi').className = `result-value ${annualROI >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('monthly-mortgage').textContent = `$${monthlyMortgage.toFixed(0)}`;
    document.getElementById('total-cash').textContent = `$${totalCashInvested.toFixed(0)}`;

    // Show results
    document.getElementById('calculation-results').style.display = 'block';
}

// Sample rental property data
const sampleRentalProperties = [
    {
        id: 'rental-001',
        title: 'Luxury Downtown Apartment',
        address: '321 Main Street, Downtown District, CA 90210',
        price: '$2,800/month',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1400,
        type: 'Apartment',
        yearBuilt: 2021,
        landlordId: 'landlord-001',
        images: ['🏢', '🏠', '🏡', '🏘️'],
        description: 'Modern luxury apartment in the heart of downtown with stunning city views and premium amenities.',
        features: ['City views', 'In-unit washer/dryer', 'Gym access', 'Rooftop pool', 'Parking included'],
        leaseTerms: ['12 months', '6 months'],
        petPolicy: 'Cats allowed',
        availableDate: '2024-11-01',
        deposit: '$2,800'
    },
    {
        id: 'rental-002',
        title: 'Cozy Family House',
        address: '567 Elm Street, Suburban Heights, CA 90213',
        price: '$3,200/month',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1800,
        type: 'Single Family',
        yearBuilt: 2018,
        landlordId: 'landlord-002',
        images: ['🏠', '🏡', '🏢', '🏘️'],
        description: 'Beautiful family home with large backyard, perfect for families with children.',
        features: ['Large backyard', 'Two-car garage', 'Updated kitchen', 'Hardwood floors', 'Near schools'],
        leaseTerms: ['12 months', '24 months'],
        petPolicy: 'Pets allowed with deposit',
        availableDate: '2024-10-15',
        deposit: '$3,200'
    },
    {
        id: 'rental-003',
        title: 'Modern Studio Loft',
        address: '890 Industrial Way, Arts District, CA 90214',
        price: '$1,950/month',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 750,
        type: 'Studio',
        yearBuilt: 2020,
        landlordId: 'landlord-003',
        images: ['🏢', '🏠', '🏡', '🏘️'],
        description: 'Trendy studio loft in the vibrant Arts District with exposed brick and high ceilings.',
        features: ['Exposed brick', 'High ceilings', 'Modern appliances', 'Walk to galleries', 'Bike storage'],
        leaseTerms: ['12 months', '6 months', 'Month-to-month'],
        petPolicy: 'No pets',
        availableDate: '2024-10-20',
        deposit: '$1,950'
    },
    {
        id: 'rental-004',
        title: 'Spacious Townhome',
        address: '234 Oak Ridge Drive, Westside, CA 90215',
        price: '$4,100/month',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2200,
        type: 'Townhouse',
        yearBuilt: 2019,
        landlordId: 'landlord-001',
        images: ['🏘️', '🏠', '🏡', '🏢'],
        description: 'Spacious townhome with modern amenities and community features including pool and playground.',
        features: ['Community pool', 'Playground', 'Attached garage', 'Private patio', 'Central AC'],
        leaseTerms: ['12 months', '18 months'],
        petPolicy: 'Small pets allowed',
        availableDate: '2024-11-15',
        deposit: '$4,100'
    },
    {
        id: 'rental-005',
        title: 'Charming Cottage',
        address: '456 Garden Lane, Riverside, CA 90216',
        price: '$2,400/month',
        bedrooms: 2,
        bathrooms: 1,
        sqft: 1100,
        type: 'House',
        yearBuilt: 2015,
        landlordId: 'landlord-002',
        images: ['🏡', '🏠', '🏢', '🏘️'],
        description: 'Charming cottage with beautiful garden and peaceful neighborhood setting.',
        features: ['Beautiful garden', 'Fireplace', 'Updated bathroom', 'Quiet neighborhood', 'Storage shed'],
        leaseTerms: ['12 months'],
        petPolicy: 'Pets welcome',
        availableDate: '2024-10-30',
        deposit: '$2,400'
    }
];

// Sample landlord profiles
const landlordProfiles = {
    'landlord-001': {
        id: 'landlord-001',
        name: 'David Thompson',
        title: 'Property Owner',
        company: 'Thompson Properties',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMkU4QjU3Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RFQ8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 234-5678',
        email: 'david@thompsonproperties.com',
        experience: '10 years',
        specialties: ['Luxury rentals', 'Downtown properties', 'Corporate housing'],
        rating: 4.9,
        reviewCount: 156,
        bio: 'David owns and manages premium rental properties throughout the city. Known for excellent tenant service and well-maintained properties.',
        responseTime: 'Within 2 hours',
        languages: ['English']
    },
    'landlord-002': {
        id: 'landlord-002',
        name: 'Maria Santos',
        title: 'Property Manager',
        company: 'Family First Rentals',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjZCIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TVM8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 345-6789',
        email: 'maria@familyfirstrentals.com',
        experience: '7 years',
        specialties: ['Family homes', 'Pet-friendly properties', 'Suburban rentals'],
        rating: 4.8,
        reviewCount: 203,
        bio: 'Maria specializes in family-friendly rental properties and is known for her caring approach to tenant relationships.',
        responseTime: 'Within 4 hours',
        languages: ['English', 'Spanish']
    },
    'landlord-003': {
        id: 'landlord-003',
        name: 'Alex Kim',
        title: 'Real Estate Investor',
        company: 'Urban Nest Properties',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNEE5MEUyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QUs8L3RleHQ+Cjwvc3ZnPg==',
        phone: '(555) 456-7890',
        email: 'alex@urbannest.com',
        experience: '5 years',
        specialties: ['Modern apartments', 'Young professionals', 'Tech-enabled properties'],
        rating: 4.7,
        reviewCount: 89,
        bio: 'Alex focuses on modern, tech-enabled rental properties perfect for young professionals and students.',
        responseTime: 'Within 1 hour',
        languages: ['English', 'Korean']
    }
};

// Function to get landlord profile
function getLandlordProfile(landlordId) {
    return landlordProfiles[landlordId] || null;
}

// Function to get rental property data
function getRentalPropertyData(propertyId) {
    return sampleRentalProperties.find(property => property.id === propertyId) || null;
}

// Search mode functionality
let currentSearchMode = 'buy';

function switchSearchMode(mode) {
    currentSearchMode = mode;
    
    // Update button states
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Update price range options
    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-label');
    
    if (mode === 'rent') {
        priceLabel.textContent = 'Monthly Rent';
        priceRange.innerHTML = `
            <option>Any Price</option>
            <option>$0 - $1,500</option>
            <option>$1,500 - $2,500</option>
            <option>$2,500 - $3,500</option>
            <option>$3,500 - $5,000</option>
            <option>$5,000+</option>
        `;
    } else {
        priceLabel.textContent = 'Price Range';
        priceRange.innerHTML = `
            <option>Any Price</option>
            <option>$0 - $300K</option>
            <option>$300K - $500K</option>
            <option>$500K - $750K</option>
            <option>$750K+</option>
        `;
    }
    
    // Update search results
    performPropertySearch();
}

function performPropertySearch() {
    const location = document.getElementById('location-input').value;
    const priceRange = document.getElementById('price-range').value;
    const propertyType = document.getElementById('property-type').value;
    const bedrooms = document.getElementById('bedrooms').value;
    
    let properties;
    let resultsHeader;
    
    if (currentSearchMode === 'rent') {
        properties = filterRentalProperties(location, priceRange, propertyType, bedrooms);
        resultsHeader = `${properties.length} Rental Properties Found`;
        displayRentalResults(properties);
    } else {
        properties = filterBuyProperties(location, priceRange, propertyType, bedrooms);
        resultsHeader = `${properties.length} Properties Found`;
        displayBuyResults(properties);
    }
    
    // Update results header
    const resultsHeaderElement = document.querySelector('.results-header h2');
    if (resultsHeaderElement) {
        resultsHeaderElement.textContent = resultsHeader;
    }
    
    showNotification(`Found ${properties.length} ${currentSearchMode === 'rent' ? 'rental ' : ''}properties matching your criteria`);
}

function filterRentalProperties(location, priceRange, propertyType, bedrooms) {
    let filtered = [...sampleRentalProperties];
    
    // Filter by location
    if (location) {
        filtered = filtered.filter(property => 
            property.address.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Filter by price range
    if (priceRange && priceRange !== 'Any Price') {
        filtered = filtered.filter(property => {
            const price = parseInt(property.price.replace(/[^0-9]/g, ''));
            switch (priceRange) {
                case '$0 - $1,500':
                    return price <= 1500;
                case '$1,500 - $2,500':
                    return price > 1500 && price <= 2500;
                case '$2,500 - $3,500':
                    return price > 2500 && price <= 3500;
                case '$3,500 - $5,000':
                    return price > 3500 && price <= 5000;
                case '$5,000+':
                    return price > 5000;
                default:
                    return true;
            }
        });
    }
    
    // Filter by property type
    if (propertyType && propertyType !== 'All Types') {
        filtered = filtered.filter(property => 
            property.type.toLowerCase().includes(propertyType.toLowerCase())
        );
    }
    
    // Filter by bedrooms
    if (bedrooms && bedrooms !== 'Any') {
        const bedroomCount = parseInt(bedrooms.replace('+', ''));
        filtered = filtered.filter(property => property.bedrooms >= bedroomCount);
    }
    
    return filtered;
}

function filterBuyProperties(location, priceRange, propertyType, bedrooms) {
    let filtered = [...sampleProperties];
    
    // Filter by location
    if (location) {
        filtered = filtered.filter(property => 
            property.address.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Filter by price range
    if (priceRange && priceRange !== 'Any Price') {
        filtered = filtered.filter(property => {
            const price = parseInt(property.price.replace(/[^0-9]/g, ''));
            switch (priceRange) {
                case '$0 - $300K':
                    return price <= 300000;
                case '$300K - $500K':
                    return price > 300000 && price <= 500000;
                case '$500K - $750K':
                    return price > 500000 && price <= 750000;
                case '$750K+':
                    return price > 750000;
                default:
                    return true;
            }
        });
    }
    
    // Filter by property type
    if (propertyType && propertyType !== 'All Types') {
        filtered = filtered.filter(property => 
            property.type.toLowerCase().includes(propertyType.toLowerCase())
        );
    }
    
    // Filter by bedrooms
    if (bedrooms && bedrooms !== 'Any') {
        const bedroomCount = parseInt(bedrooms.replace('+', ''));
        filtered = filtered.filter(property => property.bedrooms >= bedroomCount);
    }
    
    return filtered;
}

function displayRentalResults(properties) {
    const propertiesGrid = document.querySelector('.properties-grid');
    if (!propertiesGrid) return;
    
    propertiesGrid.innerHTML = properties.map(property => `
        <div class="property-card">
            <div class="property-comparison-checkbox">
                <input type="checkbox" id="${property.id}" class="comparison-checkbox" 
                       onchange="togglePropertyComparison(this, ${JSON.stringify(property).replace(/"/g, '&quot;')})">
                <label for="${property.id}" class="comparison-label">
                    <i class="fas fa-balance-scale"></i>
                    Compare
                </label>
            </div>
            <div class="property-image">
                <div class="placeholder-image">${property.images[0]}</div>
                <div class="property-badge">For Rent</div>
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location">📍 ${property.address.split(',')[1]?.trim() || 'Location'}</p>
                <p class="specs">${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft} sq ft</p>
                <p class="lease-info">Available: ${property.availableDate}</p>
                <div class="property-footer">
                    <span class="price">${property.price}</span>
                    <button class="favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation to property cards
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function displayBuyResults(properties) {
    const propertiesGrid = document.querySelector('.properties-grid');
    if (!propertiesGrid) return;
    
    propertiesGrid.innerHTML = properties.map(property => `
        <div class="property-card">
            <div class="property-comparison-checkbox">
                <input type="checkbox" id="${property.id}" class="comparison-checkbox" 
                       onchange="togglePropertyComparison(this, ${JSON.stringify(property).replace(/"/g, '&quot;')})">
                <label for="${property.id}" class="comparison-label">
                    <i class="fas fa-balance-scale"></i>
                    Compare
                </label>
            </div>
            <div class="property-image">
                <div class="placeholder-image">${property.images[0]}</div>
                <div class="property-badge">For Sale</div>
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location">📍 ${property.address.split(',')[1]?.trim() || 'Location'}</p>
                <p class="specs">${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft} sq ft</p>
                <div class="property-footer">
                    <span class="price">${property.price}</span>
                    <button class="favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add animation to property cards
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ... existing code ...