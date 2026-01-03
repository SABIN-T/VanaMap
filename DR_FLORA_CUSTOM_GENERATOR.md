# 🎨 Train Custom Plant Image Generator Using World Flora Index

## 🎯 Goal
Train Dr. Flora's own AI image generator that:
1. Learns from your World Flora Index (5,839 species)
2. Generates accurate plant images based on botanical data
3. Understands plant characteristics (leaf shape, flower type, etc.)
4. Creates images matching your database specifications

## 🧠 Approach: Fine-tune Stable Diffusion

### Why This Works
- **Your Data**: World Flora Index has detailed botanical descriptions
- **Base Model**: Stable Diffusion already knows general concepts
- **Fine-tuning**: Teach it YOUR specific plant species
- **Result**: Custom generator for your exact database

## 📊 Training Strategy

### Phase 1: Prepare Training Data from World Flora Index

#### Step 1.1: Convert World Flora Data to Training Format

```python
import json
from pathlib import Path

# Load your World Flora Index
from frontend.src.data.worldFlora import worldFlora

def create_training_captions():
    """
    Convert World Flora Index to image captions for training
    """
    training_data = []
    
    for plant in worldFlora:
        # Create detailed caption from botanical data
        caption = f"""
        {plant['scientificName']} ({plant['commonName']}), 
        {plant['flowerType']} flowers, 
        {plant['leafVenation']} leaf venation, 
        {plant['inflorescencePattern']} inflorescence pattern,
        botanical illustration, high detail, scientific accuracy,
        verified by {plant['verifiedSource']}
        """.strip().replace('\n', ' ')
        
        training_data.append({
            'species_id': plant['id'],
            'scientific_name': plant['scientificName'],
            'common_name': plant['commonName'],
            'caption': caption,
            'metadata': {
                'flower_type': plant['flowerType'],
                'leaf_venation': plant['leafVenation'],
                'inflorescence': plant['inflorescencePattern'],
                'rarity': plant['rarityIndex'],
                'light': plant['lightRequirement']
            }
        })
    
    # Save training captions
    with open('training/captions.json', 'w') as f:
        json.dump(training_data, f, indent=2)
    
    print(f"Created {len(training_data)} training captions")
    return training_data

# Generate captions
captions = create_training_captions()
```

#### Step 1.2: Collect Reference Images

**Option A: Download from Public Sources**

```python
import requests
from bs4 import BeautifulSoup
import time

def download_plant_images(species_name, num_images=10):
    """
    Download reference images for each species
    Uses Wikimedia Commons API (legal, CC-licensed)
    """
    base_url = "https://commons.wikimedia.org/w/api.php"
    
    params = {
        'action': 'query',
        'format': 'json',
        'generator': 'search',
        'gsrsearch': f'{species_name} plant',
        'gsrlimit': num_images,
        'prop': 'imageinfo',
        'iiprop': 'url'
    }
    
    response = requests.get(base_url, params=params)
    data = response.json()
    
    images = []
    if 'query' in data and 'pages' in data['query']:
        for page in data['query']['pages'].values():
            if 'imageinfo' in page:
                img_url = page['imageinfo'][0]['url']
                images.append(img_url)
    
    return images

# Download images for all species
def collect_dataset():
    """
    Collect images for all World Flora species
    """
    for plant in worldFlora[:100]:  # Start with first 100 species
        print(f"Downloading: {plant['scientificName']}")
        
        images = download_plant_images(plant['scientificName'])
        
        # Save images
        species_dir = f"dataset/images/{plant['id']}"
        Path(species_dir).mkdir(parents=True, exist_ok=True)
        
        for idx, img_url in enumerate(images):
            try:
                img_data = requests.get(img_url).content
                with open(f"{species_dir}/img_{idx}.jpg", 'wb') as f:
                    f.write(img_data)
            except Exception as e:
                print(f"Error downloading {img_url}: {e}")
        
        time.sleep(1)  # Be respectful to API
    
    print("Dataset collection complete!")

collect_dataset()
```

**Option B: Use Existing Plant Datasets**

```bash
# Download PlantCLEF dataset (recommended)
wget https://lab.plantnet.org/seafile/d/XXXXX/files/?p=/PlantCLEF2024.zip

# Or use PlantNet-300K
git clone https://github.com/plantnet/PlantNet-300K.git
```

#### Step 1.3: Organize Training Data

```
training_data/
├── images/
│   ├── wf_1000_sansevieria_trifasciata/
│   │   ├── 001.jpg
│   │   ├── 002.jpg
│   │   └── ...
│   ├── wf_1001_chlorophytum_comosum/
│   │   └── ...
│   └── ... (5,839 species folders)
├── captions/
│   └── metadata.jsonl  # One caption per line
└── config.yaml
```

### Phase 2: Fine-tune Stable Diffusion

#### Step 2.1: Install Requirements

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install torch torchvision
pip install diffusers transformers accelerate
pip install datasets pillow
pip install wandb  # For training monitoring
```

#### Step 2.2: Prepare Training Script

```python
import torch
from diffusers import StableDiffusionPipeline, DDPMScheduler
from diffusers.optimization import get_cosine_schedule_with_warmup
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import json

class PlantDataset(Dataset):
    """
    Custom dataset for World Flora plants
    """
    def __init__(self, data_dir, captions_file, transform=None):
        self.data_dir = data_dir
        with open(captions_file, 'r') as f:
            self.captions = json.load(f)
        self.transform = transform
    
    def __len__(self):
        return len(self.captions)
    
    def __getitem__(self, idx):
        item = self.captions[idx]
        
        # Load image
        img_path = f"{self.data_dir}/{item['species_id']}/001.jpg"
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
        
        return {
            'image': image,
            'caption': item['caption'],
            'metadata': item['metadata']
        }

def train_plant_generator(
    model_name="runwayml/stable-diffusion-v1-5",
    output_dir="models/dr_flora_generator",
    num_epochs=100,
    batch_size=4,
    learning_rate=1e-5
):
    """
    Fine-tune Stable Diffusion on World Flora Index
    """
    # Load base model
    pipe = StableDiffusionPipeline.from_pretrained(
        model_name,
        torch_dtype=torch.float16
    )
    pipe = pipe.to("cuda")
    
    # Prepare dataset
    from torchvision import transforms
    
    transform = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5])
    ])
    
    dataset = PlantDataset(
        data_dir="training_data/images",
        captions_file="training/captions.json",
        transform=transform
    )
    
    dataloader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=4
    )
    
    # Setup optimizer
    optimizer = torch.optim.AdamW(
        pipe.unet.parameters(),
        lr=learning_rate
    )
    
    lr_scheduler = get_cosine_schedule_with_warmup(
        optimizer,
        num_warmup_steps=500,
        num_training_steps=len(dataloader) * num_epochs
    )
    
    # Training loop
    print(f"Starting training for {num_epochs} epochs...")
    
    for epoch in range(num_epochs):
        for batch_idx, batch in enumerate(dataloader):
            images = batch['image'].to("cuda")
            captions = batch['caption']
            
            # Encode images
            latents = pipe.vae.encode(images).latent_dist.sample()
            latents = latents * 0.18215
            
            # Add noise
            noise = torch.randn_like(latents)
            timesteps = torch.randint(
                0, pipe.scheduler.num_train_timesteps,
                (latents.shape[0],)
            ).long().to("cuda")
            
            noisy_latents = pipe.scheduler.add_noise(
                latents, noise, timesteps
            )
            
            # Encode captions
            text_embeddings = pipe.text_encoder(
                pipe.tokenizer(
                    captions,
                    padding="max_length",
                    max_length=77,
                    return_tensors="pt"
                ).input_ids.to("cuda")
            )[0]
            
            # Predict noise
            noise_pred = pipe.unet(
                noisy_latents,
                timesteps,
                text_embeddings
            ).sample
            
            # Calculate loss
            loss = torch.nn.functional.mse_loss(
                noise_pred, noise
            )
            
            # Backprop
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            lr_scheduler.step()
            
            if batch_idx % 100 == 0:
                print(f"Epoch {epoch}, Batch {batch_idx}, Loss: {loss.item():.4f}")
        
        # Save checkpoint
        if epoch % 10 == 0:
            pipe.save_pretrained(f"{output_dir}/checkpoint-{epoch}")
    
    # Save final model
    pipe.save_pretrained(output_dir)
    print(f"Training complete! Model saved to {output_dir}")

# Start training
train_plant_generator()
```

#### Step 2.3: Simplified Training with Dreambooth

**Easier approach using Hugging Face's Dreambooth trainer:**

```bash
# Install Dreambooth
git clone https://github.com/huggingface/diffusers
cd diffusers/examples/dreambooth

# Train on your World Flora data
accelerate launch train_dreambooth.py \
  --pretrained_model_name_or_path="runwayml/stable-diffusion-v1-5" \
  --instance_data_dir="training_data/images" \
  --output_dir="models/dr_flora_generator" \
  --instance_prompt="a botanical illustration of a plant" \
  --resolution=512 \
  --train_batch_size=1 \
  --gradient_accumulation_steps=4 \
  --learning_rate=5e-6 \
  --lr_scheduler="constant" \
  --lr_warmup_steps=0 \
  --max_train_steps=2000 \
  --use_8bit_adam \
  --mixed_precision="fp16"
```

### Phase 3: Create Dr. Flora Generator API

#### Step 3.1: Flask API for Custom Generator

```python
from flask import Flask, request, jsonify
from diffusers import StableDiffusionPipeline
import torch
import base64
from io import BytesIO

app = Flask(__name__)

# Load your custom-trained model
pipe = StableDiffusionPipeline.from_pretrained(
    "models/dr_flora_generator",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

@app.route('/api/dr-flora/generate-plant', methods=['POST'])
def generate_plant():
    """
    Generate plant image using Dr. Flora's custom model
    """
    try:
        data = request.json
        species_id = data.get('speciesId')
        
        # Get plant data from World Flora Index
        plant = next(
            (p for p in worldFlora if p['id'] == species_id),
            None
        )
        
        if not plant:
            return jsonify({'error': 'Species not found'}), 404
        
        # Create detailed prompt from World Flora data
        prompt = f"""
        {plant['scientificName']} ({plant['commonName']}),
        {plant['flowerType']} flowers,
        {plant['leafVenation']} leaf venation,
        {plant['inflorescencePattern']} inflorescence,
        botanical illustration, high detail, scientific accuracy,
        professional photography, natural lighting
        """
        
        # Generate image
        image = pipe(
            prompt,
            num_inference_steps=50,
            guidance_scale=7.5,
            height=512,
            width=512
        ).images[0]
        
        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'image': f"data:image/png;base64,{img_str}",
            'species': plant['scientificName'],
            'metadata': {
                'flower_type': plant['flowerType'],
                'leaf_venation': plant['leafVenation']
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
```

### Phase 4: Integrate with Dr. Flora AI

#### Step 4.1: Update Dr. Flora System Prompt

```javascript
// backend/index.js

const systemPrompt = `
... existing Dr. Flora prompt ...

🎨 IMAGE GENERATION CAPABILITY:
You have access to a custom-trained image generator that can create botanical illustrations of any plant in the World Flora Index.

When a user asks to see a plant, you can:
1. Describe the plant verbally
2. Offer to generate an image: "Would you like me to generate a botanical illustration?"
3. If they say yes, respond with: [GENERATE:species_id]

Example:
User: "Show me a Snake Plant"
You: "Sansevieria trifasciata, commonly known as Snake Plant, has upright sword-like leaves with parallel venation. Would you like me to generate a botanical illustration? 🎨"
User: "Yes"
You: "[GENERATE:wf_1000] Here's a generated image of Sansevieria trifasciata!"

... rest of prompt ...
`;
```

#### Step 4.2: Handle Generation Requests

```javascript
// backend/index.js

app.post('/api/chat-dr-flora', async (req, res) => {
    const { messages } = req.body;
    
    // Get AI response
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages
        ]
    });
    
    let aiResponse = completion.choices[0].message.content;
    
    // Check if AI wants to generate an image
    const generateMatch = aiResponse.match(/\[GENERATE:([^\]]+)\]/);
    
    if (generateMatch) {
        const speciesId = generateMatch[1];
        
        // Call your custom generator
        const genResponse = await fetch('http://localhost:5002/api/dr-flora/generate-plant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ speciesId })
        });
        
        const genData = await genResponse.json();
        
        // Replace [GENERATE:xxx] with actual image
        aiResponse = aiResponse.replace(
            /\[GENERATE:[^\]]+\]/,
            ''
        );
        
        // Add image to response
        completion.choices[0].message.image = genData.image;
    }
    
    res.json(completion);
});
```

## 💻 Hardware Requirements

### Training:
- **GPU**: NVIDIA RTX 3090 (24GB) or better
- **RAM**: 32GB+
- **Storage**: 500GB SSD
- **Time**: 2-7 days continuous training

### Inference (Production):
- **GPU**: NVIDIA GTX 1660 (6GB) or better
- **RAM**: 16GB
- **Storage**: 50GB
- **Speed**: 5-10 seconds per image

## 💰 Cost Estimate

### Cloud Training (Recommended):
- **RunPod/Vast.ai**: $0.30-0.80/hour
- **Training Time**: 48-168 hours
- **Total Cost**: $15-135

### Self-Hosted:
- **GPU Purchase**: $800-2000
- **Electricity**: $20-50/month
- **Break-even**: 6-12 months

## 🎯 Expected Results

After training on your World Flora Index:

✅ **Accurate Species**: Generates images matching your database
✅ **Botanical Details**: Correct flower types, leaf patterns
✅ **Scientific Accuracy**: Based on verified sources
✅ **Customization**: Unique to your application
✅ **No External Costs**: Runs on your infrastructure

## 📈 Training Timeline

- **Week 1**: Collect images (10-50 per species)
- **Week 2**: Prepare captions from World Flora data
- **Week 3-4**: Train model (48-168 hours GPU time)
- **Week 5**: Test and refine
- **Week 6**: Deploy and integrate

**Total**: 6 weeks

## 🚀 Quick Start

1. **Collect 10-20 images** for top 100 species
2. **Generate captions** from World Flora Index
3. **Fine-tune** Stable Diffusion (Dreambooth)
4. **Deploy** Flask API
5. **Integrate** with Dr. Flora

## ⚠️ Important Notes

1. **Quality depends on training data**: More images = better results
2. **Start small**: Train on 100 species first, then expand
3. **GPU required**: CPU training is impractically slow
4. **Legal**: Ensure training images are CC-licensed or public domain

## 🎯 Recommendation

**Yes, Dr. Flora can learn from your World Flora Index and create its own generator!**

**Best approach:**
1. Start with Dreambooth (easier)
2. Train on top 100 species first
3. Use cloud GPU for training
4. Deploy on your server for inference

This gives you a **custom AI trained specifically on your botanical database**! 🌿🎨

**Ready to start? I can create the training scripts!**
