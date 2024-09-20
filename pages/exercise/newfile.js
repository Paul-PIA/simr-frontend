import React, { useState } from "react";
import { apiClient } from "../../services/api";

export default function NewFile() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [exerciseId, setExerciseId] = useState(null);

  // Récupérer l'ID de l'exercice à partir de l'URL
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const exer_id = params.get('exer_id');
    setExerciseId(exer_id);
  }, []);

  // Gestion du changement de fichier
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Veuillez télécharger un fichier Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("name", fileName);
    formData.append("file", file);
    formData.append("exercise", exerciseId);

    try {
      await apiClient({
        method: "POST",
        path: "file/",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Fichier créé avec succès !");
      window.location = `/exercise?id=${exerciseId}`;
    } catch (error) {
      console.error("Erreur lors de la création du fichier :", error);
      alert("Échec de la création du fichier.");
    }
  };

  return (
    <div>
      <div className="file-form">
        <h2>New File</h2>
        <form onSubmit={handleSubmit}>
          <label>
            File Name&nbsp;
            <input
              type="text"
              name="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </label>

          <label>
            Upload Excel File&nbsp;
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              required
            />
          </label>

          <button type="submit" className="submit-btn">Create File</button>
        </form>
      </div>

      <style jsx="true">{`
        .file-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 400px;
          max-width: 90%;
          margin: 0 auto;
        }
        .file-form input[type="text"],
        .file-form input[type="file"] {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .file-form button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .file-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
