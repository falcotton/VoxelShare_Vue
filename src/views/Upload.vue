<template>
  <div>
    <v-alert type="error" :value="valid_errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(value,index) in valid_errors" :key="index">{{value}}</li>
      </ul>
    </v-alert>

    <v-dialog v-model="thumnail_dialog" v-if="thumnail_dialog" height="500px" width="500px">
      <div>Thumnail uploaded</div>
      <v-img :src="imageurl"></v-img>
      <v-btn color="error" @click.stop="thumnail_dialog = false">close</v-btn>
    </v-dialog>

    <amplify-connect :mutation="createPostMutation" @done="onCreateFinished">
      <template slot-scope="{loading,mutate,errors}">
        <div v-if="loading">Loading...</div>

        <div v-if="errors.length > 0">
          <h1>{{errors}}</h1>
        </div>
        <v-container grid-list-ms>
          <v-layout row wrap>
            <v-flex xs12 justify-center d-flex text-xs-center>
              <h1>Upload Your Vox File</h1>
            </v-flex>
            <v-flex xs12 md6>
              <v-container>
                <v-layout row wrap justify-center>
                  <v-flex v-if="uploaded">
                    <v-flex xs10 offset-xs1 justify-cdnter align-center>
                      <v-btn color="primary" @click.stop="progress = uploaded = false">reupload</v-btn>
                      <v-btn color="success" @click.stop="thumnailPicker">Get Thumnail</v-btn>
                      <v-progress-linear :indeterminate="true" v-if="!progress"></v-progress-linear>
                      <ModelField :modelpath="model_key" v-if="progress" />
                    </v-flex>
                  </v-flex>

                  <div v-if="!uploaded">
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12>.vox file is required more less than 50kB</v-flex>
                        <v-flex xs12>
                          <input ref="file_input" type="file" accept=".vox" @change="pick" />
                        </v-flex>
                        <v-flex xs12>
                          <v-btn @click.stop="Upload" :disabled="!file" color="success" large>upload</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                </v-layout>
              </v-container>
            </v-flex>

            <v-flex xs12 md6>
              <v-text-field v-model="title" :counter="50" label="title" required></v-text-field>
              <v-textarea
                outline
                v-model="description"
                :counter="300"
                auto-grow
                box
                label="description"
              ></v-textarea>
              <v-checkbox v-model="privateCheckbox" label="private"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
        <v-layout justify-end>
          <v-btn :disabled="valid_errors.length>0" @click="mutate" color="success">POST</v-btn>
          <v-btn color="error" @click.stop="clear">Claer</v-btn>
        </v-layout>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { components } from "aws-amplify-vue";
import { API, Storage, graphqlOperation } from "aws-amplify";

import AmplifyStore from "../store/store";
import ModelField from "@/components/ModelField.vue";
import uuid from "uuid";

import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import aws_exports from "../aws-exports";

export default {
  components: {
    ModelField,
    ...components
  },
  data() {
    return {
      logger: {},
      valid_errors: [],
      error_I18e: null,
      file: null,
      uploaded: false,
      progress: false,
      thumnail_dialog: false,
      title: "",
      description: "",
      privateCheckbox: false,
      model_key: null,
      imageurl: null,
      thumnail_key: null
    };
  },
  methods: {
    Upload() {
      const that = this;
      const delay_time = this.file.size > 20 * 1024 ? 7000 : 5000;
      let vox_key = `${AmplifyStore.state.user.username}/${uuid()}.vox`;

      this.$Amplify.Storage.put(vox_key, this.file)
        .then(() => {
          setTimeout(() => (that.progress = true), delay_time);
          this.file = null;
          this.uploaded = true;
          this.model_key = vox_key + ".json";
        })
        .catch(e => {
          this.setError(e);
        });
    },
    pick(evt) {
      let tmpfile = evt.target.files[0];

      if (!tmpfile) {
        return;
      } else if (tmpfile.size > 51 * 1024) {
        this.file = null;
        this.$refs.file_input.value = "";
        alert(
          "This file size is too big. \n .vox file is required more less than 50 kB."
        );
        return;
      }

      this.file = tmpfile;
    },
    setError(e) {
      this.error_I18e = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    },
    clear() {
      this.title = "";
      this.description = "";
    },
    valid() {
      this.valid_errors = [];

      if (!this.title) {
        this.valid_errors.push("title is required");
      } else if (this.title.length > 50) {
        this.valid_errors.push(
          "title is required more less than 50 characters."
        );
      }
      if (!this.description) {
        this.valid_errors.push("description is required");
      } else if (this.description.length > 300) {
        this.valid_errors.push(
          "description is required more less than 300 characters."
        );
      }

      if (!this.uploaded) {
        this.valid_errors.push(".vox file is required");
      } else if (!this.thumnail_key) {
        this.valid_errors.push("Thumnail image is required");
      }
    },

    onCreateFinished() {
      this.$router.push({ name: "Home" });
    },
    thumnailPicker() {
      let canvas = document.getElementsByTagName("canvas")[0];
      this.imageurl = canvas.toDataURL();
      this.thumnail_key = this.model_key + ".png";
      let image_buf = new Buffer(
        this.imageurl.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      Storage.put(this.thumnail_key, image_buf, {
        contentType: "image/png"
      }).then(() => {});
      this.thumnail_dialog = true;
    }
  },
  computed: {
    createPostMutation() {
      this.valid();
      let createPostInput = {
        postUserId: AmplifyStore.state.user.attributes.sub,
        title: this.title,
        description: this.description,
        model: {
          bucket: aws_exports.aws_user_files_s3_bucket,
          region: aws_exports.aws_user_files_s3_bucket_region,
          key: this.model_key
        },
        thumnail: {
          bucket: aws_exports.aws_user_files_s3_bucket,
          region: aws_exports.aws_user_files_s3_bucket_region,
          key: this.thumnail_key
        },
        visibility: this.privateCheckbox ? "private" : "public"
      };

      return this.$Amplify.graphqlOperation(mutations.createPost, {
        input: createPostInput
      });
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