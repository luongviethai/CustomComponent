const uninstall = () => {
	delete global.requestAnimationFrame;
	delete global.cancelAnimationFrame;
};

const install = () => {
	if (typeof window === "undefined") {
		return;
	}
	let lastTime = 0;
	const vendors = ["ms", "moz", "webkit", "o"];

	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
		window.cancelAnimationFrame =
			window[vendors[x] + "CancelAnimationFrame"] ||
			window[vendors[x] + "CancelRequestAnimationFrame"];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (callback) {
			const currTime = new Date().getTime();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = window.setTimeout(() => {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}

	global.requestAnimationFrame =
		global.requestAnimationFrame || window.requestAnimationFrame;
	global.cancelAnimationFrame =
		global.cancelAnimationFrame || window.cancelAnimationFrame;
};

export default { install, uninstall };
