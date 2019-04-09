from flask import Flask, request, jsonify, make_response, render_template, Blueprint
from flask_restful import Api
from flask_mysqldb import MySQL
from passlib.hash import sha256_crypt
from config import app, api, mysql
from resources.Register import Register
from resources.Login import Login
from resources.UserExists import UserExists
from resources.Emotions import Emotions
from resources.ResetPassword import ResetPassword


api.add_resource(Register, '/Register')
api.add_resource(UserExists, '/UserExists')
api.add_resource(Login, '/Login')
api.add_resource(Emotions, '/Emotions')
api.add_resource(ResetPassword, '/ResetPassword')




@app.route('/')
def index():
    return render_template('index.html')

@app.errorhandler(404)
def handle_error(e):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(500)
def handle_error(e):
    return make_response(jsonify({'error': 'Internal server error'}), 500)

@app.errorhandler(403)
def handle_error(e):
    return make_response(jsonify({'error': 'Unauthorized'}), 403)



if __name__ == '__main__':
    app.run()
