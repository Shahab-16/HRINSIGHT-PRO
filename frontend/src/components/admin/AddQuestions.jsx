import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AddQuestions = () => {
  const [file, setFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [uploading, setUploading] = useState(false);

  const BackendURL=import.meta.env.VITE_BACKEND_URL

  // File change handler
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    parseExcel(uploadedFile);
  };

  // Parse Excel according to your structure
  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const formatted = jsonData.map((row, index) => ({
        id: index + 1,
        area: row["Category"]?.trim() || "General",
        question: row["Diagnostic Question"]?.trim() || "",
        options: [
          row["Leading"]?.trim(),
          row["Established"]?.trim(),
          row["Emerging"]?.trim(),
          row["Absent"]?.trim(),
        ].filter((opt) => opt && opt.length > 0),
      }));

      const filtered = formatted.filter((q) => q.question && q.options.length > 0);
      setParsedQuestions(filtered);
      console.log("✅ Parsed Questions:", filtered);
    };
    reader.readAsArrayBuffer(file);
  };

  // Upload to backend
  const handleUpload = async () => {
    if (parsedQuestions.length === 0) {
      toast.error("No valid questions found to upload!");
      return;
    }
    setUploading(true);
    try {
      await axios.post(`${BackendURL}/api/admin/questions/upload`, { questions: parsedQuestions });
      toast.success("Questions uploaded successfully!");
      setFile(null);
      setParsedQuestions([]);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload questions");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add Questions from Excel
      </h2>

      {/* Upload Box */}
      <div className="bg-white border rounded-xl shadow p-8 flex flex-col items-center justify-center">
        <FileSpreadsheet size={64} className="text-indigo-500 mb-4" />
        <p className="text-gray-700 mb-4 text-center">
          Upload your Excel file with columns: <br />
          <strong>
            Theme, Category, S.No, Diagnostic Question, Leading, Established, Emerging, Absent
          </strong>
        </p>
        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md flex items-center gap-2">
          <Upload size={18} />
          Choose File
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            hidden
          />
        </label>

        {file && (
          <p className="mt-3 text-sm text-gray-600">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
      </div>

      {/* Preview Table */}
      {parsedQuestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Preview ({parsedQuestions.length} questions)
          </h3>

          <div className="overflow-x-auto border rounded-lg shadow bg-white">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Question</th>
                  <th className="p-3 border-b">Options</th>
                </tr>
              </thead>
              <tbody>
                {parsedQuestions.slice(0, 10).map((q) => (
                  <tr key={q.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{q.id}</td>
                    <td className="p-3">{q.area}</td>
                    <td className="p-3">{q.question}</td>
                    <td className="p-3">
                      <ul className="list-disc ml-5">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Questions"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
