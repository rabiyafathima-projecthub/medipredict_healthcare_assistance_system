from fastapi import APIRouter, UploadFile, File, HTTPException
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import io
import os

router = APIRouter()

# Folder to save uploaded reports
UPLOAD_DIR = "uploaded_reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_text_from_image(image_bytes):
    """Extract text from image (JPG/PNG/PDF page image)."""
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text


def extract_text_from_pdf(pdf_path):
    """Convert PDF pages → images → extract text."""
    pages = convert_from_path(pdf_path)
    full_text = ""

    for page in pages:
        img_bytes = io.BytesIO()
        page.save(img_bytes, format="PNG")
        text = pytesseract.image_to_string(page)
        full_text += text + "\n"

    return full_text


@router.post("/upload/report")
async def upload_medical_report(file: UploadFile = File(...)):
    """
    Upload medical PDFs or images and extract text.
    """

    # Validate file type
    if not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Only PDF or image files allowed")

    # Save file temporarily
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text
    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)
    else:
        with open(file_path, "rb") as f:
            img_bytes = f.read()
        extracted_text = extract_text_from_image(img_bytes)

    return {
        "filename": file.filename,
        "extracted_text": extracted_text[:2000]  # prevent extremely long output
    }
