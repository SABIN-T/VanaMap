// Advanced Response Engine - Analyzes questions and provides focused answers
// Searches internal database + external sources for comprehensive responses

import { cleanAIResponse, formatResponse } from './cleanResponse';

interface Plant {
    name: string;
    scientificName?: string;
    description?: string;
    [key: string]: any;
}

export class SmartResponseEngine {

    // Main function - analyzes question and generates focused response
    static async generateResponse(
        userQuestion: string,
        internalPlants: Plant[],
        webSearchFn: (query: string) => Promise<string | null>
    ): Promise<string> {

        const analysis = this.analyzeQuestion(userQuestion);

        // Route to appropriate handler based on question type
        if (analysis.isGreeting) {
            return this.handleGreeting();
        }

        if (analysis.isSimpleQuery) {
            return this.handleSimpleQuery(userQuestion);
        }

        if (analysis.needsPlantInfo) {
            return await this.handlePlantQuery(
                analysis.plantName,
                internalPlants,
                webSearchFn
            );
        }

        if (analysis.needsGeneralAdvice) {
            return await this.handleGeneralAdvice(
                userQuestion,
                webSearchFn
            );
        }

        // Default: comprehensive response
        return await this.handleComplexQuery(
            userQuestion,
            webSearchFn
        );
    }

    // Analyze what the user is actually asking
    private static analyzeQuestion(question: string): any {
        const lower = question.toLowerCase().trim();

        return {
            isGreeting: /^(hi|hello|hey|greetings)[\s!.?]*$/i.test(lower),
            isSimpleQuery: lower.split(' ').length <= 5,
            needsPlantInfo: this.extractPlantName(lower) !== null,
            plantName: this.extractPlantName(lower),
            needsGeneralAdvice: /how|what|why|when|best|recommend/i.test(lower),
            questionType: this.getQuestionType(lower),
            keywords: this.extractKeywords(lower)
        };
    }

    // Extract plant name from question
    private static extractPlantName(question: string): string | null {
        const commonPlants = [
            'monstera', 'pothos', 'snake plant', 'sansevieria', 'fiddle leaf fig',
            'peace lily', 'spider plant', 'aloe', 'succulent', 'cactus',
            'fern', 'orchid', 'bamboo', 'jade', 'rubber plant', 'philodendron',
            'calathea', 'dracaena', 'zz plant', 'anthurium'
        ];

        for (const plant of commonPlants) {
            if (question.includes(plant)) {
                return plant;
            }
        }

        return null;
    }

    // Determine question type
    private static getQuestionType(question: string): string {
        if (/^why/i.test(question)) return 'why';
        if (/^how/i.test(question)) return 'how';
        if (/^what/i.test(question)) return 'what';
        if (/^when/i.test(question)) return 'when';
        if (/^where/i.test(question)) return 'where';
        if (/^which/i.test(question)) return 'which';
        return 'general';
    }

    // Extract important keywords
    private static extractKeywords(question: string): string[] {
        const keywords: string[] = [];

        const importantTerms = [
            'water', 'light', 'sun', 'fertilizer', 'soil', 'pest', 'disease',
            'yellow', 'brown', 'dying', 'wilting', 'drooping', 'spots'
        ];

        importantTerms.forEach(term => {
            if (question.includes(term)) {
                keywords.push(term);
            }
        });

        return keywords;
    }

    // Handle greetings
    private static handleGreeting(): string {
        return "Hello! What can I help you with today?";
    }

    // Handle simple queries
    private static handleSimpleQuery(question: string): string {
        const lower = question.toLowerCase();

        if (lower.includes('name')) {
            return "I'm Dr. Flora, your plant care expert. What would you like to know?";
        }

        if (lower.includes('help')) {
            return "I can help with plant care, diagnosis, and recommendations. What's your question?";
        }

        return "I'm here to help! Could you tell me more about your plant question?";
    }

    // Handle plant-specific queries
    private static async handlePlantQuery(
        plantName: string | null,
        internalPlants: Plant[],
        webSearchFn: (query: string) => Promise<string | null>
    ): Promise<string> {

        if (!plantName) {
            return "I'd be happy to help! Which plant are you asking about?";
        }

        // Search internal database first
        const dbPlant = internalPlants.find(p =>
            p.name.toLowerCase().includes(plantName) ||
            p.scientificName?.toLowerCase().includes(plantName)
        );

        // Search web for additional info
        const webInfo = await webSearchFn(`${plantName} plant care`);

        // Combine and format response
        let response = '';

        if (dbPlant) {
            response += `${dbPlant.name}\n\n`;
            if (dbPlant.description) {
                response += `${cleanAIResponse(dbPlant.description)}\n\n`;
            }
            response += `Care Requirements:\n`;
            response += `• Temperature: ${dbPlant.idealTempMin || 18}-${dbPlant.idealTempMax || 28}°C\n`;
            response += `• Humidity: ${dbPlant.minHumidity || 40}%+\n`;
            response += `• Light: ${dbPlant.sunlight || 'Moderate indirect light'}\n`;
        }

        if (webInfo && !dbPlant) {
            response += cleanAIResponse(webInfo);
        }

        if (!response) {
            response = `I don't have detailed information about ${plantName} in my database yet. However, I can help with general care questions. What would you like to know?`;
        }

        return formatResponse(response);
    }

    // Handle general advice queries
    private static async handleGeneralAdvice(
        question: string,
        webSearchFn: (query: string) => Promise<string | null>
    ): Promise<string> {

        // Search web for current best practices
        const webInfo = await webSearchFn(question);

        if (webInfo) {
            return formatResponse(cleanAIResponse(webInfo));
        }

        return "I'd be happy to help with that! Could you provide a bit more detail about your specific situation?";
    }

    // Handle complex queries
    private static async handleComplexQuery(
        question: string,
        webSearchFn: (query: string) => Promise<string | null>
    ): Promise<string> {

        // Get web information
        const webInfo = await webSearchFn(question);

        if (webInfo) {
            const cleaned = cleanAIResponse(webInfo);
            return formatResponse(cleaned);
        }

        return "I want to give you the most accurate answer. Could you rephrase your question or provide more details?";
    }
}
