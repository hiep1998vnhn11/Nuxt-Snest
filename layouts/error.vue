<template>
  <div class="error-page">
    <div class="error-container">
      <div class="content">
        <h1>
          {{ error.statusCode }}
        </h1>
        <h2 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h2>
        <h2 v-else>
          {{ otherError }}
        </h2>
        <h3>
          {{ error }}
        </h3>
        <nuxt-link v-slot="{ href, navigate }" custom :to="localePath('/')">
          <a :href="href" @click="navigate">
            Back to Home page
          </a>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Ops! Page not found',
      pageNotFoundMessasge:
        "The page you looking for doesn't exist. You may have mistyped the address or the page may have moved",
      otherError: 'An error occurred'
    }
  },
  head() {
    const title = `Ops ${this.error.statusCode}`
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  background: linear-gradient(45deg, #47c93a, #ffba00);
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  .error-container {
    position: absolute;
    top: 20%;
    left: 20%;
    right: 20%;
    bottom: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #8500ff, #5acaff);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    .content {
      max-width: 600px;
      max-height: 100vh;
      text-align: center;
      h1 {
        color: white;
        font-size: 6rem;
      }
      h2 {
        font-size: 2rem;
        background: white;
        margin-bottom: 20px;
        padding: 10px 20px;
        display: inline-block;
      }
      h3 {
        font-size: 1.5rem;
        color: white;
      }
      a {
        display: inline-block;
        position: relative;
        padding: 10px 25px;
        text-decoration: none;
        margin-top: 25px;
        border-radius: 15px;
        background: red;
        color: white;
        border-bottom: 4px solid #d00d56;
      }
    }
  }
}
</style>
