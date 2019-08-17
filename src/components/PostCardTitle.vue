<template>
  <div class="postcardtitle">
    <v-card :to="{ name: 'Model', params: { modelpath : post.id } }">
      <v-img
        :src="`https://${post.thumnail.bucket}.s3.amazonaws.com/public/${post.thumnail.key}`"
        height="500px"
      ></v-img>
      <v-card-title primary-title v-if="post">
        <v-flex>
          <h1 class="headline mb-1 font-weight-bold display-4">{{post.title.substr(0,16)}}</h1>
          <div
            id="card-description"
            class="headline mb-0"
            :style="{height: '150px' }"
          >{{post.description.substr(0,64)}}</div>
          <v-layout justify-end>
            <h4 v-text="post.createdAt.substr(0,10)"></h4>
          </v-layout>
        </v-flex>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "PostCardTitle",
  props: {
    post: {
      type: Object
    }
  },
  methods: {
    goModel() {
      this.$router.push({ name: "Home" });
    }
  },
  created() {}
};
</script>

<style>
#card-description {
  text-overflow: ellipsis;
  overflow: hidden;
  height: 60px;
}
</style>