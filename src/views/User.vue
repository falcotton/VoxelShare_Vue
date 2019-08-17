<template>
  <amplify-connect :query="getUserQuery">
    <template slot-scope="{ loading, data, errors }">
      <div v-if="loading">Loading...</div>

      <div v-else-if="errors.length > 0">
        <h1>{{errors}}</h1>
      </div>

      <div v-else-if="data">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-flex xs6 md12>
                <div v-if="data.itemsByUserid.items[0].avatar === null">
                  <v-img :src="require('@/assets/blank-profile-picture-973460_960_720.png')"></v-img>
                </div>
                <div v-else>
                  <v-img :src="imagePath"></v-img>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs2>
                    <v-btn
                      icon
                      v-if="data.itemsByUserid.items[0].twitterid"
                      :href="`https://twitter.com/${data.itemsByUserid.items[0].twitterid}`"
                    >
                      <v-img :src="require('@/assets/Twitter_Social_Icon_Circle_Color.png')"></v-img>
                    </v-btn>
                  </v-flex>
                  <v-flex xs10>
                    <v-flex xs12 md5>Nickname</v-flex>
                    <v-flex xs12 md12>
                      <v-text-field v-model="data.itemsByUserid.items[0].nickname" readonly></v-text-field>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
            <v-flex xs12 md9>
              <v-textarea
                v-model="data.itemsByUserid.items[0].bio"
                label="Bio"
                outline
                height="400"
                readonly
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <div v-if="data.itemsByUserid.items[0].posts.items">
          <v-container>
            <v-layout wrap row>
              <v-flex
                sm12
                md4
                v-for="post in data.itemsByUserid.items[0].posts.items"
                :key="post.createAt"
              >
                <v-card>
                  <post-card-title :post="post"></post-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </div>
    </template>
  </amplify-connect>
</template>

<script>
import * as queries from "../graphql/queries";
import aws_exports from "../aws-exports";
import PostCardTitle from "../components/PostCardTitle.vue";

import axios from "axios";
import default_avatar from "@/assets/blank-profile-picture-973460_960_720.png";

export default {
  name: "User",
  components: { PostCardTitle },
  props: {},
  data: () => {
    return { imagePath: "" };
  },
  computed: {
    getUserQuery() {
      return this.$Amplify.graphqlOperation(queries.itemsByUserid, {
        userid: this.$route.params.id
      });
    }
  },
  created() {
    this.imagePath = default_avatar;
    let avatarPath = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${this.$route.params.id}/avatar`;
    axios
      .get(avatarPath)
      .then(() => {
        this.imagePath = avatarPath;
      })
      .catch(() => {
        console.log("Avatar is not exist.");
      });
  }
};
</script>