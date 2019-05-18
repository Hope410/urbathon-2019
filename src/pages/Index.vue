<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="q-pa-md">
          <div align="center">
            <h4>
              Добро пожаловать в приложение для поиска оптимального маршрута для инвалидов
            </h4>
            <h5>
              Выберите режим работы приложения
            </h5>
          </div>

          <div class="row" style="height: 57vh;">
            <q-btn class="frac col" color="primary" no-caps @click="start(true)">
              <h3>
                Я зрячий
              </h3>
            </q-btn>
            <q-btn class="frac col" color="primary" no-caps @click="start(false)">
              <h3>
                Я незрячий
              </h3>
            </q-btn>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
  .frac {
    width: 90%;
    border-radius: 7px;
    margin-right: 10px;
    margin-right: 10px;
    display: flex;
  }
</style>

<script>
export default {
  name: 'PageIndex',

  data(){
    return {
    }
  },

  methods: {
    start(sighted){
      this.$router.push(`/${!sighted ? 'un' : ''}sighted`)
    },
  }
}
</script>
