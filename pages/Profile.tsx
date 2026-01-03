import React, { useState } from "react";
import axios from "axios";

interface ProfileProps {
  onComplete: () => void;
}

export default function Profile({ onComplete }: ProfileProps) {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    if (!name || !email || !age || !gender) {
      setMsg("Please fill all fields.");
      return;
    }

    await axios.post("http://127.0.0.1:8000/auth/update-profile", {
      email,
      name,
      age: Number(age),
      gender,
    });

    localStorage.setItem("first_login", "0");

    onComplete();
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px]">

        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>

        <div className="space-y-4">
          <input className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />

          <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {msg && <p className="text-red-500 mt-4">{msg}</p>}

        <button
          onClick={handleSave}
          className="mt-6 bg-teal-600 text-white w-full py-3 rounded-lg hover:bg-teal-700"
        >
          Save & Continue
        </button>

      </div>
    </div>
  );
}
