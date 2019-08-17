<template>
  <v-container>
    <v-layout wrap row justify-center>
      <amplify-authenticator :authConfig="authConfig"></amplify-authenticator>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      authConfig: {
        signUpConfig: {
          hiddenDefaults: ["phone_number"]
        }
      }
    };
  }
};
</script>