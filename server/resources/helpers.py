import datetime  
from flask import request, jsonify
from passlib.hash import sha256_crypt
from config import mysql


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


# return tuple (verified, errors)
def _verify_user(email, password):
    password_hash = _get_password_hash(email)

    # email doesn't exists in DB
    if not password_hash:
        loggedIn = False
        error = 'emailNotExisting' 

    loggedIn = sha256_crypt.verify(password, password_hash)

    if not loggedIn:
        error = 'wrongPassword'
    
    return jsonify({'loggedIn' : loggedIn, 'error': error})


def _hash_password(password):
    return sha256_crypt.encrypt(password)