import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
import joblib

# -----------------------------
# FINAL FEVER-FOCUSED SYMPTOMS (26)
# -----------------------------
symptoms = [
    "fever","chills","fatigue","weakness","body_ache","joint_pain","headache",
    "loss_of_appetite","night_sweats","dizziness",
    "nausea","vomiting","abdominal_pain","diarrhea",
    "rash","bleeding_gums",
    "yellow_eyes","itching",
    "cough","shortness_of_breath","chest_pain",
    "high_bp_signs","low_bp_signs",
    "dry_mouth"
]

# -----------------------------
# FEVER + BP–RELATED DISEASE LIST
# -----------------------------
diseases = [
    "Dengue", "Malaria", "Typhoid", "Hepatitis", "Viral Fever", "Flu",
    "COVID", "Pneumonia", "Chikungunya", "Leptospirosis", "Scrub Typhus",
    "High Blood Pressure", "Low Blood Pressure",
    "Other Febrile Illness"
]

# -----------------------------
# DISEASE-SYMPTOM PROBABILITY MAPPING
# -----------------------------
patterns = {
    "Dengue": ["fever","chills","joint_pain","body_ache","rash","headache","bleeding_gums","weakness"],
    "Malaria": ["fever","chills","headache","joint_pain","weakness","itching","body_ache"],
    "Typhoid": ["fever","abdominal_pain","nausea","weakness","loss_of_appetite","headache"],
    "Hepatitis": ["fever","yellow_eyes","itching","nausea","loss_of_appetite","weakness"],
    "Viral Fever": ["fever","fatigue","headache","body_ache","chills"],
    "Flu": ["fever","cough","fatigue","body_ache","headache"],
    "COVID": ["fever","cough","shortness_of_breath","loss_of_appetite","fatigue","headache"],
    "Pneumonia": ["fever","cough","shortness_of_breath","chest_pain"],
    "Chikungunya": ["fever","joint_pain","body_ache","rash","headache"],
    "Leptospirosis": ["fever","chills","abdominal_pain","itching"],
    "Scrub Typhus": ["fever","rash","headache","abdominal_pain"],
    
    # NEW BP CONDITIONS
    "High Blood Pressure": ["high_bp_signs","headache","chest_pain","dizziness"],
    "Low Blood Pressure": ["low_bp_signs","weakness","dizziness","dry_mouth"],

    "Other Febrile Illness": ["fever","fatigue","headache"]
}

# -----------------------------
# GENERATE SYNTHETIC DATASET
# -----------------------------
rows = []
np.random.seed(42)

for _ in range(5000):
    disease = np.random.choice(diseases)
    row = {"diagnosis": disease}

    for s in symptoms:
        p = 0.80 if s in patterns.get(disease, []) else 0.10
        row[s] = int(np.random.rand() < p)

    rows.append(row)

df = pd.DataFrame(rows)

os.makedirs("datasets", exist_ok=True)
df.to_csv("datasets/symptoms.csv", index=False)

# -----------------------------
# TRAIN MODEL
# -----------------------------
le = LabelEncoder()
df["label"] = le.fit_transform(df["diagnosis"])

X = df[symptoms]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, stratify=y, random_state=42)

model = RandomForestClassifier(n_estimators=350, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le.classes_))

os.makedirs("ml_models", exist_ok=True)
joblib.dump(model, "ml_models/symptom_model.pkl")
joblib.dump(le, "ml_models/symptom_label_encoder.pkl")

print("🔥 Training completed and model saved!")
