<template>
  <v-navigation-drawer fixed clipped v-model="navigate" app>
    <v-list dense>
      <v-list-tile v-for="menu in menulists" :key="menu.text" :to="menu.link">
        <v-list-tile-action>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ menu.text }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list>
        <v-list-tile v-for="user in userlists" :key="user.text" avatar :style="{height:'80px'}">
          <post-card-actions :user="user"></post-card-actions>
        </v-list-tile>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
import PostCardActions from "./PostCardActions.vue";

export default {
  components: { PostCardActions },
  props: {
    navigate: {
      type: Boolean
    }
  },
  data: () => ({
    menulists: [
      { icon: "home", text: "Home", link: "/" },
      { icon: "contact_support", text: "contact", link: "/about" }
    ],
    userlists: []
  }),
  created() {}
};
</script>