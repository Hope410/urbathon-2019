<template>
  <q-layout>
    <q-page-container>
      <q-page ref="page" @click="say">
        <div class="q-pa-md row justify-center">
          <div ref="chat" style="width: 100%; max-width: 400px">
            <q-chat-message
              v-for="ch in chatHistory"
              :key="ch.id"
              :text="[ch.text]"
              :sent="ch.sent"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import getUserMedia from 'get-user-media-promise'
import { Howl, Howler } from 'howler';

export default {
  name: 'unsighted',
  data(){
    return {
      text: 'Добро пожаловать в приложение! Куда Вы хотите направиться?',
      mediaRecorder: null,
      audio: null,
      latlng: [],
      listening: false,
      recognized: '',
      curPath: [],
      offset: 0,
      stopped: false,

      chatHistory: [],

      qAddr: null,
      makePathQ: false,

      commands: [
        {
          reg: /следующие 3 действия/gm,
          fn: async () => {
            console.log(ar);

            const ar = this.curPath.slice(this.offset, 3);
            if(ar){
              await this.aFor(this.curPath.slice(this.offset, 3), this.play, 0);
              this.offset += 3;
            }else{
              await this.play('Действий нет');
            }
          }
        },
        {
          reg: /предыдущие 3 действия/gm,
          fn: async () => {
            this.offset -= 3;
            const ar = this.curPath.slice(this.offset, 3);
            if(ar){
              await this.aFor(this.curPath.slice(this.offset, 3), this.play, 0);
            }else{
              await this.play('Действий нет');
            }
          }
        },
        {
          reg: /да$/gm,
          fn: async () => {
            await this.getPath(this.qAddr);
          }
        },
        {
          reg: /нет$/gm,
          fn: async () => {
            this.qAddr = null;
            this.makePathQ = false;
            await this.play('Отменено');
            this.stopListening();
          }
        },
        {
          reg: /стоп$/gm,
          fn: async () => {
            this.stopped = true;
          }
        },
        {
          reg: /тест$/gm,
          fn: async () => {
            await this.play('тест');
          }
        }
      ]
    }
  },

  mounted() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      this.setLocation(position.coords.latitude, position.coords.longitude);
    });
  },

  watch: {
    async recognized(val){
      console.log(val);
      let found = false;
      this.stopped = false;

      this.chatHistory.push({
        id: this.chatHistory.length,
        text: val,
        sent: true
      });

      await Promise.all(this.commands.map(
        async (item) => {
          try{
            const result = val.match(item.reg);

            console.log(result);

            if(result){
              found = true;
              await item.fn();
            }
          }catch(e){
            console.log(e);
          }
        }
      ));

      if(!found){
        await this.play('Желаете построить маршрут до '+val+'?');
        this.makePathQ = true;
        this.qAddr = val;
      }
      this.say();
    }
  },

  methods: {
    setLocation(lat, long){
      this.latlng = [long, lat];
    },
    async say(){
      this.stopped = true;
      try{
        if(!this.listening){
          this.listening = true;
          const rec = await this.startListening();
        }else{
          this.listening = false;
          this.stopListening();
        }
      }catch(e){
        console.log(e);
      }
    },

    play(text){
      return new Promise((resolve, reject) => {
        this.chatHistory.push({
          id: this.chatHistory.length,
          text,
          sent: false
        });

        let sound = new Howl({
          src: `https://spatialdata.work/api/synthesize.ogg?text=${encodeURI(text)}`,
          volume: 0.5,
          onend: resolve
        });

        sound.play();
      })
    },

    async startListening() {
      try{
        this.chunks = [];

        const stream = await getUserMedia({ video: false, audio: true });

        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        // console.log(this.mediaRecorder.state);

        this.mediaRecorder.ondataavailable = async (e) => {
          const data = new FormData();

          data.append('audio', e.data);
          const res = await this.$axios.post('https://spatialdata.work/api/recognize', data);

          this.recognized = res.data.result;
        }
      }catch(e){
        console.log(e);
      }
    },

    async stopListening(){
      this.mediaRecorder.stop();
    },

    async aFor(arr, callback, i = 0, restriction = 0){
      if(this.stopped) throw 'stopped';

      if(i < arr.length && (restriction ? i < restriction : 1)){
        await callback(arr[i]);
        await this.aFor(arr, callback, ++i);
      }
    },

    async getPath(pointTo){
      pointTo = 'Россия, Республика Татарстан, город Казань, ' + pointTo;

      const res = await this.$axios.get(
        `https://spatialdata.work/api/geo?start=${this.latlng}&finish=${pointTo}`);

      let coordinates = [];

      this.curPath = res.data.text;

      await this.play('Если хотите остановить перечисление действий, кликните по экрану.');
      await this.aFor(res.data.text, this.play);
            this.play('Перед запросом и после него кликните по экрану.');
            this.stopListening();
    }
  }
}
</script>

