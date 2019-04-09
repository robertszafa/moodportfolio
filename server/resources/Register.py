from flask import request, jsonify, url_for, redirect
from flask_restful import Resource
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from config import mysql, mail, app
from .helpers import _hash_password, _encode_auth_token, _get_user_id
from datetime import datetime, timedelta
import jwt


s = URLSafeTimedSerializer(app.config.get('SECRET_KEY'))


class Register(Resource):
    def post(self):
        try:
            name = request.json.get('name')
            email = request.json.get('email')
            password = _hash_password(request.json.get('password'))

            registration_token = _encode_registration_token(name, password)
        except:
            return jsonify({'emailSent' : False, 'error' : 'incorrectInput'})
        
        token = s.dumps(email, salt='email-confirm')
        msg = Message('Almost there! Confirm Your Email', sender='Moodportfolio', recipients=[email])
        link = url_for('confirm_email', 
                        token=token, 
                        registration_token=registration_token,
                        _external=True)
        msg.body = f'Please click on the confirmation link below\n\n{link}'
        mail.send(msg)

        return jsonify({'emailSent' : True, 
                        'error' : ''})


@app.route('/confirm_email/<token>')
def confirm_email(token):
    # confirmation token expires after 24h
    email = s.loads(token, salt='email-confirm', max_age=36000) 

    registration_token = request.args.get('registration_token')
    name, password = _decode_registration_token(registration_token)
    now = datetime.now()
    now.strftime('%Y-%m-%d %H:%M:%S')
   
    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO User(name, hashedPassword, email, signupDate) VALUES(%s, %s, %s, %s)",
                        (name, password, email, now))
        mysql.connection.commit()
        cur.close()
    except Exception as err:
        return '<h1>Ups, an error has occured... Please try again later</h1>'

    return redirect("http://www.localhost:3000/login", code=302)



def _encode_registration_token(name, password_hash):
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1, seconds=0),
            'iat': datetime.utcnow(),
            'name': name,
            'password_hash': password_hash
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        print(e)
        return e

def _decode_registration_token(auth_token):
    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        return payload['name'], payload['password_hash']
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

