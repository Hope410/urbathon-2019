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
              <q-icon left size="5em" name="visibility" />
            </q-btn>
            <q-btn class="frac col" color="primary" no-caps @click="start(false)">
              <q-icon left size="5em" name="hearing" />
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
import { Howl, Howler } from 'howler';

export default {
  name: 'PageIndex',

  data(){
    return {
    }
  },

  methods: {
    start(sighted){
      this.$router.push(`/${!sighted ? 'un' : ''}sighted`)

      if(!sighted){
        this.play('Добро пожаловать в приложение! Куда Вы хотите направиться? Перед ответом и после него кликните по экрану.');
      }
    },

    play(text){
      return new Promise((resolve, reject) => {
        let sound = new Howl({
          src: `https://spatialdata.work/api/synthesize.ogg?text=${encodeURI(text)}`,
          volume: 0.5,
          onend: resolve
        });

        sound.play();
      })
    },
  }
}
</script>
