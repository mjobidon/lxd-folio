// Configuration for eLearning Portfolio
const user = {
  name: "Marieve Jobidon",
  title: "Senior eLearning Developer & LMS Administrator",
  email: "jobidonm@outlook.com",
  linkedin: "https://linkedin.com/in/mjobidon",
  github: "https://github.com/sarahjohnson",
  
  // Contact information
  phone: "+1 (514) 651-6034",
  location: "Montreal, QC, CA",
  
  // Portfolio customization
  theme: {
    primary: "#2563eb",
    secondary: "#1e293b",
    accent: "#f97316"
  },
  
  // Demo URLs (replace with actual hosted demos)
  demos: {
    compliance: "./projects/storyline-demo/index.html",
    microlearning: "./projects/rise-demo/index.html",
    gamified: "./projects/h5p-demo/index.html"
  },
  
  // LMS Screenshots (replace with actual paths)
  screenshots: {
    moodle: "./assets/images/moodle-dashboard.png",
    docebo: "./assets/images/docebo-analytics.png",
    custom: "./assets/images/custom-reporting.png"
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = user;
} else {
  window.userConfig = user;
}