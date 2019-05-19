<template>
  <q-page>
    <div class="map-container">
      <l-map
        style="height: 100%; width: 125%"
        :zoom="zoom"
        :center="center"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
      >
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker v-if="markerLatLng.length == 2" :lat-lng="markerLatLng" ></l-marker>
        <l-polyline
          :lat-lngs="path.latlngs"
          :color="path.color" />
      </l-map>
    </div>

    <helper-panel
      class="main-card fixed-bottom-right"
      style="z-index: 400;"
      v-model="pathPoints"
      :build="getPath" />
  </q-page>
</template>

<style scoped>
  .map-container {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
  }
</style>

<script>
import HelperPanel from '../components/HelperPanel'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'

export default {
  name: 'sighted',
  components: { LMap, LTileLayer, LMarker, HelperPanel, LPolyline },
  data(){
    return {
      pathPoints: {
        pointFrom: '',
        pointTo: ''
      },
      path: {
        latlngs: [],
        color: 'green'
      },
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 3,
      center: [47.413220, -1.219482],
      bounds: null,
      markerLatLng: [ ],
      geolocInterval: null
    }
  },

  watch: {
    // async 'pathPoints.pointTo'(val){
    //   await this.getPath(val);
    // }
  },

  mounted(){
    this.zoom = this.$q.cookies.get('zoom') || 3;
    this.center = this.$q.cookies.get('center') || [47.413220, -1.219482];
    this.bounds = this.$q.cookies.get('bounds') || null;

    this.geolocInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.pathPoints.pointFrom = 'Мое местоположение';
        this.markerLatLng = [position.coords.latitude, position.coords.longitude];
      });
    }, 5000);
  },

  methods: {
    zoomUpdated (zoom) {
      this.$q.cookies.set('zoom', zoom);
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.$q.cookies.set('center', center);
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.$q.cookies.set('bounds', bounds);
      this.bounds = bounds;
    },

    async getPath(){
      let { pointFrom, pointTo } = this.pathPoints;
      if(pointFrom == 'Мое местоположение'){
        if(this.markerLatLng.length){
          pointFrom = this.markerLatLng.reverse();
        }else{
          pointFrom = 'Россия, Республика Татарстан, город Казань, ул Баумана, дом 70';
        }
      }else{
        pointFrom = 'Россия, Республика Татарстан, город Казань, ' + pointFrom;
      }

      pointTo = 'Россия, Республика Татарстан, город Казань, ' + pointTo;

      const res = await this.$axios.get(
        `http://spatialdata.work/api/geo?start=${pointFrom}&finish=${pointTo}`);

      let coordinates = [];

      res.data.geo.legs[0].steps.forEach((step) => {
        coordinates = coordinates.concat(step.geometry.coordinates)
      });

      this.path.latlngs = coordinates.map(c => c.reverse());
      console.log(res);
    }
  }
}
</script>
