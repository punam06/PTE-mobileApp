
## 📱 Orientation-Aware Mobile Web App

### 🏁 Project Overview
This mobile-first web application dynamically adapts its functionality based on how the user holds their mobile device. Depending on the orientation, it displays an alarm clock, stopwatch, countdown timer, or weather information. The app is built using **React** and optionally powered by a **Django REST API**, and it runs entirely in the browser—no native installation required.

---

### 📌 Features by Orientation
- **Portrait Mode (Upright)** → Alarm Clock  
- **Landscape Mode (Right-Side Up)** → Stopwatch  
- **Portrait Mode (Upside Down)** → Countdown Timer  
- **Landscape Mode (Right-Side Up)** → Weather of the Day (via free weather API)

---

### 🧰 Tech Stack
- **Frontend**: React (JavaScript)
- **Backend (optional)**: Django + REST API (Python)
- **Weather API**: OpenWeatherMap (Free Tier)
- **Deployment**: Vercel / Netlify / Render

---

### ⚙️ Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables for the weather API key.
4. Run the development server:
   ```bash
   npm start
   ```
---

### 🌐 Deployment
The app is deployed using Vercel for optimal performance and global CDN.  
**Live URL**: _[Deploy with Vercel - Ready for Production]_

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Configure environment variables (REACT_APP_WEATHER_API_KEY)
3. Deploy automatically on push to main branch

**Build Status:** ✅ Production build successful (77.96 kB gzipped)

---

### ✅ Key Requirements
- Mobile-first design (responsive, touch-friendly)
- Seamless orientation transitions
- Runs entirely in the browser
- Compatible with Android and iOS browsers
- Modular React components
- Error handling for API and orientation detection
- Accessibility features (ARIA labels, readable fonts)
- Performance optimization and input validation
- Basic internationalization (i18n) support

---

### ⚠️ Constraints
- No native mobile code or external dependencies
- No use of device permissions (camera, GPS, notifications)
- No personal data storage or transmission
- Use only free-tier APIs with rate limit handling
- Maintain state across orientation changes

---

### 🧪 Testing
Basic unit tests included using Jest and React Testing Library.
