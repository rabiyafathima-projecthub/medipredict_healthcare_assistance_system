from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database import get_db
from auth.utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ------------------ MODELS ----------------------

class SignupModel(BaseModel):
    email: EmailStr
    password: str
    name: str
    age: int
    gender: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordModel(BaseModel):
    email: EmailStr

class ResetPasswordModel(BaseModel):
    token: str
    new_password: str

class UpdateProfileModel(BaseModel):
    email: EmailStr
    name: str
    age: int
    gender: str


# ------------------ SIGNUP ----------------------

@router.post("/signup")
def signup(user: SignupModel):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    cursor.execute("""
        INSERT INTO users (email, password, name, age, gender, first_login)
        VALUES (?, ?, ?, ?, ?, 1)
    """, (user.email, hashed, user.name, user.age, user.gender))

    conn.commit()
    conn.close()

    return {"message": "Signup successful!", "first_login": 1}


# ------------------ LOGIN ----------------------

@router.post("/login")
def login(data: LoginModel):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (data.email,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"email": user["email"]})

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "name": user["name"],
        "first_login": user["first_login"]
    }


# ------------------ RESET PASSWORD (Optional) ----------------------

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordModel):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (data.email,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = create_access_token({"email": data.email})

    cursor.execute("UPDATE users SET reset_token=? WHERE email=?", (reset_token, data.email))
    conn.commit()

    conn.close()
    return {"message": "Password reset link generated", "reset_token": reset_token}


@router.post("/reset-password")
def reset_password(data: ResetPasswordModel):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE reset_token=?", (data.token,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed = hash_password(data.new_password)
    cursor.execute("UPDATE users SET password=?, reset_token=NULL WHERE id=?", (hashed, user["id"]))
    conn.commit()
    conn.close()

    return {"message": "Password reset successful"}


# ------------------ UPDATE PROFILE (IMPORTANT) ----------------------

@router.post("/update-profile")
def update_profile(data: UpdateProfileModel):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (data.email,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute("""
        UPDATE users
        SET name=?, age=?, gender=?, first_login=0
        WHERE email=?
    """, (data.name, data.age, data.gender, data.email))

    conn.commit()
    conn.close()

    return {"message": "Profile updated", "first_login": 0}
