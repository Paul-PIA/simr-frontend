import React from "react";
import { apiClient } from "../services/api";    

export default function AffichageCommentaires ({comments, children,getComments,self,selectedDealer,orgConRights,columnDefs,orgUsers,handleViewCell}){

  const Reply=(comment)=>{ //Répondre à un autre commentaire
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
  });
  getComments()
}

// const handleDelete=async(comment_id)=>{ //Pour utiliser cette fonction: modifier le backend pour permettre au front de connaître l'auteur d'un commentaire
//   await apiClient({
//     method:'DELETE',
//     path:`comment/${comment_id}/`
//   });
//   getComments()
// }
    const handleFuse=async(parent,child)=>{
       await apiClient({
        method:'POST',
        path:'fusecomments/',
        data:{comment1:parent.id,comment2:child.id}
       });
      getComments()}
    function AffichageEnfants ({parent}){ //Affiche les commentaires enfants du commentaire parent
        const styles = {
            button: {
              padding: '10px',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              marginRight:'10px'
            },
            commentContainer: {
              marginTop: '20px',
              maxHeight: '300px',
              marginLeft:'20px',
            },
          };
        return(<div style={styles.commentContainer}>
            {children[parent.id].map((comment, index) => (
             
                <li>
                  {`Réponse à "${parent.text}": ${comment.text} `}
                  <button onClick={() => handleViewCell(comment.line, columnDefs[comment.colone - 1])} style={{ ...styles.button, backgroundColor: '#2196F3' }}>
                    Voir la case
                  </button>
                  {/*comment.commenter==self.id && (
                    <button onClick={()=>handleDelete(comment.id)} style={{ ...styles.button, backgroundColor: '#b81414' }}>
                      Supprimer
                    </button>)*/}
                  {self.id==orgConRights.chief && ( <button onClick={() => handleFuse(parent,comment)} style={{ ...styles.button, backgroundColor: '#2196F3' }}>
                    Fusionner cette réponse avec le message original
                  </button> )}
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
                    <AffichageEnfants parent={comment}/>
                  )}
                </li>
              ))} </div> )}

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
          marginLeft:'20px',
        },
      };
    return(<div styles={styles.commentContainer}>
        {comments.map((comment, index) => (
            comment.parent==null &&(
            <li key={index}>
              {`Ligne ${comment.line}, Colonne ${comment.colone} (${columnDefs[comment.colone - 1]}) :`}
              {comment.text.split('\n').map((line, index) => ( //Pour les commentaires fusionnés: sépare chaque commentaire par ligne
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment> ))}
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
                <AffichageEnfants parent={comment}/>
              )}
            </li>)
          ))}
          </div>
    )
}