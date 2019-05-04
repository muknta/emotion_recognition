# emotion_recognition
*[RELEASE](https://olephirs.herokuapp.com/)*

The website was inspired by INT20H Hackathon.

## Django 2.1.5
Site contains 3 templates.

There are *base.html*, that spread to all other templates, *index.html* - main page, *album.html* - contains photos and filter for photos by emotions.
	
Filter acts on the face emotions(>9%).

## Database
We were using sqlite3 database (standard Django db). It contains two tables: faces, photos.

## Python scripts
* album_download.py
  
  Contains function which provides availability of certain photos from *flickr.com* to other scripts by storing there urls in a database.
* face_nice.py
  
  Contains function which fills the database with photo-analysis results provided by facial recognition service Detect API by *faceplusplus.com*.
* twelve_threads.py

  Calls the above functions. Utilizes multithreading.

For more detailed desciption view comments in there code.
## Locally running app
```bash
user@user:~$ python manage.py runserver
```
In case it won't run, it might be necessary to download packages from *requirements.txt*.
```bash
user@user:~$ pip install -r requirements.txt
```

## ABOUT US
We are a team of aspiring students from KPI.

Our githubs:
* Nikita: https://github.com/heknt
* Nazar: https://github.com/NazarKostetskiy
* Bohdan: https://github.com/deepwebhoax
* Dmitro: https://github.com/LuSTiK-2017
