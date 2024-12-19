
/**
 * Renvoie une version modifiée d'une liste remplaçant les valeurs dupliquées par des valeurs uniques
 * @param {(str | undefined)[]} liste -
 * @returns 
 */
export function RenameDuplicates(liste){
    const occurences={} //Nombre d'occurences de chaque valeur
    return liste.map((valeur)=>{
        if (valeur==undefined){valeur="Undefined"}
        occurences[valeur]?(occurences[valeur]+=1):(occurences[valeur]=1)
        return (occurences[valeur]==1?valeur:(`${valeur}_${occurences[valeur]}`))
    })
}