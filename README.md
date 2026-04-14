# 🌐 Full-Stack AI Dashboard

An interactive web dashboard built with HTML, CSS, and JavaScript, integrated with AI capabilities for intelligent data visualization and automation monitoring.

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 📊 **Real-time Monitoring** - Live dashboard updates and statistics
- 🤖 **AI Integration** - AI-powered insights and recommendations
- 🖱️ **Drag & Drop** - Intuitive file upload and management
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Optimized for speed and efficiency
- 🔄 **Auto-refresh** - Automatic data updates
- 🎯 **Interactive Charts** - Dynamic data visualization

## 🚀 Live Demo

**[View Live Demo](https://your-demo-link.com)** (Update with actual link)

## 📸 Screenshots

_Add screenshots of your dashboard here_

![Dashboard Screenshot](screenshots/dashboard.png)

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Flexbox, Grid, animations, and responsive design
- **JavaScript (ES6+)** - Modern JavaScript with async/await
- **Chart.js** - Beautiful data visualizations
- **Font Awesome** - Professional icons

### Backend
- **Python Flask** - Lightweight web framework
- **SQLite** - Lightweight database
- **REST API** - Clean API architecture

### AI Integration
- **Multi-AI Support** - OpenAI, Local LLMs
- **Smart Analysis** - AI-powered data insights
- **Automated Reporting** - Intelligent report generation

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Modern web browser (Chrome, Firefox, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/codebytaki/fullstack-ai-dashboard.git
cd fullstack-ai-dashboard

# Install Python dependencies
pip install -r requirements.txt

# Start the application
python run_dashboard.py
```

### Usage

1. Open your browser and navigate to `http://localhost:5001`
2. Explore the dashboard features
3. Upload files using drag-and-drop
4. View AI-powered insights and recommendations

## 📁 Project Structure

```
fullstack-ai-dashboard/
├── src/
│   ├── dashboard/          # Dashboard application
│   │   ├── templates/      # HTML templates
│   │   ├── static/         # CSS and JS files
│   │   └── app.py          # Flask backend
│   ├── ai_engine/          # AI integration
│   └── database/           # Database management
├── config/                 # Configuration files
└── README.md
```

## 🎨 Customization

### Changing Themes

Edit `static/css/styles.css` to customize colors and themes.

### Adding New Widgets

1. Create new HTML template in `templates/`
2. Add corresponding route in `app.py`
3. Update navigation menu

### AI Provider Configuration

Edit `config/.env` to configure your AI provider:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
```

## 🧪 Testing

```bash
# Run tests
pytest tests/

# Check code quality
flake8 src/
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Get dashboard statistics |
| `/api/problems` | GET | Retrieve problem list |
| `/api/solve` | POST | AI-powered problem solving |
| `/api/upload` | POST | File upload endpoint |
| `/api/push` | POST | Push to GitHub |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Flask community for the amazing framework
- Chart.js for beautiful visualizations
- OpenAI for AI capabilities
- The open-source community

## 📫 Contact

Taki - [@codebytaki](https://github.com/codebytaki)

Project Link: [https://github.com/codebytaki/fullstack-ai-dashboard](https://github.com/codebytaki/fullstack-ai-dashboard)

---

<div align="center">

**Built with ❤️ using HTML, CSS, JavaScript & Python**

⭐ Star this repo if you find it helpful!

</div>
