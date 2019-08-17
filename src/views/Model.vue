<template>
  <div id="view_field" ref="view_field" v-if="post">
    <v-layout justify-end>
      <a
        class="twitter-share-button"
        :href="twitterURL()"
        data-text="custom share text"
        data-url="https://dev.twitter.com/web/tweet-button"
        data-hashtags="example,demo"
        data-via="twitterdev"
        data-related="twitterapi,twitter"
      >
        <img height="40" :src="require('@/assets/Twitter_Social_Icon_Circle_Color.png')" />
      </a>
    </v-layout>

    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:actions>
          <v-icon color="white">$vuetify.icons.expand</v-icon>
        </template>
        <template v-slot:header>
          <v-list>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="imagePath" alt />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold" v-text="post.title"></v-list-tile-title>
                <v-list-tile-subtitle v-text="post.user.nickname"></v-list-tile-subtitle>
              </v-list-tile-content>
              <v-spacer></v-spacer>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold" v-text="post.createdAt.substr(0,10)"></v-list-tile-title>
                <v-list-tile-subtitle v-text="post.createdAt.substr(11,8)"></v-list-tile-subtitle>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </template>
        <v-card>
          <v-btn
            color="info"
            outline
            :to="{ name: 'User', params: { id : post.user.userid } }"
          >USER PAGE</v-btn>

          <v-card-text class="grey lighten">{{post.description}}</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <ModelField :modelpath="post.model.key" />
  </div>
</template>
<script>
import aws_exports from "../aws-exports";

import ModelField from "@/components/ModelField.vue";
import * as queries from "../graphql/queries";

import axios from "axios";
import default_avatar from "@/assets/blank-profile-picture-973460_960_720.png";

export default {
  components: { ModelField },
  data() {
    let post;
    return {
      imagePath: null,
      post: post,
      actions: {
        getPost: queries.getPost
      }
    };
  },
  created() {
    let that = this;
    this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(this.actions.getPost, {
        id: that.$route.params.modelpath
      })
    ).then(res => {
      this.post = res.data.getPost;
      console.log(this.post);
      this.imagePath = default_avatar;
      let avatarPath = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${this.post.user.userid}/avatar`;
      axios
        .get(avatarPath)
        .then(() => {
          this.imagePath = avatarPath;
        })
        .catch(() => {
          console.log("Avatar is not exist.");
        });
    });
  },
  methods: {
    twitterURL() {
      let modelURL = `http://${HOSTING_BUCKET_NAME}.s3-website-us-east-1.amazonaws.com${this.$route.fullPath}`;

      return encodeURI(
        `https://twitter.com/intent/tweet?text=Title:${this.post.title}&url=${modelURL}&hashtags=VoxShare`
      );
    }
  }
};
</script>
