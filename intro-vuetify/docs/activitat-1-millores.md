# Activitat 1 — Millora de la interfície del Cercador de Pel·lícules

> Aplicació: **Cercador de Pel·lícules** (Vue 3 + Vite + Vuetify 4)
> Objectiu: passar d'una interfície que «funciona» a una interfície **agradable, clara i coherent**, aplicant els principis de disseny **C.R.A.P.** (Contrast, Repetició, Alineació i Proximitat) i reorganitzant el codi en **components reutilitzables**.

---

## 1. Captures de l'estat inicial (ABANS)

![Cercador de pel·lícules — abans](./img/abans-cercador.png)

![Detall de pel·lícula — abans](./img/abans-detall.png)

> Col·loca les captures dins `docs/img/`. Si una imatge no apareix, revisa que el nom del fitxer coincideixi exactament.

---

## 2. Anàlisi crítica (principis C.R.A.P.)

La primera versió complia la funcionalitat, però tenia problemes de disseny evidents. Aquests són els més rellevants:

| # | Principi | Problema detectat | Per què és un problema |
|---|----------|-------------------|------------------------|
| 1 | **Contrast** | Els botons utilitzaven `style="color: teal"` escrit directament al codi, i el text «Descripció» del detall tenia el mateix pes visual que la sinopsi. | El teal sobre blanc té poc contrast, no depèn de cap *token* del tema i no s'adapta al mode fosc. Sense jerarquia, l'usuari no sap què és un títol i què és contingut. |
| 2 | **Repetició** | El color s'escrivia a cada botó (`teal` una i una altra vegada), hi havia targetes dins de targetes sense un patró comú i les etiquetes barrejaven idiomes («Més info», «Close», «Welcome To Movies»). | Repetir valors «a mà» fa que qualsevol canvi s'hagi de fer a molts llocs i genera una interfície inconsistent. |
| 3 | **Alineació** | El camp de cerca i el botó «Cercar» estaven un sobre l'altre, el panell de detall es col·locava amb `position: absolute; bottom: 0` (podia tapar el contingut) i la graella tenia un `v-card` extra que afegia padding duplicat. | Elements desalineats donen sensació de desordre i dificulten la lectura. |
| 4 | **Proximitat** | La cerca, el botó i els resultats no formaven un bloc coherent, hi havia un `v-navigation-drawer` de «Navigation drawer» sense utilitat i no existien estats de càrrega ni de «sense resultats». | El que està relacionat ha d'estar junt; el que no aporta, ha de desaparèixer. Sense estats, l'app sembla trencada quan no troba res. |

A més, hi havia dos errors tècnics de fons: `:key="pelicula.Title"` podia generar **claus duplicades**, i no es gestionava el valor `"N/A"` del pòster (es mostrava una imatge trencada).

---

## 3. Canvis realitzats

### 3.1 Nous components (teoria de components)

El codi original era **monolític**: tota la lògica i tota la interfície vivien a `Pelicules.vue`. L'hem dividit seguint el principi de **responsabilitat única**, on cada component:

- **`props`** → rep dades del pare (comunicació *cap avall*).
- **`emit`** → comunica esdeveniments al pare (comunicació *cap amunt*).
- No fa crides a l'API ni guarda estat global → és un **component de presentació**, fàcil de reutilitzar i de provar.

#### `FitxaPelicula.vue` — la fitxa de la pel·lícula

```ts
const props = defineProps<{
  pelicula: PeliculaOMDb
}>()

const emit = defineEmits<{
  'veure-detall': [imdbID: string]
}>()
```

- Mostra el pòster amb una relació d'aspecte fixa (`aspect-ratio: 2/3`) perquè **totes les targetes tinguin la mateixa alçada**.
- Si el pòster és `"N/A"`, mostra una icona substituta (estat buit).
- Afegeix un `v-chip` amb el tipus traduït (*Pel·lícula / Sèrie / Episodi*).
- El títol es limita a **2 línies** per mantenir l'alineació de la graella.

#### `DetallPelicula.vue` — la finestra de detall

```ts
const props = defineProps<{
  obert: boolean
  detall: DetallOMDb | null
}>()

const emit = defineEmits<{
  tancar: []
}>()
```

- És un component **controlat**: el pare decideix si s'obre i quines dades es mostren.
- Substitueix l'antic overlay `position: absolute` per un **`v-dialog`** (no tapa contingut i funciona bé en mòbil).
- Estableix jerarquia: títol → xips de metadades (*Gènere · Durada · Qualificació*) → «Sinopsi», «Direcció» i «Repartiment» amb encapçalaments.

### 3.2 Abans / després del codi

**ABANS** — `Pelicules.vue` (tot barrejat, color hardcodejat, sense estats):

```vue
<v-text-field v-model="textCerca" label="Què vols cercar?"></v-text-field>
<v-btn @click="ferCerca"> Cercar </v-btn>

<v-card>
  <v-container fluid>
    <v-row density="comfortable">
      <v-col v-for="pelicula in resultats" :key="pelicula.Title" ...>
        <v-card>
          <v-img :src="pelicula.Poster"></v-img>
          <v-card-title v-text="pelicula.Title"></v-card-title>
          <v-btn style="color: teal" text="Més info" variant="text" ...></v-btn>
          <v-expand-transition>
            <v-card class="position absolute w-100" style="bottom: 0"> ... </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-card>
```

**DESPRÉS** — `Pelicules.vue` (cerca alineada, estats i components):

```vue
<v-row align="center" class="mb-4">
  <v-col cols="12" md="8">
    <v-text-field v-model="textCerca" variant="outlined" prepend-inner-icon="mdi-magnify"
      @keyup.enter="ferCerca" />
  </v-col>
  <v-col cols="12" md="4">
    <v-btn block color="primary" size="large" :loading="carregant" @click="ferCerca">Cercar</v-btn>
  </v-col>
</v-row>

<div v-if="carregant" class="d-flex justify-center py-12">
  <v-progress-circular color="primary" indeterminate size="56" />
</div>
<v-empty-state v-else-if="!haCercat" icon="mdi-movie-search-outline"
  title="Comença la teva cerca" text="Escriu el títol..." />
<v-empty-state v-else-if="resultats.length === 0" icon="mdi-emoticon-sad-outline"
  title="No s'han trobat resultats" text="Prova amb un altre títol..." />
<v-row v-else>
  <v-col v-for="pelicula in resultats" :key="pelicula.imdbID" cols="12" sm="6" md="4" lg="3">
    <FitxaPelicula :pelicula="pelicula" @veure-detall="obrirDetall" />
  </v-col>
</v-row>
```

### 3.3 Tema i contrast

A `src/plugins/vuetify.ts` hem definit una **paleta pròpia** amb colors en lloc de valors escrits a mà:

```ts
const lightTheme = {
  dark: false,
  colors: {
    primary: '#4F46E5',          // indigo
    secondary: '#7C3AED',        // porpra
    background: '#F4F5FB',
    surface: '#FFFFFF',
    'surface-variant': '#E8E7F3',
    'on-surface': '#1F2233',
    // ...
  },
}
```

- Ara **qualsevol** botó amb `color="primary"` comparteix el mateix color (resol la *Repetició*).
- S'han definit versions **light i dark**; `defaultTheme: 'system'` segueix la preferència del sistema operatiu.
- A `App.vue` hi ha un **botó per canviar de tema** i comprovar el contrast en tots dos modes.

### 3.4 Estats i accessibilitat

- Estats explícits de **càrrega**, **inicial** i **sense resultats** (`v-progress-circular` + `v-empty-state`).
- `alt` descriptiu a les imatges.
- Contorn de focus visible per teclat (`:focus-visible`) definit a `src/styles/main.scss`.
- `prefers-reduced-motion` per desactivar l'animació de les targetes.
- `:key="pelicula.imdbID"` en lloc del títol → **claus úniques**.

---

## 4. Captures de l'estat final (DESPRÉS)

![Cercador de pel·lícules — després](./img/despres-cercador.png)

![Detall de pel·lícula — després](./img/despres-detall.png)

![Tema fosc](./img/despres-fosc.png)

---

## 5. Comparativa ABANS / DESPRÉS

| Aspecte | Abans | Després |
|---------|-------|---------|
| **Contrast** | Teal hardcodejat, sense jerarquia al detall | Color primari del tema + jerarquia de títols |
| **Repetició** | `style="color: teal"` a cada botó | Token `primary` únic i components reutilitzables |
| **Alineació** | Cerca apilada, overlay absolut, padding duplicat | Cerca en fila alineada, `v-dialog`, graella neta |
| **Proximitat** | Drawer inútil, sense agrupació ni estats | Bloc de cerca + resultats, estats clars |
| **Components** | Tot dins `Pelicules.vue` | `FitxaPelicula.vue` + `DetallPelicula.vue` |
| **Idioma** | «Més info» / «Close» barrejats | Tot en català |
| **Errors de fons** | Claus duplicades, pòster `N/A` trencat | Claus per `imdbID`, pòster substitut |

---

## 6. Fitxers afectats

| Fitxer | Tipus | Descripció |
|--------|-------|------------|
| `src/components/FitxaPelicula.vue` | **Nou** | Targeta de pel·lícula (props/emit) |
| `src/components/DetallPelicula.vue` | **Nou** | Finestra de detall amb `v-dialog` |
| `src/services/communicationManager.d.ts` | **Nou** | Tipus del servei OMDb |
| `src/components/Pelicules.vue` | Modificat | Cerca alineada, estats i ús dels components |
| `src/plugins/vuetify.ts` | Modificat | Paleta light/dark |
| `src/App.vue` | Modificat | Barra neta + selector de tema |
| `src/styles/main.scss` | Modificat | Focus visible i `prefers-reduced-motion` |

---

## 7. Com executar-ho

```bash
npm install
npm run dev       # http://localhost:3000
```

Per comprovar que tot està correcte:

```bash
npm run type-check
npm run lint
npm run build
```

---

## 8. Conclusions

Aplicar C.R.A.P. no és «decorar»: és **ordenar la informació**. Definir una paleta com a *tokens* i separar la interfície en components de presentació (`FitxaPelicula`, `DetallPelicula`) ha resolt alhora els quatre principis i ha fet el codi més fàcil de mantenir i ampliar. Els estats (càrrega, buit, sense resultats) són els que més canvien la sensació de qualitat: fan que l'aplicació sembli **acabada** i no trencada.
