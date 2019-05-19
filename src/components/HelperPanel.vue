<template>
  <q-expansion-item
      v-model="open"
      header-class="bg-white"
      label="Путь"
    >
      <q-card>
        <q-card-section vertical :style="`display: ${!open ? 'none' : ''}`">
          <q-input ref="pointFrom" v-model="value.pointFrom" @change="processInput" label="Точка отправления" />
          <q-input ref="pointTo" v-model="value.pointTo" @change="processInput" label="Точка назначения" />
          <q-btn class="q-mt-sm" color="primary" style="width: 100%;" @click="build">Построить!</q-btn>
        </q-card-section>
      </q-card>
    </q-expansion-item>
</template>

<script>
export default {
  name: 'HelperPanel',
  props: [ 'value', 'build' ],

  data(){
    return {
      open: true
    }
  },

  methods: {
    processInput(){
      this.$emit('input', {
        pointFrom: this.$refs.pointFrom.value,
        pointTo: this.$refs.pointTo.value
      })
    }
  }
}
</script>
