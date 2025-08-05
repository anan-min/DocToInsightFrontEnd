# DocToInsight Frontend

A modern Angular application for AI-powered document analysis. Upload documents and get intelligent insights through automated analysis.

![Angular](https://img.shields.io/badge/Angular-19.2-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-teal?style=flat-square&logo=tailwindcss)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19.1-blue?style=flat-square)

## 🚀 Quick Start - How to Run the Project

### 📋 Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Backend API running on `http://localhost:4444`

### 🏃‍♂️ **Manual Setup (Recommended for Development)**

1. **Clone the repository**
   ```bash
   git clone https://github.com/anan-min/DocToInsightFrontEnd.git
   cd DocToInsightFrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   - Navigate to `http://localhost:4200/`
   - The application will automatically reload when you change source files

### 🐳 **Docker Setup (Alternative)**

If you prefer using Docker:

1. **Clone the repository**
   ```bash
   git clone https://github.com/anan-min/DocToInsightFrontEnd.git
   cd DocToInsightFrontEnd
   ```

2. **Build and run with Docker**
   ```bash
   # Build the Docker image
   docker build -t doc-to-insight-frontend .
   
   # Run the container
   docker run -p 4200:4200 doc-to-insight-frontend
   ```

3. **Or use Docker Compose** (if available)
   ```bash
   # Start the application
   docker-compose up --build
   
   # Stop the application
   docker-compose down
   ```

4. **Access the application**
   - Navigate to `http://localhost:4200/`

> **Note**: Make sure your backend API is running on `http://localhost:4444` before starting the frontend.

## 🚀 Features

- **Single File Upload**: Upload one document at a time (up to 100MB)
- **Real-time Analysis**: Monitor upload progress and analysis status
- **Multiple File Types**: Supports all document formats (.pdf, .docx, .txt, etc.)
- **Interactive Results**: View analysis results with expandable sections and checkboxes
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Live updates during document processing
- **Cancel Support**: Ability to cancel ongoing analysis

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 19.2
- **UI Library**: PrimeNG 19.1 with Aura theme
- **Styling**: TailwindCSS 4.1
- **Icons**: PrimeIcons 7.0
- **HTTP Client**: Angular HttpClient
- **State Management**: Component-based state

## 📋 Detailed Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`) - Optional but recommended
- Backend API running on `http://localhost:4444`

## 🏗️ Additional Setup (Optional)

If you need to install PrimeNG and dependencies manually:
```bash
npm install primeng@^19.0.0 @primeuix/themes primeicons
```

## 🚀 Development Details

### Backend API Configuration

The frontend expects a backend API running on `http://localhost:4444`. Update the `DOC_API` variable in `app.component.ts` if your backend runs on a different port:

```typescript
DOC_API = 'http://localhost:4444'  // Change this if needed
```

### Development Commands
- `npm start` or `ng serve` - Start development server
- `ng build` - Build for development
- `ng build --configuration=production` - Build for production
- `ng test` - Run unit tests

## 📁 Project Structure

```
src/
├── app/
│   ├── app.component.ts         # Main component with upload logic
│   ├── app.component.html       # Main template
│   ├── app.component.css        # Component styles
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Routing configuration
├── styles.css                  # Global styles
└── index.html                  # Main HTML file
```

## 🔧 Key Components

### File Upload
- Uses PrimeNG FileUpload component
- Single file selection with 100MB limit
- Drag & drop support
- Real-time upload progress

### Analysis Engine
- HTTP-based communication with backend
- Status polling for long-running analysis
- Progress tracking and cancellation support

### Results Display
- Accordion-style results presentation
- Interactive checkboxes for requirements
- Processing time display

## 🌐 API Integration

The frontend communicates with a backend API through these endpoints:

- `POST /main` - Upload file and start analysis
- `GET /status/{task_id}` - Check analysis status
- `POST /stop/{task_id}` - Cancel ongoing analysis

### API Response Format

```typescript
// Upload Response
{
  task_id: string,
  status: 'success' | 'error',
  message?: string
}

// Status Response
{
  status: 'processing' | 'completed' | 'failed' | 'cancelled',
  message: string,
  result?: Array<{
    requirement: string,
    testchecklist: string[]
  }>,
  processing_time?: number
}
```

## 🎨 Styling

The project uses:
- **TailwindCSS** for utility-first styling
- **PrimeNG Aura Theme** for component styling
- **PrimeIcons** for iconography
- **Responsive design** with mobile-first approach

## 🔧 Configuration

### Environment Variables
Update `DOC_API` in `app.component.ts` for different environments:

```typescript
// Development
DOC_API = 'http://localhost:4444'

// Production
DOC_API = 'https://your-api-domain.com'
```

### File Size Limits
Modify in `app.component.html`:
```html
<p-fileupload maxFileSize="104857600">  <!-- 100MB in bytes -->
```

## 🏗️ Build

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration=production
```

Build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## 📱 Responsive Features

- **Mobile-first design** with responsive breakpoints
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** file upload interface
- **Collapsible sections** for better mobile navigation

## 🔍 Troubleshooting

### Common Issues

1. **PrimeIcons not showing**
   - Ensure `primeicons.css` is imported in `styles.css`
   - Check for CSS import errors in browser console

2. **File upload fails**
   - Verify backend API is running on correct port
   - Check file size doesn't exceed 100MB limit
   - Ensure proper CORS configuration on backend

3. **Analysis stuck in processing**
   - Check backend logs for errors
   - Verify task_id is properly generated
   - Use browser dev tools to monitor API calls

## 📚 Documentation

- [Angular Documentation](https://angular.dev)
- [PrimeNG Documentation](https://primeng.org)
- [TailwindCSS Documentation](https://tailwindcss.com)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **anan-min** - *Initial work* - [GitHub Profile](https://github.com/anan-min)

## 🙏 Acknowledgments

- Angular team for the robust framework
- PrimeNG team for the comprehensive UI components
- TailwindCSS team for the utility-first CSS framework
