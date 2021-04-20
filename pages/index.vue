<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to form link generator
        </v-card-title>
        
        <v-text-field class="mx-4" v-model="original" label="Link here" />
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="mr-2"
            color="primary"
            nuxt
            v-on:click="generateLink"
            v-bind:loading="loading"
            v-bind:disabled="loading"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            Your shareable link is generated.
          </v-card-title>

          <v-card-text class="my-4">
            <a v-bind:href="generated" id="myInput">{{generated}}</a>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              text
              v-on:click="copyToClipboard"
            >
              Copy & Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-col>
  </v-row>
</template>

<script>
import {POST} from 'fetchier'

import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },

  data: () => ({
    original: 'https://dev.forms.bloo.io/f/cknnzoqob274708updnwwz3rrz',
    generated: '',
    loading: false,
    dialog: false,
    patternUrl: /https\:\/\/dev\.forms\.bloo\.io\/f\//g
  }),

  methods: {
    async generateLink() {
      try {
        this.loading = true
        
        if(!this.original.match(this.patternUrl)) throw 'Unsupport URL format'

        const {generatedUrl, ...data} = await POST({
          url: '/api/json', 
          body: {url: this.original.replace(this.patternUrl, '')}
        })

        console.log('GQL', data)

        this.generated = generatedUrl
        this.loading = false
        this.dialog = true
      } catch(e) {
        console.error(e)
        this.loading = false
      }
    },

    copyToClipboard() {
      const el = document.createElement('input');
      el.setAttribute('type', 'text')
      el.value = this.generated;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.dialog = false
    }
  }
}
</script>
