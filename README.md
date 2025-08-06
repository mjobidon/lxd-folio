# 🎓 Senior eLearning Developer Portfolio

## Live Demo
**Visit:** [https://your-username.github.io/eLearning-Portfolio](https://your-username.github.io/eLearning-Portfolio)

## 🎮 Interactive Demos Now Live!

**Three fully functional eLearning demos are embedded and ready to use:**

### 1. 🏆 Interactive Compliance Training
- **Live Demo**: [Launch Demo](projects/compliance/index.html)
- **Features**: Branching scenarios, character animations, scored quiz, SCORM tracking
- **Tools Simulated**: Articulate Storyline 360, Vyond animations
- **Download**: [SCORM Package](projects/scorm-packages/compliance-training-scorm.zip)

### 2. 📱 Mobile Microlearning Series  
- **Live Demo**: [Launch Demo](projects/microlearning/index.html)
- **Features**: 3 responsive lessons, xAPI tracking, interactive elements
- **Tools Simulated**: Rise 360, mobile-first design
- **Download**: [SCORM Package](projects/scorm-packages/microlearning-series-scorm.zip)

### 3. 🎮 Gamified Safety Assessment
- **Live Demo**: [Launch Demo](projects/gamified-quiz/index.html)  
- **Features**: Quiz game, leaderboards, badges, powerups, timer
- **Tools Simulated**: H5P, custom JavaScript interactions
- **Download**: [SCORM Package](projects/scorm-packages/safety-quiz-scorm.zip)

**🧪 Test in SCORM Cloud**: [Upload any package here](https://cloud.scorm.com/sc/guest/Preview)

---

## 🚀 3-Step Setup Guide

### Step 1: Fork & Clone
```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/eLearning-Portfolio.git
cd eLearning-Portfolio
```

### Step 2: Customize Your Information
Edit `/assets/js/config.js`:
```javascript
const user = {
  name: "Your Name",
  title: "Your Title", 
  email: "your.email@example.com",
  // ... customize all fields
};
```

### Step 3: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Select **Source**: Deploy from a branch
3. Choose **Branch**: main
4. Save and wait 2-3 minutes

✅ **Done!** Your portfolio is live at: `https://your-username.github.io/eLearning-Portfolio`

---

## 📁 Repository Structure

```
eLearning-Portfolio/
├── index.html              # Main portfolio page
├── projects/               # 🎮 LIVE INTERACTIVE DEMOS
│   ├── compliance/         # Storyline-style training
│   ├── microlearning/      # Rise 360-style series  
│   ├── gamified-quiz/      # H5P-style game
│   └── scorm-packages/     # Downloadable SCORM files
├── assets/
│   ├── css/styles.css      # Custom styling
│   ├── js/config.js        # User configuration
│   └── js/main.js         # Interactive functionality
├── .github/workflows/      
│   └── deploy.yml         # Auto-deployment
└── README.md              # This file
```

---

## 🎨 Customization Options

### 1. Personal Information
Update your details in `assets/js/config.js`:
- Name, title, contact information
- Social media links
- Demo URLs

### 2. Color Theme
Modify CSS variables in `assets/css/styles.css`:
```css
:root {
  --primary: #2563eb;    /* Main brand color */
  --secondary: #1e293b;  /* Secondary color */
  --accent: #f97316;     /* Accent highlights */
}
```

### 3. Demo Integration
The demos are **already fully functional**! You can:
- Customize content in each demo's files
- Replace with your own Storyline 360 HTML5 exports
- Add your own Rise 360 published content  
- Integrate your H5P interactive modules
- Create custom eLearning content using the provided templates

---

## 🛠️ Features Included

### ✨ Fully Functional Interactive Demos
- **🏆 Compliance Training**: Complete branching scenario with character animations, decision points, and scored assessment
- **📱 Microlearning Series**: 3-lesson mobile-responsive course with interactive elements and progress tracking  
- **🎮 Safety Quiz Game**: Gamified assessment with timer, powerups, leaderboards, and achievement system
- **📦 SCORM Packages**: Ready-to-upload packages for any LMS platform
- **🔧 xAPI Tracking**: Advanced learning analytics and progress monitoring

### 📊 LMS Administration Proof
- **Performance metrics** with animated progress bars
- **Screenshot galleries** (placeholder containers ready for your images)
- **Admin dashboard highlights** showing optimization results

### 🎯 Professional Presentation
- **Skills matrix** with visual proficiency indicators
- **Certification display** with icon badges
- **Project statistics** counter animations
- **Contact form** with success notifications

### ⚡ Auto-Deployment
- **GitHub Actions workflow** deploys changes automatically
- **No manual build steps** required
- **Live updates** within minutes of pushing changes

---

## 📱 Technical Specifications

- **Framework**: Vanilla HTML/CSS/JavaScript (no dependencies)
- **Demos**: Fully functional with SCORM 1.2/2004 and xAPI support
- **Styling**: Tailwind CSS via CDN
- **Icons**: Lucide React icon library
- **Deployment**: GitHub Pages with Actions
- **Performance**: Optimized for fast loading (demos work offline)
- **SEO**: Meta tags and semantic HTML structure
- **Tracking**: Complete learning analytics and progress monitoring

---

## 🔧 Advanced Customization

### Customizing Existing Demos
1. **Compliance Training**: Edit questions in `projects/compliance/quiz.js`
2. **Microlearning**: Modify lessons in `projects/microlearning/main.js`  
3. **Safety Quiz**: Update game data in `projects/gamified-quiz/game-data.js`
4. **SCORM Settings**: Adjust tracking in each demo's SCORM wrapper files

### Adding Your Own Demos
1. Create new folder in `/projects/your-demo-name/`
2. Use existing demos as templates for SCORM compliance
3. Update iframe sources in `index.html`
4. Add download links for SCORM packages
### LMS Screenshots
1. Add your actual admin screenshots to `/assets/images/`
2. Update image paths in the HTML
3. Ensure images are optimized for web (< 500KB each)

### Custom Branding
1. Replace color variables in CSS
2. Add your logo/brand assets
3. Modify typography in Tailwind classes
4. Update meta tags in HTML head

---

## 🎯 Portfolio Sections

### 🏆 Live Interactive Demos  
**Three production-ready eLearning modules** that visitors can actually use:
- Complete user interactions and feedback
- Real scoring and progress tracking  
- SCORM-compliant for LMS integration
- Professional animations and game mechanics

### 📈 LMS Administration
Prove your technical expertise with real performance metrics and optimizations

### 🛠️ Skills Matrix  
Visual representation of your proficiency across tools and technologies

### 📞 Professional Contact
Clean, functional contact form with automated response handling

---

## 🚀 Deployment Status

[![Deploy to GitHub Pages](https://github.com/your-username/eLearning-Portfolio/workflows/Deploy%20eLearning%20Portfolio%20to%20GitHub%20Pages/badge.svg)](https://github.com/your-username/eLearning-Portfolio/actions)

**Auto-deployment enabled** - Changes pushed to main branch automatically deploy to GitHub Pages within 2-3 minutes.

---

## 💡 Tips for Success

1. **Demos are ready**: Three fully functional demos are already embedded and working
2. **Optimize images**: Compress screenshots and assets for fast loading  
3. **Test SCORM packages**: Upload to SCORM Cloud or your LMS to verify tracking
4. **Customize content**: Update questions, scenarios, and branding to match your style
5. **Mobile-first**: Ensure great experience on all device sizes
6. **Analytics ready**: All demos include xAPI statements for learning analytics

---

## 📄 License

MIT License - Feel free to customize and use for your own portfolio.

**Demo Content**: The interactive demos are original creations and can be used as templates for your own eLearning projects.
---

## 🤝 Support

**Questions?** Open an issue or reach out:
- 📧 Email: your.email@example.com
- 💼 LinkedIn: [your-profile](https://linkedin.com/in/your-profile)
- 🐙 GitHub: [@your-username](https://github.com/your-username)

---

*Built with ❤️ for eLearning professionals*