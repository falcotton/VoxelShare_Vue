<template>
  <div class="home">
    <amplify-connect :query="listPostsQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0">
          <h2>{{errors}}</h2>
        </div>

        <div v-else-if="data">
          <post-list :result="data.searchPosts"></post-list>
          <v-flex xs12>
            <v-layout justify-center>
              <v-pagination
                v-model="page"
                :length="Math.ceil(data.searchPosts.total/9)"
                :total-visible="Math.ceil(data.searchPosts.total/9)"
              ></v-pagination>
            </v-layout>
          </v-flex>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import PostList from "../components/PostList.vue";
import * as queries from "../graphql/queries";

export default {
  data: () => {
    return {
      page: 1,
      posts: null
    };
  },
  components: { PostList },
  computed: {
    listPostsQuery() {
      let api_arg = {
        filter: {
          and: [
            {
              visibility: { eq: "public" }
            }
          ]
        },
        sort: { field: "createdAt", direction: "desc" },
        nextToken: (this.page - 1) * 9,
        limit: 9
      };
      if (this.$route.name === "Search") {
        let searchword = this.$route.query.search;
        api_arg["filter"]["and"] = {
          or: [
            { title: { match: `*${searchword}*` } },
            { description: { match: `*${searchword}*` } }
          ]
        };
        this.page = 1;
      }
      return this.$Amplify.graphqlOperation(queries.searchPosts, api_arg);
    }
  },
  created() {}
};
</script>