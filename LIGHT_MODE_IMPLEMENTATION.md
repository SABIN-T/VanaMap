# Light Mode Implementation Plan - Premium Green Botanical Theme

## ✅ COMPLETED PAGES
1. **Core System** (`index.css`)
   - Global color variables
   - Button styles
   - Input/form styles
   - Card styles
   - Modal overlays
   - Links and notifications

2. **Navigation** (`Navbar.module.css`)
   - Glass effect navbar
   - Interactive elements
   - Mobile menu

3. **Mobile Tab Bar** (`MobileTabBar.tsx`)
   - Dynamic theme detection
   - Green accents

4. **Leaderboard** (`Leaderboard.module.css`)
   - Complete light mode styling
   - Quest bar, podium, cards

## 🔄 IN PROGRESS / NEEDS REVIEW

### High Priority User-Facing Pages
5. **Home Page** (`Home.module.css`)
6. **Shops** (`Shops.module.css`)
7. **Nearby** (`Nearby.module.css`)
8. **Cart** (`Cart.module.css`)
9. **Auth** (`Auth.module.css`)
10. **AI Doctor** (`AIDoctor.module.css`)
11. **Heaven** (`Heaven.module.css`)
12. **Premium** (`Premium.module.css`)

### Components
13. **PlantCard** (`PlantCard.module.css`)
14. **PlantDetailsModal** (`PlantDetailsModal.module.css`)
15. **PlantVendorsModal** (`PlantVendorsModal.module.css`)

### Secondary Pages
16. **About** (`About.module.css`)
17. **Contact** (`Contact.module.css`)
18. **Support** (`Support.module.css`)
19. **UserDashboard** (`UserDashboard.module.css`)
20. **VendorPortal** (`VendorPortal.module.css`)
21. **MakeItReal** (`MakeItReal.module.css`)
22. **PotDesigner** (`PotDesigner.module.css`)
23. **ForestGame** (`ForestGame.module.css`)
24. **DailyNews** (`DailyNews.module.css`)

### Admin Pages (Lower Priority)
25. **Admin** (`Admin.module.css`)
26. **AdminLogin** (`AdminLogin.module.css`)
27. All admin sub-pages

## Color Palette Reference
```css
/* Light Mode Colors */
--color-bg: #f0fdf4;              /* Mint green background */
--color-bg-alt: #dcfce7;          /* Soft green */
--color-bg-card: #ffffff;         /* White cards */
--color-text-main: #064e3b;       /* Deep forest green */
--color-text-muted: #047857;      /* Medium green */
--color-text-dim: #059669;        /* Light green */
--color-primary: #10b981;         /* Emerald */
--color-border: rgba(16, 185, 129, 0.15);
```

## Implementation Strategy
1. Start with high-traffic user pages
2. Ensure all text is readable (no white text on light backgrounds)
3. Use green-tinted shadows and borders
4. Maintain premium aesthetic
5. Test each page thoroughly
