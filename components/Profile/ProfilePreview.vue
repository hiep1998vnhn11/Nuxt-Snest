<template>
  <v-card justify="center" class="mx-auto" max-width="800px" height="350px">
    <v-img class="align-end" width="800px" height="350px" :src="background">
      <v-row>
        <v-col cols="4"> </v-col>
        <v-col cols="4" class="text-center">
          <v-avatar size="150" class="avatar-outlined">
            <img :src="avatar" />
          </v-avatar>
        </v-col>
      </v-row>
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: ['background', 'avatar']
}
</script>

<style></style>
