var cmPriority = Packages.net.canarymod.plugin.Priority,
  cmCanary = Packages.net.canarymod.Canary,
  cmDispatcher = Packages.net.canarymod.hook.Dispatcher,
  cmRegisteredPluginListener = Packages.net.canarymod.plugin.RegisteredPluginListener,
  cmPluginListener = Packages.net.canarymod.plugin.PluginListener;
var cmHookExecutor = cmCanary.hooks();

exports.on = function( 
  /* Java Class */
  eventType, 
  /* function( registeredListener, event) */ 
  handler,   
  /* (optional) String (CRITICAL, HIGH, NORMAL, LOW, PASSIVE), */
  priority   ) {
  var handlerList,
    regd,
    eventExecutor;

  if ( typeof priority == 'undefined' ) {
    priority = cmPriority.NORMAL;
  } else {
    priority = cmPriority[priority.toUpperCase().trim()];
  }
  
  var result = { };
  eventExecutor = new cmDispatcher( {
    execute: function (l, evt) {
      handler.call(result, evt );
    }
  });
  /* 
   wph 20130222 issue #64 bad interaction with Essentials plugin
   if another plugin tries to unregister a Listener (not a Plugin or a RegisteredListener)
   then BOOM! the other plugin will throw an error because Rhino can't coerce an
   equals() method from an Interface.
   The workaround is to make the ScriptCraftPlugin java class a Listener.
   Should only unregister() registered plugins in ScriptCraft js code.
   */
  regd = new cmPluginListener({});
  cmHookExecutor.registerHook(regd, __plugin, eventType.class, eventExecutor, priority);
  result.unregister = function(){
    cmHookExecutor.unregisterPluginListener(regd);
  };
  return result;
};
