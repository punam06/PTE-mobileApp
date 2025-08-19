# Custom Domain Setup: www.ptemobileapp.com

## 🌐 Domain Configuration for PTE Mobile Weather App

### **Target Domain**: `www.ptemobileapp.com`
### **Alternative**: `ptemobileapp.com` (redirects to www)

---

## 📋 Prerequisites

### 1. **Domain Registration**
You need to register the domain `ptemobileapp.com` through a domain registrar:
- **Recommended Registrars**: Namecheap, GoDaddy, Google Domains, Cloudflare
- **Domain**: `ptemobileapp.com`
- **Annual Cost**: ~$10-15 USD

### 2. **Render Account**
- Free account at [render.com](https://render.com)
- GitHub repository connected

---

## 🚀 Step-by-Step Domain Setup

### **Step 1: Deploy to Render First**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect `punam06/PTE-mobileApp` repository
4. Use these settings:
   - **Name**: `pte-mobile-weather-app`
   - **Environment**: `Static Site`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### **Step 2: Add Custom Domain in Render**
1. After deployment, go to your service dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter: `www.ptemobileapp.com`
5. Also add: `ptemobileapp.com` (for redirect)
6. Render will provide DNS records to configure

### **Step 3: Configure DNS Records**
In your domain registrar's DNS settings, add these records:

```dns
# A Record (for root domain)
Type: A
Name: @ (or leave blank)
Value: [Render's IP address - provided by Render]
TTL: 3600

# CNAME Record (for www subdomain)
Type: CNAME
Name: www
Value: [your-app-name].onrender.com
TTL: 3600

# Optional: CNAME for redirect
Type: CNAME
Name: ptemobileapp.com
Value: www.ptemobileapp.com
TTL: 3600
```

### **Step 4: SSL Certificate**
- Render automatically provides **free SSL certificate**
- HTTPS will be enabled automatically
- Certificate auto-renews

---

## 🔧 Expected Configuration

### **Primary URL**: `https://www.ptemobileapp.com`
### **Redirect**: `https://ptemobileapp.com` → `https://www.ptemobileapp.com`
### **Backup**: `https://pte-mobile-weather-app.onrender.com`

---

## ⚡ Features Available at Your Domain

### **Weather App Features**:
- ✅ Real-time weather data (WeatherAPI integration)
- ✅ 20-language internationalization system
- ✅ Mobile-responsive design (portrait/landscape)
- ✅ Progressive Web App (PWA) capabilities
- ✅ Alarm clock and timer functionality
- ✅ Stopwatch with multiple alarms
- ✅ Dark/light mode support
- ✅ Optimized help button positioning
- ✅ Enhanced country selector for landscape mode

### **Technical Stack**:
- **Frontend**: React 18 with TypeScript
- **Styling**: Responsive CSS with mobile optimization
- **API**: WeatherAPI.com integration
- **Deployment**: Render with global CDN
- **SSL**: Free automated certificate

---

## 🕒 Timeline

1. **Domain Registration**: 1-24 hours
2. **Render Deployment**: 5-10 minutes  
3. **DNS Propagation**: 1-48 hours
4. **SSL Certificate**: Automatic after DNS

---

## 💡 Alternative Domain Options

If `ptemobileapp.com` is unavailable, consider:
- `pte-mobile-app.com`
- `pteweatherapp.com` 
- `mypteapp.com`
- `ptemobile.app`

---

## 🎯 Final Result

Your PTE Mobile Weather App will be live at:
**`https://www.ptemobileapp.com`**

With all features working perfectly on your custom domain! 🚀
