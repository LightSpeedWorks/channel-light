void function () {
	'use strict';

	var slice = [].slice;

	// Channel
	function Channel() {
		var callbacks = slice.call(arguments), values = [];
		return function channel(first) {
			try {
				var args = slice.call(arguments);
				if (typeof first === 'function')
					args.forEach(function (func) {
						if (values.length) func.apply(channel, values.shift());
						else callbacks.push(func);
					});
				else if (first && typeof first.then === 'function')
					first.then(channel, channel);
				else {
					if (first != null && !(first instanceof Error))
						args = [null].concat(args);
					if (args.length > 2) args = [args[0], args.slice(1)];
					if (callbacks.length) callbacks.shift().apply(channel, args);
					else values.push(args);
				}
			} catch (err) {
				channel(err);
			}
			return channel;
		}
	}

	if (typeof module === 'object' && module && module.exports)
		module.exports = Channel;

	if (typeof window === 'object' && window)
		window['channel-light'] = window.Channel = Channel;

}();
