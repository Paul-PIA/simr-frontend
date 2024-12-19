
/**
 * Renvoie une version modifiée d'une liste remplaçant les valeurs dupliquées par des valeurs uniques
 * A vocation à être utiisé sur les noms de colonne des fichiers Excel, qui sont parfois vides ou dupliquées (notamment en cas de fusion)
 * @param {(string | undefined)[]} liste
 * @returns {string[]} 
 */
export function RenameDuplicates(liste){
    const occurences={} //Nombre d'occurences de chaque valeur
    return liste.map((valeur)=>{
        if (valeur==undefined){valeur="Undefined"}
        occurences[valeur]?(occurences[valeur]+=1):(occurences[valeur]=1)
        return (occurences[valeur]==1?valeur:(`${valeur}_${occurences[valeur]}`))
    })
}