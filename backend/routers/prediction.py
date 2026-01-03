from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd

router = APIRouter(
    prefix="/predict",
    tags=["Predictions"]
)

# ====================================================
#                 LOAD MODELS
# ====================================================

symptom_model = joblib.load("ml_models/symptom_model.pkl")
symptom_encoder = joblib.load("ml_models/symptom_label_encoder.pkl")

diabetes_model = joblib.load("ml_models/diabetes_model.pkl")
heart_model = joblib.load("ml_models/heart_model.pkl")
kidney_model = joblib.load("ml_models/kidney_model.pkl")


# ====================================================
#            DISEASE INFORMATION DATABASE
# ====================================================

DISEASE_INFO = {

    "Dengue": {
        "severity": "High",
        "description": "Dengue is a mosquito-borne viral infection causing high fever, joint pain, rash, and fatigue.",
        "prevention": [
            "Use mosquito repellent and bed nets",
            "Remove stagnant water",
            "Keep windows screened",
            "Wear long-sleeved clothing",
            "Community mosquito control"
        ],
        "tips": [
            "Drink plenty of fluids / ORS",
            "Avoid painkillers like ibuprofen or aspirin",
            "Watch for bleeding or vomiting",
            "Monitor platelet count",
            "Seek urgent care if symptoms worsen"
        ]
    },

    "Malaria": {
        "severity": "High",
        "description": "Malaria is a parasite spread by mosquitoes and causes fever cycles, chills, and weakness.",
        "prevention": [
            "Use insecticide-treated bed nets",
            "Apply mosquito repellent",
            "Avoid outdoor exposure at dusk/dawn",
            "Take prophylaxis when traveling to high-risk areas"
        ],
        "tips": [
            "Seek antimalarial treatment immediately",
            "Complete full medication course",
            "Stay hydrated",
            "Seek care if jaundice or itching develops"
        ]
    },

    "Typhoid": {
        "severity": "High",
        "description": "Typhoid fever is a bacterial infection spread through contaminated food or water.",
        "prevention": [
            "Drink clean or boiled water",
            "Maintain food hygiene",
            "Wash hands regularly",
            "Avoid raw or street foods"
        ],
        "tips": [
            "Follow antibiotic treatment completely",
            "Stay hydrated",
            "Monitor fever trends",
            "Seek care for abdominal pain or dehydration"
        ]
    },

    "Hepatitis": {
        "severity": "High",
        "description": "Hepatitis causes liver inflammation leading to jaundice, fever, nausea, and yellow eyes.",
        "prevention": [
            "Avoid alcohol consumption",
            "Do not share needles",
            "Vaccination for Hepatitis A/B when available",
            "Eat hygienic food and clean water"
        ],
        "tips": [
            "Get liver function tests",
            "Rest well and drink water",
            "Avoid fatty foods and alcohol",
            "Follow up with a doctor for monitoring"
        ]
    },

    "Viral Fever": {
        "severity": "Moderate",
        "description": "General viral fever causing weakness, headache, muscle pain, and chills.",
        "prevention": [
            "Maintain hand hygiene",
            "Avoid close contact with infected people",
            "Boost immunity with proper diet",
            "Disinfect commonly touched surfaces"
        ],
        "tips": [
            "Take paracetamol for fever",
            "Drink warm fluids",
            "Rest adequately",
            "Seek care if fever persists beyond 3 days"
        ]
    },

    "Flu": {
        "severity": "Moderate",
        "description": "A contagious respiratory viral infection with fever, cough, and body ache.",
        "prevention": [
            "Annual flu vaccination",
            "Hand hygiene",
            "Avoid crowded indoor areas",
            "Wear masks when symptomatic"
        ],
        "tips": [
            "Take antiviral medication if prescribed",
            "Rest and stay hydrated",
            "Monitor breathing difficulty",
            "Avoid cold drinks and exposure"
        ]
    },

    "COVID": {
        "severity": "High",
        "description": "COVID-19 affects the respiratory system and may cause severe breathing issues.",
        "prevention": [
            "Vaccination",
            "Wear masks",
            "Avoid crowded spaces",
            "Practice hand hygiene"
        ],
        "tips": [
            "Monitor oxygen levels",
            "Isolate if symptomatic",
            "Maintain hydration",
            "Seek medical care for breathlessness"
        ]
    },

    "Pneumonia": {
        "severity": "High",
        "description": "Pneumonia is a lung infection causing fever, cough, and breathing difficulty.",
        "prevention": [
            "Get vaccinated (pneumococcal/flu)",
            "Avoid smoking",
            "Boost immunity",
            "Maintain hygiene"
        ],
        "tips": [
            "Seek medical care immediately",
            "Monitor oxygen saturation",
            "Take prescribed antibiotics",
            "Rest and hydrate"
        ]
    },

    "Chikungunya": {
        "severity": "Moderate",
        "description": "A mosquito-borne viral disease causing severe joint pains and fever.",
        "prevention": [
            "Use mosquito repellent",
            "Keep environment clean",
            "Wear protective clothing",
            "Remove stagnant water"
        ],
        "tips": [
            "Hydrate well",
            "Take pain relief medication like paracetamol",
            "Avoid heavy physical activity",
            "Monitor joint pain"
        ]
    },

    "Leptospirosis": {
        "severity": "High",
        "description": "A bacterial disease spread through contaminated water, causing fever and muscle pain.",
        "prevention": [
            "Avoid flood/contaminated water exposure",
            "Wear protective footwear",
            "Maintain cleanliness",
            "Protect pets from infection"
        ],
        "tips": [
            "Seek medical testing immediately",
            "Start antibiotics early",
            "Hydrate adequately",
            "Monitor for jaundice or kidney issues"
        ]
    },

    "Scrub Typhus": {
        "severity": "Moderate",
        "description": "A mite-borne infection causing fever, rash, and severe headache.",
        "prevention": [
            "Avoid dense vegetation",
            "Wear long clothes outdoors",
            "Use insect repellents",
            "Keep surroundings clean"
        ],
        "tips": [
            "Seek antibiotics as prescribed",
            "Hydrate",
            "Monitor fever duration",
            "Seek immediate care if breathing difficulty appears"
        ]
    },

    "High Blood Pressure": {
        "severity": "High",
        "description": "Hypertension may cause headache, chest pressure, dizziness, and risk of stroke.",
        "prevention": [
            "Reduce salt intake",
            "Exercise regularly",
            "Avoid smoking/alcohol",
            "Maintain healthy body weight",
            "Manage stress effectively"
        ],
        "tips": [
            "Monitor BP daily",
            "Take medications regularly",
            "Seek emergency care for chest pain or confusion",
            "Stay hydrated"
        ]
    },

    "Low Blood Pressure": {
        "severity": "Moderate",
        "description": "Low BP causes dizziness, fainting, weakness, and dehydration.",
        "prevention": [
            "Increase fluid intake",
            "Increase salt only if advised",
            "Eat small frequent meals",
            "Avoid long standing"
        ],
        "tips": [
            "Sit or lie down when dizzy",
            "Avoid sudden posture changes",
            "Drink ORS or fluids",
            "Seek care if fainting occurs"
        ]
    },

    "Other Febrile Illness": {
        "severity": "Unknown",
        "description": "A general fever-related illness requiring further diagnosis.",
        "prevention": ["Hydrate", "Maintain hygiene"],
        "tips": ["Monitor symptoms", "Seek medical evaluation"]
    },

    # Structured diseases (existing)
    "Diabetes": {
    "severity": "High",
    "description": (
            "Your results indicate a high chance of diabetes, a condition where the body struggles to manage blood sugar levels effectively.",

    ),
    "prevention": [
        "Adopt a balanced diet rich in whole grains, vegetables, and lean proteins",
        "Engage in regular physical activity (at least 30 minutes a day)",
        "Maintain a healthy weight and avoid excessive sugar intake"
    ],
    "tips": [
        "Monitor blood glucose levels regularly",
        "Limit consumption of processed and high-sugar foods",
        "Stay hydrated and follow a consistent meal schedule"
    ]
},

    "Heart Disease": {
    "severity": "High",
    "description": (
        "Possible signs of heart strain detected. This may indicate reduced blood flow or increased workload on the heart. "
        "Early evaluation helps prevent serious complications."
    ),

    "tips": [
        "Consult a cardiologist promptly for ECG and echocardiogram tests.",
        "Monitor blood pressure and heart rate regularly.",
        "Stay physically active but avoid overexertion until medically cleared.",
        "Follow a heart-healthy diet rich in fruits, vegetables, and whole grains.",
        "Maintain hydration and limit caffeinated drinks.",
        "Track symptoms like chest tightness, breathlessness, or palpitations.",
        "Take prescribed medications consistently without skipping doses."
    ],

    "prevention": [
        "Reduce intake of oily, fried, and high-cholesterol foods.",
        "Quit smoking and avoid alcohol to decrease heart strain.",
        "Maintain a healthy weight with balanced diet and regular exercise.",
        "Manage stress using meditation, deep breathing, or relaxation exercises.",
        "Control diabetes, hypertension, and thyroid issues through routine checkups.",
        "Sleep 7–8 hours daily with a consistent schedule.",
        "Limit salt intake, especially if blood pressure is high."
    ]
},

    "Kidney Problem": {
    "severity": "High",
    "description": (
        "Your results indicate a possible decline in kidney function. "
        "This may be due to dehydration, high blood pressure, diabetes, medication effects, "
        "or an underlying renal condition. It is important to undergo further evaluation, "
        "including kidney function tests, urine analysis, and imaging, to determine the exact cause."
    ),
    "prevention": [
        "Increase daily water intake to support healthy kidney filtration.",
        "Reduce salt consumption to help control blood pressure and reduce kidney strain.",
        "Maintain appropriate blood pressure and blood sugar levels to prevent further kidney damage.",
        "Limit high-protein and processed foods which can increase kidney workload.",
        "Schedule regular follow-ups with a healthcare provider or nephrologist."
    ],
    "tips": [
        "Monitor kidney function regularly through serum creatinine, urea, and eGFR tests.",
        "Avoid frequent use of painkillers (NSAIDs) as they may worsen kidney function.",
        "Stay well-hydrated unless your doctor advises fluid restriction.",
        "Follow a kidney-friendly diet low in salt, processed foods, and red meat.",
        "Avoid alcohol and smoking as both can worsen kidney health."
    ]
},


    "Healthy": {
        "severity": "Low",
        "description": "Your health appears normal.",
        "prevention": ["Continue healthy lifestyle"],
        "tips": ["Stay hydrated", "Exercise regularly"]
    },
}

DEFAULT_INFO = {
    "severity": "Unknown",
    "description": "No information available.",
    "prevention": ["No data available"],
    "tips": ["No data available"]
}


# ====================================================
#            REQUEST MODELS
# ====================================================

class SymptomRequest(BaseModel):
    fever: int
    chills: int
    fatigue: int
    weakness: int
    body_ache: int
    joint_pain: int
    headache: int
    loss_of_appetite: int
    night_sweats: int
    dizziness: int

    nausea: int
    vomiting: int
    abdominal_pain: int
    diarrhea: int

    rash: int
    bleeding_gums: int

    yellow_eyes: int
    itching: int

    cough: int
    shortness_of_breath: int
    chest_pain: int

    high_bp_signs: int
    low_bp_signs: int
    dry_mouth: int



class DiabetesRequest(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int


class HeartRequest(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int


class KidneyRequest(BaseModel):
    age: int
    bp: int
    sg: float
    al: int
    su: int
    bgr: int
    bu: float
    sc: float
    hemo: float
    wbcc: int
    rbcc: float


# ====================================================
#         MAIN SYMPTOM PREDICTION
# ====================================================

@router.post("/symptoms")
def predict_symptoms(data: SymptomRequest):

    df = pd.DataFrame([data.dict()])
    pred = symptom_model.predict(df)[0]
    disease = symptom_encoder.inverse_transform([pred])[0]

    info = DISEASE_INFO.get(disease, DEFAULT_INFO)

    return {
        "disease": disease,
        "severity": info["severity"],
        "description": info["description"],
        "prevention": info["prevention"],
        "tips": info["tips"]
    }


# ====================================================
#          DIABETES (Unified Output)
# ====================================================

@router.post("/diabetes")
def predict_diabetes(data: DiabetesRequest):
    df = pd.DataFrame([data.dict()])
    pred = diabetes_model.predict(df)[0]

    disease = "Diabetes" if pred == 1 else "Healthy"
    info = DISEASE_INFO[disease]

    return {
        "disease": disease,
        "severity": info["severity"],
        "description": info["description"],
        "prevention": info["prevention"],
        "tips": info["tips"]
    }


# ====================================================
#          HEART (Unified Output)
# ====================================================

@router.post("/heart")
def predict_heart(data: HeartRequest):

    heart_input = {
        "age": data.age,
        "sex": data.sex,
        "cp": data.cp,
        "trestbps": data.trestbps,
        "chol": data.chol,
        "fbs": data.fbs,
        "restecg": data.restecg,
        "thalach": data.thalach,
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal
    }

    df = pd.DataFrame([heart_input])
    pred = heart_model.predict(df)[0]

    disease = "Heart Disease" if pred == 1 else "Healthy"
    info = DISEASE_INFO.get(disease, DEFAULT_INFO)

    return {
        "disease": disease,
        "severity": info["severity"],
        "description": info["description"],
        "prevention": info["prevention"],
        "tips": info["tips"]
    }


# ====================================================
#          KIDNEY (Unified Output)
# ====================================================

@router.post("/kidney")
def predict_kidney(data: KidneyRequest):
    df = pd.DataFrame([data.dict()])
    pred = kidney_model.predict(df)[0]

    disease = "Kidney Problem" if pred == 1 else "Healthy"
    info = DISEASE_INFO[disease]

    return {
        "disease": disease,
        "severity": info["severity"],
        "description": info["description"],
        "prevention": info["prevention"],
        "tips": info["tips"]
    }


# ====================================================
#                   TEST ROUTE
# ====================================================

@router.get("/test")
def test():
    return {"message": "Prediction router working!"}
