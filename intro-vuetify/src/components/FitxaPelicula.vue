<script setup lang="ts">
  import type { PeliculaOMDb } from '@/services/communicationManager'
  import { computed } from 'vue'

  /**
   * Fitxa resumida d'una pel·lícula.
   *
   * Component de presentació: només rep les dades (`props`) i comunica les
   * interaccions cap al pare (`emit`). No fa cap crida a l'API.
   */
  const props = defineProps<{
    pelicula: PeliculaOMDb
  }>()

  const emit = defineEmits<{
    'veure-detall': [imdbID: string]
  }>()

  /** OMDb retorna `"N/A"` quan no hi ha pòster; cal mostrar un substitut. */
  const tePoster = computed(() => Boolean(props.pelicula.Poster) && props.pelicula.Poster !== 'N/A')

  /** Tradueix el tipus que retorna l'API per mostrar-lo en català. */
  const ETIQUETES_TIPUS: Record<string, string> = {
    movie: 'Pel·lícula',
    series: 'Sèrie',
    episode: 'Episodi',
  }

  const tipusEtiqueta = computed(() => ETIQUETES_TIPUS[props.pelicula.Type] ?? props.pelicula.Type)
</script>

<template>
  <v-card
    class="fitxa"
    elevation="2"
    height="100%"
    rounded="lg"
    variant="flat"
  >
    <div class="fitxa__poster">
      <v-img
        v-if="tePoster"
        :alt="`Pòster de ${pelicula.Title}`"
        cover
        height="100%"
        :src="pelicula.Poster"
      />

      <div v-else class="fitxa__poster-buit">
        <v-icon icon="mdi-movie-open-outline" size="64" />
        <span class="text-caption">Sense pòster</span>
      </div>

      <v-chip
        class="fitxa__tipus"
        color="primary"
        label
        size="small"
        variant="flat"
      >
        {{ tipusEtiqueta }}
      </v-chip>
    </div>

    <v-card-item class="pb-0 pt-3">
      <v-card-title class="text-wrap text-truncate-2">
        {{ pelicula.Title }}
      </v-card-title>

      <v-card-subtitle>{{ pelicula.Year }}</v-card-subtitle>
    </v-card-item>

    <v-card-actions class="px-4 pb-4 pt-3">
      <v-btn
        block
        color="primary"
        prepend-icon="mdi-information-outline"
        variant="tonal"
        @click="emit('veure-detall', pelicula.imdbID)"
      >
        Més informació
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.fitxa {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fitxa:hover {
  transform: translateY(-4px);
  box-shadow: var(--v-shadow-lg);
}

/* Empeny el botó a la part inferior perquè totes les fitxes quedin alineades. */
.fitxa .v-card-actions {
  margin-top: auto;
}

/* Emmagatzema l'espai del pòster encara que la imatge no carregui. */
.fitxa__poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background-color: rgb(var(--v-theme-surface-variant));
}

.fitxa__poster-buit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Repetició coherent: el xip de tipus sempre a la mateixa cantonada. */
.fitxa__tipus {
  position: absolute;
  top: 12px;
  left: 12px;
}

/* Limita el títol a dues línies perquè totes les fitxes quedin alineades. */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  white-space: normal;
}
</style>
