/**
 * OpenAI Service for Real Estate Hub
 * Handles AI chatbot functionality with property-aware responses
 */

class OpenAIService {
    constructor() {
        // Note: API key should be retrieved from environment or secure storage
        // For demo purposes, using a placeholder - replace with actual key
        this.apiKey = this.getApiKey();
        this.baseURL = 'https://api.openai.com/v1';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 1000;
        this.temperature = 0.7;
        
        // Property context for AI responses
        this.propertyContext = null;
        this.userPreferences = null;
        this.conversationHistory = [];
        this.systemPrompt = this.createSystemPrompt();
    }

    /**
     * Get API key from environment or configuration
     */
    getApiKey() {
        // In a real application, this would come from environment variables
        // or secure configuration. For demo, using placeholder.
        try {
            return (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) || this.getStoredApiKey() || 'your-openai-api-key-here';
        } catch (error) {
            // Handle case where process is not defined (browser environment)
            return this.getStoredApiKey() || 'your-openai-api-key-here';
        }
    }

    /**
     * Get stored API key from localStorage or other storage
     */
    getStoredApiKey() {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('openai_api_key');
            }
        } catch (error) {
            console.warn('Unable to access localStorage for API key');
        }
        return null;
    }

    /**
     * Initialize the service
     */
    async initialize() {
        // Get API key from environment or user input
        this.apiKey = this.getApiKey();
        
        if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
            console.warn('OpenAI API key not found. Service will run in demo mode.');
            this.isInitialized = false;
            return;
        }
        
        this.isInitialized = true;
        console.log('OpenAI service initialized successfully');
    }

    /**
     * Create system prompt for property-focused AI assistant
     */
    createSystemPrompt() {
        const currentDate = new Date().toLocaleDateString();
        const marketContext = this.getMarketContext();
        
        return `You are an expert real estate AI assistant for "Real Estate Hub", a comprehensive property platform. Your role is to help users with all aspects of real estate including property search, market analysis, investment advice, and general real estate guidance.

CURRENT DATE: ${currentDate}

Key capabilities:
- Property search and recommendations based on user preferences
- Market trend analysis and insights with current data
- Investment opportunity evaluation and ROI calculations
- Neighborhood and location analysis with demographics
- Financing and mortgage guidance with current rates
- Real estate process education (buying, selling, renting)
- Comparative market analysis and property valuations
- Property management and maintenance advice
- Buyer services and acquisition assistance
- Cash offer vs. financing comparisons
- Pre-approval and loan qualification guidance

PLATFORM INTEGRATION:
You have access to our Real Estate Hub's comprehensive buyer services:
- Opendoor cash offer calculator and instant offers
- Mortgage and financing services with multiple lenders
- Property tracking and bidding war alerts
- Market analysis dashboard with current trends
- Email notifications for property updates
- Advanced search and filtering capabilities
- Property comparison tools and investment analysis
- Pre-approval assistance and loan type recommendations

BUYER SERVICES SPECIALIZATION:
- Cash Offers: Guide users through Opendoor's instant cash offer process
- Mortgage Services: Help compare lenders, calculate payments, and choose loan types
- Acquisition Strategy: Advise on cash vs. financing based on market conditions
- Pre-approval: Assist with pre-approval applications and documentation
- Investment Analysis: Provide ROI calculations and market opportunity assessments
- Negotiation Strategy: Offer guidance on competitive offers and bidding wars

MARKET CONTEXT:
${marketContext}

PROPERTY CONTEXT: ${this.propertyContext ? JSON.stringify(this.propertyContext) : 'No specific property context set'}

USER PREFERENCES: ${this.userPreferences ? JSON.stringify(this.userPreferences) : 'No user preferences set'}

ACQUISITION ASSISTANCE:
When helping with property acquisition:
1. Assess buyer's financial situation and goals
2. Recommend appropriate financing or cash offer strategies
3. Provide market timing and competition analysis
4. Guide through our platform's buyer services
5. Offer specific next steps and platform integrations

Guidelines:
- Always be helpful, professional, and knowledgeable
- Provide specific, actionable advice with numbers when possible
- Use current market knowledge and trends in your responses
- Ask clarifying questions to better understand user needs
- Suggest relevant properties or areas when appropriate
- Provide price ranges, market comparisons, and investment metrics
- Be transparent about limitations and recommend professional consultation for legal/financial advice
- Reference specific neighborhoods, price points, and market conditions
- Help users understand complex real estate concepts in simple terms
- Proactively suggest relevant platform features and services
- Focus on acquisition success and buyer empowerment

Response style:
- Conversational and friendly while maintaining expertise
- Use bullet points and structured information when helpful
- Include relevant statistics or market data when available
- Suggest next steps or follow-up questions
- Offer to help with related topics or deeper analysis
- Provide clear next steps and platform integrations

Remember: You're helping users make one of the biggest financial decisions of their lives. Be thorough, accurate, and supportive while leveraging our platform's buyer services capabilities.`;
    }

    /**
     * Set property context for more relevant responses
     */
    setPropertyContext(properties) {
        this.propertyContext = properties;
        // Update system prompt with new context
        this.systemPrompt = this.createSystemPrompt();
    }

    /**
     * Set user preferences for personalized responses
     */
    setUserPreferences(preferences) {
        this.userPreferences = preferences;
        // Update system prompt with new preferences
        this.systemPrompt = this.createSystemPrompt();
    }

    /**
     * Get current market context for AI responses
     */
    getMarketContext() {
        // This would typically come from a market data service
        // For now, providing general market context
        return `Current market conditions:
- Interest rates are fluctuating, affecting buyer purchasing power
- Inventory levels vary by location and price range
- Market trends show seasonal patterns in activity
- Investment opportunities exist in emerging neighborhoods
- First-time buyer programs and incentives are available`;
    }

    /**
     * Add property context to the conversation
     */
    getPropertyContextString() {
        if (!this.propertyContext || this.propertyContext.length === 0) {
            return "No specific properties are currently being viewed.";
        }

        const contextString = this.propertyContext.map(property => {
            return `Property: ${property.address || 'Address not available'}
Price: ${property.price ? this.formatPrice(property.price) : 'Price not available'}
Bedrooms: ${property.bedrooms || 'N/A'}
Bathrooms: ${property.bathrooms || 'N/A'}
Square Feet: ${property.sqft ? this.formatNumber(property.sqft) : 'N/A'}
Type: ${property.type || 'N/A'}`;
        }).join('\n\n');

        return `Current properties being discussed:\n${contextString}`;
    }

    /**
     * Send message to OpenAI and get response
     */
    async sendMessage(userMessage, includePropertyContext = true) {
        try {
            // If not initialized (no API key), return demo response
            if (!this.isInitialized) {
                const demoResponse = this.getFallbackResponse(userMessage);
                this.addToHistory(userMessage, demoResponse);
                return {
                    success: true,
                    response: demoResponse,
                    demo: true,
                    timestamp: new Date().toISOString()
                };
            }

            // Prepare messages array
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompt
                }
            ];

            // Add property context if available and requested
            if (includePropertyContext && this.propertyContext) {
                messages.push({
                    role: 'system',
                    content: this.getPropertyContextString()
                });
            }

            // Add conversation history (last 10 messages to stay within token limits)
            const recentHistory = this.conversationHistory.slice(-10);
            messages.push(...recentHistory);

            // Add current user message
            messages.push({
                role: 'user',
                content: userMessage
            });

            // Make API call to OpenAI
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

            // Add to conversation history
            this.addToHistory(userMessage, aiResponse);

            return {
                success: true,
                response: aiResponse,
                usage: data.usage,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('OpenAI Service Error:', error);
            
            // Return fallback response
            const fallbackResponse = this.getFallbackResponse(userMessage);
            this.addToHistory(userMessage, fallbackResponse);
            return {
                success: false,
                response: fallbackResponse,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Add message pair to conversation history
     */
    addToHistory(userMessage, aiResponse) {
        this.conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        );

        // Keep history manageable (last 20 messages = 10 exchanges)
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    /**
     * Get fallback response when API is unavailable
     */
    getFallbackResponse(userMessage) {
        const fallbackResponses = {
            greeting: "Hello! I'm your Real Estate Hub assistant. I'm currently experiencing some technical difficulties, but I'm here to help you with property questions. Please try again in a moment.",
            
            search: "I'd love to help you find the perfect property! While I'm experiencing some connectivity issues, you can browse our property listings using the search filters on the main page. Look for properties by price range, location, bedrooms, and more.",
            
            market: "Market analysis is one of my specialties! Although I'm having some technical difficulties right now, you can check out our Market Analysis section for current trends, price comparisons, and neighborhood insights.",
            
            general: "I'm your Real Estate Hub assistant, and I'm here to help with all your property needs! I'm currently experiencing some technical issues, but please feel free to explore our platform features like property search, market analysis, and bidding war alerts. Try asking me again in a moment!"
        };

        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return fallbackResponses.greeting;
        } else if (message.includes('search') || message.includes('find') || message.includes('property')) {
            return fallbackResponses.search;
        } else if (message.includes('market') || message.includes('price') || message.includes('trend')) {
            return fallbackResponses.market;
        } else {
            return fallbackResponses.general;
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Generate property-specific questions
     */
    generatePropertyQuestions(property) {
        const questions = [
            `Tell me more about ${property.address}`,
            `What's the neighborhood like around this property?`,
            `Is this property a good investment?`,
            `What are the pros and cons of this property?`,
            `How does this property compare to similar ones in the area?`,
            `What should I know about the local market trends?`
        ];

        return questions;
    }

    /**
     * Analyze user intent from message
     */
    analyzeIntent(message) {
        const intents = {
            search: ['find', 'search', 'looking for', 'want', 'need'],
            compare: ['compare', 'versus', 'vs', 'difference', 'better'],
            market: ['market', 'trend', 'price', 'value', 'investment'],
            neighborhood: ['neighborhood', 'area', 'location', 'nearby', 'around'],
            financing: ['mortgage', 'loan', 'financing', 'payment', 'afford'],
            process: ['buy', 'sell', 'rent', 'lease', 'process', 'steps']
        };

        const messageLower = message.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => messageLower.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (typeof price === 'number') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        }
        return price;
    }

    /**
     * Format number with commas
     */
    formatNumber(number) {
        if (typeof number === 'number') {
            return new Intl.NumberFormat('en-US').format(number);
        }
        return number;
    }

    /**
     * Analyze a specific property and provide insights
     */
    async analyzeProperty(propertyData) {
        const analysisPrompt = `Please analyze this property and provide comprehensive insights:

Property Details:
${JSON.stringify(propertyData, null, 2)}

Please provide:
1. Property overview and key features
2. Market value assessment
3. Investment potential and ROI analysis
4. Neighborhood analysis
5. Pros and cons
6. Recommendations for potential buyers
7. Financing considerations

Be specific and provide actionable insights.`;

        try {
            const response = await this.sendMessage(analysisPrompt);
            return response;
        } catch (error) {
            console.error('Property analysis failed:', error);
            return {
                success: false,
                response: 'Unable to analyze property at this time. Please try again later.'
            };
        }
    }

    /**
     * Get market insights for a specific area
     */
    async getMarketInsights(location, priceRange = null) {
        const insightsPrompt = `Provide market insights for ${location}${priceRange ? ` in the ${priceRange} price range` : ''}:

Please include:
1. Current market conditions and trends
2. Average property prices and recent changes
3. Neighborhood characteristics and amenities
4. Investment potential and growth prospects
5. Best property types for the area
6. Buyer recommendations and timing advice

Be specific about the local market conditions.`;

        try {
            const response = await this.sendMessage(insightsPrompt);
            return response;
        } catch (error) {
            console.error('Market insights failed:', error);
            return {
                success: false,
                response: 'Unable to get market insights at this time. Please try again later.'
            };
        }
    }

    /**
     * Compare multiple properties
     */
    async compareProperties(properties) {
        const comparisonPrompt = `Please compare these properties and help me decide:

Properties to Compare:
${properties.map((prop, index) => `
Property ${index + 1}:
${JSON.stringify(prop, null, 2)}
`).join('\n')}

Please provide:
1. Side-by-side comparison of key features
2. Value analysis for each property
3. Pros and cons of each option
4. Investment potential comparison
5. Recommendation with reasoning
6. Factors to consider for final decision

Help me understand which property offers the best value and fits my needs.`;

        try {
            const response = await this.sendMessage(comparisonPrompt);
            return response;
        } catch (error) {
            console.error('Property comparison failed:', error);
            return {
                success: false,
                response: 'Unable to compare properties at this time. Please try again later.'
            };
        }
    }

    /**
     * Get financing advice for a property
     */
    async getFinancingAdvice(propertyPrice, downPayment, creditScore = null, income = null) {
        const financingPrompt = `Provide financing advice for a property purchase:

Property Price: $${propertyPrice.toLocaleString()}
Down Payment: $${downPayment.toLocaleString()}
${creditScore ? `Credit Score: ${creditScore}` : ''}
${income ? `Annual Income: $${income.toLocaleString()}` : ''}

Please provide:
1. Loan amount and monthly payment estimates
2. Different loan options (conventional, FHA, VA, etc.)
3. Interest rate considerations
4. Additional costs (PMI, taxes, insurance)
5. Affordability analysis
6. Tips for getting the best rates
7. Pre-approval recommendations

Help me understand all financing aspects and options.`;

        try {
            const response = await this.sendMessage(financingPrompt);
            return response;
        } catch (error) {
            console.error('Financing advice failed:', error);
            return {
                success: false,
                response: 'Unable to provide financing advice at this time. Please try again later.'
            };
        }
    }

    /**
     * Acquisition strategy recommendations
     */
    getAcquisitionStrategy(propertyData, buyerProfile) {
        const { price, marketCondition, competition } = propertyData;
        const { budget, timeline, financing } = buyerProfile;
        
        let strategy = "🎯 Acquisition Strategy Recommendations:\n\n";
        
        // Cash vs Financing recommendation
        if (financing === 'cash' || budget >= price) {
            strategy += "💰 CASH OFFER RECOMMENDED:\n";
            strategy += "• Use our Opendoor service for instant cash offers\n";
            strategy += "• Stronger negotiating position\n";
            strategy += "• Faster closing (14-21 days)\n";
            strategy += "• No financing contingencies\n\n";
        } else {
            strategy += "🏦 FINANCING STRATEGY:\n";
            strategy += "• Get pre-approved through our mortgage services\n";
            strategy += "• Consider conventional, FHA, or VA loans\n";
            strategy += "• Include financing contingency\n";
            strategy += "• Plan for 30-45 day closing\n\n";
        }
        
        // Market timing advice
        if (marketCondition === 'hot') {
            strategy += "🔥 HOT MARKET TACTICS:\n";
            strategy += "• Act quickly on good properties\n";
            strategy += "• Consider offering above asking price\n";
            strategy += "• Waive non-essential contingencies\n";
            strategy += "• Use our bidding war alerts\n\n";
        }
        
        // Competition analysis
        if (competition === 'high') {
            strategy += "⚔️ HIGH COMPETITION STRATEGY:\n";
            strategy += "• Submit offers within 24 hours\n";
            strategy += "• Include escalation clauses\n";
            strategy += "• Write personal letters to sellers\n";
            strategy += "• Be flexible on closing dates\n\n";
        }
        
        strategy += "📋 NEXT STEPS:\n";
        strategy += "• Use our property comparison tools\n";
        strategy += "• Set up property tracking alerts\n";
        strategy += "• Connect with our buyer services team\n";
        
        return strategy;
    }

    /**
     * Cash offer vs financing comparison
     */
    compareCashVsFinancing(propertyPrice, cashAvailable, interestRate = 6.5) {
        const monthlyRate = interestRate / 100 / 12;
        const loanTerm = 30 * 12;
        const loanAmount = propertyPrice * 0.8; // 20% down
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                              (Math.pow(1 + monthlyRate, loanTerm) - 1);
        
        let comparison = "💰 Cash vs Financing Comparison:\n\n";
        
        comparison += "CASH OFFER BENEFITS:\n";
        comparison += `• Total cost: $${propertyPrice.toLocaleString()}\n`;
        comparison += "• No monthly payments\n";
        comparison += "• Stronger negotiating position\n";
        comparison += "• Faster closing process\n";
        comparison += "• No interest payments\n\n";
        
        comparison += "FINANCING BENEFITS:\n";
        comparison += `• Down payment: $${(propertyPrice * 0.2).toLocaleString()}\n`;
        comparison += `• Monthly payment: $${monthlyPayment.toFixed(0)}\n`;
        comparison += "• Preserve cash for other investments\n";
        comparison += "• Tax deductions on mortgage interest\n";
        comparison += "• Leverage for higher returns\n\n";
        
        if (cashAvailable >= propertyPrice) {
            comparison += "💡 RECOMMENDATION: Consider cash offer for competitive advantage\n";
            comparison += "Use our Opendoor service for instant cash offer calculations";
        } else {
            comparison += "💡 RECOMMENDATION: Explore our financing options\n";
            comparison += "Get pre-approved through our mortgage services";
        }
        
        return comparison;
    }

    /**
     * Pre-approval guidance
     */
    getPreApprovalGuidance(income, debts, creditScore, downPayment) {
        const monthlyIncome = income / 12;
        const dtiRatio = debts / monthlyIncome;
        const maxDTI = creditScore >= 740 ? 0.43 : creditScore >= 670 ? 0.41 : 0.37;
        const maxPayment = (monthlyIncome * maxDTI) - debts;
        
        let guidance = "📋 Pre-Approval Guidance:\n\n";
        
        guidance += "QUALIFICATION ASSESSMENT:\n";
        guidance += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
        guidance += `• Current DTI: ${(dtiRatio * 100).toFixed(1)}%\n`;
        guidance += `• Max DTI Allowed: ${(maxDTI * 100).toFixed(1)}%\n`;
        guidance += `• Max Monthly Payment: $${maxPayment.toFixed(0)}\n\n`;
        
        if (dtiRatio <= maxDTI) {
            guidance += "✅ STRONG QUALIFICATION PROFILE\n";
            guidance += "• You're likely to get approved\n";
            guidance += "• Competitive interest rates available\n";
        } else {
            guidance += "⚠️ IMPROVEMENT NEEDED\n";
            guidance += "• Consider paying down debts\n";
            guidance += "• Increase down payment if possible\n";
        }
        
        guidance += "\n📄 REQUIRED DOCUMENTS:\n";
        guidance += "• 2 years of tax returns\n";
        guidance += "• Recent pay stubs\n";
        guidance += "• Bank statements (2-3 months)\n";
        guidance += "• Employment verification letter\n";
        guidance += "• Asset documentation\n\n";
        
        guidance += "🚀 NEXT STEPS:\n";
        guidance += "• Use our pre-approval form\n";
        guidance += "• Compare lenders in our mortgage section\n";
        guidance += "• Get pre-approval letter within 24 hours\n";
        
        return guidance;
    }

    /**
     * Investment opportunity analysis
     */
    analyzeInvestmentOpportunity(propertyData, investmentGoals) {
        const { price, rentEstimate, expenses, appreciation } = propertyData;
        const { strategy, timeline, targetReturn } = investmentGoals;
        
        const annualRent = rentEstimate * 12;
        const capRate = ((annualRent - expenses) / price) * 100;
        const cashFlow = (annualRent - expenses) / 12;
        
        let analysis = "📊 Investment Opportunity Analysis:\n\n";
        
        analysis += "FINANCIAL METRICS:\n";
        analysis += `• Purchase Price: $${price.toLocaleString()}\n`;
        analysis += `• Annual Rent: $${annualRent.toLocaleString()}\n`;
        analysis += `• Cap Rate: ${capRate.toFixed(2)}%\n`;
        analysis += `• Monthly Cash Flow: $${cashFlow.toFixed(0)}\n`;
        analysis += `• Projected Appreciation: ${appreciation}% annually\n\n`;
        
        if (capRate >= 8) {
            analysis += "🟢 EXCELLENT INVESTMENT\n";
        } else if (capRate >= 6) {
            analysis += "🟡 GOOD INVESTMENT\n";
        } else {
            analysis += "🔴 MARGINAL INVESTMENT\n";
        }
        
        analysis += "\n💡 INVESTMENT STRATEGY:\n";
        if (strategy === 'cashFlow') {
            analysis += "• Focus on monthly cash flow generation\n";
            analysis += "• Consider financing to maximize leverage\n";
        } else if (strategy === 'appreciation') {
            analysis += "• Focus on long-term value growth\n";
            analysis += "• Consider cash purchase in hot markets\n";
        }
        
        analysis += "\n📈 RECOMMENDATIONS:\n";
        analysis += "• Use our property comparison tools\n";
        analysis += "• Set up market alerts for similar properties\n";
        analysis += "• Consider our financing options for leverage\n";
        
        return analysis;
    }

    /**
     * Get suggested responses based on context
     */
    getSuggestedResponses(context = 'general') {
        const suggestions = {
            general: [
                "What's the current market trend in my area?",
                "Help me find properties under $500K",
                "Explain the home buying process step by step",
                "Calculate mortgage payments for different scenarios",
                "Compare neighborhoods for families"
            ],
            property: [
                "Analyze this property's investment potential",
                "What are the pros and cons of this location?",
                "Compare this with similar properties nearby",
                "What financing options work best for this price?",
                "Calculate potential rental income and ROI"
            ],
            market: [
                "What are the hottest markets right now?",
                "Best areas for first-time home buyers?",
                "Market predictions for the next 6 months",
                "How do interest rates affect my buying power?",
                "Investment opportunities in emerging neighborhoods"
            ],
            financing: [
                "What's the difference between loan types?",
                "How much house can I afford with my income?",
                "Tips for improving my credit score quickly",
                "Should I pay PMI or put more money down?",
                "How to get pre-approved for a mortgage"
            ],
            acquisition: [
                "Should I make a cash offer or get financing?",
                "Help me develop an acquisition strategy",
                "What documents do I need for pre-approval?",
                "Analyze this as an investment opportunity"
            ],
            buyerServices: [
                "Get me an instant cash offer through Opendoor",
                "Compare mortgage lenders and rates",
                "Help me get pre-approved for a loan",
                "What buyer protection services do you offer?"
            ],
            cashOffer: [
                "Calculate my cash offer advantages",
                "How does Opendoor's process work?",
                "Compare cash vs financing for this property",
                "What are the benefits of a cash purchase?"
            ],
            mortgage: [
                "Calculate my monthly mortgage payment",
                "What's my debt-to-income ratio?",
                "Help me improve my credit score",
                "Find the best mortgage rates available"
            ]
        };

        return suggestions[context] || suggestions.general;
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return this.apiKey && this.apiKey !== 'your-openai-api-key-here';
    }

    /**
     * Get service status
     */
    getStatus() {
        return {
            configured: this.isConfigured(),
            model: this.model,
            conversationLength: this.conversationHistory.length,
            hasPropertyContext: !!this.propertyContext
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIService;
} else if (typeof window !== 'undefined') {
    window.OpenAIService = OpenAIService;
}