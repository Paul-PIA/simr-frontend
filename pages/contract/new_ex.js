import React, { useState, useEffect } from "react";
import { apiClient, apiRefresh } from "../../services/api";
import { Layout } from "antd";
import HomePageButton from "../../components/HomePageButton";
import Sider_ from "../../components/Sidebar";

export default function NewExercise() {
const [contractId,setContractId]=useState(null)
  const [exerciseName, setExerciseName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [mainOrganization, setMainOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [orgId,setOrgId]=useState([]);

  const {Content}=Layout;

  useEffect(() => {
    fetchContractOrganizations();
  }, []);

  // Récupérer les organisations du contrat
  const fetchContractOrganizations = async () => {
    await apiRefresh();
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const contract_Id = queryParams.get('con_id');
        setContractId(contract_Id);
      const response = await apiClient({
        method: "GET",
        path: `contract/${contract_Id}/`,
      });
      setOrgId(response.org);
      const org_names=await Promise.all(
        response.org.map(async (orga) => {
            const Orgesponse=await apiClient({
              method: 'GET',
              path: `organization/${orga}/`,
              data:{}
            });
            return Orgesponse.name
    }));
      setOrganizations(org_names); // Assurez-vous que response.org contient les organisations
      setMainOrganization(org_names[0]); // Sélectionner automatiquement la première organisation
    } catch (error) {
      console.error("Failed to fetch contract organizations:", error);
    }
  };

  // Calculer la durée en années
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    return diffYears.toFixed(2); // Limiter à deux décimales
  };

  // Mettre à jour la durée dès que les dates changent
  useEffect(() => {
    if (startDate && endDate) {
      const calculatedDuration = calculateDuration(startDate, endDate);
      setDuration(calculatedDuration);
    }
  }, [startDate, endDate]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiClient({
        method: "POST",
        path: "exercise/",
        data: {
          name: exerciseName,
          date_i: startDate,
          date_f: endDate,
          period: duration,
          org: orgId[organizations.indexOf(mainOrganization)], //Id de l'organisation principale
          con: contractId,
          type:1
        }
      });
      alert("Exercise created successfully!");
      window.location=`./?id=${contractId}`
    } catch (error) {
      console.error("Failed to create exercise:", error);
    }
  };
  if (!mainOrganization) {
    return <div>Chargement...</div>;
  }
  return (
    <div>
      <HomePageButton/>
      <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}>
        <Sider_/><Content>
      <div className="exercise-form">
        <h2>Créer un nouvel exercice</h2>
        <form name="exercise" onSubmit={handleSubmit}>
          <label>
            Nom de l'exercice&nbsp;
            <input
              type="text"
              name="exerciseName"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
            />
          </label>

          <label>
            Date de début&nbsp;
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>

          <label>
            Date de fin&nbsp;
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>

          <label>
            Durée (années):&nbsp;
            <input type="text" value={duration} readOnly />
          </label>

          <label>
            Organisation principale&nbsp;
            <select
              value={mainOrganization}
              onChange={(e) => setMainOrganization(e.target.value)}
              required
            >
              {organizations.map((org, index) => (
                <option key={index} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="submit-btn">Créer</button>
        </form>
      </div>
      <style jsx="true">{`
        .exercise-form {
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
        .exercise-form input,
        .exercise-form select {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .exercise-form button {
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
        .exercise-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
      </Content></Layout>
    </div>
  );
}
