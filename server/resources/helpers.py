from datetime import datetime, timedelta
import jwt
from flask import request, jsonify
from passlib.hash import sha256_crypt
from config import app, mysql
import reverse_geocoder as rg



def _authenticate_user(request):
    try:
        auth_token = request.headers.get('Authorization')
    except:
        return False
    
    if auth_token:
        return _decode_auth_token(auth_token)
    
    return False


def _encode_auth_token(user_id):
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=7, seconds=0),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e


def _decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


def _email_exists(email):
    # Create DB cursor
    cur = mysql.connection.cursor()

    if cur.execute('SELECT email FROM User WHERE email=%s', [email]) > 0:
        # Close connection
        cur.close() 
        return True

    cur.close() 
    return False


def _get_password_hash(email):
    cur = mysql.connection.cursor()
    if cur.execute('SELECT hashedPassword FROM User WHERE email=%s', [email]) < 1:
        cur.close() 
        return # no user with this email

    password_hash = cur.fetchone().get('hashedPassword') 
    cur.close() 

    return password_hash

def _get_user_id(email):
    cur = mysql.connection.cursor()
    if cur.execute('SELECT userID FROM User WHERE email=%s', [email]) < 1:
        cur.close() 
        return # no user with this email

    user_id = cur.fetchone().get('userID') 
    cur.close() 

    return user_id

def _get_num_of_photos(user_id):
    cur = mysql.connection.cursor()

    try:
        num_of_photos = cur.execute(f'SELECT * FROM Photo WHERE userID={user_id}')
        cur.close() 
    except Exception as err:
        print('Error at _get_num_of_photos:', err)
        cur.close() 
        return 0

    return num_of_photos

# return tuple (verified, errors)
def _verify_user(email, password):
    loggedIn = False
    auth_token = None
    error = None
    password_hash = _get_password_hash(email)

    # email doesn't exists in DB
    if not password_hash:
        error = 'wrongCredentials' 
    else:
        loggedIn = sha256_crypt.verify(password, password_hash)



    if not loggedIn:
        error = 'wrongCredentials'
    else:
        auth_token = _encode_auth_token(_get_user_id(email)).decode()
    
    return jsonify({'loggedIn' : loggedIn, 'error': error, 'authToken': auth_token})


def _hash_password(password):
    return sha256_crypt.encrypt(password)


def _get_place(lat, lon):
    loc_data = rg.search((lat, lon))
    cc = loc_data[0]['cc']
    city = loc_data[0]['admin2']
    return cc, city