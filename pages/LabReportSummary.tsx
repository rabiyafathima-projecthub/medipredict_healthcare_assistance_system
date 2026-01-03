// LabReportSummary.tsx
import React, { useState } from "react";
import axios from "axios";
import { CloudUpload, FileText } from "lucide-react";

export default function LabReportSummary() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  // Upload file + get summary
  const uploadReport = async () => {
    setError("");
    setSummary("");

    if (!file) {
      setError("Please choose a file before uploading.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8000/lab/report", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      const data = res.data;

      if (data.summary) setSummary(data.summary);
      else if (data.rule_summary) setSummary(data.rule_summary.join("\n"));
      else setSummary("No summary available.");

    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Unknown error";
      setError("Error analyzing report: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // Formatting engine for professional display
  const renderFormattedSummary = (text: string) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-2 leading-relaxed">
        {lines.map((line, idx) => {
          // headings
          if (
            line.startsWith("🩺") ||
            line.startsWith("📊") ||
            line.startsWith("🔍") ||
            line.startsWith("💡")
          ) {
            return (
              <p key={idx} className="font-semibold text-blue-700 mt-4">
                {line}
              </p>
            );
          }

          // divider
          if (line.includes("━━")) {
            return <hr key={idx} className="border-gray-300 my-2" />;
          }

          // bullet points
          if (line.trim().startsWith("•")) {
            return <p key={idx} className="ml-4 text-gray-700">{line}</p>;
          }

          // high
          if (line.includes("HIGH"))
            return <p key={idx} className="text-red-600 ml-2 font-medium">⚠ {line}</p>;

          // low
          if (line.includes("LOW"))
            return <p key={idx} className="text-orange-600 ml-2 font-medium">⚠ {line}</p>;

          // normal
          if (line.includes("Normal"))
            return <p key={idx} className="text-green-700 ml-2 font-medium">✔ {line}</p>;

          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Lab Report Summary</h1>
      <p className="text-gray-500 mb-6">
        Upload a lab report (PDF or image). The system will return a medical summary.
      </p>

      {/* Upload box */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <CloudUpload className="text-blue-600" />
          <h2 className="text-lg font-semibold">Upload Lab Report</h2>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            setError("");
            setSummary("");
            const f = e.target.files?.[0] || null;
            setFile(f);
          }}
          className="w-full border rounded p-2 mb-4 cursor-pointer"
        />

        <div className="flex gap-3">
          <button
            onClick={uploadReport}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>

          <button
            onClick={() => {
              setFile(null);
              setSummary("");
              setError("");
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Summary Box */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
          <FileText size={20} /> Medical Summary
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : summary ? (
          <div className="text-gray-900 whitespace-pre-wrap">
            {renderFormattedSummary(summary)}
          </div>
        ) : (
          <p className="text-gray-500">No summary yet. Upload a report.</p>
        )}
      </div>
    </div>
  );
}
