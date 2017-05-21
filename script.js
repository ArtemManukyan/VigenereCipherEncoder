window.onload = function() {

	// Initialize

	if (!location.hash)	location.hash = 'encode';
	
	document.getElementById(location.hash.substr(1) + '-b').classList.add('chosen');
	document.getElementById(location.hash.substr(1) + '-c').removeAttribute('hidden');

	// Button classes and forms rotator

	function changeFunction(e) {
		var chosen = e.target;
		var unchosen = e.target.previousElementSibling ? e.target.previousElementSibling : e.target.nextElementSibling;
		chosen.classList.add('chosen');
		unchosen.classList.remove('chosen');
		document.getElementById(chosen.id.replace(/b$/, 'c')).removeAttribute('hidden');
		document.getElementById(unchosen.id.replace(/b$/, 'c')).setAttribute('hidden', 'true');
	}

	document.getElementById('encode-b').addEventListener('click', changeFunction);
	document.getElementById('decode-b').addEventListener('click', changeFunction);

	// Submit

	document.getElementsByTagName('main')[0].addEventListener('submit', function(e) {
		e.preventDefault();
		var outputVal = document.getElementById('output-value');
		var str = e.target.querySelector('textarea').value;
		var key = e.target.querySelector('input[type="text"]').value;
		var abc = e.target.querySelector('select')[e.target.querySelector('select').selectedIndex].innerHTML;
		var operation = e.target.id === 'encode-c' ? 'encode' : 'decode';
		outputVal.innerHTML = coder(str, key, abc, operation);
		if (outputVal.innerHTML)
			outputVal.parentNode.removeAttribute('hidden');
		else
			outputVal.parentNode.setAttribute('hidden', 'true');
	});

}

// Encoders and decoders themself

function coder(str, key, abc, operation) {

	var interimValue = (function(){
		var interimValue = '', count = 0;
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i).search(/(?:\W|\s)/) === 0)
				interimValue += str.charAt(i);
			else {
				var val = key.charAt(count);
				var ind = abc.indexOf(val);
				interimValue += val;
				count++;
				if (count >= key.length) count = 0;
			}
		}
		return interimValue;
	})();

	function vEncode() {
		var encodedValue = '';
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i).search(/(?:\W|\s)/) !== 0) {
				var abcIndStr = abc.indexOf(str.charAt(i)),
				abcIndInterim = abc.indexOf(interimValue.charAt(i)),
				newInd = abcIndInterim + abcIndStr;
				newInd = newInd < abc.length ? newInd : newInd - abc.length;
				encodedValue += abc.charAt(newInd);
			}
			else encodedValue += str.charAt(i);
		}
		return encodedValue;
	};

	function vDecode() {
		var decodedValue = '';
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i).search(/(?:\W|\s)/) !== 0) {
				var abcIndStr = abc.indexOf(str.charAt(i)),
				abcIndInterim = abc.indexOf(interimValue.charAt(i)),
				newInd = abcIndStr - abcIndInterim;
				newInd = newInd >= 0 ? newInd : newInd + abc.length;
				decodedValue += abc.charAt(newInd);
			}
			else decodedValue += str.charAt(i);
		}
		return decodedValue;
	};


	if (operation === 'encode') return vEncode(str);
	else return vDecode(str);

}