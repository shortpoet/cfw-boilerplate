import { AppConfig } from 'vue';

export const onErrorClient: AppConfig['errorHandler'] = (err, instance, info) => {
  // handle error, e.g. report to a service
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(`[ui] [app] [errorHandler] err:`);
  console.log(err);
  console.log(`[ui] [app] [errorHandler] instance:`);
  console.log(instance);
  console.log(`[ui] [app] [errorHandler] info:`);
  console.log(info);
};
