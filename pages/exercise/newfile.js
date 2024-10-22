import React, { useState } from "react";
import { apiClient } from "../../services/api";
import HomePageButton from "../../components/HomePageButton";

export default function NewFile() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [exerciseId, setExerciseId] = useState(null);

  const fetchCon=()=>
    { if (typeof window !=='undefined'){
      const params = new URLSearchParams(window.location.search);
      const exer_id = params.get('exer_id');
      setExerciseId(exer_id);
    }
  }

  useState(()=>{fetchCon()}, []);

  // Gestion du changement de fichier
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (!fileName){ //S'il n'y a pas déjà de nom, on prend celui du fichier par défaut
      setFileName(event.target.files[0].name.replace(/\.([a-z]+)$/, '')) //Retire l'extension ".xlsx" ou ".xls"
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Veuillez télécharger un fichier Excel.");
      return;
    }

    try {
      const response=await apiClient({
        method:'GET',
        path:`exercise/${exerciseId}/`
      });
      await apiClient({
        method: "POST",
        path: "file/",
        data: {
            name:fileName,
            content:file,
            exer:exerciseId,
            con:response.con
        }
      });
      alert("Fichier créé avec succès !");
      window.location = `/exercise?id=${exerciseId}`;
    } catch (error) {
      console.error("Erreur lors de la création du fichier :", error);
      alert(`Échec de la création du fichier.${error.request.response}`);
    }
  };

  return (
    <div>
      <title>Nouveau fichier</title>
      <HomePageButton/>
      <div className="file-form">
        <h2>Nouveau fichier</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom du fichier&nbsp;
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

          <button type="submit" className="submit-btn">Enregistrer le fichier</button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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
      ` }} />
    </div>
  );
}