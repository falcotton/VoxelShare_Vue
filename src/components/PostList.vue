<template>
  <v-container>
    <v-layout wrap row>
      <v-flex xs12 md4 v-for="post in result.items" :key="post.title">
        <post-card :post="post"></post-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PostCard from "../components/PostCard.vue";
export default {
  props: {
    result: {
      type: Object
    }
  },
  data: () => {
    return {
      page: 1
    };
  },
  components: { PostCard }
};
</script>