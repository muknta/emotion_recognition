// var contItems = document.getElementsByClassName("items-container");

function dispBlock(id) {
	var item = document.getElementById(id);
	item.style.display = "block";
}

function multiDispNone(selector) {
	var items = document.querySelectorAll(selector);
	for (var i = 0; i < items.length; i++) {
		items[i].style.display = "none";
	}
}

function dispNone(id) {
	var item = document.getElementById(id);
	item.style.display = "none";
}

function showModal(elem, modalId, modalImgId){
	var modal = document.getElementById(modalId);
	var modalImg = document.getElementById(modalImgId);
	modal.style.display = "block";
	modalImg.src = elem.src;
}

function hideModal(modalId){
	var modal = document.getElementById(modalId);
	modal.style.display = "none";
}


var dbPath = "/static/main/photos.db";
const URL_TABLE = "photos";
const FACE_TABLE = "faces";

const SHOW_PH_NUM = 36;
var minPh = 1;
var maxPh = SHOW_PH_NUM;

document.addEventListener("DOMContentLoaded", getAjax);
document.getElementById("moreBtn").addEventListener("click", getAjax);
var emotions = document.querySelectorAll("div.filter input");
for (var i = 0; i < emotions.length; i++) {
	emotions[i].addEventListener("click", function(){
		clearForFilter();
		getAjax();
	});
}
var ajaxInter;
document.getElementById("update").addEventListener("click", function(){
	clearForFilter();
	for (var g=0;g<30;g++) {
		demo();
		getAjax();
	}
	// ajaxInter = setInterval(getAjax, 2000);
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
}


function getAjax() {
	console.log("we are here");
	var xhr = new XMLHttpRequest();
	xhr.open('GET', dbPath, true);
	xhr.responseType = 'arraybuffer';

	xhr.addEventListener("load", loadRequest);
	xhr.addEventListener("error", errorRequest);
	xhr.send();
}

function clearForFilter() {
	minPh = 0;
	maxPh = SHOW_PH_NUM;
	document.getElementById("album").innerHTML = "";
}


function loadRequest(evt) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	//var res = db.exec("SELECT name FROM sqlite_master where type='table'");
	var urlData = db.exec("SELECT * FROM photos");
	if (urlData[0]) {
		showMore(db, urlData);
		minPh += SHOW_PH_NUM;
		maxPh += SHOW_PH_NUM;
	} else {
		moreBlockStatus(0, 0);
	}
	
	console.log(JSON.stringify(urlData));
	// document.getElementById("ex").innerHTML = data[0]["column"];
	// for (i = 0; i < res[0].values.length; i++) {
 //        // console.log(res[0].values[i] + ' ');
 //        document.getElementsByTagName("li")[0].innerHTML += '<img src="' + res[0].values[i][1] + '">;';
 //    }
};

function errorRequest() {
	alert("error via database openning");
};


function showMore(db, urlData) {
	var faceData;
	var len = (urlData[0] ? urlData[0].values.length : 0);
	var maxPagePh = (len>maxPh ? maxPh : len);
	var maxPh2 = maxPh;
	var alb = document.getElementById("album");
	for (var i = minPh-1; i < maxPagePh; i++) {
        // console.log(res[0].values[i] + ' ');
        if (urlData[0].values[i]) {
        	var phIdUrlData = urlData[0].values[i][0];
	        var execCmd = getFaceExecCmd(phIdUrlData);
	        faceData = db.exec(execCmd);
	        if (faceData[0] == null && execCmd.includes(" AND ")) {
				urlData = db.exec(getUrlExecCmd(phIdUrlData));
				len--;
				maxPagePh++;
				maxPh++;
				minPh++;
			} else {
				alb.innerHTML += itemTextHtml(urlData, faceData, i);
	    	}
        } else {
        	alert("asdddddsad");
        	len--;
        	break;
        }
    }
    moreBlockStatus(len, maxPh2);
}
 

function getFaceExecCmd(photoId) {
	var str = "SELECT * FROM "+ FACE_TABLE +" WHERE photo_id IS "+ photoId;
	var oldLen = str.length;
	for (var i = 0; i < emotions.length; i++) {
		console.log(str);
		if (emotions[i].checked) {
			str += " AND "+ emotions[i].value +">9";
		}
	}
	// str += (oldLen<str.length ?" AND ":" WHERE ")
	// 	+ "rowid BETWEEN "+ minPh +" AND "+ maxPh;
	return str;
}


function getUrlExecCmd(photoId) {
	var str = "SELECT * FROM "+ URL_TABLE +" WHERE photo_id IS NOT "+ photoId;
	return str;
}


function moreBlockStatus(len, maxPhNum) {
	var moreBtn = document.getElementById("moreBtn");
	var phNumStatus = document.getElementById("phNumStatus");
	if (len > maxPhNum) {
		moreBtn.style.display = "inline-block";
		phNumStatus.innerHTML = maxPhNum +" / "+ len;
	} else {
		moreBtn.style.display = "none";
		phNumStatus.innerHTML = len +" / "+ len;
	}
}


function itemTextHtml(urlData, faceData, urlNum) {
	var str = `<div id="item-`+ urlNum +`" class="item">
		<img id="thumb-`+ urlNum +`" class="thumb"
			src="`+ urlData[0].values[urlNum][1] +`" onclick="showModal(this,'modal-`+ urlNum +`','modal-img-`+ urlNum +`')">
		<div id="modal-`+ urlNum +`" class="modal">
			<span id="close-btn-`+ urlNum +`" class="close-btn" onclick="hideModal('modal-`+ urlNum +`'); multiDispNone('.hidden-emot')">&times;</span>
			<img class="modal-img" id="modal-img-`+ urlNum +`" usemap="#ph-detail-`+ urlNum +`">`;

	// if doesn't have faces/emotions
	if (faceData[0] == null) {
		str += `<span>Faces are faceless :c</span><hr>`;
	} else {
		str += `<map name="ph-detail-`+ urlNum +`">`;
		var x, y, R;

		for(var i = 0; i < faceData[0].values.length; i++) {
			// rectangle
			// x1 = faceData[0].values[i][10];
			// y1 = faceData[0].values[i][9];
			// x2 = x1 + faceData[0].values[i][8];
			// y2 = y1 + faceData[0].values[i][11];
			// "circle"
			x = faceData[0].values[i][10]/1.4;
			y = faceData[0].values[i][9]/1.5;
			R = (faceData[0].values[i][8] + faceData[0].values[i][11])/2;

			str += `<area id="area-`+ urlNum +`-`+ i +`"
				shape="circle" coords="`+ x +`,`+ y +`,`+ R +`"
				onmouseover="multiDispNone('.hidden-emot'); dispBlock('h-em-`+ urlNum +`-`+ i +`')"
				alt="link" title="`+getRandTitle()+`">`;
		}
		str += `</map>`;
		var sortedObj = [];
		var dict = {};

		for(var i = 0; i < faceData[0].values.length; i++) {
			for(var j = 1; j < emotions.length+1; j++) {
				dict[faceData[0].columns[j]] = faceData[0].values[i][j];
			}
			sortedObj = sortObj(dict);

			str += `<div id="h-em-`+ urlNum +`-`+ i +`" class="hidden-emot">`;
			for(var j = 0; j < emotions.length; j++) {
				str += `<p class="arcticle-content">
						<span class="descrip-text">`+ sortedObj[j][0] +`:</span> `+ sortedObj[j][1].toFixed(3) +`%
					</p>`;
			}
			str += `</div>`
		}
	}
	str += `</div>
		</div>`;
	return str;
}

var emotCode = [{"sadness":"&#x1F614", "neutral": "&#x1F611", "disgust": "&#128078", "anger": "&#x1F620", "surprise": "&#x1F62E", "fear": "&#x1F631", "happiness": "&#x1F601"}];
function getRandTitle() {
	var randomPhrases = ["LOOOOOOOOOOOL","Ooh, so cute)","It's awful!","Bad idea, man!","So hungry..","Sadly, but..","Whats up?",":c","))0)00))00","AHAHAHAHAHAHA","wow, hackathon"]
	return randomPhrases[getRandInt(0, randomPhrases.length)]
}

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
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



// hightlight area of map
// $('.modal-img').maphilight();