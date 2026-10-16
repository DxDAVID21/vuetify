<script setup lang="ts">
  import type { DetallOMDb, PeliculaOMDb } from '@/services/communicationManager'
  import { ref } from 'vue'
  import DetallPelicula from '@/components/DetallPelicula.vue'
  import FitxaPelicula from '@/components/FitxaPelicula.vue'
  import {
    cercarPelicula,
    cercarPeliculaById,
  } from '@/services/communicationManager'

  const textCerca = ref('')
  const resultats = ref<PeliculaOMDb[]>([])
  const detall = ref<DetallOMDb | null>(null)
  const carregant = ref(false)
  const dialogObert = ref(false)
  const haCercat = ref(false)

  /** Llança la cerca contra l'API i guarda els resultats a l'estat local. */
  async function ferCerca () {
    const terme = textCerca.value.trim()
    if (!terme) return

    carregant.value = true
    haCercat.value = true
    resultats.value = []

    try {
      resultats.value = await cercarPelicula(terme)
    } finally {
      carregant.value = false
    }
  }

  /** Obre el detall; mentre arriba la resposta el diàleg mostra un indicador. */
  async function obrirDetall (imdbID: string) {
    dialogObert.value = true
    detall.value = null
    detall.value = await cercarPeliculaById(imdbID)
  }
</script>

<template>
  <v-container class="py-6" max-width="1280">
    <h1 class="text-h5 font-weight-bold mb-1">
      Cercador de pel·lícules
    </h1>

    <p class="text-body-2 text-medium-emphasis mb-4">
      Escriu un títol i descobreix informació de les teves pel·lícules favorites.
    </p>

    <!-- Cerca: camp i botó alineats en una mateixa fila i amb amplada coherent. -->
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="textCerca"
          clearable
          hide-details="auto"
          label="Què vols cercar?"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @keyup.enter="ferCerca"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-btn
          block
          color="primary"
          :loading="carregant"
          prepend-icon="mdi-magnify"
          size="large"
          variant="flat"
          @click="ferCerca"
        >
          Cercar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Estat de càrrega -->
    <div v-if="carregant" class="d-flex justify-center py-12">
      <v-progress-circular color="primary" indeterminate size="56" />
    </div>

    <!-- Estat inicial -->
    <v-empty-state
      v-else-if="!haCercat"
      icon="mdi-movie-search-outline"
      text="Escriu el títol d'una pel·lícula o sèrie i prem «Cercar» per començar."
      title="Comença la teva cerca"
    />

    <!-- Sense resultats -->
    <v-empty-state
      v-else-if="resultats.length === 0"
      icon="mdi-emoticon-sad-outline"
      text="Prova amb un altre títol o revisa l'ortografia."
      title="No s'han trobat resultats"
    />

    <!-- Resultats -->
    <v-row v-else>
      <v-col
        v-for="pelicula in resultats"
        :key="pelicula.imdbID"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <FitxaPelicula :pelicula="pelicula" @veure-detall="obrirDetall" />
      </v-col>
    </v-row>

    <DetallPelicula
      :detall="detall"
      :obert="dialogObert"
      @tancar="dialogObert = false"
    />
  </v-container>
</template>
