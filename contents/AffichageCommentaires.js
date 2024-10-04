import React from "react";
import { apiClient } from "../services/api";

const Reply=(comment)=>{
    const commentText = window.prompt('Réponse: ');
    if (commentText){
      handleReply(comment,commentText)
    }
  }
const handleReply=async (comment,commentText)=>{
  await apiClient({
    method:'POST',
    path:'comment/',
    data:{
      text:commentText,
      parent:comment.id,
      file:comment.file,
      line:comment.line,
      colone:comment.colone
    }
  })
}
  // Fonction pour mettre en surbrillance la case associée à un commentaire
  const handleViewCell = (line, column) => {
    setHighlightedCell({ rowIndex: line, colId: column });
  };
function AffichageEnfants ({children,profondeur,parent,self,selectedDealer,orgConRights,orgUsers}){
    const styles = {
        button: {
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
        },
        commentContainer: {
          marginTop: '20px',
          maxHeight: '300px',
          overflowY: 'auto',
          marginLeft:'20px'
        },
      };
    return(<div style={styles.commentContainer}>
        {children[parent.id].map((comment, index) => (
         
            <li key={index}>
              {`Réponse à '${parent.text}': ${comment.text} `}
              <button onClick={() => handleViewCell(comment.line, columnDefs[comment.colone - 1])} style={{ ...styles.button, backgroundColor: '#2196F3' }}>
                Voir la case
              </button>
              <div>Responsable : 
              {self.id==orgConRights.chief ? (
              <form 
              name="Choose Dealer"
              onSubmit={async (e)=>{
                e.preventDefault();
                await apiClient({
                  method:'PATCH',
                  path:`assigncomment/${comment.id}/`,
                  data:{dealer:selectedDealer[comment.id]}
                })
              }}>          
                    <select
                    name="dealer"
                    value={selectedDealer[comment.id]}
                    onChange={
                      (e) => {
                        selectedDealer[comment.id]=e.target.value} }// Mise à jour du dealer
                  >
                    <option value={null} >Choisir un responsable </option>
                    {orgUsers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.username}
                      </option>
                        ))}
                      </select>
                          <button type="submit" style={{ ...styles.button, backgroundColor: '#2196F3' }}>Confirmer</button>
                          </form>
              ):(selectedDealer[comment.id]) } </div>
              <button style={{ ...styles.button, backgroundColor: '#2196F3' }} onClick={()=>{ Reply(comment)}}>Répondre</button>
              {children[comment.id]!==undefined &&(
                <AffichageEnfants
                comments={children[comment.id]}
                children={children}
                profondeur={profondeur+1}
                self={self}
                selectedDealer={selectedDealer}
                parent={comment}
                orgConRights={orgConRights}
                orgUsers={orgUsers}/>
              )}
            </li>
          ))} </div> )}
    

export default function AffichageCommentaires ({comments, children,self,selectedDealer,orgConRights,columnDefs,orgUsers}){
    const styles = {
        button: {
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
        },
        commentContainer: {
          marginTop: '20px',
          maxHeight: '300px',
          overflowY: 'auto',
          marginLeft:'20px'
        },
      };
    return(<div styles={styles.commentContainer}>
        {comments.map((comment, index) => (
            comment.parent==null &&(
            <li key={index}>
              {`Ligne ${comment.line}, Colonne ${comment.colone} (${columnDefs[comment.colone - 1]}) : ${comment.text} `}
              <button onClick={() => handleViewCell(comment.line, columnDefs[comment.colone - 1])} style={{ ...styles.button, backgroundColor: '#2196F3' }}>
                Voir la case
              </button>
              <div>Responsable : 
              {self.id==orgConRights.chief ? (
              <form 
              name="Choose Dealer"
              onSubmit={async (e)=>{
                e.preventDefault();
                await apiClient({
                  method:'PATCH',
                  path:`assigncomment/${comment.id}/`,
                  data:{dealer:selectedDealer[comment.id]}
                })
              }}>          
                    <select
                    name="dealer"
                    value={selectedDealer[comment.id]}
                    onChange={
                      (e) => {
                        selectedDealer[comment.id]=e.target.value} }// Mise à jour du dealer
                  >
                    <option value={null} >Choisir un responsable </option>
                    {orgUsers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.username}
                      </option>
                        ))}
                      </select>
                          <button type="submit" style={{ ...styles.button, backgroundColor: '#2196F3' }}>Confirmer</button>
                          </form>
              ):(selectedDealer[comment.id]) } </div>
              <button style={{ ...styles.button, backgroundColor: '#2196F3' }} onClick={()=>{ Reply(comment)}}>Répondre</button>
              {children[comment.id]!==undefined &&(
                <AffichageEnfants
                children={children}
                profondeur={1}
                self={self}
                selectedDealer={selectedDealer}
                parent={comment}
                orgConRights={orgConRights}
                orgUsers={orgUsers}/>
              )}
            </li>)
          ))}
          </div>
    )
}