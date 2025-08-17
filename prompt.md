Prompt:  
 
🏁 Hackathon Context: 
I am participating in an international remote hackathon called “Prompt This to Existence”, where I must develop a web application using AI tools. This is my first international hackathon, and I previously won a national AI hackathon. Please help me develop this project step by step so that no necessary part is missed. 
👩‍💻 Role Prompting: 
You are a full-stack web developer specializing in mobile-first React applications with optional Django backend support. Your task is to build a one-page, mobile-friendly web application that dynamically changes its displayed feature based on how the user is holding their mobile device. 
📱 Features Based on Orientation: 
Portrait Mode (Upright) → Alarm Clock 
Landscape Mode (Right-Side Up) → Stopwatch 
Portrait Mode (Upside Down) → Timer 
Landscape Mode (Right-Side Up) → Weather of the Day (via free weather API) 
🔧 Tech Stack: 
Frontend: React (JavaScript) 
Backend (optional): Django + REST API (Python) 
Weather API: Use a free-tier API like OpenWeatherMap 
🧪 Examples: 
When in portrait upright, show an alarm clock UI with time input and start button. 
When in landscape, show a stopwatch with start/stop/reset buttons. 
When in portrait upside down, show a countdown timer with preset durations. 
When in landscape, fetch and display weather info (temperature, condition, icon). 
✅ Expectations: 
Each feature should be implemented as a modular React component. 
Use JavaScript orientation detection and CSS media queries to switch views. 
Include smooth transitions and animations between components. 
Maintain state across orientation changes. 
Add error handling for orientation detection and API failures. 
Ensure accessibility with ARIA labels, readable fonts, and touch-friendly controls. 
Optimize for performance and responsiveness. 
Validate all user inputs and handle edge cases gracefully. 
Include basic unit tests using Jest or React Testing Library. 
Support basic internationalization (i18n) for time and weather formats. 
⚠️ Constraints: 
The app must run entirely in the browser—no native mobile code or external dependencies. 
Must be compatible with Android and iOS mobile browsers (e.g., Chrome, Safari). 
Orientation detection must reliably distinguish between portrait upright, portrait upside down, and landscape. 
Use only free-tier weather APIs and handle rate limits or failures gracefully. 
Avoid storing or transmitting any personal data. 
Do not use features that require device permissions (e.g., camera, GPS, notifications). 
Code should be modular, well-commented, and follow best practices. 
🌐 Deployment: 
Deploy the app using a free hosting service like Vercel, Netlify, or Render. 
Provide a public URL of the deployed app for jury evaluation. 
Include any necessary deployment configuration files (e.g., vercel.json, netlify.toml, Procfile) and instructions. 
🧠 Step-by-Step Thinking: 
Start by detecting device orientation using JavaScript. 
Based on orientation, render the appropriate React component. 
Implement each feature (alarm, stopwatch, timer, weather) as a separate module. 
Integrate the weather API and handle errors. 
Add transitions, accessibility, and responsiveness. 
Test the app and deploy it with a public URL. 
 

Word File Requirements 

 
