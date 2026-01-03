# train_heart.py
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
np.random.seed(22)
for _ in range(1000):
    age = np.random.randint(29,77)
    sex = np.random.choice([0,1])
    cp = np.random.randint(0,4)
    trestbps = int(np.random.normal(130,20))
    chol = int(np.random.normal(240,50))
    fbs = np.random.choice([0,1], p=[0.85,0.15])
    restecg = np.random.randint(0,2)
    thalach = int(np.random.normal(140,25))
    exang = np.random.choice([0,1], p=[0.8,0.2])
    oldpeak = round(abs(np.random.normal(1.0,1.0)),1)
    slope = np.random.randint(0,3)
    ca = np.random.randint(0,4)
    thal = np.random.choice([3,6,7])

    # simple risk heuristic
    risk = 0
    if age > 55: risk += 1
    if trestbps > 140: risk += 1
    if chol > 240: risk += 1
    if thalach < 120: risk += 1
    if exang == 1: risk += 1
    label = 1 if risk >= 2 else 0

    rows.append({
        "age": age, "sex": sex, "cp": cp, "trestbps": trestbps, "chol": chol,
        "fbs": fbs, "restecg": restecg, "thalach": thalach, "exang": exang,
        "oldpeak": oldpeak, "slope": slope, "ca": ca, "thal": thal, "target": label
    })

df = pd.DataFrame(rows)
df.to_csv("../datasets/heart.csv", index=False)
print("Saved heart dataset (1000 rows).")

X = df.drop("target", axis=1)
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)

print("Heart model performance:")
print(classification_report(y_test, pred))

joblib.dump(model, "../ml_models/heart_model.pkl")
print("Saved ../ml_models/heart_model.pkl")
