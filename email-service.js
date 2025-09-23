// Email Service with Resend Integration
// Handles all email notifications for the Real Estate Hub app

class EmailService {
    constructor() {
        this.apiKey = 're_Amj7pdpP_Exbh1eB5DE9kEqDpLCav5449';
        this.baseUrl = 'https://api.resend.com';
        this.fromEmail = 'noreply@realestatehub.com'; // Update with your verified domain
    }

    // Send bidding war warning email
    async sendBiddingWarWarning(userEmail, propertyData, warningData) {
        try {
            const emailData = {
                from: this.fromEmail,
                to: userEmail,
                subject: `🚨 Bidding War Alert: High Interest in ${propertyData.address}`,
                html: this.generateBiddingWarTemplate(propertyData, warningData)
            };

            const response = await this.sendEmail(emailData);
            console.log('Bidding war warning sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to send bidding war warning:', error);
            throw error;
        }
    }

    // Send property price drop notification
    async sendPriceDropAlert(userEmail, propertyData) {
        try {
            const emailData = {
                from: this.fromEmail,
                to: userEmail,
                subject: `💰 Price Drop Alert: ${propertyData.address}`,
                html: this.generatePriceDropTemplate(propertyData)
            };

            const response = await this.sendEmail(emailData);
            console.log('Price drop alert sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to send price drop alert:', error);
            throw error;
        }
    }

    // Send new similar property notification
    async sendSimilarPropertyAlert(userEmail, originalProperty, similarProperty) {
        try {
            const emailData = {
                from: this.fromEmail,
                to: userEmail,
                subject: `🏠 New Similar Property: Near ${originalProperty.address}`,
                html: this.generateSimilarPropertyTemplate(originalProperty, similarProperty)
            };

            const response = await this.sendEmail(emailData);
            console.log('Similar property alert sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to send similar property alert:', error);
            throw error;
        }
    }

    // Core email sending function
    async sendEmail(emailData) {
        try {
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Email API error: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    // Generate bidding war warning email template
    generateBiddingWarTemplate(property, warningData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bidding War Alert</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .alert-badge { background-color: #ff4757; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
                .property-card { border: 1px solid #e1e8ed; border-radius: 12px; padding: 20px; margin: 20px 0; background-color: #f8f9fa; }
                .property-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; }
                .property-title { font-size: 20px; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
                .property-price { font-size: 24px; font-weight: bold; color: #27ae60; margin-bottom: 15px; }
                .warning-metrics { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }
                .metric-item { display: flex; justify-content: space-between; margin: 8px 0; }
                .metric-label { font-weight: 500; color: #856404; }
                .metric-value { font-weight: bold; color: #d63031; }
                .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
                .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 Bidding War Alert!</h1>
                    <p>High interest detected in a property you liked</p>
                </div>
                
                <div class="content">
                    <div class="alert-badge">URGENT: High Competition</div>
                    
                    <div class="property-card">
                        <img src="${property.image || 'https://via.placeholder.com/600x200?text=Property+Image'}" alt="Property" class="property-image">
                        <div class="property-title">${property.address}</div>
                        <div class="property-price">$${property.price?.toLocaleString() || 'N/A'}</div>
                        <p><strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'} | <strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'} | <strong>Sq Ft:</strong> ${property.sqft?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <div class="warning-metrics">
                        <h3 style="margin-top: 0; color: #856404;">⚠️ Competition Indicators</h3>
                        <div class="metric-item">
                            <span class="metric-label">Views in last 24h:</span>
                            <span class="metric-value">${warningData.views24h || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Total likes:</span>
                            <span class="metric-value">${warningData.totalLikes || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Similar properties sold (7 days):</span>
                            <span class="metric-value">${warningData.similarSold || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Competition level:</span>
                            <span class="metric-value">${warningData.competitionLevel || 'High'}</span>
                        </div>
                    </div>

                    <p><strong>Why you're receiving this alert:</strong></p>
                    <ul>
                        <li>This property has received ${warningData.views24h || 'multiple'} views in the last 24 hours</li>
                        <li>${warningData.similarSold || 'Several'} similar properties have sold quickly in this area</li>
                        <li>The property has ${warningData.totalLikes || 'multiple'} likes from other users</li>
                        <li>Market activity suggests high buyer interest</li>
                    </ul>

                    <p><strong>Recommended Actions:</strong></p>
                    <ul>
                        <li>🏃‍♂️ Schedule a viewing immediately</li>
                        <li>📋 Get pre-approved for financing</li>
                        <li>💰 Consider your maximum offer price</li>
                        <li>📞 Contact your real estate agent</li>
                    </ul>

                    <a href="https://realestatehub.com/property/${property.id}" class="cta-button">View Property Details</a>
                </div>

                <div class="footer">
                    <p>Real Estate Hub - Your Property Intelligence Platform</p>
                    <p>You're receiving this because you liked this property. <a href="#" style="color: #74b9ff;">Manage notifications</a></p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Generate price drop alert template
    generatePriceDropTemplate(property) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Price Drop Alert</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; }
                .header { background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .savings-badge { background-color: #00b894; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
                .property-card { border: 1px solid #e1e8ed; border-radius: 12px; padding: 20px; margin: 20px 0; background-color: #f8f9fa; }
                .price-comparison { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; }
                .old-price { text-decoration: line-through; color: #636e72; font-size: 18px; }
                .new-price { font-size: 24px; font-weight: bold; color: #00b894; }
                .savings { background-color: #d63031; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; font-weight: bold; }
                .cta-button { background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
                .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💰 Price Drop Alert!</h1>
                    <p>Great news! A property you liked just got more affordable</p>
                </div>
                
                <div class="content">
                    <div class="savings-badge">PRICE REDUCED</div>
                    
                    <div class="property-card">
                        <img src="${property.image || 'https://via.placeholder.com/600x200?text=Property+Image'}" alt="Property" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
                        <h2 style="margin: 0 0 15px 0; color: #2c3e50;">${property.address}</h2>
                        
                        <div class="price-comparison">
                            <div>
                                <div class="old-price">Was: $${property.oldPrice?.toLocaleString() || 'N/A'}</div>
                                <div class="new-price">Now: $${property.price?.toLocaleString() || 'N/A'}</div>
                            </div>
                            <div class="savings">Save $${((property.oldPrice || 0) - (property.price || 0)).toLocaleString()}</div>
                        </div>
                        
                        <p><strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'} | <strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'} | <strong>Sq Ft:</strong> ${property.sqft?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <p><strong>This could be your opportunity!</strong> Price drops often indicate motivated sellers and can lead to faster negotiations.</p>

                    <a href="https://realestatehub.com/property/${property.id}" class="cta-button">View Updated Listing</a>
                </div>

                <div class="footer">
                    <p>Real Estate Hub - Your Property Intelligence Platform</p>
                    <p><a href="#" style="color: #74b9ff;">Manage notifications</a> | <a href="#" style="color: #74b9ff;">Unsubscribe</a></p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Generate similar property alert template
    generateSimilarPropertyTemplate(originalProperty, similarProperty) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Similar Property Alert</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; }
                .header { background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .new-badge { background-color: #fd79a8; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
                .property-card { border: 1px solid #e1e8ed; border-radius: 12px; padding: 20px; margin: 20px 0; background-color: #f8f9fa; }
                .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .comparison-table th, .comparison-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                .comparison-table th { background-color: #f1f2f6; font-weight: bold; }
                .cta-button { background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
                .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏠 New Similar Property!</h1>
                    <p>We found a property that matches your interests</p>
                </div>
                
                <div class="content">
                    <div class="new-badge">NEW LISTING</div>
                    
                    <div class="property-card">
                        <img src="${similarProperty.image || 'https://via.placeholder.com/600x200?text=Property+Image'}" alt="Property" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
                        <h2 style="margin: 0 0 15px 0; color: #2c3e50;">${similarProperty.address}</h2>
                        <div style="font-size: 24px; font-weight: bold; color: #fd79a8; margin-bottom: 15px;">$${similarProperty.price?.toLocaleString() || 'N/A'}</div>
                        <p><strong>Bedrooms:</strong> ${similarProperty.bedrooms || 'N/A'} | <strong>Bathrooms:</strong> ${similarProperty.bathrooms || 'N/A'} | <strong>Sq Ft:</strong> ${similarProperty.sqft?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <h3>Comparison with your liked property:</h3>
                    <table class="comparison-table">
                        <tr>
                            <th>Feature</th>
                            <th>Your Liked Property</th>
                            <th>New Similar Property</th>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>$${originalProperty.price?.toLocaleString() || 'N/A'}</td>
                            <td>$${similarProperty.price?.toLocaleString() || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Bedrooms</td>
                            <td>${originalProperty.bedrooms || 'N/A'}</td>
                            <td>${similarProperty.bedrooms || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Bathrooms</td>
                            <td>${originalProperty.bathrooms || 'N/A'}</td>
                            <td>${similarProperty.bathrooms || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Square Feet</td>
                            <td>${originalProperty.sqft?.toLocaleString() || 'N/A'}</td>
                            <td>${similarProperty.sqft?.toLocaleString() || 'N/A'}</td>
                        </tr>
                    </table>

                    <p><strong>Why this might interest you:</strong></p>
                    <ul>
                        <li>Similar size and layout to your liked property</li>
                        <li>Located in the same general area</li>
                        <li>Comparable price range</li>
                        <li>Recently listed - fresh on the market</li>
                    </ul>

                    <a href="https://realestatehub.com/property/${similarProperty.id}" class="cta-button">View New Property</a>
                </div>

                <div class="footer">
                    <p>Real Estate Hub - Your Property Intelligence Platform</p>
                    <p><a href="#" style="color: #74b9ff;">Manage notifications</a> | <a href="#" style="color: #74b9ff;">Unsubscribe</a></p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Test email functionality
    async testEmailService() {
        try {
            const testEmail = {
                from: this.fromEmail,
                to: 'test@example.com',
                subject: 'Real Estate Hub - Email Service Test',
                html: '<h1>Email service is working!</h1><p>This is a test email from Real Estate Hub.</p>'
            };

            console.log('Testing email service...');
            const response = await this.sendEmail(testEmail);
            console.log('Email service test successful:', response);
            return true;
        } catch (error) {
            console.error('Email service test failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
} else {
    window.EmailService = EmailService;
}