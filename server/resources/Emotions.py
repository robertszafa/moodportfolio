from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _authenticate_user
from base64 import b64decode




class Emotions(Resource):
    def post(self):
        # Split the data URI on the comma to get the base64 encoded data 
        # without the header. Call base64.b64decode to decode that to bytes. 
        # Last, write the bytes to a file.
        data_uri = request.json.get('dataUri')
        header, encoded = data_uri.split(",", 1)
        data = b64decode(encoded)
        with open("image.jpg", "wb") as f:
            f.write(data)
            # get jpg data (date taken, location, etc)
            # classify photo 
            # delete image at the end, we can store the data_URI
        
        return jsonify({'status': 'success', 'emotion' : 'sad'})
