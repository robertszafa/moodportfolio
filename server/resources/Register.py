from flask import request, jsonify
from flask_restful import Resource
from config import mysql
from .helpers import _hash_password, _encode_auth_token, _get_user_id
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
            return jsonify({'registered' : False, 'error' : 'noEmailOrPassword'})

        try:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO User(name, hashedPassword, email, signupDate) VALUES(%s, %s, %s, %s)",
                                                                            (name, password, email, now))
            mysql.connection.commit()
            cur.close()
            user_id = _get_user_id(email)
            auth_token = _encode_auth_token(user_id)
        except Exception as err:
            return jsonify({'registered' : False, 'error' : 'databaseError' + str(err)})
        
        return jsonify({'registered' : True, 
                        'error' : '', 
                        'authToken': auth_token.decode()})
