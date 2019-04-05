from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _verify_user, _authenticate_user


class Login(Resource):
    def post(self):
        try:
            email = request.json.get('email')
            password = request.json.get('password')
        except:
            return jsonify({'loggedIn' : 'False', 
                            'error' : 'noEmailOrPasswordSupplied',
                            'authToken' : ""})
        
        return _verify_user(email, password)

        
    def get(self):
        user_id = _authenticate_user(request)

        if not user_id:
            return jsonify({'success': False, 'error': 'incorrectOrExpiredAuthToken'})
        
        return jsonify({'success': True})