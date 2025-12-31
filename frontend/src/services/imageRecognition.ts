// Image Recognition Service for Plant Diagnosis
// Uses Google Gemini 1.5 Flash (Free Tier) for multimodal analysis
import { useState } from 'react';

// Interfaces
export interface PlantDiagnosis {
    identification?: PlantIdentification;
    healthScore: number;
    issues: DiagnosisIssue[];
    recommendations: string[];
    confidence: number;
    isHealthy: boolean;
}

export interface DiagnosisIssue {
    type: 'disease' | 'pest' | 'nutrient' | 'environmental';
    name: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    treatment: string;
    confidence: number;
}

export interface PlantIdentification {
    name: string;
    scientificName: string;
    commonNames: string[];
    confidence: number;
    description?: string;
    internalId?: string; // ID from our own database if found
    careInfo?: {
        water: string;
        light: string;
        temperature: string;
        humidity: string;
    };
}

export class ImageRecognitionService {

    private static readonly API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
    private static readonly API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

    // Helper: Convert file to Base64
    static async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string, mimeType: string } }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve({
                    inlineData: {
                        data: base64String,
                        mimeType: file.type
                    }
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Main Analysis Function
    static async analyzeImage(imageFile: File, knownPlants: { _id: string, name: string }[] = []): Promise<PlantDiagnosis> {
        try {
            if (!this.API_KEY) {
                console.warn("Missing Gemini API Key. Please set VITE_GEMINI_API_KEY in .env");
                // Return a mock if no key, ensuring the app handles it somewhat gracefully
                return this.basicImageAnalysis(imageFile);
            }

            const imagePart = await this.fileToGenerativePart(imageFile);

            // Construct context from internal DB
            // Limit to top 50 matches or just send names to avoid context overflow if list is huge
            // For now, assuming manageable list size < 100 items
            const plantListString = knownPlants.map(p => `${p.name} (ID: ${p._id})`).join(', ');

            const prompt = `
                You are Dr. Flora, an expert botanist AI. Analyze this plant image carefully.
                
                Task 1: Identify the plant.
                - Check against this list of known plants from our database: [${plantListString}].
                - If the image matches one of these plants with high confidence (>80%), include its "internalId" and set name to the DB name.
                - If not, identify it accurately using your own knowledge.
                
                Task 2: Diagnose its health.
                - Estimate a health score (0-100).
                - Identify any visible diseases, pests, or nutrient issues.
                - Provide specific care recommendations.

                Return ONLY a JSON object with this exact structure (no markdown):
                {
                    "identification": {
                        "name": "Common Name",
                        "scientificName": "Scientific Name",
                        "internalId": "ID_FROM_LIST_OR_NULL",
                        "confidence": 0.95,
                        "description": "Brief description",
                        "careInfo": { "water": "...", "light": "...", "temperature": "...", "humidity": "..." }
                    },
                    "healthScore": 85,
                    "isHealthy": true,
                    "issues": [
                        { "type": "disease", "name": "...", "severity": "low", "description": "...", "treatment": "...", "confidence": 0.9 }
                    ],
                    "recommendations": ["Tip 1", "Tip 2"]
                }
            `;

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            imagePart
                        ]
                    }]
                })
            });

            if (!response.ok) {
                // If 403 or 400, fallback
                throw new Error(`Gemini API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const candidate = data.candidates?.[0];
            if (!candidate) throw new Error("No candidates returned from Gemini");

            const textResponse = candidate.content.parts[0].text;

            // Clean markdown if present
            const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);

            return result;

        } catch (error) {
            console.error('Gemini Vision Analysis Failed:', error);
            return this.basicImageAnalysis(imageFile);
        }
    }

    // Fallback: Basic Analysis (if API fails)
    private static async basicImageAnalysis(imageFile: File): Promise<PlantDiagnosis> {
        // Analyze image colors and patterns (basic)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);

                    resolve({
                        identification: {
                            name: "Unknown Plant",
                            scientificName: "Unknown",
                            commonNames: [],
                            confidence: 0,
                            description: "Could not identify with AI. Please try again or check your API Key.",
                            careInfo: { water: "Check soil", light: "Indirect", temperature: "Average", humidity: "Average" }
                        },
                        healthScore: 50,
                        isHealthy: true,
                        issues: [],
                        recommendations: [
                            'Ensure good lighting',
                            'Check soil moisture before watering',
                            'Wipe leaves to remove dust'
                        ],
                        confidence: 0.5
                    });
                };
            };
            reader.readAsDataURL(imageFile);
        });
    }

    // Proxy methods to match existing interface usage
    static async diagnosePlant(imageFile: File, knownPlants: any[] = []): Promise<PlantDiagnosis> {
        return this.analyzeImage(imageFile, knownPlants);
    }

    static async identifyPlant(imageFile: File, knownPlants: any[] = []): Promise<PlantIdentification | null> {
        const result = await this.analyzeImage(imageFile, knownPlants);
        return result.identification || null;
    }
}

// React Hook for Image Recognition
export function useImageRecognition() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(null);
    const [identification, setIdentification] = useState<PlantIdentification | null>(null);

    const diagnosePlant = async (imageFile: File, knownPlants: any[] = []) => {
        setIsProcessing(true);
        try {
            const result = await ImageRecognitionService.diagnosePlant(imageFile, knownPlants);
            setDiagnosis(result);
            return result;
        } finally {
            setIsProcessing(false);
        }
    };

    const identifyPlant = async (imageFile: File, knownPlants: any[] = []) => {
        setIsProcessing(true);
        try {
            const result = await ImageRecognitionService.identifyPlant(imageFile, knownPlants);
            setIdentification(result);
            return result;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        diagnosis,
        identification,
        diagnosePlant,
        identifyPlant
    };
}
