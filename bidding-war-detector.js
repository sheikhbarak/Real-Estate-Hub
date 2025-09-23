// Bidding War Detection Algorithm
// Analyzes property metrics and market conditions to detect high competition scenarios

class BiddingWarDetector {
    constructor(propertyTracker, emailService) {
        this.propertyTracker = propertyTracker;
        this.emailService = emailService;
        this.detectionRules = this.initializeDetectionRules();
        this.notificationCooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.lastNotifications = this.getLastNotifications();
    }

    // Initialize detection rules and thresholds
    initializeDetectionRules() {
        return {
            // High competition thresholds
            highCompetition: {
                views24h: 30,           // Views in last 24 hours
                likes24h: 5,            // Likes in last 24 hours
                totalLikes: 10,         // Total likes threshold
                competitionScore: 75,   // Competition score threshold
                engagementRate: 8       // Engagement rate percentage
            },
            
            // Medium competition thresholds
            mediumCompetition: {
                views24h: 15,
                likes24h: 3,
                totalLikes: 5,
                competitionScore: 50,
                engagementRate: 5
            },
            
            // Market indicators
            marketIndicators: {
                similarPropertiesSold7d: 3,     // Similar properties sold in 7 days
                priceDropsInArea: 2,            // Recent price drops in area
                newListingsInArea: 5,           // New listings in area
                averageDaysOnMarket: 30         // Average days on market
            },
            
            // Notification triggers
            triggers: {
                immediateAlert: 85,     // Competition score for immediate alert
                urgentAlert: 70,        // Competition score for urgent alert
                watchAlert: 50          // Competition score for watch alert
            }
        };
    }

    // Get last notifications from storage
    getLastNotifications() {
        try {
            const stored = localStorage.getItem('biddingWarNotifications');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error reading notification history:', error);
            return {};
        }
    }

    // Save notification history
    saveLastNotifications() {
        try {
            localStorage.setItem('biddingWarNotifications', JSON.stringify(this.lastNotifications));
        } catch (error) {
            console.error('Error saving notification history:', error);
        }
    }

    // Main detection function - checks all user's liked properties
    async detectBiddingWars() {
        const likedProperties = this.propertyTracker.getUserLikedProperties();
        const detectedWars = [];

        for (const likedProperty of likedProperties) {
            const detection = await this.analyzeProperty(likedProperty.id, likedProperty.propertyData);
            if (detection.isBiddingWar) {
                detectedWars.push({
                    propertyId: likedProperty.id,
                    propertyData: likedProperty.propertyData,
                    detection: detection
                });

                // Send notification if needed
                await this.handleBiddingWarNotification(likedProperty, detection);
            }
        }

        return detectedWars;
    }

    // Analyze individual property for bidding war indicators
    async analyzeProperty(propertyId, propertyData = {}) {
        const metrics = this.propertyTracker.getPropertyMetrics(propertyId);
        const marketData = await this.getMarketData(propertyData);
        
        const analysis = {
            propertyId,
            metrics,
            marketData,
            indicators: this.calculateIndicators(metrics, marketData),
            competitionLevel: this.determineCompetitionLevel(metrics, marketData),
            isBiddingWar: false,
            warningLevel: 'none', // none, low, medium, high, critical
            recommendations: [],
            timestamp: new Date().toISOString()
        };

        // Determine if this constitutes a bidding war
        analysis.isBiddingWar = this.isBiddingWarScenario(analysis);
        analysis.warningLevel = this.getWarningLevel(analysis);
        analysis.recommendations = this.generateRecommendations(analysis);

        return analysis;
    }

    // Calculate various indicators
    calculateIndicators(metrics, marketData) {
        const rules = this.detectionRules;
        
        return {
            // Activity indicators
            highViewActivity: metrics.views24h >= rules.highCompetition.views24h,
            highLikeActivity: metrics.likes24h >= rules.highCompetition.likes24h,
            popularProperty: metrics.totalLikes >= rules.highCompetition.totalLikes,
            
            // Engagement indicators
            highEngagement: this.calculateEngagementRate(metrics) >= rules.highCompetition.engagementRate,
            recentSurge: this.detectActivitySurge(metrics),
            
            // Market indicators
            hotMarket: marketData.similarSold >= rules.marketIndicators.similarPropertiesSold7d,
            fastSelling: marketData.avgDaysOnMarket < rules.marketIndicators.averageDaysOnMarket,
            competitiveArea: marketData.newListings >= rules.marketIndicators.newListingsInArea,
            
            // Time-based indicators
            weekendActivity: this.isWeekendActivity(),
            peakHours: this.isPeakHours(),
            
            // Trend indicators
            growingInterest: this.isGrowingInterest(metrics),
            acceleratingViews: this.isAcceleratingViews(metrics)
        };
    }

    // Calculate engagement rate
    calculateEngagementRate(metrics) {
        if (metrics.totalViews === 0) return 0;
        return (metrics.totalLikes / metrics.totalViews) * 100;
    }

    // Detect activity surge in recent hours
    detectActivitySurge(metrics) {
        const recentViews = metrics.views24h;
        const weeklyAverage = metrics.views7d / 7;
        return recentViews > (weeklyAverage * 2);
    }

    // Check if current time is weekend
    isWeekendActivity() {
        const now = new Date();
        const day = now.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }

    // Check if current time is peak hours (6-9 PM)
    isPeakHours() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 18 && hour <= 21;
    }

    // Check if interest is growing over time
    isGrowingInterest(metrics) {
        // Simple heuristic: more activity in last 24h than previous 24h
        return metrics.views24h > (metrics.views7d - metrics.views24h) / 6;
    }

    // Check if views are accelerating
    isAcceleratingViews(metrics) {
        // More views in last 24h than the 7-day average
        const dailyAverage = metrics.views7d / 7;
        return metrics.views24h > (dailyAverage * 1.5);
    }

    // Determine overall competition level
    determineCompetitionLevel(metrics, marketData) {
        const score = metrics.competitionScore;
        const rules = this.detectionRules;

        if (score >= rules.triggers.immediateAlert) return 'critical';
        if (score >= rules.triggers.urgentAlert) return 'high';
        if (score >= rules.triggers.watchAlert) return 'medium';
        return 'low';
    }

    // Determine if this is a bidding war scenario
    isBiddingWarScenario(analysis) {
        const { indicators, metrics, competitionLevel } = analysis;
        const rules = this.detectionRules;

        // Critical level - definitely a bidding war
        if (competitionLevel === 'critical') return true;

        // High level with multiple indicators
        if (competitionLevel === 'high' && (
            indicators.highViewActivity && indicators.highLikeActivity ||
            indicators.hotMarket && indicators.highEngagement ||
            indicators.recentSurge && indicators.popularProperty
        )) return true;

        // Medium level with strong market indicators
        if (competitionLevel === 'medium' && 
            indicators.hotMarket && 
            indicators.fastSelling && 
            indicators.growingInterest) return true;

        return false;
    }

    // Get warning level
    getWarningLevel(analysis) {
        if (!analysis.isBiddingWar) return 'none';
        
        const { competitionLevel, indicators } = analysis;
        
        if (competitionLevel === 'critical') return 'critical';
        if (competitionLevel === 'high') return 'high';
        if (indicators.hotMarket && indicators.fastSelling) return 'medium';
        return 'low';
    }

    // Generate recommendations based on analysis
    generateRecommendations(analysis) {
        const recommendations = [];
        const { indicators, competitionLevel, warningLevel } = analysis;

        if (warningLevel === 'critical') {
            recommendations.push('🚨 URGENT: Schedule viewing immediately');
            recommendations.push('💰 Prepare your best offer - consider going above asking price');
            recommendations.push('📋 Get pre-approval letter ready');
            recommendations.push('⚡ Contact your agent NOW');
        } else if (warningLevel === 'high') {
            recommendations.push('🏃‍♂️ Schedule viewing within 24 hours');
            recommendations.push('💵 Prepare competitive offer');
            recommendations.push('📞 Contact your real estate agent');
            recommendations.push('🔍 Research comparable sales');
        } else if (warningLevel === 'medium') {
            recommendations.push('📅 Schedule viewing this week');
            recommendations.push('💡 Research the property thoroughly');
            recommendations.push('📊 Analyze recent sales in the area');
            recommendations.push('🤝 Consider making an offer soon');
        }

        // Add specific recommendations based on indicators
        if (indicators.hotMarket) {
            recommendations.push('🔥 Market is hot - properties selling fast');
        }
        if (indicators.weekendActivity) {
            recommendations.push('📅 High weekend activity - many buyers looking');
        }
        if (indicators.recentSurge) {
            recommendations.push('📈 Recent surge in interest detected');
        }

        return recommendations;
    }

    // Get market data (simulated - in real app would call external APIs)
    async getMarketData(propertyData) {
        // Simulate market data - in real implementation, this would call
        // real estate APIs, MLS data, or your backend
        return {
            similarSold: Math.floor(Math.random() * 8), // 0-7 similar properties sold
            avgDaysOnMarket: 20 + Math.floor(Math.random() * 40), // 20-60 days
            newListings: Math.floor(Math.random() * 10), // 0-9 new listings
            priceDrops: Math.floor(Math.random() * 5), // 0-4 price drops
            marketTrend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)],
            inventoryLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };
    }

    // Handle bidding war notification
    async handleBiddingWarNotification(likedProperty, detection) {
        const propertyId = likedProperty.id;
        const now = Date.now();
        
        // Check cooldown period
        if (this.lastNotifications[propertyId] && 
            (now - this.lastNotifications[propertyId]) < this.notificationCooldown) {
            console.log(`Notification cooldown active for property ${propertyId}`);
            return;
        }

        // Check user notification preferences
        const preferences = this.propertyTracker.getNotificationPreferences();
        if (!preferences.biddingWar) {
            console.log('Bidding war notifications disabled by user');
            return;
        }

        // Get user email (in real app, this would come from authentication)
        const user = window.auth?.getCurrentUser?.() || { email: 'user@example.com' };
        
        try {
            // Prepare warning data for email
            const warningData = {
                views24h: detection.metrics.views24h,
                totalLikes: detection.metrics.totalLikes,
                similarSold: detection.marketData.similarSold,
                competitionLevel: detection.competitionLevel,
                warningLevel: detection.warningLevel,
                recommendations: detection.recommendations
            };

            // Send email notification
            await this.emailService.sendBiddingWarWarning(
                user.email,
                likedProperty.propertyData,
                warningData
            );

            // Update notification history
            this.lastNotifications[propertyId] = now;
            this.saveLastNotifications();

            console.log(`Bidding war notification sent for property ${propertyId}`);
            
            // Show in-app notification
            this.showInAppNotification(likedProperty.propertyData, detection);
            
        } catch (error) {
            console.error('Failed to send bidding war notification:', error);
        }
    }

    // Show in-app notification
    showInAppNotification(propertyData, detection) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'bidding-war-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🚨</div>
                <div class="notification-text">
                    <strong>Bidding War Alert!</strong><br>
                    High competition detected for ${propertyData.address}
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-icon {
                    font-size: 24px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // Start continuous monitoring
    startMonitoring(intervalMinutes = 30) {
        console.log(`Starting bidding war monitoring (checking every ${intervalMinutes} minutes)`);
        
        // Initial check
        this.detectBiddingWars();
        
        // Set up periodic checks
        this.monitoringInterval = setInterval(() => {
            this.detectBiddingWars();
        }, intervalMinutes * 60 * 1000);
    }

    // Stop monitoring
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('Bidding war monitoring stopped');
        }
    }

    // Get detection statistics
    getDetectionStats() {
        const likedProperties = this.propertyTracker.getUserLikedProperties();
        const stats = {
            totalLikedProperties: likedProperties.length,
            propertiesWithHighCompetition: 0,
            propertiesWithMediumCompetition: 0,
            averageCompetitionScore: 0,
            totalNotificationsSent: Object.keys(this.lastNotifications).length
        };

        let totalScore = 0;
        for (const property of likedProperties) {
            const metrics = this.propertyTracker.getPropertyMetrics(property.id);
            totalScore += metrics.competitionScore;
            
            if (metrics.competitionScore >= 70) {
                stats.propertiesWithHighCompetition++;
            } else if (metrics.competitionScore >= 50) {
                stats.propertiesWithMediumCompetition++;
            }
        }

        if (likedProperties.length > 0) {
            stats.averageCompetitionScore = Math.round(totalScore / likedProperties.length);
        }

        return stats;
    }

    // Update detection rules
    updateDetectionRules(newRules) {
        this.detectionRules = { ...this.detectionRules, ...newRules };
        console.log('Detection rules updated');
    }

    // Export detection data
    exportDetectionData() {
        return {
            rules: this.detectionRules,
            notifications: this.lastNotifications,
            stats: this.getDetectionStats(),
            exportDate: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BiddingWarDetector;
} else {
    window.BiddingWarDetector = BiddingWarDetector;
}