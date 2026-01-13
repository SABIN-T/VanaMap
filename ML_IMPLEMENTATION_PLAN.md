# Machine Learning Implementation Plan for VanaMap

## Executive Summary

Transform VanaMap's rule-based recommendation system into a hybrid ML-powered platform that learns from user behavior while maintaining the scientific accuracy of the current algorithm.

---

## Part 1: Personalized Plant Recommendations

### Current System vs ML System

**Current (Rule-Based):**
```
User Location → Environmental Data → Gaussian/Sigmoid Scoring → Ranked Plants
```

**Future (Hybrid ML):**
```
User Location + User Behavior + Plant Features → ML Model → Personalized Ranking
                                                ↓
                                    Rule-Based Baseline (Safety Net)
```

---

### 1.1 Data Collection Strategy

#### **Phase 1: Implicit Feedback (Already Available)**

Collect user interaction data from existing features:

```javascript
// Backend: Track user interactions
const userInteraction = {
  userId: "user123",
  plantId: "plant456",
  action: "view" | "favorite" | "cart_add" | "purchase" | "share",
  timestamp: Date.now(),
  sessionDuration: 45, // seconds
  environmentalContext: {
    temperature: 28,
    humidity: 65,
    location: "Kerala"
  }
};

// Store in MongoDB
db.interactions.insertOne(userInteraction);
```

**Data Points to Collect:**
- ✅ Plant views (already tracked via analytics)
- ✅ Favorites (already in database)
- ✅ Cart additions (already tracked)
- ✅ Purchases (already tracked)
- ✅ Time spent on plant page
- ✅ Search queries
- ✅ Filter selections
- ✅ AI Doctor queries about specific plants

**Implementation:**
```javascript
// frontend/src/utils/analytics.ts
export const trackPlantInteraction = async (
  plantId: string,
  action: string,
  metadata?: any
) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  await fetch(`${API_URL}/ml/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      plantId,
      action,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      }
    })
  });
};

// Usage in components
useEffect(() => {
  const timer = setTimeout(() => {
    trackPlantInteraction(plant.id, 'view', { duration: 30 });
  }, 30000); // Track after 30 seconds
  
  return () => clearTimeout(timer);
}, [plant.id]);
```

**Timeline:** 1 week to implement tracking

---

#### **Phase 2: Explicit Feedback (New Features)**

Add user rating system:

```javascript
// New component: PlantRating.tsx
const PlantRating = ({ plantId }) => {
  const [rating, setRating] = useState(0);
  
  const submitRating = async (stars) => {
    await fetch(`${API_URL}/plants/${plantId}/rate`, {
      method: 'POST',
      body: JSON.stringify({
        rating: stars,
        review: reviewText,
        growthSuccess: true/false,
        wouldRecommend: true/false
      })
    });
  };
  
  return (
    <div>
      <StarRating value={rating} onChange={setRating} />
      <button onClick={() => submitRating(rating)}>Submit</button>
    </div>
  );
};
```

**Timeline:** 2 weeks to implement

---

### 1.2 Feature Engineering

#### **User Features**

```python
# ml/features/user_features.py
def extract_user_features(user_id):
    user = db.users.find_one({"_id": user_id})
    interactions = db.interactions.find({"userId": user_id})
    
    features = {
        # Demographics
        "user_location_lat": user.get("location", {}).get("lat", 0),
        "user_location_lng": user.get("location", {}).get("lng", 0),
        "user_climate_zone": get_climate_zone(user.location),
        
        # Behavior patterns
        "total_views": interactions.count({"action": "view"}),
        "total_favorites": interactions.count({"action": "favorite"}),
        "total_purchases": interactions.count({"action": "purchase"}),
        "avg_session_duration": calculate_avg_session(interactions),
        
        # Preferences (learned)
        "preferred_plant_type": get_most_common(interactions, "plantType"),
        "preferred_maintenance": get_most_common(interactions, "maintenance"),
        "avg_price_range": calculate_avg_price(interactions),
        
        # Time patterns
        "active_hours": get_active_hours(interactions),
        "days_since_signup": (datetime.now() - user.createdAt).days,
        "last_activity_days": get_last_activity(user_id)
    }
    
    return features
```

#### **Plant Features**

```python
# ml/features/plant_features.py
def extract_plant_features(plant_id):
    plant = db.plants.find_one({"id": plant_id})
    
    features = {
        # Basic attributes
        "temp_min": plant.get("idealTempMin", 15),
        "temp_max": plant.get("idealTempMax", 30),
        "temp_optimal": (plant.idealTempMin + plant.idealTempMax) / 2,
        "humidity_min": plant.get("minHumidity", 40),
        "light_requirement": encode_light(plant.sunlight),
        
        # Categorical (one-hot encoded)
        "is_indoor": 1 if plant.type == "indoor" else 0,
        "is_outdoor": 1 if plant.type == "outdoor" else 0,
        "maintenance_low": 1 if plant.maintenance == "low" else 0,
        "maintenance_medium": 1 if plant.maintenance == "medium" else 0,
        "maintenance_high": 1 if plant.maintenance == "high" else 0,
        
        # Popularity metrics
        "total_views": get_plant_views(plant_id),
        "total_favorites": get_plant_favorites(plant_id),
        "avg_rating": get_avg_rating(plant_id),
        "purchase_count": get_purchase_count(plant_id),
        
        # Text features (TF-IDF)
        "description_embedding": get_text_embedding(plant.description),
        "advantages_embedding": get_text_embedding(plant.advantages)
    }
    
    return features
```

#### **Context Features**

```python
# ml/features/context_features.py
def extract_context_features(user_location, timestamp):
    weather = get_weather_data(user_location)
    
    features = {
        # Environmental
        "current_temp": weather.temperature,
        "current_humidity": weather.humidity,
        "current_aqi": weather.aqi,
        "season": get_season(timestamp),
        
        # Temporal
        "hour_of_day": timestamp.hour,
        "day_of_week": timestamp.weekday(),
        "is_weekend": 1 if timestamp.weekday() >= 5 else 0,
        "month": timestamp.month,
        
        # Location
        "latitude": user_location.lat,
        "longitude": user_location.lng,
        "urban_rural": classify_location(user_location)
    }
    
    return features
```

**Timeline:** 3 weeks to implement feature engineering

---

### 1.3 Model Architecture

#### **Approach 1: Collaborative Filtering (User-Based)**

**Best for:** "Users who liked X also liked Y"

```python
# ml/models/collaborative_filtering.py
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

class CollaborativeFilteringModel:
    def __init__(self):
        self.model = NearestNeighbors(
            n_neighbors=20,
            metric='cosine',
            algorithm='brute'
        )
        self.user_plant_matrix = None
        
    def create_interaction_matrix(self, interactions):
        """
        Create user-plant interaction matrix
        Rows: Users, Columns: Plants
        Values: Interaction score (weighted)
        """
        users = interactions['userId'].unique()
        plants = interactions['plantId'].unique()
        
        user_idx = {user: i for i, user in enumerate(users)}
        plant_idx = {plant: i for i, plant in enumerate(plants)}
        
        # Weight different actions
        weights = {
            'view': 1,
            'favorite': 3,
            'cart_add': 5,
            'purchase': 10
        }
        
        matrix = np.zeros((len(users), len(plants)))
        
        for _, row in interactions.iterrows():
            u_idx = user_idx[row['userId']]
            p_idx = plant_idx[row['plantId']]
            weight = weights.get(row['action'], 1)
            matrix[u_idx, p_idx] += weight
        
        self.user_plant_matrix = csr_matrix(matrix)
        return self.user_plant_matrix
    
    def train(self, interactions):
        matrix = self.create_interaction_matrix(interactions)
        self.model.fit(matrix)
        
    def recommend(self, user_id, n_recommendations=10):
        user_vector = self.user_plant_matrix[user_id]
        distances, indices = self.model.kneighbors(
            user_vector,
            n_neighbors=n_recommendations + 1
        )
        
        # Skip first result (user themselves)
        similar_users = indices[0][1:]
        
        # Aggregate plants from similar users
        recommended_plants = self.aggregate_recommendations(similar_users)
        
        return recommended_plants[:n_recommendations]
```

**Pros:**
- Simple to implement
- Works well with sparse data
- Explainable ("Users like you also liked...")

**Cons:**
- Cold start problem (new users/plants)
- Doesn't use plant features

**Timeline:** 2 weeks to implement

---

#### **Approach 2: Content-Based Filtering**

**Best for:** "Based on plants you liked, you might like..."

```python
# ml/models/content_based.py
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class ContentBasedModel:
    def __init__(self):
        self.plant_features = None
        self.similarity_matrix = None
        
    def train(self, plants_df):
        """
        Train on plant features
        """
        # Extract features
        features = []
        for _, plant in plants_df.iterrows():
            features.append(extract_plant_features(plant['id']))
        
        self.plant_features = pd.DataFrame(features)
        
        # Calculate similarity matrix
        self.similarity_matrix = cosine_similarity(
            self.plant_features
        )
        
    def recommend(self, user_liked_plants, n_recommendations=10):
        """
        Recommend plants similar to what user liked
        """
        # Get indices of liked plants
        liked_indices = [
            self.plant_features.index[
                self.plant_features['plant_id'] == plant_id
            ][0]
            for plant_id in user_liked_plants
        ]
        
        # Calculate average similarity
        avg_similarity = np.mean(
            self.similarity_matrix[liked_indices],
            axis=0
        )
        
        # Get top N most similar
        top_indices = np.argsort(avg_similarity)[-n_recommendations:]
        
        return self.plant_features.iloc[top_indices]['plant_id'].tolist()
```

**Pros:**
- No cold start for plants
- Uses plant characteristics
- Transparent recommendations

**Cons:**
- Doesn't learn from other users
- Limited diversity

**Timeline:** 2 weeks to implement

---

#### **Approach 3: Hybrid Model (RECOMMENDED)**

**Best for:** Combining strengths of both approaches

```python
# ml/models/hybrid_model.py
import tensorflow as tf
from tensorflow import keras

class HybridRecommendationModel:
    def __init__(self, n_users, n_plants, embedding_dim=50):
        self.n_users = n_users
        self.n_plants = n_plants
        self.embedding_dim = embedding_dim
        self.model = self.build_model()
        
    def build_model(self):
        # User input
        user_input = keras.Input(shape=(1,), name='user_id')
        user_embedding = keras.layers.Embedding(
            self.n_users,
            self.embedding_dim,
            name='user_embedding'
        )(user_input)
        user_vec = keras.layers.Flatten()(user_embedding)
        
        # Plant input
        plant_input = keras.Input(shape=(1,), name='plant_id')
        plant_embedding = keras.layers.Embedding(
            self.n_plants,
            self.embedding_dim,
            name='plant_embedding'
        )(plant_input)
        plant_vec = keras.layers.Flatten()(plant_embedding)
        
        # Plant features input
        plant_features_input = keras.Input(
            shape=(20,),  # Number of plant features
            name='plant_features'
        )
        
        # User features input
        user_features_input = keras.Input(
            shape=(15,),  # Number of user features
            name='user_features'
        )
        
        # Context features input
        context_input = keras.Input(
            shape=(10,),  # Number of context features
            name='context_features'
        )
        
        # Concatenate all features
        concat = keras.layers.Concatenate()([
            user_vec,
            plant_vec,
            plant_features_input,
            user_features_input,
            context_input
        ])
        
        # Deep neural network
        dense1 = keras.layers.Dense(128, activation='relu')(concat)
        dropout1 = keras.layers.Dropout(0.3)(dense1)
        dense2 = keras.layers.Dense(64, activation='relu')(dropout1)
        dropout2 = keras.layers.Dropout(0.3)(dense2)
        dense3 = keras.layers.Dense(32, activation='relu')(dropout2)
        
        # Output: Probability of interaction
        output = keras.layers.Dense(1, activation='sigmoid')(dense3)
        
        model = keras.Model(
            inputs=[
                user_input,
                plant_input,
                plant_features_input,
                user_features_input,
                context_input
            ],
            outputs=output
        )
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy', 'AUC']
        )
        
        return model
    
    def train(self, training_data, validation_data, epochs=50):
        """
        Train the model
        """
        early_stopping = keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        )
        
        history = self.model.fit(
            training_data,
            validation_data=validation_data,
            epochs=epochs,
            batch_size=256,
            callbacks=[early_stopping],
            verbose=1
        )
        
        return history
    
    def predict(self, user_id, plant_ids, user_features, context):
        """
        Predict interaction probability for user-plant pairs
        """
        n_plants = len(plant_ids)
        
        predictions = self.model.predict({
            'user_id': np.array([user_id] * n_plants),
            'plant_id': np.array(plant_ids),
            'plant_features': np.array([
                extract_plant_features(pid) for pid in plant_ids
            ]),
            'user_features': np.array([user_features] * n_plants),
            'context_features': np.array([context] * n_plants)
        })
        
        return predictions.flatten()
    
    def recommend(self, user_id, n_recommendations=10):
        """
        Get top N recommendations for user
        """
        # Get all plants
        all_plants = get_all_plant_ids()
        
        # Get user features
        user_features = extract_user_features(user_id)
        context = extract_context_features(
            user_features['location'],
            datetime.now()
        )
        
        # Predict scores
        scores = self.predict(
            user_id,
            all_plants,
            user_features,
            context
        )
        
        # Get top N
        top_indices = np.argsort(scores)[-n_recommendations:][::-1]
        recommended_plants = [all_plants[i] for i in top_indices]
        
        return recommended_plants, scores[top_indices]
```

**Pros:**
- Learns from user behavior AND plant features
- Handles cold start better
- Most accurate predictions

**Cons:**
- More complex
- Requires more data
- Longer training time

**Timeline:** 4-5 weeks to implement

---

### 1.4 Training Pipeline

```python
# ml/training/pipeline.py
import pandas as pd
from datetime import datetime, timedelta

class TrainingPipeline:
    def __init__(self):
        self.model = HybridRecommendationModel(
            n_users=10000,
            n_plants=500
        )
        
    def prepare_data(self):
        """
        Prepare training data from MongoDB
        """
        # Get interactions from last 6 months
        cutoff_date = datetime.now() - timedelta(days=180)
        
        interactions = db.interactions.find({
            "timestamp": {"$gte": cutoff_date}
        })
        
        df = pd.DataFrame(list(interactions))
        
        # Create positive samples (interactions that happened)
        positive_samples = df.copy()
        positive_samples['label'] = 1
        
        # Create negative samples (random non-interactions)
        negative_samples = self.generate_negative_samples(
            df,
            ratio=2  # 2 negative for each positive
        )
        negative_samples['label'] = 0
        
        # Combine
        all_samples = pd.concat([positive_samples, negative_samples])
        all_samples = all_samples.sample(frac=1).reset_index(drop=True)
        
        # Split train/validation/test
        train_size = int(0.7 * len(all_samples))
        val_size = int(0.15 * len(all_samples))
        
        train_data = all_samples[:train_size]
        val_data = all_samples[train_size:train_size+val_size]
        test_data = all_samples[train_size+val_size:]
        
        return train_data, val_data, test_data
    
    def generate_negative_samples(self, interactions_df, ratio=2):
        """
        Generate negative samples (plants user didn't interact with)
        """
        all_users = interactions_df['userId'].unique()
        all_plants = get_all_plant_ids()
        
        negative_samples = []
        
        for user_id in all_users:
            # Get plants user interacted with
            user_plants = set(
                interactions_df[
                    interactions_df['userId'] == user_id
                ]['plantId']
            )
            
            # Get plants user didn't interact with
            non_interacted = list(set(all_plants) - user_plants)
            
            # Sample random plants
            n_samples = len(user_plants) * ratio
            sampled_plants = np.random.choice(
                non_interacted,
                size=min(n_samples, len(non_interacted)),
                replace=False
            )
            
            for plant_id in sampled_plants:
                negative_samples.append({
                    'userId': user_id,
                    'plantId': plant_id,
                    'timestamp': datetime.now()
                })
        
        return pd.DataFrame(negative_samples)
    
    def train_model(self):
        """
        Full training pipeline
        """
        print("Preparing data...")
        train_data, val_data, test_data = self.prepare_data()
        
        print(f"Training samples: {len(train_data)}")
        print(f"Validation samples: {len(val_data)}")
        print(f"Test samples: {len(test_data)}")
        
        # Convert to model input format
        train_inputs = self.prepare_model_inputs(train_data)
        val_inputs = self.prepare_model_inputs(val_data)
        
        print("Training model...")
        history = self.model.train(
            train_inputs,
            val_inputs,
            epochs=50
        )
        
        print("Evaluating model...")
        test_inputs = self.prepare_model_inputs(test_data)
        metrics = self.model.model.evaluate(test_inputs)
        
        print(f"Test Accuracy: {metrics[1]:.4f}")
        print(f"Test AUC: {metrics[2]:.4f}")
        
        # Save model
        self.model.model.save('models/hybrid_recommendation_v1.h5')
        
        return history, metrics
    
    def prepare_model_inputs(self, data):
        """
        Convert DataFrame to model input format
        """
        return {
            'user_id': data['userId'].values,
            'plant_id': data['plantId'].values,
            'plant_features': np.array([
                extract_plant_features(pid)
                for pid in data['plantId']
            ]),
            'user_features': np.array([
                extract_user_features(uid)
                for uid in data['userId']
            ]),
            'context_features': np.array([
                extract_context_features(
                    get_user_location(uid),
                    ts
                )
                for uid, ts in zip(data['userId'], data['timestamp'])
            ])
        }, data['label'].values

# Run training
if __name__ == "__main__":
    pipeline = TrainingPipeline()
    history, metrics = pipeline.train_model()
```

**Timeline:** 2 weeks to implement pipeline

---

### 1.5 Deployment Strategy

#### **Option 1: TensorFlow.js (Client-Side)**

```javascript
// frontend/src/ml/recommender.ts
import * as tf from '@tensorflow/tfjs';

class MLRecommender {
  private model: tf.LayersModel | null = null;
  
  async loadModel() {
    this.model = await tf.loadLayersModel(
      '/models/hybrid_recommendation/model.json'
    );
  }
  
  async recommend(userId: string, n: number = 10) {
    if (!this.model) await this.loadModel();
    
    const allPlants = await fetchAllPlants();
    const userFeatures = await getUserFeatures(userId);
    const context = getCurrentContext();
    
    // Prepare inputs
    const userIdTensor = tf.tensor2d(
      Array(allPlants.length).fill(userId),
      [allPlants.length, 1]
    );
    const plantIdTensor = tf.tensor2d(
      allPlants.map(p => p.id),
      [allPlants.length, 1]
    );
    // ... prepare other tensors
    
    // Predict
    const predictions = this.model!.predict({
      user_id: userIdTensor,
      plant_id: plantIdTensor,
      // ... other inputs
    }) as tf.Tensor;
    
    const scores = await predictions.array();
    
    // Get top N
    const topIndices = scores
      .map((score, idx) => ({ score, idx }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(item => item.idx);
    
    return topIndices.map(idx => allPlants[idx]);
  }
}
```

**Pros:**
- No server load
- Instant predictions
- Works offline

**Cons:**
- Large model size
- Limited by browser resources

---

#### **Option 2: Backend API (Server-Side)**

```python
# backend/ml_service.py
from flask import Flask, request, jsonify
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model('models/hybrid_recommendation_v1.h5')

@app.route('/ml/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = data['userId']
    n_recommendations = data.get('n', 10)
    
    # Get recommendations
    recommendations = model.recommend(user_id, n_recommendations)
    
    return jsonify({
        'recommendations': recommendations,
        'scores': scores.tolist()
    })

if __name__ == '__main__':
    app.run(port=5001)
```

**Pros:**
- More powerful models
- Easier updates
- Better security

**Cons:**
- Server load
- Latency

**RECOMMENDED:** Hybrid approach - cache predictions, update daily

---

### 1.6 A/B Testing Strategy

```javascript
// frontend/src/utils/abTesting.ts
const getRecommendations = async (userId: string) => {
  const variant = getUserVariant(userId); // 50/50 split
  
  if (variant === 'ml') {
    // ML recommendations
    return await fetch('/ml/recommend', {
      method: 'POST',
      body: JSON.stringify({ userId })
    }).then(r => r.json());
  } else {
    // Rule-based (current system)
    return await getRuleBasedRecommendations(userId);
  }
};

// Track which performs better
trackConversion(userId, variant, 'purchase');
```

**Metrics to Track:**
- Click-through rate (CTR)
- Conversion rate
- Time to purchase
- User satisfaction
- Diversity of recommendations

**Timeline:** 1 week to implement

---

## Part 2: Plant Image Classification

### 2.1 Custom CNN Model

```python
# ml/models/plant_classifier.py
import tensorflow as tf
from tensorflow.keras import layers

class PlantClassifier:
    def __init__(self, num_classes=500):
        self.num_classes = num_classes
        self.model = self.build_model()
        
    def build_model(self):
        # Use MobileNetV2 as base (efficient for mobile)
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model
        base_model.trainable = False
        
        # Add custom layers
        model = tf.keras.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_k_categorical_accuracy']
        )
        
        return model
    
    def train(self, train_data, val_data, epochs=30):
        # Data augmentation
        data_augmentation = tf.keras.Sequential([
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(0.2),
            layers.RandomContrast(0.2)
        ])
        
        # Train
        history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(
                    patience=5,
                    restore_best_weights=True
                ),
                tf.keras.callbacks.ReduceLROnPlateau(
                    factor=0.5,
                    patience=3
                )
            ]
        )
        
        return history
    
    def predict(self, image):
        # Preprocess
        img = tf.image.resize(image, (224, 224))
        img = tf.expand_dims(img, 0)
        img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
        
        # Predict
        predictions = self.model.predict(img)
        top_5 = tf.nn.top_k(predictions[0], k=5)
        
        return {
            'plant_ids': top_5.indices.numpy().tolist(),
            'confidences': top_5.values.numpy().tolist()
        }
```

**Dataset:** 
- PlantCLEF 2023 (10,000+ species)
- Custom dataset from VanaMap uploads
- Target: 95%+ accuracy on top-5

**Timeline:** 6-8 weeks (including data collection)

---

## Implementation Timeline

### Month 1: Data Collection & Infrastructure
- Week 1-2: Implement tracking system
- Week 3-4: Collect baseline data, set up ML infrastructure

### Month 2: Feature Engineering & Model Development
- Week 1-2: Build feature extraction pipeline
- Week 3-4: Develop and test models

### Month 3: Training & Evaluation
- Week 1-2: Train models, tune hyperparameters
- Week 3-4: Evaluate, A/B test setup

### Month 4: Deployment & Monitoring
- Week 1-2: Deploy to production
- Week 3-4: Monitor, iterate, improve

---

## Budget Estimate

**Infrastructure:**
- GPU server (training): $500/month
- Inference API: $200/month
- Storage: $100/month

**Tools:**
- TensorFlow, PyTorch: Free
- MLflow (experiment tracking): Free
- Weights & Biases: $50/month

**Total:** ~$850/month

---

## Success Metrics

**Phase 1 (3 months):**
- 10,000+ user interactions collected
- Model accuracy: >70%
- CTR improvement: +15%

**Phase 2 (6 months):**
- 50,000+ interactions
- Model accuracy: >80%
- Conversion rate: +25%

**Phase 3 (12 months):**
- 200,000+ interactions
- Model accuracy: >90%
- Revenue increase: +40%

---

## Next Steps

1. ✅ Implement tracking (Week 1)
2. ✅ Collect 1 month of data
3. ✅ Build prototype model
4. ✅ A/B test with 10% of users
5. ✅ Iterate and improve
6. ✅ Full rollout

**Start Date:** February 2026  
**Full Deployment:** May 2026

---

*This plan is practical, implementable, and will significantly improve VanaMap's recommendation quality.*
