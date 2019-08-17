<template>
  <div id="Profile">
    <amplify-connect :query="getUserQuery" @done="onQueryFinished">
      <template slot-scope="{ loading, data, errors }">
        <div v-if="loading">Loading...</div>
        <div v-else-if="errors.length > 0">
          <h1>{{errors}}</h1>
        </div>
        <div v-else-if="data">
          <div v-if="data.getUser===null">
            <profile-form :userdata="default_data" :status="'create'"></profile-form>
          </div>
          <div v-else>
            <profile-form :userdata="data.getUser" :status="'update'"></profile-form>
          </div>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import AmplifyStore from "../store/store";
import ProfileForm from "@/components/ProfileForm.vue";
import * as queries from "../graphql/queries";

export default {
  name: "profile",
  components: {
    ProfileForm
  },
  data: () => {
    return {
      nickname: null,
      twitterid: null,
      bio: null,
      valid: null,
      avatar: null,
      default_data: {
        nickname: AmplifyStore.state.user.username,
        twitterid: "",
        bio: "",
        avatar: null
      }
    };
  },
  methods: {
    onQueryFinished() {}
  },
  computed: {
    getUserQuery() {
      return this.$Amplify.graphqlOperation(queries.getUser, {
        id: AmplifyStore.state.user.attributes.sub
      });
    }
  }
};
</script>