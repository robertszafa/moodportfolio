from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
from flask_mysqldb import MySQL
from passlib.hash import sha256_crypt
import datetime  

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

# Config
cors = CORS(app)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'DoNotPanic42'
app.config['MYSQL_DB'] = 'moodportfolio'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# init MYSQL
mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('index.html')

###################################### API CALLS ###################################################
@app.route("/api/user/exists", methods = ["POST", "GET"])
def email_exists():
    email = request.json.get('email')

    # Create DB cursor
    cur = mysql.connection.cursor()

    if cur.execute('SELECT email FROM User WHERE email=%s', [email]) > 0:
        # Close connection
        cur.close() 
        return jsonify({'exists' : 'True'})

    cur.close() 
    return jsonify({'exists' : 'False'})


@app.route("/api/user/register", methods = ["POST", "OPTIONS"])
def register():
    # if request == "OPTIONS":
    #     return jsonify({'Access-Control-Allow-Origin':  'http://127.0.0.1:5000',
    #                     'Access-Control-Allow-Methods': 'POST',
    #                     'Access-Control-Allow-Headers': 'Content-Type, Authorization'}),
   
    name = request.json.get('name')
    email = request.json.get('email')
    password = sha256_crypt.encrypt(request.json.get('password'))
    now = datetime.datetime.now()
    now.strftime('%Y-%m-%d %H:%M:%S')

    if email is None or password is None:
        response = jsonify({'error' : 'noEmailOrPassword'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    
    if _email_exists(email):
        response = jsonify({'error' : 'emailExists'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO User(name, hashedPassword, email, signupDate) VALUES(%s, %s, %s, %s)", 
                                                                    (name, password, email, now))
    mysql.connection.commit()
    cur.close()

    response = jsonify({'registered' : 'True'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 201



@app.route("/api/user/login", methods = ["POST"])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    
    verified, error = _verify_user(email, password)
    
    if not verified:
        return jsonify({'error' : error, 'loggedIn': 'False'})

    return jsonify({'error' : error, 'loggedIn': 'True'})
###################################### API CALLS END ###############################################


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
        return ((False), 'emailNotExisting')

    verified = sha256_crypt.verify(password, password_hash)

    if not verified:
        return ((False), 'wrongPassword')
    
    return ((True), '')





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
