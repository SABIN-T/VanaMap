# 🧠 Custom Machine Learning for VanaMap - Implementation Guide

## 🎯 Goal
Build custom ML models for:
1. **Plant Image Classification** (Identify plant species from photos)
2. **Plant Image Generation** (Generate plant images)

Using your World Flora Index (5,839 species) as training data.

## 📊 Approach Overview

### Option 1: Transfer Learning (RECOMMENDED)
**Best for**: Quick implementation with good accuracy
**Time**: 2-4 weeks
**Complexity**: Medium

### Option 2: Train from Scratch
**Best for**: Maximum customization
**Time**: 2-3 months
**Complexity**: High

## 🚀 RECOMMENDED: Transfer Learning Approach

### Phase 1: Plant Image Classification

#### Technology Stack
```
- Framework: TensorFlow.js or PyTorch
- Pre-trained Model: MobileNetV2 or ResNet50
- Backend: Python (Flask) or Node.js (TensorFlow.js)
- Dataset: Your World Flora Index + Public plant datasets
```

#### Step 1.1: Collect Training Data

**Option A: Use Existing Datasets**
```python
# Free plant image datasets:
1. PlantCLEF 2024 (300,000+ images, 10,000+ species)
   - https://www.imageclef.org/PlantCLEF2024
   
2. PlantNet-300K (306,146 images, 1,081 species)
   - https://github.com/plantnet/PlantNet-300K
   
3. iNaturalist Plants (Millions of images)
   - https://www.inaturalist.org/
   
4. Pl@ntNet API (Free for research)
   - https://my.plantnet.org/
```

**Option B: Web Scraping (Legal sources)**
```python
# Scrape from:
- Wikimedia Commons (CC licensed)
- Flickr (CC licensed)
- Google Images (with proper attribution)
- Your own user uploads
```

#### Step 1.2: Prepare Dataset

**File Structure:**
```
dataset/
├── train/
│   ├── sansevieria_trifasciata/
│   │   ├── img1.jpg
│   │   ├── img2.jpg
│   │   └── ...
│   ├── chlorophytum_comosum/
│   │   └── ...
│   └── ... (5,839 species folders)
├── validation/
│   └── ... (same structure)
└── test/
    └── ... (same structure)
```

**Python Script to Organize:**
```python
import os
import shutil
from sklearn.model_selection import train_test_split

def organize_dataset(source_dir, output_dir):
    """
    Organize images into train/val/test splits
    """
    species_folders = os.listdir(source_dir)
    
    for species in species_folders:
        species_path = os.path.join(source_dir, species)
        images = os.listdir(species_path)
        
        # Split: 70% train, 15% val, 15% test
        train, temp = train_test_split(images, test_size=0.3, random_state=42)
        val, test = train_test_split(temp, test_size=0.5, random_state=42)
        
        # Create directories
        for split, imgs in [('train', train), ('validation', val), ('test', test)]:
            split_dir = os.path.join(output_dir, split, species)
            os.makedirs(split_dir, exist_ok=True)
            
            for img in imgs:
                src = os.path.join(species_path, img)
                dst = os.path.join(split_dir, img)
                shutil.copy(src, dst)
    
    print(f"Dataset organized: {output_dir}")

# Usage
organize_dataset('raw_images', 'dataset')
```

#### Step 1.3: Train Classification Model

**Using TensorFlow/Keras (Python):**

```python
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 50
NUM_CLASSES = 5839  # Your World Flora Index species count

# Data Augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

# Load Data
train_generator = train_datagen.flow_from_directory(
    'dataset/train',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

validation_generator = val_datagen.flow_from_directory(
    'dataset/validation',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Build Model (Transfer Learning)
base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model layers
base_model.trainable = False

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.5)(x)
x = Dense(512, activation='relu')(x)
x = Dropout(0.3)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy', 'top_k_categorical_accuracy']
)

# Callbacks
callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        'models/plant_classifier_best.h5',
        save_best_only=True,
        monitor='val_accuracy'
    ),
    tf.keras.callbacks.EarlyStopping(
        patience=10,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        factor=0.5,
        patience=5
    )
]

# Train
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator,
    callbacks=callbacks
)

# Save final model
model.save('models/plant_classifier_final.h5')

# Save class labels
class_labels = {v: k for k, v in train_generator.class_indices.items()}
with open('models/class_labels.json', 'w') as f:
    json.dump(class_labels, f)

print("Training complete!")
```

#### Step 1.4: Convert to TensorFlow.js (For Browser)

```bash
# Install tensorflowjs converter
pip install tensorflowjs

# Convert model
tensorflowjs_converter \
    --input_format=keras \
    models/plant_classifier_final.h5 \
    models/tfjs_model/
```

#### Step 1.5: Integrate with Backend

**Option A: Python Flask API**

```python
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import json

app = Flask(__name__)

# Load model and labels
model = load_model('models/plant_classifier_final.h5')
with open('models/class_labels.json', 'r') as f:
    class_labels = json.load(f)

@app.route('/api/identify-plant', methods=['POST'])
def identify_plant():
    try:
        # Get image from request
        img_file = request.files['image']
        
        # Preprocess
        img = image.load_img(img_file, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        
        # Predict
        predictions = model.predict(img_array)
        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        
        # Format results
        results = []
        for idx in top_5_indices:
            results.append({
                'species': class_labels[str(idx)],
                'confidence': float(predictions[0][idx])
            })
        
        return jsonify({
            'success': True,
            'predictions': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

**Option B: TensorFlow.js (Node.js)**

```javascript
const tf = require('@tensorflow/tfjs-node');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let model;
let classLabels;

// Load model
async function loadModel() {
    model = await tf.loadLayersModel('file://./models/tfjs_model/model.json');
    classLabels = require('./models/class_labels.json');
    console.log('Model loaded successfully');
}

// Preprocess image
async function preprocessImage(buffer) {
    const resized = await sharp(buffer)
        .resize(224, 224)
        .toBuffer();
    
    const tensor = tf.node.decodeImage(resized, 3)
        .toFloat()
        .div(255.0)
        .expandDims(0);
    
    return tensor;
}

// Identify plant endpoint
app.post('/api/identify-plant', upload.single('image'), async (req, res) => {
    try {
        const imageTensor = await preprocessImage(req.file.buffer);
        const predictions = await model.predict(imageTensor);
        const probabilities = await predictions.data();
        
        // Get top 5
        const top5 = Array.from(probabilities)
            .map((prob, idx) => ({ species: classLabels[idx], confidence: prob }))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5);
        
        res.json({
            success: true,
            predictions: top5
        });
        
        // Cleanup
        imageTensor.dispose();
        predictions.dispose();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

loadModel().then(() => {
    app.listen(5001, () => console.log('ML API running on port 5001'));
});
```

### Phase 2: Plant Image Generation

#### Option 1: Use Stable Diffusion (RECOMMENDED)

**Why**: Open-source, runs locally, good quality

```python
from diffusers import StableDiffusionPipeline
import torch

# Load model (one-time download ~4GB)
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")  # Use GPU

def generate_plant_image(plant_name, style="photorealistic"):
    prompt = f"A beautiful {style} photograph of {plant_name}, botanical illustration, high detail, professional photography, natural lighting"
    
    image = pipe(
        prompt,
        num_inference_steps=50,
        guidance_scale=7.5
    ).images[0]
    
    return image

# Usage
image = generate_plant_image("Sansevieria trifasciata", "photorealistic")
image.save("generated_snake_plant.png")
```

**Flask API for Generation:**

```python
@app.route('/api/generate-plant', methods=['POST'])
def generate_plant():
    try:
        data = request.json
        plant_name = data.get('plantName')
        style = data.get('style', 'photorealistic')
        
        # Generate
        image = generate_plant_image(plant_name, style)
        
        # Save to temporary file
        temp_path = f"temp/{plant_name}_{int(time.time())}.png"
        image.save(temp_path)
        
        # Return URL or base64
        with open(temp_path, 'rb') as f:
            img_base64 = base64.b64encode(f.read()).decode()
        
        return jsonify({
            'success': True,
            'image': f"data:image/png;base64,{img_base64}"
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

#### Option 2: Train Your Own GAN (Advanced)

**For custom plant generation trained on your dataset**

This requires significant computational resources and expertise. Recommended only if you have:
- GPU with 16GB+ VRAM
- Large dataset (10,000+ images per species)
- ML expertise
- 1-2 months development time

## 💻 Hardware Requirements

### Minimum (Training):
- CPU: 8+ cores
- RAM: 16GB
- GPU: NVIDIA GTX 1660 (6GB VRAM)
- Storage: 500GB SSD

### Recommended (Training):
- CPU: 16+ cores
- RAM: 32GB
- GPU: NVIDIA RTX 3090 (24GB VRAM)
- Storage: 1TB NVMe SSD

### Production (Inference):
- CPU: 4+ cores
- RAM: 8GB
- GPU: Optional (CPU inference possible but slower)
- Storage: 100GB

## 📈 Expected Performance

### Classification Model:
- **Accuracy**: 85-95% (with good dataset)
- **Inference Time**: 50-200ms per image
- **Model Size**: 50-200MB

### Generation Model:
- **Quality**: Good to Excellent
- **Generation Time**: 5-30 seconds per image
- **Model Size**: 2-4GB

## 💰 Cost Comparison

### Custom ML (One-time + Hosting):
- **Training**: $0 (local) or $50-200 (cloud GPU)
- **Hosting**: $20-50/month (VPS with GPU)
- **Per Request**: $0

### External AI (Pay-per-use):
- **Setup**: $0
- **Hosting**: Included
- **Per Request**: $0.01-0.04

**Break-even**: ~1,000-5,000 requests

## 🚀 Quick Start (Simplified)

### Week 1: Setup & Data Collection
1. Install Python, TensorFlow
2. Download PlantCLEF dataset
3. Organize dataset

### Week 2: Train Classification Model
1. Run training script
2. Evaluate accuracy
3. Convert to TensorFlow.js

### Week 3: Deploy & Integrate
1. Set up Flask/Node.js API
2. Integrate with frontend
3. Test end-to-end

### Week 4: Add Generation (Optional)
1. Set up Stable Diffusion
2. Create generation endpoint
3. Test and optimize

## 📚 Learning Resources

1. **TensorFlow Tutorial**: https://www.tensorflow.org/tutorials
2. **Plant Classification**: https://www.kaggle.com/c/plant-pathology-2021-fgvc8
3. **Transfer Learning**: https://www.tensorflow.org/tutorials/images/transfer_learning
4. **Stable Diffusion**: https://huggingface.co/docs/diffusers/

## ⚠️ Important Considerations

1. **Dataset Quality**: Garbage in = Garbage out
2. **Computational Cost**: Training requires significant resources
3. **Maintenance**: Models need retraining as data grows
4. **Accuracy**: May not match GPT-4o initially
5. **Time Investment**: 2-4 weeks minimum

## 🎯 Recommendation

**For VanaMap, I recommend:**

1. **Start with**: Transfer learning classification model
2. **Use**: Stable Diffusion for generation
3. **Host on**: Cloud GPU (RunPod, Vast.ai) - $0.20-0.50/hour
4. **Scale**: Move to dedicated server when usage grows

This gives you:
- ✅ No per-request costs
- ✅ Full control
- ✅ Privacy
- ✅ Customization
- ✅ Learning opportunity

**Next Step**: Would you like me to create the training scripts and setup guide?
