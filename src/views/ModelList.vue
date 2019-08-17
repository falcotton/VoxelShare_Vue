<template>
  <div class="modellist">
    <v-dialog v-model="thumnail_dialog" v-if="thumnail_dialog" height="500px" width="500px">
      <div>Thumnail uploaded</div>
      <v-img :src="imageurl"></v-img>
      <v-btn color="error" @click.stop="thumnail_dialog = false">close</v-btn>
    </v-dialog>
    <v-dialog v-model="update_dialog" v-if="update_dialog" hide-overlay>
      <v-card>
        <v-card-title class="headline grey" primary-title center>
          <v-spacer></v-spacer>
          <v-icon x-large @click.stop="clickClose">clear</v-icon>
        </v-card-title>

        <v-container grid-list-ms>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-container>
                <v-layout row wrap justify-center>
                  <v-flex>
                    <v-flex xs10 offset-xs1 justify-cdnter align-center>
                      <v-btn color="success" @click.stop="thumnailPicker">Get Thumnail</v-btn>
                      <ModelField :modelpath="update_post.model.key" />
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>

            <v-flex xs12 md6>
              <v-text-field v-model="update_post.title" :counter="50" label="title" required></v-text-field>
              <v-textarea
                outline
                v-model="update_post.description"
                :counter="300"
                auto-grow
                box
                label="description"
              ></v-textarea>
              <v-checkbox v-model="privateCheckbox" label="private"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" @click.stop="clickDelete">delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" :to="{ name: 'Model', params: { modelpath : update_post.id } }">View</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" @click.stop="clickUpdate">update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <amplify-connect :query="getUserQuery">
      <template slot-scope="{ loading, data, errors }">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0">
          <h1>{{errors}}</h1>
        </div>

        <div v-else-if="data">
          <div v-if="data.getUser.posts.items">
            <v-container>
              <v-layout wrap row>
                <v-flex sm12 md4 v-for="post in data.getUser.posts.items" :key="post.createAt">
                  <v-card @click.stop="openDialog(post)">
                    <v-img
                      :src="`https://${post.thumnail.bucket}.s3.amazonaws.com/public/${post.thumnail.key}`"
                      height="500px"
                    ></v-img>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
          <div v-if="data.getUser.posts.items.length ==0">
            <v-layout justify-center>no model</v-layout>
          </div>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { API, Storage, graphqlOperation } from "aws-amplify";

import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import AmplifyStore from "../store/store";
import ModelField from "@/components/ModelField.vue";

export default {
  name: "ModelList",
  components: { ModelField },
  props: {},
  data: () => {
    return {
      update_dialog: null,
      thumnail_dialog: null,
      privateCheckbox: null,
      update_post: null
    };
  },
  computed: {
    getUserQuery() {
      return this.$Amplify.graphqlOperation(queries.getUser, {
        id: AmplifyStore.state.user.attributes.sub
      });
    }
  },
  methods: {
    openDialog(post) {
      this.update_post = post;
      this.update_dialog = true;
      this.privateCheckbox = this.update_post.visibility === "private";
    },
    thumnailPicker() {
      let canvas = document.getElementsByTagName("canvas")[0];
      this.imageurl = canvas.toDataURL();
      this.thumnail_key = this.update_post.thumnail.key;
      let image_buf = new Buffer(
        this.imageurl.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      Storage.put(this.thumnail_key, image_buf, {
        contentType: "image/png"
      }).then(() => {});
      this.thumnail_dialog = true;
    },
    async clickDelete() {
      let deleteid = this.update_post.id;
      const mutate = await API.graphql(
        graphqlOperation(mutations.deletePost, {
          input: { id: deleteid }
        })
      );
      this.update_dialog = false;
      this.$router.push({ name: "Profile" });
    },
    async clickUpdate() {
      let updatePostInput = this.update_post;
      updatePostInput["visibility"] = this.privateCheckbox
        ? "private"
        : "public";
      const mutate = await API.graphql(
        graphqlOperation(mutations.updatePost, {
          input: updatePostInput
        })
      );
      this.update_dialog = false;
    },
    clickClose() {
      this.update_dialog = false;
    }
  },
  async created() {
    const userCheck = await API.graphql(
      graphqlOperation(queries.getUser, {
        id: AmplifyStore.state.user.attributes.sub
      })
    );
    console.log("user = null? ", userCheck.data.getUser == null);
    if (userCheck.data.getUser == null) {
      alert("Please fill your profile before upload.");
      this.$router.push({ name: "Profile" });
    }
  }
};
</script>