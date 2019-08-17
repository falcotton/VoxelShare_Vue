<template>
  <div class="postcard">
    <v-card>
      <post-card-title :post="post"></post-card-title>
      <post-card-actions :user="post.user"></post-card-actions>
    </v-card>
  </div>
</template>

<script>
import PostCardTitle from "./PostCardTitle.vue";
import PostCardActions from "./PostCardActions.vue";

export default {
  name: "PostCard",
  components: { PostCardTitle, PostCardActions },
  props: {
    post: {
      type: Object
    }
  }
};
</script>
