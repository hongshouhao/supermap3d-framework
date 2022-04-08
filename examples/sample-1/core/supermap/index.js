import '@sipsd/supermap3d-framework/lib/supermap3d-framework.css';
import registerIQuery from '../iquery';
import supermap3d from '@sipsd/supermap3d-framework';

export default {
  install: function (Vue, callback) {
    Vue.prototype.$api.jonemap
      .getMapConfig({
        method: 'get',
        params: {
          appCode: process.env.VUE_APP_ONEMAP_ID,
        },
      })
      .then(({ data }) => {
        let layers = data[0].mapLayerJson.layers.filter(
          (f) => f.label || f.name
        );
        let config = data[0].mapLayerJson;
        config.layers = layers;

        registerIQuery(Vue, config);

        Vue.use(supermap3d, config);

        if (callback) {
          callback();
        }
      });
  },
};
