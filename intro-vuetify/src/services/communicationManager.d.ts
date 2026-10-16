/** Resultat resumit que retorna la cerca per text (`s=`). */
export interface PeliculaOMDb {
  Title: string
  Year: string
  Type: string
  Poster: string
  imdbID: string
}

/** Detall complet que retorna la cerca per identificador (`i=`). */
export interface DetallOMDb extends PeliculaOMDb {
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Ratings?: Array<{ Source: string, Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  BoxOffice?: string
  Response: string
}

export function cercarPelicula (text: string): Promise<PeliculaOMDb[]>
export function cercarPeliculaById (imdbID: string): Promise<DetallOMDb | null>
