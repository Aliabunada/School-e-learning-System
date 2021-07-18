'use strict';
var notUndefinedNotNull = function (data) {
    if (undefined !== data && null !== data) {
      return true;
    } else {
      return false;
    }
  };
  exports.notUndefinedNotNull = notUndefinedNotNull;
  