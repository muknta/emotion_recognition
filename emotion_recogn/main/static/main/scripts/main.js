// var contItems = document.getElementsByClassName("items-container");

function disBlock(id) {
	var item = document.getElementById(id);
	item.style.zIndex = "10";
}

function disHide(id) {
	var item = document.getElementById(id);
	item.style.zIndex = "0";
}

console.log("we are here");
var path = "/static/main/photos.db";

document.addEventListener("DOMContentLoaded", getAjax);
document.getElementById("moreBtn").addEventListener("click", getAjax);
var emotions = document.querySelectorAll("div.filter input");
for (var i = 0; i < emotions.length; i++) {
	emotions[i].addEventListener("click", clearForFilter);
}

const SHOW_PH_NUM = 1;
var minPh = 0;
var maxPh = SHOW_PH_NUM;

function getAjax() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.responseType = 'arraybuffer';

	xhr.addEventListener("load", loadRequest);
	xhr.addEventListener("error", errorRequest);
	xhr.send();
}

function clearForFilter() {
	minPh = 0;
	maxPh = SHOW_PH_NUM;
	document.getElementById("album").innerHTML = "";
	getAjax();
}


function loadRequest(evt) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	//var res = db.exec("SELECT name FROM sqlite_master where type='table'");
	var res = db.exec(getExecCmd());
	if (res[0]) {
		showMore(res, minPh, maxPh);
		minPh += SHOW_PH_NUM;
		maxPh += SHOW_PH_NUM;
	} else {
		moreBlockStatus(0, 0);
	}
	
	console.log(JSON.stringify(res));
	// document.getElementById("ex").innerHTML = data[0]["column"];
	// for (i = 0; i < res[0].values.length; i++) {
 //        // console.log(res[0].values[i] + ' ');
 //        document.getElementsByTagName("li")[0].innerHTML += '<img src="' + res[0].values[i][1] + '">;';
 //    }
};


function getExecCmd() {
	var str = "SELECT * FROM photos";
	var oldLen = str.length;
	for (var i = 0; i < emotions.length; i++) {
		console.log(str);
		if (emotions[i].checked) {
			str += (oldLen<str.length ?" AND ":" WHERE ")+ emotions[i].value +">9";
		}
	}
	return str;
}


function errorRequest() {
	alert("error via database openning");
};


function showMore(data, minNum, maxNum) {
	var len = (data[0] ? data[0].values.length : 0);
	var alb = document.getElementById("album");
	for (var i = minNum; i < (len>maxNum ? maxNum : len); i++) {
        // console.log(res[0].values[i] + ' ');
        alb.innerHTML += itemTextHtml(data, i);
    }
    moreBlockStatus(len, maxNum);
}


function moreBlockStatus(len, maxNum) {
	var moreBtn = document.getElementById("moreBtn");
	var phNumStatus = document.getElementById("phNumStatus");
	if (len > maxNum) {
		moreBtn.style.display = "inline-block";
		phNumStatus.innerHTML = maxNum +" / "+ len;
	} else {
		moreBtn.style.display = "none";
		phNumStatus.innerHTML = len +" / "+ len;
	}
}


const EMOT_NUM = 7;
function itemTextHtml(data, num) {
	var str = `<div id="item-`+ num +`" class="item" onmouseover="disBlock('item-`+ num +`')" onmouseout="disHide('item-`+ num +`')">
		<img class="photo" src="`+ data[0].values[num][1] +`" alt="photo" style="">
		<div class="hidden-specs">`;
	var dict = {};
	for(var i = 0; i < EMOT_NUM; i++) {
		dict[data[0].columns[i+2]] = data[0].values[num][i+2];
	}
	sortedObj = sortObj(dict);
	for(var i = 0; i < EMOT_NUM; i++) {
		str += `<p class="arcticle-content">
				<span class="descrip-text">`+ sortedObj[i][0] +`:</span> `+ sortedObj[i][1] +`%
			</p>`;
	}
	str += `</div>
		</div>`;
	return str;
}


function sortObj(obj) {
	var keyValues = [];
	for (var key in obj) {
		keyValues.push([ key, obj[key] ]);
	}
	keyValues.sort(function compare(kv1, kv2) {
		// This comparison function has 3 return cases:
		// - NegativePositive number: kv2 should be placed BEFORE kv1
		// - Positive number: kv2 should be placed AFTER kv1
		// - Zero: they are equal, any order is ok between these 2 items
		return kv2[1] - kv1[1];
	});
	return keyValues;
}