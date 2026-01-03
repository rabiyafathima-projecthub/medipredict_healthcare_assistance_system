**MediPredict – Healthcare Assistance System

MediPredict is a web-based healthcare prediction and assistance system designed to support early health risk identification and preventive care. The system combines symptom-based analysis, algorithm-driven disease prediction, and location-based healthcare services into a single integrated platform.

🎯 Project Objectives
Early identification of potential health risks
Algorithm-based prediction of diseases such as heart disease, diabetes, kidney disease, and fever-related illnesses
Symptom-based disease assessment with explainable results
Location-based hospital assistance using geolocation
Integration of digital healthcare support services

⚙️ Technologies Used
**Programming Languages
 Python (Backend & ML)
TypeScript / JavaScript (Frontend)
**Backend
FastAPI – RESTful API development
Uvicorn – ASGI server
**Frontend
React.js
Tailwind CSS
**Machine Learning
Scikit-learn
Pandas, NumPy
Joblib (model handling)
**Database
SQLite (user and system data)
**Location & Mapping
Browser Geolocation API
OpenStreetMap / Overpass API
**OCR & Lab Report Processing
Tesseract OCR
pdf2image
Pillow (PIL)
**Development Tools
Visual Studio Code
Git & GitHub


🧠 Algorithms Used
Logistic Regression
Decision Tree
Random Forest
Support Vector Machine (SVM)
(Algorithm selection is based on the specific disease prediction module.)

📂 System Modules
User Registration and Authentication
Symptom Checker (Fever-related illnesses)
Disease Prediction Modules (Heart, Kidney, Diabetes)
Result Interpretation and Health Guidance
Hospital Locator (Geolocation-based)
Online Doctor Consultation Integration
Medicine Ordering & Lab Test Booking
Lab Report Upload and Summary Generation

🏗️ System Architecture

MediPredict follows a client–server architecture:
Frontend handles user interaction and result visualization
Backend (FastAPI) processes requests and prediction logic
Machine Learning layer generates disease risk predictions
External services provide hospital location and healthcare support

🚀 How to Run (Basic)

Start the backend using FastAPI and Uvicorn
Run the React frontend
Access the application through a web browser

📌 Note

Trained machine learning model files (.pkl) are excluded from this repository due to GitHub file size limits.
Models can be regenerated using the provided training scripts.

## 📸 Screenshots

![Home Page](screenshots/picture1.png)
![Symptom Checker](screenshots/symptom_checker.png)
![Prediction Result](screenshots/prediction_result.png)

