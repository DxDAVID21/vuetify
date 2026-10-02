
const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const URL =`http://www.omdbapi.com/?apikey=${API_KEY}&`

export async function cercarPelicula(text) {

  try {
    const demana = `${URL}s=${encodeURIComponent(text)}`;

    const resposta = await fetch(demana);

    const dades = await resposta.json()

    return dades.Search ?? []
    
  } catch (error) {
    console.error("Error: ", error.message)
    return [];
  }
}

export async function cercarPeliculaById(imdbID) {
   try {
    const demana = `${URL}i=${imdbID}&plot=full`;

    const resposta = await fetch(demana);

    const dades = await resposta.json();
    
    if (!resposta.ok || dades.Response === "False") {
      throw new Error(dades.Error ?? "Error en la API")
    }
    
    return dades;

  } catch (error) {
    console.error("Error: ", error.message)
    return null;
  }
}



