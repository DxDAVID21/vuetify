<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title class="font-weight-bold">
        <v-icon class="mr-2" icon="mdi-movie-open" />
        Cercador de Pel·lícules
      </v-app-bar-title>

      <template #append>
        <v-btn
          :aria-label="esFosc ? 'Activar el tema clar' : 'Activar el tema fosc'"
          :icon="esFosc ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="alternarTema"
        />
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useTheme } from 'vuetify'

  const theme = useTheme()

  const esFosc = computed(() => theme.current.value.dark)

  /** Alterna entre els temes clar i fosc definits a `plugins/vuetify.ts`. */
  function alternarTema () {
    theme.change(esFosc.value ? 'light' : 'dark')
  }
</script>
