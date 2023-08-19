import { Application } from 'express';

import corsLoader from './corsLoader';
import expressLoader from './expressLoader';
import i18nLoader from './i18nLoader';

export default ({ app }: { app: Application }): void => {
  corsLoader({ app });
  i18nLoader({ app });
  expressLoader({ app });
};
