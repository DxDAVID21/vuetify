<script setup lang="ts">
  import type { DetallOMDb } from '@/services/communicationManager'
  import { computed } from 'vue'

  /**
   * Finestra de detall d'una pel·lícula.
   *
   * Component controlat: el pare decideix si està obert (`obert`) i quines
   * dades mostrar (`detall`); aquest component només avisa quan cal tancar.
   */
  const props = defineProps<{
    obert: boolean
    detall: DetallOMDb | null
  }>()

  const emit = defineEmits<{
    tancar: []
  }>()

  const tePoster = computed(() => Boolean(props.detall?.Poster) && props.detall?.Poster !== 'N/A')

  /** Metadades que es mostren com a xips, tot filtrant els buits. */
  const etiquetes = computed(() =>
    [props.detall?.Genre, props.detall?.Runtime, props.detall?.Rated].filter(
      (valor): valor is string => Boolean(valor) && valor !== 'N/A',
    ),
  )
</script>

<template>
  <v-dialog
    max-width="820"
    :model-value="obert"
    scrollable
    @update:model-value="emit('tancar')"
  >
    <v-card v-if="detall" rounded="lg">
      <v-card-item class="pt-4">
        <template #prepend>
          <v-avatar
            color="primary"
            icon="mdi-movie-open"
            rounded="lg"
            size="48"
            variant="tonal"
          />
        </template>

        <v-card-title class="text-h5 text-wrap">
          {{ detall.Title }}
        </v-card-title>

        <v-card-subtitle>{{ detall.Year }}</v-card-subtitle>

        <template #append>
          <v-btn
            aria-label="Tancar el detall"
            icon="mdi-close"
            variant="text"
            @click="emit('tancar')"
          />
        </template>
      </v-card-item>

      <v-divider />

      <v-card-text class="pa-5">
        <div class="d-flex flex-wrap ga-2 mb-5">
          <v-chip
            v-for="etiqueta in etiquetes"
            :key="etiqueta"
            color="primary"
            variant="tonal"
          >
            {{ etiqueta }}
          </v-chip>
        </div>

        <div class="detall__cos">
          <v-img
            v-if="tePoster"
            :alt="`Pòster de ${detall.Title}`"
            class="detall__poster"
            rounded="lg"
            :src="detall.Poster"
          />

          <div>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">
              Sinopsi
            </h3>

            <p class="text-body-1 mb-5">
              {{ detall.Plot }}
            </p>

            <h3 class="text-subtitle-1 font-weight-bold mb-1">
              Direcció
            </h3>

            <p class="text-body-2 mb-5">
              {{ detall.Director || 'No disponible' }}
            </p>

            <h3 class="text-subtitle-1 font-weight-bold mb-1">
              Repartiment
            </h3>

            <p class="text-body-2 mb-0">
              {{ detall.Actors || 'No disponible' }}
            </p>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-5 py-3">
        <v-spacer />

        <v-btn color="primary" variant="flat" @click="emit('tancar')">
          Tancar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else class="pa-8 d-flex justify-center" rounded="lg">
      <v-progress-circular color="primary" indeterminate />
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Una sola columna en mòbil, pòster + text alineats a partir de `md`. */
.detall__cos {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

.detall__poster {
  max-width: 220px;
}

@media (min-width: 840px) {
  .detall__cos {
    grid-template-columns: 220px 1fr;
    align-items: start;
  }
}
</style>
