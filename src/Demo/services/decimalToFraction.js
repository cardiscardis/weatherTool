export function gcd(a, b) {
	return (b) ? gcd(b, a % b) : a;
}

var decimalToFraction = function (_decimal) {

	if (_decimal === 1) {
		return {
			top		: 1,
			bottom	: 1,
			display	: 1 + ':' + 1
		};
	}  else {

		var top		= _decimal.toString().replace(/\d+[.]/, '');
		var bottom	= Math.pow(10, top.length);
		if (_decimal > 1) {
			top	= +top + Math.floor(_decimal) * bottom;
		}
		var x = gcd(top, bottom);
		return {
			top		: (top / x),
			bottom	: (bottom / x),
			display	: Number(top / x).toFixed() + '/' + Number(bottom / x).toFixed()
		};
	}
};

export { decimalToFraction };