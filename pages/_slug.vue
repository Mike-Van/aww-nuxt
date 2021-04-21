<template>
   <div class="text-center">
    <v-overlay :value="true" opacity="1">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
      <p class="overline my-4">Redirecting</p>
    </v-overlay>
  </div>
</template>

<script>
  import {GQL} from 'fetchier'

  export default {
    mounted() {
      window.location.replace(`https://dev.forms.bloo.io/f/${this.form.id}`)
    },
    head() {
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
            content: 'Form Link Generator'
          },         
          {
            hid: 'og:type',
            property: 'og:type',
            content: 'article',
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.form.imageURL,
          },
        ]
      }
    },
    async asyncData({params: {slug}, payload}) {
      let data = {
        id: 'something',
        title: 'Unknown title',
        description: 'Unknown description'
      }

      let {formQueries: {form = data}} = await GQL({
        url: 'https://api-dev.bloo.io/graphql', query: `
          {
            formQueries {
              form(id: "${slug}") {
                id title description imageURL
              }
            }
          }
        `
      }).catch(e => {
        console.error(e)
        return data
      })

      return {
        form: {
          ...form,
          description: form?.description.replace(/<\/?[^>]+(>|$)/g, '')
        }
      }
    },
  }
</script>
