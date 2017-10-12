(function universalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require("jQuery"));
  else if(typeof define === 'function' && define.amd)
    define(["jQuery"], factory);
  else if(typeof exports === 'object')
    exports["c"] = factory(require("jQuery"));
  else
    root["c"] = factory(root["$"]);
})(this, function($) {
  return 'c';
});
