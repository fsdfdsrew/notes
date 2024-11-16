<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import '@/styles/styles.css';

#app {
  font-family: 'Montserrat', Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-weight: 900;
  font-size: 104px;
  line-height: 104px;
  color: var(--white);
}

h2 {
  font-weight: 600;
  font-size: 48px;
  line-height: 72px;
  margin: 0;
  color: var(--white);
}

h3 {
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  color: var(--white);
}

h4 {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: var(--white);
}


p {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  margin: 0;
  color: var(--gray);
}

.text-normal {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 32px;
  color: var(--white);
}

input {
  border-radius: 36px;
  width: 620px;
  height: 72px;
}

body {
  margin: 0;
  background: var(--dark);
}
</style>