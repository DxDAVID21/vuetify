<script setup>
import { ref } from "vue";
import { cercarPelicula, cercarPeliculaById } from "@/services/communicationManager";

const textCerca = ref("");
const resultats = ref([]);
// const reveal = ref(false)
const detall = ref(null)
const seleccionada = ref(null)


async function ferCerca() {
  resultats.value = await cercarPelicula(textCerca.value);
}

async function obrirDetall(imdbID) {
    detall.value = await cercarPeliculaById(imdbID)
    seleccionada.value = imdbID
}
</script>

<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title> Welcome To Movies </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-heart"></v-btn>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>
  <v-app>
    <v-navigation-drawer>
      <v-list nav>
        <v-list-item title="Navigation drawer" link></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center" height="300">
      <v-text-field v-model="textCerca" label="Què vols cercar?"></v-text-field>

      <v-btn @click="ferCerca"> Cercar </v-btn>
      
      <v-container>
        <v-sheet
          border="dashed md"
          color="surface-light"
          height="200"
          rounded="lg"
          width="100%"
        >
          <v-card
          >
            <v-container fluid>
              <v-row density="comfortable">
                <v-col
                  v-for="pelicula in resultats"
                  :key="pelicula.Title"
                  cols="12"
                  md="6"
                >
                  <v-card
                   class="position relative"
                  >
                    <v-img
                      :src="pelicula.Poster"
                      aspect-ratio="2/3"
                    >
                    </v-img>
                    <v-card-title
                      class="text-white"
                      v-text="pelicula.Title"
                    ></v-card-title>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="teal-accent-4"
                        text="Més info"
                        variant="text"
                        @click="obrirDetall(pelicula.imdbID)"
                      ></v-btn>
                    </v-card-actions>

                    <v-expand-transition
                     
                    >
                      <v-card
                        v-if="seleccionada === pelicula.imdbID"
                          class="position absolute w-100"
                        width="100%"
                        style="bottom: 0"
                      >
                        <v-card-text class="pb-0">
                          <p class="text-headline-large">Descripció</p>
                          <p class="text-medium-emphasis">{{detall?.Plot}}</p>
                        </v-card-text>

                        <v-card-actions class="pt-0">
                          <v-btn
                            color="teal-accent-4"
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
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>
