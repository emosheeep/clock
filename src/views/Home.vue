<template>
  <div class="home">
    <SignIn />
  </div>
</template>

<script>
import SignIn from '@/components/SignIn.vue';

export default {
  name: 'Home',
  components: {
    SignIn,
  },
};
</script>
