(function universalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require("lib.jQuery"));
  else if(typeof define === 'function' && define.amd)
    define(["lib.jQuery"], factory);
  else if(typeof exports === 'object')
    exports["c"] = factory(require("lib.jQuery"));
  else
    root["c"] = factory(root["$"]);
})(this, function($) {
  return 'c';
});
