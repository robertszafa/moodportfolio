from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _verify_user


class Login(Resource):
    def post(self):
        try:
            email = request.json.get('email')
            password = request.json.get('password')
        except:
            return jsonify({'loggedIn' : 'False', 'error' : 'noEmailOrPasswordSupplied'})
        
        return _verify_user(email, password)