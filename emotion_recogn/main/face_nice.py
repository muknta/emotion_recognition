from os import listdir
import json
import requests
from requests_toolbelt import MultipartEncoder
import sqlite3
import time

# Request target url.
facepp_url = 'https://api-us.faceplusplus.com/facepp/v3/detect'

# My personal face++ user keys.
key = "xSEonOy5LV3UxX8TCjxA4cuB-2rDfWxk"
secret = "klLItU8XQ32F0u-mh8Wvf5o5PDRI4zss"

photos_count = 289
# Free version limits.
max_faces = 5

# start - start index (for multithreading)
def evaluate_emotions(db_path, start, thread_count):
    """
    Given the database db_path having photos_count "photos" table with photo_id, photo_url
    and faces table with anger, disgust, fear, happiness, neutral, sadness,
    surprise, width, top, left, height columns
    creates records in faces using Detect API by Face++.

    An emotion value of a photo is the mean of this emotion's values of all faces.
    """
    # Connecting to database
    con = sqlite3.connect(db_path)
    ri = start
    while ri<photos_count:
        # Getting photo id and url
        cur = con.cursor()
        id_url = cur.execute("SELECT photo_id, photo_url FROM photos WHERE rowid=?", (ri,)).fetchone()
        cur.close()

        # Making a POST request. r contains the response
        d = {'api_key': key, 'api_secret': secret, 'image_url': id_url[1], 'return_attributes':'emotion'}
        r = requests.post(facepp_url, data=d)
        while r.status_code!=200:
            r = requests.post(facepp_url, data=d)

        # Extracting faces' emotions values from response json.
        faces_count = len(r.json()['faces'])
        if faces_count!=0:
            emotions = [face["attributes"]["emotion"] for face in r.json()['faces'][:max_faces]]
            rectangles = [face["face_rectangle"] for face in r.json()['faces'][:max_faces]]

            # Filling recognized faces' emotions and coordinates into faces table
            cur = con.cursor()
            for i in range(len(emotions)):
                cur.execute("""INSERT INTO faces
                             VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                            (id_url[0], emotions[i]['sadness'], emotions[i]['neutral'], emotions[i]['disgust'],
                             emotions[i]['anger'], emotions[i]['surprise'], emotions[i]['fear'], emotions[i]['happiness'],
                             rectangles[i]['width'], rectangles[i]['top'],rectangles[i]['left'], rectangles[i]['height']))
            con.commit()
            cur.close()
        print(ri, start)
        ri+= thread_count
