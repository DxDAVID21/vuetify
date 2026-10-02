<script setup>
import { ref } from "vue";
import {
  cercarPelicula,
  cercarPeliculaById,
} from "@/services/communicationManager";

const textCerca = ref("");
const resultats = ref([]);
const detall = ref(null);
const seleccionada = ref(null);

async function ferCerca() {
  resultats.value = await cercarPelicula(textCerca.value);
}

async function obrirDetall(imdbID) {
  detall.value = await cercarPeliculaById(imdbID);
  seleccionada.value = imdbID;
}
</script>

<template>
  <v-navigation-drawer>
    <v-list nav>
      <v-list-item title="Navigation drawer" link></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-text-field v-model="textCerca" label="Què vols cercar?"></v-text-field>

  <v-btn @click="ferCerca"> Cercar </v-btn>

  <v-container>
    <v-card>
      <v-container fluid>
        <v-row density="comfortable">
          <v-col
            v-for="pelicula in resultats"
            :key="pelicula.Title"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img :src="pelicula.Poster"> </v-img>
              <v-card-title v-text="pelicula.Title"></v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  style="color: teal"
                  text="Més info"
                  variant="text"
                  @click="obrirDetall(pelicula.imdbID)"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="seleccionada === pelicula.imdbID"
                  class="position absolute w-100"
                  width="100%"
                  style="bottom: 0"
                >
                  <v-card-text class="pb-0">
                    <p>Descripció</p>
                    <p>{{ detall?.Plot }}</p>
                  </v-card-text>

                  <v-card-actions class="pt-0">
                    <v-btn
                      style="color: teal"
                      text="Close"
                      variant="text"
                      @click="seleccionada = null"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
