<template>
  <div id="app">
    <v-app dark id="inspire">
      <menu-navigator :navigate="navigate"></menu-navigator>
      <v-toolbar color="red" dense fixed clipped-left app>
        <v-toolbar-side-icon @click.stop="navigate = !navigate"></v-toolbar-side-icon>
        <v-avatar>
          <v-img :src="require('@/assets/snap2019-07-26-00-10-57.png')" alt="logo" />
        </v-avatar>

        <v-toolbar-title class="mr-5 align-center">
          <div class="title">VoxelShare</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-layout row align-center style="max-width: 650px">
          <v-text-field
            placeholder="Search..."
            single-line
            append-icon="search"
            v-model="search_word"
            @click:append="() => {searchPost()}"
            color="white"
            hide-details
          ></v-text-field>
          <user-navigator></user-navigator>
        </v-layout>
      </v-toolbar>
      <v-content>
        <v-container fill-height>
          <v-layout justify-center align-center>
            <v-flex>
              <router-view />
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>


<script>
import MenuNavigator from "./components/MenuNavigator";
import UserNavigator from "./components/UserNavigator";

export default {
  name: "app",
  components: { MenuNavigator, UserNavigator },
  data: () => ({
    navigate: false,
    search_word: null
  }),
  props: {},

  methods: {
    searchPost() {
      if (!this.search_word) {
        return;
      }
      this.$router.push({
        name: "Search",
        query: { search: this.search_word }
      });
    }
  }
};
</script>
<style>
</style>