// Mock Authentication System for Demo
// This replaces Supabase with a local authentication system for demonstration purposes

// Mock user storage
const MOCK_USERS_KEY = 'real_estate_hub_users';
const CURRENT_USER_KEY = 'real_estate_hub_current_user';

// Helper functions for local storage
function getMockUsers() {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    if (users) {
        return JSON.parse(users);
    }
    
    // Initialize with default demo users
    const defaultUsers = [
        {
            id: 'demo_user_1',
            email: 'demo@example.com',
            first_name: 'Demo',
            last_name: 'User',
            full_name: 'Demo User',
            password_hash: btoa('demo123'), // password: demo123
            created_at: new Date().toISOString(),
            email_verified: true
        },
        {
            id: 'demo_user_2',
            email: 'john@example.com',
            first_name: 'John',
            last_name: 'Doe',
            full_name: 'John Doe',
            password_hash: btoa('password123'), // password: password123
            created_at: new Date().toISOString(),
            email_verified: true
        }
    ];
    
    saveMockUsers(defaultUsers);
    return defaultUsers;
}

function saveMockUsers(users) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function getCurrentUserData() {
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
}

function setCurrentUserData(userData) {
    if (userData) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

// Authentication Functions

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {Object} - Result object with success status and data/error
 */
async function signUpUser(email, password, firstName, lastName) {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const users = getMockUsers();
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return {
                success: false,
                error: 'User with this email already exists'
            };
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: email,
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            created_at: new Date().toISOString(),
            email_verified: true // Mock as verified for demo
        };
        
        // Store password hash (in real app, this would be properly hashed)
        newUser.password_hash = btoa(password); // Simple base64 encoding for demo
        
        users.push(newUser);
        saveMockUsers(users);
        
        // Auto sign in the new user
        setCurrentUserData({
            user: newUser,
            session: {
                access_token: 'mock_token_' + newUser.id,
                expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }
        });
        
        return {
            success: true,
            data: { user: newUser },
            message: 'Account created successfully! You are now signed in.'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred during sign up'
        };
    }
}

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - Result object with success status and data/error
 */
async function signInUser(email, password) {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const users = getMockUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return {
                success: false,
                error: 'No account found with this email address'
            };
        }
        
        // Check password (in real app, this would use proper password hashing)
        if (atob(user.password_hash) !== password) {
            return {
                success: false,
                error: 'Invalid password'
            };
        }
        
        // Create session
        const sessionData = {
            user: user,
            session: {
                access_token: 'mock_token_' + user.id,
                expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }
        };
        
        setCurrentUserData(sessionData);
        
        return {
            success: true,
            data: sessionData,
            message: 'Signed in successfully!'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred during sign in'
        };
    }
}

/**
 * Sign out the current user
 * @returns {Object} - Result object with success status
 */
async function signOutUser() {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Clear current user data
        setCurrentUserData(null);

        return {
            success: true,
            message: 'Successfully signed out!'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred during sign out'
        };
    }
}

/**
 * Get the current user session
 * @returns {Object|null} - Current session or null if not authenticated
 */
async function getCurrentUser() {
    try {
        const userData = getCurrentUserData();
        if (!userData || !userData.session) {
            return null;
        }
        
        // Check if session is expired
        if (userData.session.expires_at < Date.now()) {
            setCurrentUserData(null);
            return null;
        }
        
        return userData.user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
async function isAuthenticated() {
    const session = await getCurrentUser();
    return session !== null && session.user !== null;
}

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Object} - Result object with success status
 */
async function resetPassword(email) {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const users = getMockUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return {
                success: false,
                error: 'No account found with this email address'
            };
        }

        // In a real app, this would send an actual email
        // For demo purposes, we'll just simulate success
        return {
            success: true,
            message: 'Password reset email sent! Please check your inbox. (Demo: Password reset functionality simulated)'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred while sending reset email'
        };
    }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Object} - Result object with success status
 */
async function updatePassword(newPassword) {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentUserData = getCurrentUserData();
        if (!currentUserData || !currentUserData.user) {
            return {
                success: false,
                error: 'No user is currently signed in'
            };
        }
        
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.id === currentUserData.user.id);
        
        if (userIndex === -1) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        // Update password hash
        users[userIndex].password_hash = btoa(newPassword);
        saveMockUsers(users);
        
        return {
            success: true,
            message: 'Password updated successfully!'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred while updating password'
        };
    }
}

/**
 * Update user profile
 * @param {Object} updates - Object containing profile updates
 * @returns {Object} - Result object with success status
 */
async function updateUserProfile(updates) {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentUserData = getCurrentUserData();
        if (!currentUserData || !currentUserData.user) {
            return {
                success: false,
                error: 'No user is currently signed in'
            };
        }
        
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.id === currentUserData.user.id);
        
        if (userIndex === -1) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        // Update user profile
        users[userIndex] = { ...users[userIndex], ...updates };
        saveMockUsers(users);
        
        // Update current user data
        const updatedUserData = {
            ...currentUserData,
            user: users[userIndex]
        };
        setCurrentUserData(updatedUserData);

        return {
            success: true,
            message: 'Profile updated successfully!'
        };
    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred while updating profile'
        };
    }
}

/**
 * Get user data from local storage or session
 * @returns {Object|null} - User data or null if not found
 */
function getUserData() {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

/**
 * Initialize authentication state listener (Mock version)
 */
function initAuthStateListener() {
    // Mock auth state listener - check current user on page load
    const currentUserData = getCurrentUserData();
    
    if (currentUserData && currentUserData.user) {
        // Check if session is still valid
        if (currentUserData.session.expires_at > Date.now()) {
            console.log('Mock auth: User is signed in');
            updateUIForAuthenticatedUser(currentUserData.user);
        } else {
            console.log('Mock auth: Session expired, signing out');
            setCurrentUserData(null);
            updateUIForUnauthenticatedUser();
        }
    } else {
        console.log('Mock auth: No user signed in');
        updateUIForUnauthenticatedUser();
    }
    
    // Set up periodic session check (every 5 minutes)
    setInterval(() => {
        const userData = getCurrentUserData();
        if (userData && userData.session.expires_at <= Date.now()) {
            console.log('Mock auth: Session expired during use');
            setCurrentUserData(null);
            updateUIForUnauthenticatedUser();
        }
    }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Update UI for authenticated user
 * @param {Object} user - User object
 */
function updateUIForAuthenticatedUser(user) {
    // Update navigation to show user info and logout
    const accountBtn = document.querySelector('[data-section="account"]');
    if (accountBtn) {
        const userName = user.user_metadata?.full_name || user.email;
        accountBtn.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${userName}</span>
        `;
    }

    // Show logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }

    // Hide login/signup buttons if they exist
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
}

/**
 * Update UI for unauthenticated user
 */
function updateUIForUnauthenticatedUser() {
    // Reset navigation
    const accountBtn = document.querySelector('[data-section="account"]');
    if (accountBtn) {
        accountBtn.innerHTML = `
            <i class="fas fa-user"></i>
            <span>Account</span>
        `;
    }

    // Hide logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }

    // Show login/signup buttons if they exist
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (loginBtn) loginBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
}

/**
 * Protect routes - redirect to login if not authenticated
 * @param {Array} protectedPages - Array of page names that require authentication
 */
async function protectRoutes(protectedPages = []) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (protectedPages.includes(currentPage)) {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            window.location.href = 'login.html';
            return false;
        }
    }
    return true;
}

/**
 * Initialize authentication on page load
 */
async function initAuth() {
    // Initialize auth state listener
    initAuthStateListener();

    // Check current authentication status
    const session = await getCurrentUser();
    if (session && session.user) {
        updateUIForAuthenticatedUser(session.user);
    } else {
        updateUIForUnauthenticatedUser();
    }

    // Add logout functionality if logout button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const result = await signOutUser();
            if (result.success) {
                window.location.href = 'index.html';
            }
        });
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export functions for global use
/**
 * Update UI based on current authentication state
 */
async function updateAuthUI() {
    try {
        const user = await getCurrentUser();
        if (user) {
            updateUIForAuthenticatedUser(user);
        } else {
            updateUIForUnauthenticatedUser();
        }
    } catch (error) {
        console.error('Error updating auth UI:', error);
        updateUIForUnauthenticatedUser();
    }
}

window.authFunctions = {
    signUpUser,
    signInUser,
    signOutUser,
    getCurrentUser,
    isAuthenticated,
    resetPassword,
    updatePassword,
    updateUserProfile,
    getUserData,
    protectRoutes,
    updateAuthUI
};