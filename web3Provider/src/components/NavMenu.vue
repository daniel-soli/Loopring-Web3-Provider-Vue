<template>
    <v-list nav dense v-if="isLoggedIn()">
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4">

            <v-list-item to="/home" link prepend-icon="mdi-view-dashboard" title="Home" value="home" />
            
        </v-list-item-group>
    </v-list>
</template>

<script lang="ts">
export default {
  name: "NavMenu",
  data: () => ({
    group: null,
  }),
  methods: {
    isLoggedIn(){
        console.log("test");
        if (sessionStorage.getItem("address") !== "")
            return true;
        else
            return false;
    }
  }
}
</script>