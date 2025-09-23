// Property Tracking System
// Monitors property engagement metrics for bidding war detection

class PropertyTracker {
    constructor() {
        this.storageKey = 'propertyTracking';
        this.userStorageKey = 'userPropertyData';
        this.initializeStorage();
    }

    // Initialize local storage for property tracking
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.userStorageKey)) {
            localStorage.setItem(this.userStorageKey, JSON.stringify({
                likedProperties: [],
                viewedProperties: [],
                notifications: {
                    biddingWar: true,
                    priceDrops: true,
                    similarProperties: true
                }
            }));
        }
    }

    // Get all tracking data
    getTrackingData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('Error reading tracking data:', error);
            return {};
        }
    }

    // Save tracking data
    saveTrackingData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving tracking data:', error);
        }
    }

    // Get user property data
    getUserData() {
        try {
            return JSON.parse(localStorage.getItem(this.userStorageKey)) || {
                likedProperties: [],
                viewedProperties: [],
                notifications: {
                    biddingWar: true,
                    priceDrops: true,
                    similarProperties: true
                }
            };
        } catch (error) {
            console.error('Error reading user data:', error);
            return {
                likedProperties: [],
                viewedProperties: [],
                notifications: {
                    biddingWar: true,
                    priceDrops: true,
                    similarProperties: true
                }
            };
        }
    }

    // Save user property data
    saveUserData(data) {
        try {
            localStorage.setItem(this.userStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    // Track property view
    trackPropertyView(propertyId, propertyData = {}) {
        const trackingData = this.getTrackingData();
        const userData = this.getUserData();
        const now = new Date().toISOString();

        // Initialize property tracking if not exists
        if (!trackingData[propertyId]) {
            trackingData[propertyId] = {
                views: [],
                likes: [],
                totalViews: 0,
                totalLikes: 0,
                firstViewed: now,
                lastViewed: now,
                propertyData: propertyData
            };
        }

        // Add view record
        trackingData[propertyId].views.push({
            timestamp: now,
            sessionId: this.getSessionId(),
            userAgent: navigator.userAgent
        });

        trackingData[propertyId].totalViews++;
        trackingData[propertyId].lastViewed = now;

        // Update user viewed properties
        const existingView = userData.viewedProperties.find(p => p.id === propertyId);
        if (existingView) {
            existingView.lastViewed = now;
            existingView.viewCount = (existingView.viewCount || 0) + 1;
        } else {
            userData.viewedProperties.push({
                id: propertyId,
                firstViewed: now,
                lastViewed: now,
                viewCount: 1,
                propertyData: propertyData
            });
        }

        // Keep only last 100 viewed properties
        if (userData.viewedProperties.length > 100) {
            userData.viewedProperties = userData.viewedProperties
                .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
                .slice(0, 100);
        }

        this.saveTrackingData(trackingData);
        this.saveUserData(userData);

        console.log(`Property ${propertyId} view tracked`);
        return trackingData[propertyId];
    }

    // Track property like
    trackPropertyLike(propertyId, propertyData = {}) {
        const trackingData = this.getTrackingData();
        const userData = this.getUserData();
        const now = new Date().toISOString();

        // Initialize property tracking if not exists
        if (!trackingData[propertyId]) {
            trackingData[propertyId] = {
                views: [],
                likes: [],
                totalViews: 0,
                totalLikes: 0,
                firstViewed: now,
                lastViewed: now,
                propertyData: propertyData
            };
        }

        // Add like record
        trackingData[propertyId].likes.push({
            timestamp: now,
            sessionId: this.getSessionId()
        });

        trackingData[propertyId].totalLikes++;

        // Update user liked properties
        const existingLike = userData.likedProperties.find(p => p.id === propertyId);
        if (!existingLike) {
            userData.likedProperties.push({
                id: propertyId,
                likedAt: now,
                propertyData: propertyData
            });
        }

        this.saveTrackingData(trackingData);
        this.saveUserData(userData);

        console.log(`Property ${propertyId} like tracked`);
        return trackingData[propertyId];
    }

    // Remove property like
    removePropertyLike(propertyId) {
        const userData = this.getUserData();
        userData.likedProperties = userData.likedProperties.filter(p => p.id !== propertyId);
        this.saveUserData(userData);

        console.log(`Property ${propertyId} like removed`);
    }

    // Get property metrics
    getPropertyMetrics(propertyId) {
        const trackingData = this.getTrackingData();
        const propertyData = trackingData[propertyId];

        if (!propertyData) {
            return {
                totalViews: 0,
                totalLikes: 0,
                views24h: 0,
                views7d: 0,
                likes24h: 0,
                likes7d: 0,
                competitionScore: 0
            };
        }

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const views24h = propertyData.views.filter(v => 
            new Date(v.timestamp) > oneDayAgo
        ).length;

        const views7d = propertyData.views.filter(v => 
            new Date(v.timestamp) > sevenDaysAgo
        ).length;

        const likes24h = propertyData.likes.filter(l => 
            new Date(l.timestamp) > oneDayAgo
        ).length;

        const likes7d = propertyData.likes.filter(l => 
            new Date(l.timestamp) > sevenDaysAgo
        ).length;

        // Calculate competition score (0-100)
        const competitionScore = this.calculateCompetitionScore({
            totalViews: propertyData.totalViews,
            totalLikes: propertyData.totalLikes,
            views24h,
            views7d,
            likes24h,
            likes7d
        });

        return {
            totalViews: propertyData.totalViews,
            totalLikes: propertyData.totalLikes,
            views24h,
            views7d,
            likes24h,
            likes7d,
            competitionScore,
            firstViewed: propertyData.firstViewed,
            lastViewed: propertyData.lastViewed
        };
    }

    // Calculate competition score
    calculateCompetitionScore(metrics) {
        let score = 0;

        // Views scoring
        if (metrics.views24h >= 50) score += 30;
        else if (metrics.views24h >= 20) score += 20;
        else if (metrics.views24h >= 10) score += 10;

        // Likes scoring
        if (metrics.totalLikes >= 20) score += 25;
        else if (metrics.totalLikes >= 10) score += 15;
        else if (metrics.totalLikes >= 5) score += 10;

        // Recent activity scoring
        if (metrics.likes24h >= 5) score += 20;
        else if (metrics.likes24h >= 2) score += 10;

        // Weekly trend scoring
        if (metrics.views7d >= 100) score += 15;
        else if (metrics.views7d >= 50) score += 10;

        // Engagement rate scoring
        const engagementRate = metrics.totalViews > 0 ? 
            (metrics.totalLikes / metrics.totalViews) * 100 : 0;
        
        if (engagementRate >= 10) score += 10;
        else if (engagementRate >= 5) score += 5;

        return Math.min(score, 100);
    }

    // Get user's liked properties
    getUserLikedProperties() {
        const userData = this.getUserData();
        return userData.likedProperties || [];
    }

    // Get user's viewed properties
    getUserViewedProperties() {
        const userData = this.getUserData();
        return userData.viewedProperties || [];
    }

    // Check if property is liked by user
    isPropertyLiked(propertyId) {
        const userData = this.getUserData();
        return userData.likedProperties.some(p => p.id === propertyId);
    }

    // Get properties with high competition
    getHighCompetitionProperties(threshold = 70) {
        const trackingData = this.getTrackingData();
        const highCompetitionProperties = [];

        for (const [propertyId, data] of Object.entries(trackingData)) {
            const metrics = this.getPropertyMetrics(propertyId);
            if (metrics.competitionScore >= threshold) {
                highCompetitionProperties.push({
                    propertyId,
                    metrics,
                    propertyData: data.propertyData
                });
            }
        }

        return highCompetitionProperties.sort((a, b) => 
            b.metrics.competitionScore - a.metrics.competitionScore
        );
    }

    // Get trending properties
    getTrendingProperties(limit = 10) {
        const trackingData = this.getTrackingData();
        const trendingProperties = [];

        for (const [propertyId, data] of Object.entries(trackingData)) {
            const metrics = this.getPropertyMetrics(propertyId);
            if (metrics.views24h > 0 || metrics.likes24h > 0) {
                trendingProperties.push({
                    propertyId,
                    metrics,
                    propertyData: data.propertyData,
                    trendScore: metrics.views24h * 2 + metrics.likes24h * 5
                });
            }
        }

        return trendingProperties
            .sort((a, b) => b.trendScore - a.trendScore)
            .slice(0, limit);
    }

    // Update notification preferences
    updateNotificationPreferences(preferences) {
        const userData = this.getUserData();
        userData.notifications = { ...userData.notifications, ...preferences };
        this.saveUserData(userData);
    }

    // Get notification preferences
    getNotificationPreferences() {
        const userData = this.getUserData();
        return userData.notifications || {
            biddingWar: true,
            priceDrops: true,
            similarProperties: true
        };
    }

    // Generate session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('propertyTrackerSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('propertyTrackerSessionId', sessionId);
        }
        return sessionId;
    }

    // Clean old data (keep last 30 days)
    cleanOldData() {
        const trackingData = this.getTrackingData();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        for (const [propertyId, data] of Object.entries(trackingData)) {
            // Clean old views
            data.views = data.views.filter(v => 
                new Date(v.timestamp) > thirtyDaysAgo
            );

            // Clean old likes
            data.likes = data.likes.filter(l => 
                new Date(l.timestamp) > thirtyDaysAgo
            );

            // Update totals
            data.totalViews = data.views.length;
            data.totalLikes = data.likes.length;

            // Remove property if no recent activity
            if (data.views.length === 0 && data.likes.length === 0) {
                delete trackingData[propertyId];
            }
        }

        this.saveTrackingData(trackingData);
        console.log('Old tracking data cleaned');
    }

    // Export tracking data
    exportData() {
        return {
            tracking: this.getTrackingData(),
            user: this.getUserData(),
            exportDate: new Date().toISOString()
        };
    }

    // Import tracking data
    importData(data) {
        if (data.tracking) {
            this.saveTrackingData(data.tracking);
        }
        if (data.user) {
            this.saveUserData(data.user);
        }
        console.log('Tracking data imported');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropertyTracker;
} else {
    window.PropertyTracker = PropertyTracker;
}