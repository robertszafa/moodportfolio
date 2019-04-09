from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _authenticate_user, _get_num_of_photos, _get_place
from base64 import b64decode
import os
import datetime



class Emotions(Resource):
    def post(self):
        user_id = _authenticate_user(request)
        latitude = request.json.get('latitude')
        longitude = request.json.get('longitude')
        now = datetime.datetime.now()
        now.strftime('%Y-%m-%d %H:%M:%S')

        # Split the data URI on the comma to get the base64 encoded data 
        # without the header. Call base64.b64decode to decode that to bytes. 
        # Last, write the bytes to a file.
        data_uri = request.json.get('dataUri')
        header, encoded = data_uri.split(",", 1)
        data = b64decode(encoded)
        
        # store the photo dataURI in a txt file .photos/{user_id}/{photo_index}.txt
        photo_index = f'{_get_num_of_photos(user_id) + 1}.txt'
        photo_uri_dir = f'photos/{user_id}/' 
        if not os.path.exists(photo_uri_dir):
            os.makedirs(photo_uri_dir)
        with open(photo_uri_dir + photo_index, "w") as f:
            f.write(data_uri)

        ############## CLASSIFY PHOTO HERE ###################################################
        # save as photos/{user_id}/{photo_index}.jpg (temporarily) and classify
        emotion = {}
        # photo_jpg_dir = f'photos/{user_id}/{photo_index}.jpg' 
        # with open(photo_jpg_dir, "wb") as f:
        #     f.write(data)
        #######################################################################################

        # get city, country
        country = ''
        city = ''
        if latitude and longitude:
            country, city = _get_place(latitude, longitude)
        
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO Photo(userID, timestamp, path, emotion, city, country) VALUES(%s, %s, %s, %s, %s, %s)",
                    (user_id, now, photo_uri_dir, emotion, city, country))
        mysql.connection.commit()
        cur.close()


        return jsonify({'status': 'success', 'emotion' : emotion})
