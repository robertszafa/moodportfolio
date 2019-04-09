from flask import request, jsonify, url_for, redirect
from flask_restful import Resource
from flask_mail import Message
from config import mysql, mail, app
from .helpers import _hash_password
import random
import string


class ResetPassword(Resource):
    def post(self):
        try:
            email = request.json.get('email')
            new_password = _get_random_password()
            password_hash = _hash_password(new_password)
        except Exception as e:
            return jsonify({'emailSent' : False, 'error' : 'incorrectInput'})
        
        try:
            cur = mysql.connection.cursor()
            cur.execute(f"UPDATE User SET hashedPassword='{password_hash}' WHERE email='{email}'")
            mysql.connection.commit()
            cur.close()
        except Exception as e:
            return jsonify({'emailSent' : False, 'error' : 'databaseError'})
        
        msg = Message('Moodportfolio - Your New Password', sender='Moodportfolio', recipients=[email])
        msg.body = f'Your new password is: {new_password}\n\nYou should change your password after you log in again'
        mail.send(msg)

        return jsonify({'emailSent' : True, 
                        'error' : ''})



def _get_random_password():
    password_characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(password_characters) for i in range(10))
    # password = ''
    # password.join(random.choice(string.ascii_uppercase) for i in range(3))
    # password.join(random.choice(string.ascii_lowercase) for i in range(3))
    # password.join(random.choice(string.punctuation) for i in range(3))
    # password.join(random.choice(string.digits) for i in range(3))
    
    # return password