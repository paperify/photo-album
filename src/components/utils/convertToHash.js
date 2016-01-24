import _ from 'lodash';

export default function(items){
  return _.reduce(items, function (memo, value, key) {
    memo[key] = _.clone(value);
    return memo;
  }, {});
}
