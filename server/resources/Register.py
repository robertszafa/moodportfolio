from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _hash_password
import datetime  

class Register(Resource):
    def post(self):
        try:
            name = request.json.get('name')
            email = request.json.get('email')
            password = _hash_password(request.json.get('password'))
            now = datetime.datetime.now()
            now.strftime('%Y-%m-%d %H:%M:%S')
        except:
            response = jsonify({'error' : 'noEmailOrPassword'})
            return response

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO User(name, hashedPassword, email, signupDate) VALUES(%s, %s, %s, %s)", 
                                                                        (name, password, email, now))

        mysql.connection.commit()
        cur.close()

        response = jsonify({'registered' : 'True'})
        return response
