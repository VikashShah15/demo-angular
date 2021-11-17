import { Subscription } from 'rxjs';
import _ from 'lodash';

/**
 * To unsubscribe from all the subscriptions
 * Generally to call when components gets destroyed
 */
export function unsubscribeCollection(subscriptions: Subscription[]): void {
  if (subscriptions) {
    _.each(subscriptions, (sub) => {
      if (!_.isUndefined(sub)) {
        sub.unsubscribe();
      }
    });
  }
}
