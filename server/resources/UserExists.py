from flask import request, jsonify
from flask_restful import Resource
from .helpers import _email_exists
import datetime  

class UserExists(Resource):
    def get(self):
        try:
            email = request.json.get('email')
        except:
            return jsonify({'exists' : "False", 'error' : 'noEmailProvided'})

        response = _email_exists(email)

        return jsonify({'exists' : response})

    def post(self):
        try:
            email = request.json.get('email')
        except:
            return jsonify({'exists' : False, 'error' : 'noEmailProvided'})

        response = _email_exists(email)

        return jsonify({'exists' : response})