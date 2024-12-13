import React, { useState } from "react";
import { apiClient, apiClientGetFile, apiRefresh } from "../../services/api";
import HomePageButton from "../../components/HomePageButton";
import { Layout } from "antd";
import Sider_ from "../../components/Sidebar";
export default function NewFile() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [exerciseId, setExerciseId] = useState(null);
  const [useTemplate,setUseTemplate]=useState(false);
  const [templates,setTemplates]=useState([]);

  const {Content}=Layout;

  const fetchCon=async ()=>{  
    await apiRefresh();
    if (typeof window !=='undefined'){
    const params = new URLSearchParams(location.search);
    const exer_id = params.get('exer_id');
    setExerciseId(exer_id);
    }
    const response=await apiClient({
      method:"GET",
      path:"file/?is_template=true"
    });
    setTemplates(response)
  }

  useState(()=>{fetchCon()}, []);

  // Gestion du changement de fichier
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (!fileName){ //S'il n'y a pas déjà de nom, on prend celui du fichier par défaut
      setFileName(event.target.files[0].name.replace(/\.([a-z]+)$/, '')) //Retire l'extension ".xlsx" ou ".xls"
    }
  };

  const handleTemplate=async (path)=>{
    const fichier=await apiClientGetFile({path}); //Récupère le fichier template depuis le backend et le copie
    const blob = new Blob([fichier], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const file_ex = new File(
      [blob],
      `${path.split('/').pop().replace(/\.[^/.]+$/, '')}.xlsx`, // Ajoute ou remplace l'extension en ".xlsx"
      { type: blob.type }
    );
    setFile(file_ex)
  }
  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(file);
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
      if (typeof window==!'undefined'){
      location = `/exercise?id=${exerciseId}`}
    } catch (error) {
      console.error("Erreur lors de la création du fichier :", error);
      alert(`Échec de la création du fichier.${error.request.response}`);
    }
  };

  return (
    <div>
      <title>Nouveau fichier</title>
      <HomePageButton/>
      <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}><Sider_/><Content>
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
                <input
                  type="checkbox"
                  checked={useTemplate}
                  onChange={(e) => {
                    setUseTemplate(e.target.checked);
                  }}
                />
                &nbsp;Créer à partir d'un template ?
              </label>
              <div>
              {useTemplate ? (
                <label>
                  Choisir un template&nbsp;
                  <select
                    onChange={(e) =>
                      handleTemplate(templates[e.target.value].content)
                    }
                    required
                  >
                    <option value="">Sélectionner</option>
                    {templates.map((template,index) => (
                      <option key={template.id} value={index}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : 

          (<label>
            Upload Excel File&nbsp;
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              required
            />
          </label>)} </div>

          <button type="submit" className="submit-btn">Enregistrer le fichier</button>
        </form>
      </div>

      </Content></Layout>
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