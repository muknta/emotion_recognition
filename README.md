The website was Inspired by INT20H Hackaton.

This webapp was created using Django framework. 

<h1>Django 2.1.5</h1>
<p>Site contains 3 templates.</p>
<p>There are base.html, that spread to all other templates, index.html - main page, album.html - contains photos and filter for photos by emotions.</p>

<h1>DATABASE</h1>
<p>We were using sqlite3 database. It contains two tables: faces, photos. </p>

<p>Also there are three Python scripts:
 <p>1. album_download.py
    Contains function which provides availability of certain photos from flickr.com to other scripts by storing there urls in a database. </p>
<p> 2. face_nice.py
    Contains function which fills the database with photo-analysis results provided by facial recognition service Detect API by faceplusplus.com.</p>
<p> 3. twelve_threads.py
    Calls the above functions. Utilizes multithreading.</p>
 </p>

<p>For more detailed desciption view comments in there code.</p>
<h1> OPENING APP </h1>
 <p><p> To open our webapp go to console and open manage.py (emotion_recognition/emotion_recogn/manage.py) with runserver parameter: </p>
 <p>  "python manage.py runserver" </p>

In case it won't run, it might be necessary to download some packages (e.g. djangorestapi). Use pip for this purpose.
</p>



ABOUT US.
We are a team of aspiring students from KPI.

Our githubs:
	Nikita: https://github.com/heknt
	Nazar: https://github.com/NazarKostetskiy
	Bohdan: https://github.com/deepwebhoax
	Dmitro: https://github.com/LuSTiK-2017


