// Clean AI Response Utility
// Removes all markdown and formats responses professionally

export function cleanAIResponse(text: string): string {
    if (!text) return '';

    let cleaned = text;

    // Remove all markdown formatting
    cleaned = cleaned
        // Remove bold (**text** or __text__)
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        // Remove italic (*text* or _text_)  
        .replace(/\*([^*]+?)\*/g, '$1')
        .replace(/_([^_]+?)_/g, '$1')
        // Remove code blocks (```text```)
        .replace(/```[\s\S]*?```/g, '')
        // Remove inline code (`text`)
        .replace(/`(.+?)`/g, '$1')
        // Remove headers (# text, ## text, etc.)
        .replace(/^#{1,6}\s+(.+)$/gm, '$1')
        // Remove horizontal rules (---, ___, ***)
        .replace(/^[-_*]{3,}$/gm, '')
        // Remove blockquotes (> text)
        .replace(/^>\s+/gm, '')
        // Clean up emoji overuse - keep only one emoji per line
        .replace(/(🌿|🌱|💧|☀️|🔬|🌡️|🪴|🐛|✂️|💡|⚠️){2,}/g, '$1')
        // Remove multiple spaces
        .replace(/  +/g, ' ')
        // Clean up multiple newlines (max 2)
        .replace(/\n{3,}/g, '\n\n')
        // Trim each line
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        // Final trim
        .trim();

    return cleaned;
}

// Format response with proper structure
export function formatResponse(text: string): string {
    const cleaned = cleanAIResponse(text);

    // Split into lines
    const lines = cleaned.split('\n').filter(line => line.length > 0);

    let formatted = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if it's a list item
        const isListItem = /^[-•]\s/.test(line);

        if (isListItem) {
            if (!inList) {
                formatted += '\n'; // Add space before list
                inList = true;
            }
            // Clean list marker and add consistent bullet
            const cleanLine = line.replace(/^[-•]\s+/, '');
            formatted += `• ${cleanLine}\n`;
        } else {
            if (inList) {
                formatted += '\n'; // Add space after list
                inList = false;
            }

            // Check if it's a heading (ends with : and is short)
            if (line.endsWith(':') && line.length < 80) {
                formatted += `\n${line}\n`;
            } else {
                formatted += `${line}\n\n`;
            }
        }
    }

    return formatted.trim();
}

// Extract key terms for bolding (without markdown)
export function highlightKeyTerms(text: string): Array<{ text: string, bold: boolean }> {
    const keyTerms = [
        'overwatering', 'underwatering', 'root rot', 'nitrogen deficiency',
        'yellow leaves', 'brown spots', 'wilting', 'drooping',
        'direct sunlight', 'indirect light', 'low light', 'bright light',
        'important', 'critical', 'urgent', 'warning', 'caution'
    ];

    const segments: Array<{ text: string, bold: boolean }> = [];
    let remaining = text;

    for (const term of keyTerms) {
        const regex = new RegExp(`\\b(${term})\\b`, 'gi');
        const parts = remaining.split(regex);

        if (parts.length > 1) {
            for (let i = 0; i < parts.length; i++) {
                if (parts[i]) {
                    const isBold = regex.test(parts[i]);
                    segments.push({
                        text: parts[i],
                        bold: isBold
                    });
                }
            }
            break;
        }
    }

    if (segments.length === 0) {
        segments.push({ text, bold: false });
    }

    return segments;
}
