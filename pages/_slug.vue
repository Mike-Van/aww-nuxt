<template>
  <div>
    <h1>Hi!</h1>
    <p>Fuck Off Kindly :D</p>
  </div>
</template>

<script>
  import {POST} from 'fetchier'

  export default {
    async asyncData({ params: {slug}, payload}) {
      console.log('payload', payload)
      return {
        data: payload || POST({url: '/api/json', body: {url: slug}})
      }
    },
    data: obj => console.log('data init', obj)
  }
</script>
