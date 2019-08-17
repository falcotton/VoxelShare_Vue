<template>
  <div>
    <v-alert type="error" :value="valid_errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(value,index) in valid_errors" :key="index">{{value}}</li>
      </ul>
    </v-alert>

    <amplify-connect :mutation="createUpdateUserMutation" @done="onCreateUpdateFinished">
      <template slot-scope="{loading,mutate,errors}">
        <div v-if="loading">Loading...</div>

        <div v-if="errors.length > 0">
          <h1>{{errors}}</h1>
        </div>
        <v-dialog v-model="pickup_dialog">
          <amplify-photo-picker v-bind:photoPickerConfig="photoPickerConfig"></amplify-photo-picker>
        </v-dialog>

        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-flex xs6 md12>
                <v-img @click.stop="pickup_dialog=true" :src="imagePath" ref="avatar_field"></v-img>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs12 md5>Nickname</v-flex>
                  <v-flex xs12 md12>
                    <v-text-field v-model="userdata.nickname" :counter="20"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md5>TwitterID</v-flex>
                  <v-flex xs12 md12>
                    <v-text-field v-model="userdata.twitterid "></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
            <v-flex xs12 md9>
              <v-textarea v-model="userdata.bio" label="Bio" outline height="400" :counter="500"></v-textarea>
              <v-btn :disabled="valid_errors.length>0" @click="mutate" large color="success">save</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { components, AmplifyEventBus } from "aws-amplify-vue";
import * as mutations from "../graphql/mutations";

import AmplifyStore from "../store/store";
import aws_exports from "../aws-exports";
import axios from "axios";
import default_avatar from "@/assets/blank-profile-picture-973460_960_720.png";

export default {
  name: "ProfileForm",
  components: {
    ...components
  },
  props: {
    userdata: {
      type: Object
    },
    status: {
      type: String
    }
  },
  data: () => {
    return {
      photoPickerConfig: {
        header: "Upload Profile Pic",
        accept: "image/*",
        path: `${AmplifyStore.state.user.username}/`,
        defaultName: "avatar"
      },
      imagePath: "",
      pickup_dialog: false,
      s3_image_path: `${AmplifyStore.state.user.username}/avatar`,
      valid_errors: []
    };
  },
  computed: {
    createUpdateUserMutation() {
      this.valid();
      let userInput = {
        id: AmplifyStore.state.user.attributes.sub,
        userid: AmplifyStore.state.user.username,
        nickname: this.userdata.nickname,
        bio: this.userdata.bio,
        avatar: {
          bucket: aws_exports.aws_user_files_s3_bucket,
          region: aws_exports.aws_user_files_s3_bucket_region,
          key: "avatar"
        }
      };

      if (this.userdata.twitterid) {
        userInput["twitterid"] = this.userdata.twitterid;
      }
      if (this.status === "create") {
        return this.$Amplify.graphqlOperation(mutations.createUser, {
          input: userInput
        });
      } else if (this.status === "update") {
        return this.$Amplify.graphqlOperation(mutations.updateUser, {
          input: userInput
        });
      }
    }
  },
  methods: {
    onCreateUpdateFinished() {
      this.$router.push({ name: "Upload" });
    },
    valid() {
      this.valid_errors = [];

      if (!this.userdata.nickname) {
        this.valid_errors.push("title is required");
      } else if (this.userdata.nickname.length > 20) {
        this.valid_errors.push(
          "nickname is required more less than 20 characters."
        );
      }
      if (!this.userdata.bio) {
        this.valid_errors.push("bio is required");
      } else if (this.userdata.bio.length > 500) {
        this.valid_errors.push(
          "bio is required more less than 500 characters."
        );
      }

      if (
        this.userdata.twitterid &&
        this.userdata.twitterid.match(/[^a-zA-Z0-9_]/) !== null
      ) {
        this.valid_errors.push("Twitter id can uses {0-9,a-z,A-Z,_} .");
      }
    }
  },
  async created() {
    console.log(this.status);
    this.imagePath = default_avatar;
    let avatarPath = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${AmplifyStore.state.user.username}/avatar`;
    axios
      .get(avatarPath)
      .then(() => {
        this.imagePath = avatarPath;
      })
      .catch(() => {
        console.log("Avatar is not exist.");
      });
  },
  async beforeCreate() {
    AmplifyEventBus.$on("fileUpload", async () => {
      this.pickup_dialog = false;
    });
  }
};
</script>