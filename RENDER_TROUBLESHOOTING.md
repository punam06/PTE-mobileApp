# Render Deployment Troubleshooting Guide

## 🚨 **Common Issues and Solutions**

### **Issue 1: Build Fails**
**Problem**: Build command not finding the correct directory
**Solution**: Use these exact settings:

```
Name: pte-mobile-weather-app
Root Directory: (leave blank)
Build Command: cd pte-mobile-app && npm ci && npm run build
Publish Directory: pte-mobile-app/build
```

### **Issue 2: Repository Not Found**
**Problem**: Can't find the GitHub repository
**Solution**:
1. Make sure GitHub is connected to Render
2. Repository name: `punam06/PTE-mobileApp`
3. Make sure the repository is public

### **Issue 3: Build Takes Too Long**
**Problem**: Build times out after 10 minutes
**Solution**: Use `npm ci` instead of `npm install`

### **Issue 4: 404 Error on Routes**
**Problem**: React Router routes return 404
**Solution**: Add this to render.yaml:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

---

## 🛠️ **Step-by-Step Deployment (Simplified)**

### **Method 1: Manual Configuration (Recommended)**

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Select `punam06/PTE-mobileApp`
4. **Use These Settings**:
   - **Name**: `pte-mobile-weather-app`
   - **Root Directory**: (leave blank)
   - **Environment**: `Static Site`
   - **Branch**: `main`
   - **Build Command**: `cd pte-mobile-app && npm ci && npm run build`
   - **Publish Directory**: `pte-mobile-app/build`

### **Method 2: Infrastructure as Code**
If Method 1 fails, Render should automatically detect the `render.yaml` file.

---

## 🔍 **Debugging Steps**

### **Check Build Logs**
1. Go to your service in Render dashboard
2. Click on "Events" or "Logs"
3. Look for error messages in the build process

### **Common Error Messages**

**Error**: `npm: command not found`
**Fix**: Make sure Node.js environment is selected

**Error**: `No such file or directory: package.json`
**Fix**: Check the Root Directory setting (should be blank)

**Error**: `Build failed with exit code 1`
**Fix**: Check build command and make sure all dependencies are in package.json

**Error**: `Static site build succeeded but no files found`
**Fix**: Check Publish Directory path: `pte-mobile-app/build`

---

## 🎯 **Alternative: Deploy Using GitHub Pages**

If Render continues to have issues, you can use GitHub Pages:

1. **Go to Repository Settings**: https://github.com/punam06/PTE-mobileApp/settings
2. **Pages Section**: Enable GitHub Pages
3. **Source**: Deploy from branch `main`
4. **Folder**: Select `pte-mobile-app/build` (after configuring)

---

## 📞 **If Still Having Issues**

### **Quick Verification**
1. **Repository**: https://github.com/punam06/PTE-mobileApp ✅
2. **Branch**: `main` ✅
3. **Build Files**: `pte-mobile-app/package.json` ✅
4. **Build Output**: `pte-mobile-app/build/` ✅

### **Test Locally**
```bash
cd pte-mobile-app
npm install
npm run build
npm run start
```

If this works locally, the issue is in Render configuration.

---

## 🆘 **Emergency Fallback**

Your app is already live on Surge.sh:
**URL**: https://punam-pte-weather-api.surge.sh

This is a working backup while we troubleshoot Render.

---

## 📧 **Expected Render URL**
Once working: `https://pte-mobile-weather-app.onrender.com`

## 🕐 **Typical Deploy Time**
- **First Deploy**: 5-10 minutes
- **Subsequent Deploys**: 2-5 minutes
