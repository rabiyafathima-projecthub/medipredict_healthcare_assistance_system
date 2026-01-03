# train_kidney.py
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
np.random.seed(33)
for _ in range(800):
    age = np.random.randint(18,85)
    bp = int(np.random.normal(80,12))
    sg = round(np.random.choice([1.005,1.010,1.015,1.020,1.025], p=[0.1,0.2,0.3,0.3,0.1]),3)
    al = np.random.randint(0,6)
    su = np.random.randint(0,3)
    bgr = int(np.random.normal(100,40))
    bu = round(np.random.normal(40,20),1)
    sc = round(np.random.normal(1.2,0.8),2)
    hemo = round(np.random.normal(12.5,2.5),1)
    wbcc = int(abs(np.random.normal(8000,3000)))
    rbcc = round(abs(np.random.normal(4.5,0.7)),1)

    risk = 0
    if bu > 50: risk += 1
    if sc > 1.5: risk += 1
    if hemo < 11: risk += 1
    if age > 60: risk += 1
    label = 1 if risk >= 2 else 0

    rows.append({
        "age": age, "bp": bp, "sg": sg, "al": al, "su": su,
        "bgr": bgr, "bu": bu, "sc": sc, "hemo": hemo, "wbcc": wbcc, "rbcc": rbcc, "target": label
    })

df = pd.DataFrame(rows)
df.to_csv("../datasets/kidney.csv", index=False)
print("Saved kidney dataset (800 rows).")

X = df.drop("target", axis=1)
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)

print("Kidney model performance:")
print(classification_report(y_test, pred))

joblib.dump(model, "../ml_models/kidney_model.pkl")
print("Saved ../ml_models/kidney_model.pkl")
