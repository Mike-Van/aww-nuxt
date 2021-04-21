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

      let {form = data} = await GQL({
        url: 'https://api-dev.bloo.io/graphql', query: `
          {
            formQueries {
              form(id: "${slug}") {
                id title description imageURL snapshotURL
              }
            }
          }
        `
      }).then(({formQueries}) => formQueries)
      .catch(e => {
        console.error('failed to fetched data', e)
        return {form: data}
      })

      return {
        form: {
          ...form,
          title: form?.title || data.title,
          description: form?.description?.replace(/<\/?[^>]+(>|$)/g, '') || data.id,
          imageURL: form?.snapshotURL || form?.imageURL
            || 'https://scontent.fpnh2-1.fna.fbcdn.net/v/t1.6435-9/89338414_492696631410324_1116546820986634240_n.png?_nc_cat=100&ccb=1-3&_nc_sid=09cbfe&_nc_eui2=AeGguH22kcYbuLTVsQD2wwyK0XphGIcIhoDRemEYhwiGgCApyqXLTgLnvyUQEOlpaQT2wiTyeuHef9JKwo6Pqkw0&_nc_ohc=s6RvQBh9Q6QAX8GfwaG&_nc_ht=scontent.fpnh2-1.fna&oh=c06fa1ab427f291d1140c9d9fdff8188&oe=60A7112A'
        }
      }
    },
  }
</script>
