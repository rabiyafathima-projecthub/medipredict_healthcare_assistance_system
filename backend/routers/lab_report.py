from fastapi import APIRouter, UploadFile, File
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import tempfile
import os
import re

router = APIRouter(prefix="/lab", tags=["Lab Report"])


# ---------------------------------------------------
# OCR HELPERS (FAST VERSION)
# ---------------------------------------------------

def extract_text_from_image(path):
    """Handles PNG, JPG, JPEG, WEBP with fast OCR."""
    try:
        img = Image.open(path).convert("RGB")

        # 🔥 SPEED BOOST: resize large images
        if img.width > 1500:
            img = img.resize((img.width // 2, img.height // 2))

        return pytesseract.image_to_string(img, config="--oem 1 --psm 6")  # FAST MODE
    except:
        return ""


def extract_text_from_pdf(path):
    text = ""
    try:
        # 🔥 SPEED BOOST: reduce DPI from 300 → 150
        pages = convert_from_path(path, 150)

        for page in pages:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                page.save(tmp.name, "PNG")
                text += extract_text_from_image(tmp.name)
                os.unlink(tmp.name)
    except:
        pass

    return text


# ---------------------------------------------------
# YOUR SAME TEST PATTERNS, NORMAL RANGES, EXTRACTION
# (NO CHANGES MADE HERE)
# ---------------------------------------------------

TEST_PATTERNS = {
    "WBC": r"(WBC|TOTAL\s*LEUKOCYTE\s*COUNT)[^\d]*(\d+[,\.]?\d*)",
    "RBC": r"(RBC|TOTAL\s*RBC\s*COUNT)[^\d]*(\d+[,\.]?\d*)",
    "Hemoglobin": r"(HEMOGLOBIN|HGB)[^\d]*(\d+[,\.]?\d*)",
    "Hematocrit": r"(HCT|HEMATOCRIT)[^\d]*(\d+[,\.]?\d*)",
    "Platelets": r"(PLATELET\s*COUNT|PLATELETS)[^\d]*(\d+[,\.]?\d*)",
    "Neutrophils": r"(NEUTROPHILS)[^\d]*(\d+[,\.]?\d*)",
    "Lymphocytes": r"(LYMPHOCYTES)[^\d]*(\d+[,\.]?\d*)",
    "Monocytes": r"(MONOCYTES)[^\d]*(\d+[,\.]?\d*)",
    "Eosinophils": r"(EOSINOPHILS)[^\d]*(\d+[,\.]?\d*)",
    "Basophils": r"(BASOPHILS)[^\d]*(\d+[,\.]?\d*)",
    "TSH": r"(TSH)[^\d]*(\d+\.?\d*)",
    "T3": r"(T3)[^\d]*(\d+\.?\d*)",
    "T4": r"(T4)[^\d]*(\d+\.?\d*)",
    "Glucose Fasting": r"(FASTING\s*BLOOD\s*SUGAR|FBS)[^\d]*(\d+\.?\d*)",
    "Glucose PP": r"(PP\s*BLOOD\s*SUGAR|PPBS)[^\d]*(\d+\.?\d*)",
    "SGPT": r"(SGPT|ALT)[^\d]*(\d+\.?\d*)",
    "SGOT": r"(SGOT|AST)[^\d]*(\d+\.?\d*)",
    "Bilirubin Total": r"(BILIRUBIN\s*TOTAL)[^\d]*(\d+\.?\d*)",
    "Creatinine": r"(CREATININE)[^\d]*(\d+\.?\d*)",
    "Urea": r"(UREA)[^\d]*(\d+\.?\d*)",
}

NORMAL_RANGES = {
    "WBC": (4000, 11000),
    "RBC": (4.2, 5.9),
    "Hemoglobin": (12, 16.5),
    "Hematocrit": (36, 50),
    "Platelets": (150000, 450000),
    "Neutrophils": (40, 80),
    "Lymphocytes": (20, 40),
    "Monocytes": (2, 10),
    "Eosinophils": (1, 6),
    "Basophils": (0, 2),
    "Glucose Fasting": (70, 100),
    "Glucose PP": (80, 140),
    "TSH": (0.4, 4.5),
    "T3": (0.8, 2.0),
    "T4": (4.5, 12.5),
    "SGPT": (7, 56),
    "SGOT": (5, 40),
    "Bilirubin Total": (0.1, 1.2),
    "Creatinine": (0.6, 1.3),
    "Urea": (10, 50),
}


def extract_values(text):
    extracted = {}
    text = text.replace(",", "")

    for test, pattern in TEST_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                extracted[test] = float(match.group(2))
            except:
                continue

    return extracted


# ---------------------------------------------------
# SAME DISEASE DETECTION / SUMMARY BUILDER
# (NO CHANGES – BECAUSE IT IS WORKING PERFECTLY)
# ---------------------------------------------------

def detect_disease(values):
    diseases = []
    hb = values.get("Hemoglobin")
    plate = values.get("Platelets")
    tsh = values.get("TSH")
    fasting = values.get("Glucose Fasting")
    sgpt = values.get("SGPT")
    creat = values.get("Creatinine")

    if hb and hb < 12: diseases.append("Anemia")
    if fasting and fasting > 126: diseases.append("Diabetes")
    if tsh and tsh > 4.5: diseases.append("Hypothyroidism")
    if tsh and tsh < 0.3: diseases.append("Hyperthyroidism")
    if plate and plate < 100000: diseases.append("Possible Dengue (Low Platelets)")
    if sgpt and sgpt > 56: diseases.append("Liver Stress / Hepatitis")
    if creat and creat > 1.3: diseases.append("Kidney Dysfunction")

    return diseases if diseases else ["No major disease detected"]


def build_disease_summary(values):
    diseases = detect_disease(values)
    primary = diseases[0]  # Most likely condition

    summary = []
    summary.append("🧠 **Clinical Summary**")
    summary.append("━━━━━━━━━━━━━━━━━━━━━━")
    summary.append(f"📌 **Most Likely Condition:** {primary}")
    summary.append("")

    # -------- KEY OBSERVATIONS --------
    summary.append("📊 **Key Findings:**")

    for test, val in values.items():
        if test not in NORMAL_RANGES:
            continue

        low, high = NORMAL_RANGES[test]

        if val < low:
            summary.append(f"• {test}: **LOW** ({val})")
        elif val > high:
            summary.append(f"• {test}: **HIGH** ({val})")
        else:
            summary.append(f"• {test}: Normal ({val})")

    summary.append("")

    # -------- RECOMMENDATIONS --------
    summary.append("📝 **Recommended Actions:**")

    if "Possible Dengue (Low Platelets)" in diseases:
        summary.append("• Drink plenty of fluids.")
        summary.append("• Monitor platelet count daily.")
        summary.append("• Seek medical care if bleeding or fever increases.")

    elif "Anemia" in diseases:
        summary.append("• Consume iron-rich foods (spinach, beetroot, jaggery).")
        summary.append("• Consider iron supplements.")
        summary.append("• Recheck hemoglobin after 4–6 weeks.")

    elif "Diabetes" in diseases:
        summary.append("• Reduce sugar and carbohydrate intake.")
        summary.append("• Exercise daily for 30 minutes.")
        summary.append("• Consult a diabetologist if fasting sugar remains high.")

    elif "Hypothyroidism" in diseases:
        summary.append("• Consult an endocrinologist.")
        summary.append("• Thyroid medication may be required.")
        summary.append("• Recheck TSH after 6–8 weeks.")

    elif "Hyperthyroidism" in diseases:
        summary.append("• Avoid caffeine & stress.")
        summary.append("• Seek medical advice for thyroid management.")
        summary.append("• Monitor heart rate if symptoms worsen.")

    elif "Liver Stress / Hepatitis" in diseases:
        summary.append("• Avoid alcohol & fatty foods.")
        summary.append("• Repeat LFT after 1–2 weeks.")
        summary.append("• Consult a gastroenterologist if levels stay high.")

    elif "Kidney Dysfunction" in diseases:
        summary.append("• Reduce high-protein foods temporarily.")
        summary.append("• Check BP & urine test.")
        summary.append("• Visit a nephrologist for renal evaluation.")

    else:
        summary.append("• No action needed. Maintain a healthy lifestyle.")

    summary.append("━━━━━━━━━━━━━━━━━━━━━━")

    return "\n".join(summary)



# ---------------------------------------------------
# MAIN ROUTE
# ---------------------------------------------------

@router.post("/report")
async def analyze_lab_report(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            path = tmp.name

        ext = file.filename.lower()
        text = extract_text_from_pdf(path) if ext.endswith(".pdf") else extract_text_from_image(path)
        os.unlink(path)

        values = extract_values(text)
        disease_summary = build_disease_summary(values)
        rule_summary = disease_summary.split("\n")

        return {
            "raw_text": text,
            "extracted_values": values,
            "rule_summary": rule_summary,
            "summary": disease_summary
        }

    except Exception as e:
        return {"error": str(e)}
