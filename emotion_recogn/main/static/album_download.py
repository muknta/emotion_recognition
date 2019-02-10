import flickrapi, sqlite3
from requests import get

api_key = "13499edc8577a240cc77fee8f6b7059d"
api_secret = "2ecddde1014a44a6"
flickr = flickrapi.FlickrAPI(api_key, api_secret)
#given data
set_id = "72157674388093532"
user_id = "144522605@N06"
tag_name = "#int20h"


def get_photos_url(db_path):
    album_url(db_path, set_id)
    tagBy_url(db_path, tag_name)


def download(url, file_name):
    # open in binary mode
    with open(file_name, "wb") as file:
        # get request
        response = get(url)
        # write to file
        file.write(response.content)
        print("Cool!")


def album_url(db_path, set_id):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    for photo in flickr.walk_set(set_id):
        farm_id = photo.get('farm')
        server_id = photo.get('server')
        photo_id = photo.get('id')
        photo_secret = photo.get('secret')
        #making url of photo
        photo_url = "http://farm%s.staticflickr.com/%s/%s_%s_b.jpg" % (farm_id, server_id, photo_id, photo_secret)
        try:
            cur.execute("INSERT INTO photos(photo_id, photo_url) VALUES('%s', '%s')" % (photo_id, photo_url))
            print("Saved one")
        except sqlite3.Error: print('This photo in db already')
        con.commit()
    print('All data from album saved')
    cur.close()
    con.close()

def tagBy_url(db_path, tag_name):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    photos_by_Tag = flickr.walk(text="#int20h", per_page=100)
    for photo in photos_by_Tag:
        farm_id = photo.get('farm')
        server_id = photo.get('server')
        photo_id = photo.get('id')
        photo_secret = photo.get('secret')
        #making url of photo
        photo_url = "http://farm%s.staticflickr.com/%s/%s_%s_b.jpg" % (farm_id, server_id, photo_id, photo_secret)
        try:
            cur.execute("INSERT INTO photos(photo_id, photo_url) VALUES('%s', '%s')" % (photo_id, photo_url))
            print('Saved one')
        except sqlite3.Error: print('This photo in db already')
        con.commit()
    print('All data by tag saved')
    cur.close()
    con.close()
