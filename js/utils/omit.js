import _ from 'lodash';

export function omit(data, fields) {
  if (typeof fields === 'string')
    fields = [fields];

  _.each(fields, function(field) {
    _.each(data, function(value, key) {
      if (key === field) {
        delete data[key]
      } else if (_.isObject(value)) {
        omit(value, field);
      } else if (_.isArray(value)) {
        _.each(value, function(v) {
          omit(v, field);
        });
      }
    });
  });

  return data;
}

export default omit;