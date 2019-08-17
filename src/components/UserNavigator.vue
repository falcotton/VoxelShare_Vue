<template>
  <div>
    <v-menu bottom left v-if="user">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-icon large>account_circle</v-icon>
        </v-btn>
      </template>
      <v-list :style="{'align-items':'center'}">
        <amplify-connect :query="getUserQuery">
          <template slot-scope="{ loading, data, errors }">
            <div v-if="loading">Loading...</div>
            <div v-else-if="errors.length > 0">
              <h1>{{errors}}</h1>
            </div>
            <div v-else-if="data.getUser ">
              <v-list-tile
                v-for="(item,i) in profiletiles"
                :key="i"
                :to="item.to"
                :disabled="item.required_profile"
              >
                <v-layout justify-center>
                  <v-icon>{{item.icon}}</v-icon>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-layout>
              </v-list-tile>
            </div>
            <div v-else-if="data">
              <v-list-tile
                v-for="(item,i) in noprofiletiles"
                :key="i"
                :to="item.to"
                :disabled="item.required_profile"
              >
                <v-layout justify-center>
                  <v-icon>{{item.icon}}</v-icon>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-layout>
              </v-list-tile>
            </div>
          </template>
        </amplify-connect>

        <amplify-sign-out></amplify-sign-out>
      </v-list>
    </v-menu>
    <v-btn  color="primary" v-if="!user" to="/auth">SignIn</v-btn>
  </div>
</template>


<script>
import AmplifyStore from "../store/store";
import * as queries from "../graphql/queries";

export default {
  data() {
    return {
      profiletiles: [
        {
          title: "PROFILE ",
          to: "/profile",
          icon: "account_box"
        },
        {
          title: "MODEL LIST",
          to: "/modellist",
          icon: "android"
        },
        {
          title: "UPLOAD",
          to: "/upload",
          icon: "cloud_upload"
        }
      ],
      noprofiletiles: [
        {
          title: "PROFILE ",
          to: "/profile",
          icon: "account_box",
          required_profile: false
        },
        {
          title: "UPLOAD",
          to: "/upload",
          icon: "cloud_upload",
          required_profile: true
        },
        {
          title: "MODEL LIST",
          to: "/modellist",
          icon: "cloud_upload",
          required_profile: true
        }
      ]
    };
  },
  computed: {
    user() {
      return AmplifyStore.state.user;
    },
    getUserQuery() {
      return this.$Amplify.graphqlOperation(queries.getUser, {
        id: AmplifyStore.state.user.attributes.sub
      });
    }
  }
};
</script>