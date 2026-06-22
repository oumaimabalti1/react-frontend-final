# EasyRH Frontend — React Dashboard

The user-facing interface for EasyRH HR management platform. Multi-tenant React dashboard for managing jobs, employees, CVs, and accessing AI-powered HR tools.

**Part of:** [EasyRH Full Project](https://github.com/oumaimabalti1/react-frontend-final) | **Other repos:** [Backend](https://github.com/oumaimabalti1/backendtest) | [Chatbot](https://github.com/oumaimabalti1/chatbotrag)

---

## ✨ Features

- 📊 **Multi-tenant HR Dashboard** — manage employees, jobs, and candidates per company
- 📤 **CV Upload & AI Scoring** — upload PDFs, get instant AI-driven match scores
- 📝 **AI Job Description Generator** — automatically create professional job postings
- 💼 **Employee Management** — create, update, view, delete employee records
- 🔐 **Secure Authentication** — JWT-based login with token refresh
- 📱 **Responsive Design** — works on desktop, tablet, mobile
- ⚡ **Real-time Updates** — instant feedback from AI services

---

## 🛠️ Tech Stack

- **React.js** (ES6+, functional components with hooks)
- **Axios** — HTTP client for API communication
- **CSS3** — responsive styling, flexbox/grid layouts
- **JWT** — token-based authentication
- **Deployed on Netlify**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running on `http://localhost:5000`
- Chatbot service running on `http://localhost:5001`

### Installation

```bash
git clone https://github.com/oumaimabalti1/react-frontend-final.git
cd react-frontend-final
npm install
```

### Configuration

Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:5001
```

### Running

```bash
npm start
```

The app opens at `http://localhost:3000`

---


---

## 🔌 API Integration

### Authentication
```javascript
// Login
POST /api/auth/login
{ email, password }

// Register
POST /api/auth/register
{ email, password, company }

// Refresh token
POST /api/auth/refresh-token
```

### Jobs
```javascript
GET /api/jobs
POST /api/jobs
{ title, description, company }

PUT /api/jobs/:id
DELETE /api/jobs/:id
```

### Employees
```javascript
GET /api/employees
POST /api/employees
{ name, email, position, company }

PUT /api/employees/:id
DELETE /api/employees/:id
```

### CV & AI Features
```javascript
POST /api/upload-cv
{ file: File, jobId: string }

// Returns: { score, feedback, suggestions }
```

---

## 🎨 Component Overview

| Component | Purpose |
|-----------|---------|
| `Dashboard` | Main hub — shows all HR data |
| `JobPosting` | Create/edit/delete job listings |
| `CVUpload` | Upload PDFs, view AI scores |
| `EmployeeList` | Manage employee records |
| `Chatbot` | Query AI assistant |
| `Login/Register` | Authentication |

---

## 🔐 Authentication Flow

1. User enters email/password on Login page
2. Frontend posts to `/api/auth/login`
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include token in headers:
   ```
   Authorization: Bearer {token}
   ```
6. Backend validates token; if expired, request new one via refresh endpoint

---

## 🎯 Key Features in Detail

### CV Upload & Scoring
1. User selects PDF file
2. Frontend sends to backend with job ID
3. Backend extracts PDF text (pdf-parse)
4. Chatbot service scores CV vs. job description
5. Score + feedback displayed to user

### AI Job Generator
1. User fills form: job title, company context
2. Frontend requests Chatbot API
3. Hugging Face generates description
4. Result shown in modal/form

### Chatbot Interface
1. User types HR question
2. Frontend sends to Chatbot API
3. Chatbot retrieves relevant documents (RAG)
4. LLM generates response
5. Chat history maintained in UI

---

## 🚀 Deployment

### Deploy to Netlify

**Option 1: Direct from GitHub**
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically on push

**Option 2: Build & Deploy Manually**
```bash
npm run build
# Upload 'build' folder to Netlify
```

**Environment Variables on Netlify:**
```
REACT_APP_API_URL=https://your-backend.render.com
REACT_APP_CHATBOT_URL=https://your-chatbot.render.com
```

---

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Build for production
npm run build

# Check for build errors
npm run build -- --profile
```

---

## 📊 Performance Tips

- Use React DevTools to check for unnecessary re-renders
- Lazy load components with `React.lazy()` for large dashboards
- Memoize expensive computations with `useMemo`
- Use pagination for large employee/job lists
- Cache API responses locally to reduce server calls

---

## 🐛 Troubleshooting

**Issue: CORS errors**
- Ensure backend is running
- Check that `REACT_APP_API_URL` matches backend URL
- Backend must have CORS enabled for frontend origin

**Issue: Login fails**
- Check network tab in DevTools
- Verify backend is responding to `/api/auth/login`
- Confirm email/password are correct

**Issue: CV upload doesn't work**
- Check file size (must be < 5MB)
- Ensure backend Multer is configured
- Check browser console for errors

---

## 🔗 Related Repositories

- **Backend API:** https://github.com/oumaimabalti1/backendtest
- **Chatbot Service:** https://github.com/oumaimabalti1/chatbotrag


---

## 👤 Author

**Oumaima Balti** — Full-Stack Developer  
📧 baltioumaima1@gmail.com | 🐙 github.com/oumaimabalti1

---

## 📝 License

MIT License
