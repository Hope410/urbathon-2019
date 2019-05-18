<template>
  <q-page>
    <q-card class="main-card fixed-bottom-right">
      <q-card-section>
        <div class="text-h6">Построить путь</div>
      </q-card-section>

      <q-separator />

      <q-card-section vertical>
        <q-input v-model="pointFrom" label="Точка отправления" />
        <q-input v-model="pointTo" label="Точка назначения" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>

</style>

<script>
// import L from 'leaflet-routing-machine'

export default {
  name: 'sighted',
  data(){
    return {
      pointFrom: '',
      pointTo: ''
    }
  },
}
</script>
