<template>
  <div class="postcardactions">
    <v-card :to="{ name: 'User', params: { id : user.userid } }">
      <v-card-actions>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-img :src="imagePath" alt />
            </v-list-tile-avatar>
            <v-list-tile-title v-text="user.nickname"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import aws_exports from "../aws-exports";
import twitter_icon from "@/assets/Twitter_Social_Icon_Circle_Color.png";

import axios from "axios";
import default_avatar from "@/assets/blank-profile-picture-973460_960_720.png";

export default {
  name: "PostCardActions",
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      t_icon: null,
      imagePath: null
    };
  },
  created() {
    this.t_icon = twitter_icon;

    this.imagePath = default_avatar;
    let avatarPath = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${this.user.userid}/avatar`;
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
