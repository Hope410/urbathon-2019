<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div>Hi!</div>
        <q-btn color="primary" @click="startListening">Cтарт!</q-btn>
        <q-btn color="primary" @click="stopListening">Стоп!</q-btn>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import getUserMedia from 'get-user-media-promise'

export default {
  name: 'unsighted',
  data(){
    return {
      mediaRecorder: null,
      audio: null
    }
  },


  mounted() {
    this.play();
  },

  methods: {
    async play(){
      try{
        this.audioPlayer = new Audio();
        this.audioPlayer.autoplay = true;

        // console.log(this.audioPlayer);
        const { data } = this.$axios.get(`/synthesize.ogg?text=${encodeURI(this.text)}`);

        this.audioPlayer.srcObject = data;

        await this.audioPlayer.load();
        await this.audioPlayer.play();
      }catch(e){
        console.log(e);
      }
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
          await this.$axios.post('/recognize', data);
        }
      }catch(e){
        console.log(e);
      }
    },

    async stopListening(){
      this.mediaRecorder.stop();
    },
  }
}
</script>

