
import * as utiles from './src/utils';
import * as components from './src/components';

export const Utiles = {
  ...utiles
}

export const Components = {
  ...components
}

export * from './src/utils';
export * from './src/components';

export default {
  ...utiles.default,
  ...components
};