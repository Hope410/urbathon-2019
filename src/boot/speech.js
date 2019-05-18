import axios from 'axios'

export default async ({ Vue }) => {
  const getToken = async () => {
    const { data } = await axios.get('https://gooddeed.me/noname4/iam/');
    return data;
  }

  Vue.prototype.$speech = {
    async synthesize(text){
      // const token = await getToken();
      const result = await axios.get(`/synthesize?text=${text}`);

      return result.data
    },

    async recognize(){

    }
  };
}
