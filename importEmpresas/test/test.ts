import { handler } from '../src/handler.js';

(async () => {
  const res = await handler({});
  console.log('Resultado:', res);
})();
