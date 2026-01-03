from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import prediction
from auth import user_auth
from routers import tools
from routers.lab_report import router as lab_report_router 

app = FastAPI(
    title="MediPredict Backend",
    version="1.0"
)

# ---------------------------
# ✅ ENABLE CORS (VERY IMPORTANT)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # allow all frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_auth.router)
app.include_router(prediction.router)
app.include_router(tools.router, prefix="/tools", tags=["Tools"])
app.include_router(lab_report_router) 


@app.get("/")
def home():
    return {"message": "MediPredict Backend is running!"}
