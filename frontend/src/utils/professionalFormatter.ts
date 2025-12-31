// Professional AI Response Formatter
// Converts AI markdown to clean, styled HTML for professional appearance

export interface FormattedSection {
    type: 'heading' | 'paragraph' | 'list' | 'important' | 'tip';
    content: string;
    items?: string[];
}

export class ProfessionalFormatter {

    // Main formatting function - removes markdown, adds proper structure
    static formatResponse(aiText: string): FormattedSection[] {
        const sections: FormattedSection[] = [];

        // Clean up the text first
        let cleanText = this.removeMarkdown(aiText);

        // Split into logical sections
        const lines = cleanText.split('\n').filter(line => line.trim().length > 0);

        let currentList: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detect headings (lines ending with :)
            if (line.endsWith(':') && line.length < 100) {
                // Flush any pending list
                if (currentList.length > 0) {
                    sections.push({ type: 'list', content: '', items: [...currentList] });
                    currentList = [];
                }

                sections.push({
                    type: 'heading',
                    content: line.replace(':', '')
                });
                continue;
            }

            // Detect list items (start with -, •, or number)
            if (/^[-•\d.]\s/.test(line)) {
                const cleanItem = line.replace(/^[-•\d.]\s+/, '');
                currentList.push(cleanItem);
                continue;
            }

            // Detect important statements (contains keywords)
            if (this.isImportant(line)) {
                // Flush any pending list
                if (currentList.length > 0) {
                    sections.push({ type: 'list', content: '', items: [...currentList] });
                    currentList = [];
                }

                sections.push({
                    type: 'important',
                    content: line
                });
                continue;
            }

            // Detect tips (contains tip keywords)
            if (this.isTip(line)) {
                // Flush any pending list
                if (currentList.length > 0) {
                    sections.push({ type: 'list', content: '', items: [...currentList] });
                    currentList = [];
                }

                sections.push({
                    type: 'tip',
                    content: line
                });
                continue;
            }

            // Regular paragraph
            if (currentList.length > 0) {
                sections.push({ type: 'list', content: '', items: [...currentList] });
                currentList = [];
            }

            sections.push({
                type: 'paragraph',
                content: line
            });
        }

        // Flush any remaining list
        if (currentList.length > 0) {
            sections.push({ type: 'list', content: '', items: currentList });
        }

        return sections;
    }

    // Remove all markdown formatting
    private static removeMarkdown(text: string): string {
        return text
            // Remove bold (**text** or __text__)
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/__(.+?)__/g, '$1')
            // Remove italic (*text* or _text_)
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            // Remove code blocks
            .replace(/`(.+?)`/g, '$1')
            // Remove headers (# text)
            .replace(/^#{1,6}\s+/gm, '')
            // Clean up multiple spaces
            .replace(/\s+/g, ' ')
            // Clean up multiple newlines
            .replace(/\n{3,}/g, '\n\n');
    }

    // Detect if line contains important information
    private static isImportant(line: string): boolean {
        const importantKeywords = [
            'important', 'critical', 'urgent', 'warning', 'caution',
            'must', 'never', 'always', 'immediately', 'essential'
        ];

        const lowerLine = line.toLowerCase();
        return importantKeywords.some(keyword => lowerLine.includes(keyword));
    }

    // Detect if line is a tip
    private static isTip(line: string): boolean {
        const tipKeywords = [
            'tip', 'pro tip', 'hint', 'suggestion', 'try',
            'remember', 'note', 'keep in mind'
        ];

        const lowerLine = line.toLowerCase();
        return tipKeywords.some(keyword => lowerLine.includes(keyword));
    }

    // Extract bold phrases from text (for inline bolding)
    static extractBoldPhrases(text: string): Array<{ text: string; bold: boolean }> {
        const phrases: Array<{ text: string; bold: boolean }> = [];

        // Keywords that should be bolded
        const boldKeywords = [
            'overwatering', 'underwatering', 'root rot', 'nitrogen deficiency',
            'direct sunlight', 'indirect light', 'low light', 'bright light',
            'water', 'fertilize', 'prune', 'repot', 'propagate',
            'yellow leaves', 'brown spots', 'wilting', 'drooping'
        ];

        let remainingText = text;

        for (const keyword of boldKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = remainingText.match(regex);

            if (matches) {
                matches.forEach(match => {
                    const parts = remainingText.split(match);
                    if (parts[0]) {
                        phrases.push({ text: parts[0], bold: false });
                    }
                    phrases.push({ text: match, bold: true });
                    remainingText = parts.slice(1).join(match);
                });
            }
        }

        if (remainingText) {
            phrases.push({ text: remainingText, bold: false });
        }

        return phrases.length > 0 ? phrases : [{ text, bold: false }];
    }

    // Generate clean HTML for rendering
    static toHTML(sections: FormattedSection[]): string {
        let html = '<div class="ai-response">';

        sections.forEach((section, index) => {
            switch (section.type) {
                case 'heading':
                    html += `<h3 class="response-heading">${section.content}</h3>`;
                    break;

                case 'paragraph':
                    html += `<p class="response-paragraph">${section.content}</p>`;
                    break;

                case 'list':
                    html += '<ul class="response-list">';
                    section.items?.forEach(item => {
                        html += `<li>${item}</li>`;
                    });
                    html += '</ul>';
                    break;

                case 'important':
                    html += `<div class="response-important">⚠️ ${section.content}</div>`;
                    break;

                case 'tip':
                    html += `<div class="response-tip">💡 ${section.content}</div>`;
                    break;
            }

            // Add spacing between sections
            if (index < sections.length - 1) {
                html += '<div class="section-spacer"></div>';
            }
        });

        html += '</div>';
        return html;
    }
}

// CSS styles for professional formatting
export const professionalStyles = `
.ai-response {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #2c3e50;
}

.response-heading {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d6a4f;
    margin: 1.2rem 0 0.6rem 0;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid #52b788;
}

.response-paragraph {
    margin: 0.8rem 0;
    font-size: 0.95rem;
    color: #34495e;
}

.response-list {
    margin: 0.8rem 0;
    padding-left: 1.5rem;
    list-style-type: none;
}

.response-list li {
    position: relative;
    margin: 0.5rem 0;
    padding-left: 1.2rem;
    font-size: 0.95rem;
}

.response-list li:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #52b788;
    font-weight: bold;
}

.response-important {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 0.8rem 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    font-weight: 500;
}

.response-tip {
    background: #d1ecf1;
    border-left: 4px solid #17a2b8;
    padding: 0.8rem 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    font-style: italic;
}

.section-spacer {
    height: 0.5rem;
}
`;
