// Deep Analysis of User Requests for AI Doctor

export interface UserRequestAnalysis {
    intent: string;
    urgency: string;
    context: string;
    questionType: 'why' | 'how' | 'what' | 'when' | 'which' | 'where' | 'general';
}

export const analyzeUserRequest = (userMessage: string): UserRequestAnalysis => {
    const lowerMsg = userMessage.toLowerCase();

    // Determine question type
    let questionType: UserRequestAnalysis['questionType'] = 'general';
    if (/^why|why is|why are|why do/.test(lowerMsg)) questionType = 'why';
    else if (/^how|how to|how do|how can/.test(lowerMsg)) questionType = 'how';
    else if (/^what|what is|what are|what's/.test(lowerMsg)) questionType = 'what';
    else if (/^when|when should|when do/.test(lowerMsg)) questionType = 'when';
    else if (/^which|which is|which are/.test(lowerMsg)) questionType = 'which';
    else if (/^where|where should|where do/.test(lowerMsg)) questionType = 'where';

    // Detect intent
    let intent = '';
    if (/yellow|brown|dying|dead|wilting|drooping/.test(lowerMsg)) {
        intent = 'User has a SICK PLANT - they need immediate diagnostic help and solutions.';
    } else if (/pest|bug|insect|mite|aphid/.test(lowerMsg)) {
        intent = 'User has a PEST PROBLEM - they need identification and treatment options.';
    } else if (/best|recommend|suggest|good for/.test(lowerMsg)) {
        intent = 'User wants PLANT RECOMMENDATIONS - they need specific suggestions for their situation.';
    } else if (/how to|how do i|how can i/.test(lowerMsg)) {
        intent = 'User wants to LEARN A TECHNIQUE - they need step-by-step instructions.';
    } else if (/why|what causes|reason/.test(lowerMsg)) {
        intent = 'User wants to UNDERSTAND WHY - they need clear explanation of causes.';
    } else if (/water|watering/.test(lowerMsg)) {
        intent = 'User has WATERING QUESTIONS - they need specific guidance on frequency and technique.';
    } else if (/light|sun|shade/.test(lowerMsg)) {
        intent = 'User has LIGHTING QUESTIONS - they need placement and light level advice.';
    } else if (/fertilizer|feed|nutrients/.test(lowerMsg)) {
        intent = 'User has FERTILIZER QUESTIONS - they need feeding schedule and product recommendations.';
    } else {
        intent = 'User has a GENERAL PLANT QUESTION - provide comprehensive, helpful information.';
    }

    // Detect urgency
    let urgency = '';
    if (/dying|dead|urgent|help|emergency|quickly|fast/.test(lowerMsg)) {
        urgency = 'URGENT - User needs immediate help! Prioritize actionable solutions.';
    } else if (/yellow|brown|wilting|pest/.test(lowerMsg)) {
        urgency = 'MODERATE URGENCY - Plant has issues that need addressing soon.';
    } else {
        urgency = 'NOT URGENT - User is learning or planning. Can provide detailed information.';
    }

    // Extract context clues
    const contextClues: string[] = [];

    // Plant mentions
    const plantMentions = lowerMsg.match(/\b(monstera|pothos|snake plant|fiddle|fern|succulent|cactus|orchid|peace lily|spider plant)\b/g);
    if (plantMentions) {
        contextClues.push(`Specific plant mentioned: ${plantMentions.join(', ')}`);
    }

    // Environment mentions
    if (/indoor|inside|house|apartment|office/.test(lowerMsg)) {
        contextClues.push('Indoor environment');
    }
    if (/outdoor|outside|garden|patio/.test(lowerMsg)) {
        contextClues.push('Outdoor environment');
    }
    if (/bathroom|humid/.test(lowerMsg)) {
        contextClues.push('High humidity environment');
    }
    if (/low light|dark|shade/.test(lowerMsg)) {
        contextClues.push('Low light conditions');
    }
    if (/bright|sunny|direct sun/.test(lowerMsg)) {
        contextClues.push('Bright light conditions');
    }

    // Experience level
    if (/beginner|new to|first time|never/.test(lowerMsg)) {
        contextClues.push('Beginner level - needs simple, clear instructions');
    }

    // Time mentions
    if (/week|month|day|recently|just|started/.test(lowerMsg)) {
        contextClues.push('Timeline mentioned - user tracking changes over time');
    }

    const context = contextClues.length > 0
        ? `CONTEXT: ${contextClues.join(' | ')}`
        : 'No specific context detected - provide general but thorough answer.';

    return {
        intent,
        urgency,
        context,
        questionType
    };
};

// Generate response structure based on question type
export const getResponseStructure = (questionType: UserRequestAnalysis['questionType']): string => {
    switch (questionType) {
        case 'why':
            return 'Start with THE REASON, then explain the science, then prevention tips.';
        case 'how':
            return 'Give STEP-BY-STEP INSTRUCTIONS numbered 1, 2, 3... Be specific and actionable.';
        case 'what':
            return 'IDENTIFY IT CLEARLY first, then describe characteristics, then care needs.';
        case 'when':
            return 'Give SPECIFIC TIMING/FREQUENCY first, then explain why that timing matters.';
        case 'which':
            return 'COMPARE OPTIONS with pros/cons, then give your top recommendation.';
        case 'where':
            return 'Specify EXACT LOCATION/PLACEMENT first, then explain why.';
        default:
            return 'Address the core question directly, then provide supporting details.';
    }
};
