# train_diabetes.py
import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

os.makedirs("../datasets", exist_ok=True)
os.makedirs("../ml_models", exist_ok=True)

rows = []
np.random.seed(11)
for _ in range(1000):
    preg = np.random.poisson(1)
    age = np.random.randint(18,85)
    bmi = max(15, np.random.normal(28,6))
    glucose = int(max(40, np.random.normal(120,30)))
    bp = int(max(40, np.random.normal(75,12)))
    insulin = int(max(10, np.random.normal(100,60)))
    dpf = round(np.random.random(), 2)

    # heuristic risk scoring
    risk = 0
    if glucose > 140: risk += 1
    if bmi > 30: risk += 1
    if age > 50: risk += 1
    if preg > 3: risk += 1
    label = 1 if risk >= 2 else 0

    rows.append({
        "Pregnancies": preg,
        "Glucose": glucose,
        "BloodPressure": bp,
        "SkinThickness": int(max(7, np.random.normal(20,8))),
        "Insulin": insulin,
        "BMI": round(bmi,1),
        "DiabetesPedigreeFunction": dpf,
        "Age": age,
        "Outcome": label
    })

df = pd.DataFrame(rows)
df.to_csv("../datasets/diabetes.csv", index=False)
print("Saved diabetes dataset (1000 rows).")

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)

print("Diabetes model performance:")
print(classification_report(y_test, pred))

joblib.dump(model, "../ml_models/diabetes_model.pkl")
print("Saved ../ml_models/diabetes_model.pkl")
