// Suggested Questions Helper for AI Doctor
export const getSuggestedQuestions = (responseText: string): string[] => {
    const suggestions: string[] = [];
    const lowerResponse = responseText.toLowerCase();

    // Add relevant suggestions based on response content
    if (lowerResponse.includes('water')) {
        suggestions.push("How do I know if I'm overwatering?");
        suggestions.push("What's the best time of day to water plants?");
    }
    if (lowerResponse.includes('light') || lowerResponse.includes('sun')) {
        suggestions.push("Can I use grow lights instead of sunlight?");
        suggestions.push("How do I know if my plant needs more light?");
    }
    if (lowerResponse.includes('yellow') || lowerResponse.includes('brown')) {
        suggestions.push("How can I prevent this from happening again?");
        suggestions.push("Should I remove the affected leaves?");
    }
    if (lowerResponse.includes('fertiliz')) {
        suggestions.push("What's the best fertilizer for indoor plants?");
        suggestions.push("How often should I fertilize?");
    }
    if (lowerResponse.includes('pest') || lowerResponse.includes('bug')) {
        suggestions.push("How do I prevent pests naturally?");
        suggestions.push("Are there pet-safe pest control options?");
    }
    if (lowerResponse.includes('propagat')) {
        suggestions.push("What's the easiest plant to propagate?");
        suggestions.push("Can I propagate in water or soil?");
    }

    // Default suggestions if none matched
    if (suggestions.length === 0) {
        const defaults = [
            "What are the easiest plants for beginners?",
            "How do I know when to repot my plant?",
            "Best plants for low light conditions?",
            "How to propagate plants from cuttings?",
            "Why are my plant's leaves turning yellow?",
            "Best air purifying plants for bedroom?"
        ];
        // Randomly select 2 defaults
        const shuffled = defaults.sort(() => 0.5 - Math.random());
        suggestions.push(...shuffled.slice(0, 2));
    }

    return suggestions.slice(0, 3); // Max 3 suggestions
};

// Add suggestions to formatted response
export const addSuggestionsToResponse = (formatted: string, aiText: string): string => {
    const suggestions = getSuggestedQuestions(aiText);

    let result = formatted;

    if (suggestions.length > 0) {
        result += `\n**💡 You might also want to ask:**\n`;
        suggestions.forEach(q => {
            result += `• ${q}\n`;
        });
    }

    return result;
};
