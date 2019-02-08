console.log("we are here");
var path = "/static/main/photos.db";
//var path = "016sqlite_files/Chinook_Sqlite.sqlite"
var xhr = new XMLHttpRequest();
xhr.open('GET', path, true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	//var contents = db.exec("SELECT name FROM sqlite_master where type='table'");
	var contents = db.exec("SELECT * FROM photo");
	console.log(JSON.stringify(contents));
	var data = JSON.stringify(contents);
	// document.getElementById("ex").innerHTML = data[0]["column"];
	for (i = 0; i < contents[0].values.length; i++) {
        console.log(contents[0].values[i] + ' ');
    }
};
xhr.send();


xhr.onload = function(e) {
	var uInt8Array = new Uint8Array(this.response);
	var db = new SQL.Database(uInt8Array);
	//var contents = db.exec("SELECT name FROM sqlite_master where type='table'");
	var contents = db.exec("SELECT * FROM photo");
	console.log(JSON.stringify(contents));
	var data = JSON.stringify(contents);
	// document.getElementById("ex").innerHTML = data[0]["column"];
	for (i = 0; i < contents[0].values.length; i++) {
        // console.log(contents[0].values[i] + ' ');
        document.getElementById("ex").innerHTML += contents[0].values[i];
    }
};
xhr.send();
