<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to form link generator
        </v-card-title>
        
        <v-text-field 
          class="mx-4" v-model="original" label="Link here" 
          :rules="rules"
        />
        
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
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog
        v-model="dialog"
        max-width="480"
      >
        <v-card class="d-flex flex-column align-center">
          <v-card-title class="headline">
            Your shareable link is generated.
          </v-card-title>

          <v-card-text class="my-4 text-center">
            <a target="_blank" v-bind:href="generated">{{generated}}</a>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              v-on:click="copyToClipboard"
            >
              <v-icon
                right
                dark
              >
                mdi-content-paste
              </v-icon> &nbsp; Copy & Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-col>
  </v-row>
</template>

<script>
  import copy from 'copy-to-clipboard'
 
  import Logo from '~/components/Logo.vue'
  import VuetifyLogo from '~/components/VuetifyLogo.vue'

  export default {
    components: {
      Logo,
      VuetifyLogo
    },

    data: () => ({
      original: '',
      generated: '',
      loading: false,
      dialog: false,
      patternUrl: /https\:\/\/dev\.forms\.bloo\.io\/f\//g,
      rules: [
        value => !!value || 'Required.',
        value => {
          const pattern = /https\:\/\/dev\.forms\.bloo\.io\/f\//g
          return value.match(pattern) || 'Must start with "https://dev.forms.bloo.io/f/..."'
        },
      ]
    }),

    methods: {
      async generateLink() {
        try {
          this.loading = true
          
          if(!this.original.match(this.patternUrl)) throw 'Unsupport URL format'

          await new Promise(res => setTimeout(() => res(), 500))

          this.generated = this.original.replace(this.patternUrl, `${window.location.href}shared?fid=`)
          this.loading = false
          this.dialog = true
        } catch(e) {
          console.error(e)
          this.loading = false
        }
      },

      copyToClipboard() {
        console.log('generated', this.generated)
        copy(this.generated)
        this.dialog = false
      }
    }
  }
</script>
