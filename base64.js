/*! https://mths.be/base64 v1.0.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '1.0.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAEiElEQVR4AeWXA4xkWRhGK1jb6plgNYw33Ghstd2vXK9tW9O2Uu2xbc/EXjPajVYdrRvf/vnvy913X3VNWuHcU43onKuS7dEY/pD2sq57AxNjkwdxEKOT/RPt95pKO0OWQr2yY2jo70MQHJQcYPx/NQ81r1iwfHx531eHwcjAKcIISNq/bFk2b/nQc923jpJYCZD8HmFNjNNPy82KZ%2Beh71o7NnUER%2BYaYPxT1SvnqnccJbk1IDht6AMDY0Rd4lz0fUcRPEDq4AGiuGgOsydwfEGBcmjQP3ro3gv9XTzAeSXQi2rkIA1eeOh3NirRowZYnwQ7HJOprwW9OeJoT%2BABcU3K20jphpfx8W8P4UQKmkwBmj3pnYTrx4rHZ5//LdIzF0h/nOVDyGGtziQTOuHjkBsuZGBA6h1CD6Jw1qcVy5Xj7Sahl8Up/EOIBCNW4kU7KljvMpH6fECg50tSKnTz3IU4VeplAD5OuOEkuZi5WwacvQGvOVb9EKmEPpX11gBvE%2BNhtcDQE8mvKIH2QWsgG97gejVgoAY8ceoK/lb1bbz3Zr2OeIRiD3bT71jSCb0acJkCrk9N%2Br53DkENpIntkXon9mEXsZPYQeyGZgm4lYCDyHtOBtpKD8FMH8/QrN9t1jPboQXfIA54NspA5101UCPvDwFdzl4N7CalOn814CqRgb4JNZArTsAgXtFvZ7YRWxFllTJ2hv67LgPD/F57ihCBdHhNT6xQqS/AGVwyuGjiggp5qinh/F4Gxll/jziNg4SP4Gcvs0fO/hTOKZw1cUZymjiBRGh/WAPy3cpL6IZex26Si10/Nge9CBxBApJmZGBIbtFBJgMUkITKY02XCUVPWPX5iEfiPzLQM8FiSR5fU90gluSCbdhCbMQmg43EBmI9sxMxBrEgPZJ%2BloHWu/S6bgrUKAEvdhsr2MaJrdgsMWVIrDFJjAb7DRnYX0IBE31wGZvkYzTlcm6RcEJG7OKKMqSHI%2Bf/FbxDWgXxHib0XiKO9RyQcEJG9gY8E9xvmV6N%2Bv9SA628BjOxQi6xriHJonf8rbyaNgySViEHHkJJBJs9EUpiNeAcUAJ1K6wBP3S4La%2BYMUH0W9XtYRzv2dTR8sU4VLrhJjwKsSxX9VvU2TPalzbrqFk2hsCEDpdJ7yZiLPrtSFX1jDbb5%2B39twwxTuMSjvB/fmRTws1ygQvRLBeEIpnVbqRDl/rEmyy0jopnB6bGMIZDuENcxBgzjnakwal8Zohi%2BR6Su8TcSZ9HuMTsJzOfUs1yVK0eYeVNCpwG6WWkD9XII42XSKP/MpAq5QSl8pDN%2BiTEP%2BxjfKUmhIekXEV8Ch0l6i03xylmD00LopaH3TNq1bJSRSbUo4VnbA7fEMoSR4KqjxGjBiOog1PRZ1TY5jZKV/dPKWKpv00cYzlDCfnKA/3jubjljaq7MRIQOGoERkzUUkJD2ve%2Bl2zzHfnLG7%2ByRo4p%2BmFiCEU/eNfYFjoKV1T4u/%2BijJRKSN35V9lg9grb4kdeSHFZzZ2W37onBzCA7smW36rvFpalhtgeifEfp0PssabLta4AAAAASUVORK5CYII%3D" aria-hidden="true" width="24" height="24" alt="" class="' + _.I("stUf5b") + " " + _.I("TrZEUc")]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));
