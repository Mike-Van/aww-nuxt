<template>
  <div>
    <h1>Hi!</h1>
    <p>Fuck Off Kindly :D</p>
  </div>
</template>

<script>
  import {POST} from 'fetchier'

  export default {
    head() {
      console.log('head', this.form)
      return {
        title: this.form.title,
        description: this.form.description,
        meta: [
          {
            hid: 'og:title',
            property: 'og:title',
            content: this.form.title
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: this.form.description
          },
          {
            hid: 'og:site_name',
            property: 'og:site_name',
            content: 'Localhost Testing'
          },         
          {
            hid: 'og:type',
            property: 'og:type',
            content: 'article',
          },
          {
            hid: 'og:url',
            property: 'og:url',
            content: this.form.generatedUrl,
          },
        ]
      }
    },
    asyncData({params: {slug}, payload}) {
      return POST({url: 'http://localhost:3000/api/json', body:{url: slug}})
        .then(form => ({form}))
        .catch(console.error)
    },
  }
</script>
