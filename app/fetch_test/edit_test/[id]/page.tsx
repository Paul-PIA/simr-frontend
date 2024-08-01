"use client";
// This directive tells Next.js that this component should be rendered on the client side.

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./edit.module.css"; // Import the CSS module for styling the edit page

// Interface defining the structure of an Organization object
interface Organization {
  id: number;
  email: string;
  name: string;
  tel: string;
  adrs: string;
  post: string;
}

// Interface defining the props for the EditOrganization component
interface EditOrganizationProps {
  params: {
    id: string; // The ID of the organization to be edited, passed as a prop
  };
}

const EditOrganization: React.FC<EditOrganizationProps> = ({ params }) => {
  // State to hold the organization data being edited
  const [org, setOrg] = useState<Partial<Organization>>({});
  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to track any errors that occur
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router for navigation

  // useEffect hook to fetch the organization details when the component mounts
  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organization/${params.id}/`
        );
        setOrg(response.data); // Update the state with the fetched organization data
      } catch (error) {
        setError("Error fetching organization details."); // Set an error message if fetching fails
        console.error("Error fetching organization:", error); // Log the error to the console
      } finally {
        setLoading(false); // Set loading to false after the fetch operation completes
      }
    };

    fetchOrg(); // Call the fetch function
  }, [params.id]); // Dependency array ensures the fetch happens when the ID changes

  // Function to handle input changes and update the organization state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrg((prevOrg) => ({ ...prevOrg, [name]: value })); // Update the specific field in the org state
  };

  // Function to handle form submission and update the organization via an API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/${params.id}/`,
        {
          email: org.email,
          name: org.name,
          tel: org.tel,
          adrs: org.adrs,
          post: org.post,
        }
      );
      alert("Organization updated successfully!"); // Show a success message
      router.push("/fetch_test"); // Redirect to the fetch_test page after successful update
    } catch (error) {
      setError("Error updating organization."); // Set an error message if updating fails
      console.error("Error updating organization:", error); // Log the error to the console
    }
  };

  // Conditional rendering: if data is loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  // Render the form for editing the organization
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Edit Organization</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={org.email || ""} // Use the current value or an empty string
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={org.name || ""} // Use the current value or an empty string
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="tel"
          placeholder="Telephone"
          value={org.tel || ""} // Use the current value or an empty string
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="adrs"
          placeholder="Address"
          value={org.adrs || ""} // Use the current value or an empty string
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="post"
          placeholder="Post"
          value={org.post || ""} // Use the current value or an empty string
          onChange={handleInputChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Update Organization
        </button>
      </form>
    </div>
  );
};

export default EditOrganization;
