from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _authenticate_user


class Emotions(Resource):
    def get(self):
        user_id = _authenticate_user(request) 

        if not user_id:
            return jsonify({'status': 'fail', 'error': 'incorrectAuthToken'})
        
        return jsonify({'status': 'success', 'emotion' : 'sad'})
