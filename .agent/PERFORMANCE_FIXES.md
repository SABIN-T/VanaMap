# Mobile Performance Optimizations
*> Executed on 2026-01-07 to address PageSpeed Insights score of 69.*

## 🚀 Key Improvements

### 1. First Contentful Paint (FCP)
- **Action**: Added "VANAMAP" branding text to the initial HTML preloader.
- **Impact**: Users see the brand name immediately while the React app hydrates, reducing perceived wait time.

### 2. Largest Contentful Paint (LCP)
- **Action**: Optimized `PlantCard` image loading strategy.
- **Logic**: 
  - **Desktop**: Eagerly loads top 6 images.
  - **Mobile**: Lazy loads ALL plant images to prioritize Hero text and buttons.
- **Impact**: Frees up bandwidth and main thread for the Hero section (LCP element) on mobile devices.

### 3. Rendering Performance (Paint & Composite)
- **Action**: Reduced CSS complexity on mobile via `@media (max-width: 640px)`.
- **Changes**:
  - **Disabled `backdrop-filter`**: Removed resource-intensive blur effects on `.actionContainer` and icons.
  - **Removed Text Gradients**: Switched to solid color for `.heroTitle` on mobile to speed up text rendering.
  - **Simplified Backgrounds**: Disabled the fixed-position radial gradient orb animation in `global.css` for mobile.
  - **Hardware Acceleration**: Added `transform: translateZ(0)` to the search box to promote it to its own layer without layout thrashing.

### 4. Code & Network
- **Action**: Verified Code Splitting.
- **Status**: `PlantDetailsModal` and heavy components are already lazy-loaded. `pwaManager` and offline utilities are imported dynamically.

## 📊 Expected Result
These changes target the specific bottlenecks identified in the PageSpeed report (high painting costs, blocking time, and resource contention on mobile). Expect FCP to drop below 2s and LCP to improve significantly.
