import React, { useState } from "react";
import { Button, Card, Input, Typography } from "antd";
const { Paragraph } = Typography;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "default first",
    last_name: "default last",
    email: "default email",
    tel: "default phone",
    name: "John Doe",
    location: "New York, USA",
  });
  const [editProfile, setEditProfile] = useState(profile);

  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(editProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div style={{ flex: 1 }}>
        <Card
          title="Profile"
          extra={
            <Button onClick={handleEditToggle}>
              {isEditing ? "save" : "edit"}
            </Button>
          }
        >
          <p>
            <strong>First name: </strong>
            {isEditing ? (
              <Input
                name="first"
                value={editProfile.first_name}
                onChange={handleInputChange}
              />
            ) : (
              profile.first_name
            )}
          </p>
          <p>
            <strong>Last name: </strong>
            {isEditing ? (
              <Input
                name="last"
                value={editProfile.last_name}
                onChange={handleInputChange}
              />
            ) : (
              profile.last_name
            )}
          </p>
          <p>
            <strong>Email adress: </strong>
            {isEditing ? (
              <Input
                name="email"
                value={editProfile.email}
                onChange={handleInputChange}
              />
            ) : (
              profile.email
            )}
          </p>
          <p>
            <strong>Telephone: </strong>
            {isEditing ? (
              <Input
                name="tel"
                value={editProfile.tel}
                onChange={handleInputChange}
              />
            ) : (
              profile.tel
            )}
          </p>
          {/* <div className="profile-container">
            <div className="profile-header">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </>
              ) : (
                <>
                  <h2 className="profile-name">{profile.name}</h2>
                  <p className="profile-info">Location: {profile.location}</p>
                  <p className="profile-info">Email: {profile.email}</p>
                </>
              )}
            </div>

            <div className="profile-section">
              <h3>About Me</h3>
              <p>
                I am a software developer with a passion for creating dynamic
                and responsive web applications. I have a background in both
                front-end and back-end development, and I enjoy learning new
                technologies.
              </p>
            </div>

            <div className="profile-section">
              <h3>Follow Me</h3>
              <div className="profile-socials">
                <a href="#" className="social-link">
                  LinkedIn
                </a>
                <a href="#" className="social-link">
                  Twitter
                </a>
                <a href="#" className="social-link">
                  GitHub
                </a>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={handleEditToggle} className="edit-button">
                {isEditing ? "Confirm" : "Edit"}
              </button>
            </div> 
          </div>*/}
        </Card>
      </div>
      <style jsx="true">{`
        .profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .profile-name {
          font-size: 24px;
          margin: 10px 0;
        }

        .profile-info {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .profile-section {
          margin-bottom: 20px;
        }

        .profile-section h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }

        .profile-socials {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .social-link {
          color: #007bff;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .social-link:hover {
          color: #0056b3;
        }

        /* 输入框样式 */
        .profile-input {
          display: block;
          margin: 10px auto;
          padding: 8px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 80%;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
