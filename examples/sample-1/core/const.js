import { pubsub } from '@/utils/pubsub.js';

const CONST = {
  AppId: 'zrzy_nq',
};

const App = {
  CONST: CONST,
  pubsub: pubsub,
};

window.App = App;

export default App;
