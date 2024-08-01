"use client";
// This directive ensures that the component is rendered on the client side, as Next.js can render components on either the client or server.

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import the useRouter hook for client-side navigation
import styles from "./fetch.module.css"; // Import the CSS module for styling

// Interface to define the structure of an Organization object
interface Organization {
  id: number;
  email: string;
  name: string;
  tel: string;
  adrs: string;
  post: string;
}

const OrganizationComponent = () => {
  // State to hold the list of organizations
  const [orgs, setOrgs] = useState<Organization[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to hold the form data for a new organization
  const [newOrg, setNewOrg] = useState<Partial<Organization>>({
    name: "",
    email: "",
    tel: "",
    adrs: "",
    post: "",
  });
  const router = useRouter(); // Initialize the router for navigation

  // useEffect hook to fetch organizations data on component mount
  useEffect(() => {
    fetchOrg();
  }, []);

  // Function to fetch the list of organizations from the API
  const fetchOrg = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/`
      );
      setOrgs(response.data); // Update the state with the fetched organizations
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input changes in the form for adding a new organization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrg((prevOrg) => ({ ...prevOrg, [name]: value })); // Update the corresponding field in the newOrg state
  };

  // Function to handle form submission for adding a new organization
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/organization/`, {
        email: newOrg.email,
        name: newOrg.name,
        tel: newOrg.tel,
        adrs: newOrg.adrs,
        post: newOrg.post,
      });
      fetchOrg(); // Refresh the list of organizations after adding a new one
      // Reset the form fields
      setNewOrg({
        name: "",
        email: "",
        tel: "",
        adrs: "",
        post: "",
      });
    } catch (error) {
      console.error("Error adding organization:", error);
    }
  };

  // Function to handle the deletion of an organization
  const deleteOrganization = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/${id}/`
      );
      fetchOrg(); // Refresh the list of organizations after deletion
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  // Function to handle editing an organization, navigates to the edit page
  const editOrganization = (id: number) => {
    router.push(`/fetch_test/edit_test/${id}`); // Redirect to the edit page for the selected organization
  };

  // If the data is still loading, this shows a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Organizations</h1>
      <ul className={styles.ul}>
        {orgs.map((org) => (
          <li key={org.id} className={styles.li}>
            {org.name}
            <div className={styles.buttonGroup}>
              <button
                onClick={() => editOrganization(org.id)}
                className={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => deleteOrganization(org.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newOrg.email || ""}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newOrg.name || ""}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="tel"
          placeholder="Telephone"
          value={newOrg.tel || ""}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="adrs"
          placeholder="Address"
          value={newOrg.adrs || ""}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="post"
          placeholder="Post"
          value={newOrg.post || ""}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Add Organization
        </button>
      </form>
    </div>
  );
};

export default OrganizationComponent;
