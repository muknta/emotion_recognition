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

# Free version limits.
max_faces = 5

def evaluate_emotions(db_path):
    """
    Given the database db_path having "photos" table with photo_id, photo_url
    and anger, disgust, fear, happiness, neutral, sadness, surprise columns
    evaluates emotions columns using Detect API by Face++.

    An emotion value of a photo is the mean of this emotion's values of all faces.
    """
    # Connecting to database
    con = sqlite3.connect(db_path)

    # Iterating through all the photos in "photos" table
    cur = con.cursor()
    data = cur.execute('SELECT photo_id, photo_url from photos').fetchall()
    cur.close()
    for id_url in data:
        print(time.time())
        # Making a POST request. r contains the response
        d = {'api_key': key, 'api_secret': secret, 'image_url': id_url[1], 'return_attributes':'emotion'}
        r = requests.post(facepp_url, data=d)
        while r.status_code!=200:
            r = requests.post(facepp_url, data=d)

        # Extracting faces' emotions values from response json.
        faces_count = len(r.json()['faces'])
        #print(time.time())
        if faces_count==0:
            continue
        faces = [face["attributes"]["emotion"] for face in r.json()['faces'][:max_faces]]

        # Finding mean emotions of faces
        emotions = {key: sum([face[key] for face in faces])/float(len(faces)) for key in faces[0].keys()}

        # Updating the database by updating emotions' values
        cur = con.cursor()
        cur.execute("""UPDATE photos
                     SET anger = ? ,disgust = ?,fear = ?,happiness = ?,neutral = ?,sadness = ?,surprise = ?
                     WHERE photo_id = ?""",
                        (emotions['anger'], emotions['disgust'], emotions['fear'], emotions['happiness'],
                         emotions['neutral'], emotions['sadness'], emotions['surprise'], id_url[0]))
        con.commit()
        cur.close()
    con.close()

