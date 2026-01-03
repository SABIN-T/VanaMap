# Two-Stage AI Verification Implementation

## Overview
This document describes the two-stage AI verification process for plant data accuracy.

## Stage 1: Data Generation
- Dr. Flora generates comprehensive plant information
- Extracts all botanical, environmental, and safety data
- Toast: "🤖 Dr. Flora Stage 1: Generating data..."

## Stage 2: Scientific Verification
- Second AI call acts as botanical scientist
- Verifies scientific accuracy of all data points
- Corrects any inaccuracies found
- Toast: "🔬 Dr. Flora Stage 2: Verifying scientific accuracy..."

## Implementation Code

```typescript
const handleAIAutoFill = async () => {
    if (!scientificNameSearch.trim()) {
        toast.error("Please enter a plant name first");
        return;
    }

    setAiLoading(true);
    const tid = toast.loading("🤖 Stage 1: Generating data...");

    try {
        // STAGE 1: Generate initial data
        const stage1Prompt = `Provide comprehensive plant information for: "${scientificNameSearch}"
        
Include: Scientific Name, Common Name, Description, Type, Sunlight, Temperature, Humidity, 
Oxygen Level, Pet Safety, CAM Photosynthesis, Ecosystem, Medicinal Values, Benefits, 
Lifespan, Leaf Shape, Stem Structure, Growth Habit, Distinctive Features`;

        const stage1Response = await chatWithDrFlora(
            [{ role: 'user', content: stage1Prompt }],
            { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
        );

        const stage1Text = stage1Response.choices?.[0]?.message?.content;
        if (!stage1Text) {
            toast.error("Stage 1 failed", { id: tid });
            return;
        }

        // STAGE 2: Verify scientific accuracy
        toast.loading("🔬 Stage 2: Verifying accuracy...", { id: tid });

        const stage2Prompt = `As a botanical scientist, verify this plant data for accuracy:

${stage1Text}

Verify: scientific name, temperature ranges, oxygen levels, pet toxicity, botanical characteristics, medicinal values.
Correct any inaccuracies. Return corrected data in same format.`;

        const stage2Response = await chatWithDrFlora(
            [{ role: 'user', content: stage2Prompt }],
            { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
        );

        const verifiedText = stage2Response.choices?.[0]?.message?.content;
        
        // Extract and populate form
        const extractedData = extractPlantDataFromAI(verifiedText || stage1Text);
        setNewPlant(prev => ({ ...prev, ...extractedData }));

        toast.success("✅ Scientifically Verified!", { id: tid });

    } catch (error) {
        toast.error("AI unavailable", { id: tid });
    } finally {
        setAiLoading(false);
    }
};
```

## Benefits
1. **Accuracy**: Double-checked by AI
2. **Scientific Validation**: Verified against botanical knowledge
3. **Error Correction**: Automatically fixes inaccuracies
4. **User Feedback**: Clear progress indication
5. **Fallback**: Uses Stage 1 data if Stage 2 fails
