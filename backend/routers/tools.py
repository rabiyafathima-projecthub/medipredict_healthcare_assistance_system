from fastapi import APIRouter, HTTPException, UploadFile, File
import httpx
import math
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os

router = APIRouter()

# ----------------------------------------------------
# ⭐ DISTANCE CALCULATOR 
# ----------------------------------------------------
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# ----------------------------------------------------
# ⭐ BLOCK SPECIALTY HOSPITALS
# ----------------------------------------------------
BLOCKED_KEYWORDS = [
    "dental", "dentist", "tooth",
    "eye", "optical", "vision",
    "skin", "derma", "cosmetic", "aesthetic",
    "ayur", "ayurvedic", "naturopathy", "homeopathy",
    "oncology", "cancer",
    "physiotherapy", "physio",
    "orthopedic", "ortho",
    "veterinary", "animal", "vet"
]

def is_blocked(name: str):
    name_lower = name.lower()
    return any(word in name_lower for word in BLOCKED_KEYWORDS)

# ----------------------------------------------------
# ⭐ HEART SPECIALTY FILTER 
# ----------------------------------------------------
HEART_KEYWORDS = [
    "cardio", "heart", "cardiac", "cardiology", "cardiologist", "vascular"
]

def is_heart_hospital(name: str):
    name_lower = name.lower()
    return any(key in name_lower for key in HEART_KEYWORDS)

# ----------------------------------------------------
# ⭐ KIDNEY SPECIALTY FILTER
# ----------------------------------------------------
KIDNEY_KEYWORDS = [
    "nephro", "kidney", "renal", "dialysis"
]

def is_kidney_hospital(name: str):
    name_lower = name.lower()
    return any(key in name_lower for key in KIDNEY_KEYWORDS)

# ----------------------------------------------------
# ⭐ HOSPITAL SEARCH
# ----------------------------------------------------
@router.get("/hospitals")
async def find_hospitals(lat: float, lon: float, radius: int = 10000, specialty: str = None):

    query = f"""
    [out:json][timeout:30];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      way["amenity"="hospital"](around:{radius},{lat},{lon});
      relation["amenity"="hospital"](around:{radius},{lat},{lon});
    );
    out center;
    """

    OVERPASS_SERVERS = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ]

    response_data = None

    for server in OVERPASS_SERVERS:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                res = await client.post(server, data=query)
            if res.status_code == 200:
                response_data = res.json()
                break
        except:
            continue

    if response_data is None:
        raise HTTPException(status_code=500, detail="Hospital service unavailable.")

    hospitals = []

    for element in response_data.get("elements", []):
        # Coordinates
        if element.get("lat"):
            h_lat = element["lat"]
            h_lon = element["lon"]
        elif element.get("center"):
            h_lat = element["center"]["lat"]
            h_lon = element["center"]["lon"]
        else:
            continue

        name = element.get("tags", {}).get("name", "Unknown Hospital")

        # Filter dental/eye/etc.
        if is_blocked(name):
            continue

        # ⭐ HEART FILTER
        if specialty == "heart" and not is_heart_hospital(name):
            continue

        # ⭐ KIDNEY FILTER
        if specialty == "kidney" and not is_kidney_hospital(name):
            continue

        # Address
        address = (
            element.get("tags", {}).get("addr:full")
            or element.get("tags", {}).get("addr:street")
            or element.get("tags", {}).get("addr:city")
            or "No address available"
        )

        distance = calculate_distance(lat, lon, h_lat, h_lon)

        hospitals.append({
            "name": name,
            "address": address,
            "distance_km": round(distance, 2),
            "lat": h_lat,
            "lon": h_lon,
            "map_url": f"https://www.google.com/maps?q={h_lat},{h_lon}"
        })

    hospitals = sorted(hospitals, key=lambda x: x["distance_km"])

    return {
        "searched_lat": lat,
        "searched_lon": lon,
        "total_results": len(hospitals),
        "hospitals": hospitals
    }

# ----------------------------------------------------
# ⭐ OCR
# ----------------------------------------------------
@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted = ""

    try:
        if file.filename.endswith(".pdf"):
            images = convert_from_path(file_path)
            for img in images:
                extracted += pytesseract.image_to_string(img)
        else:
            img = Image.open(file_path)
            extracted = pytesseract.image_to_string(img)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    return {"text": extracted}
