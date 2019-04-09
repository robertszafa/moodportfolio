from flask import Flask, Blueprint
from flask_mysqldb import MySQL
from flask_restful import Api
from flask_cors import CORS
from flask_mail import Mail




app = Flask(__name__, static_folder='../static/dist', template_folder='../static')
CORS(app)


# Config
# MYSQL
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Password12345'
app.config['MYSQL_DB'] = 'moodportfolio'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# EMAIL
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT']=465
app.config['MAIL_USE_TLS']=False
app.config['MAIL_USE_SSL']=True
app.config['MAIL_USERNAME']='moodportfol.io@gmail.com'
app.config['MAIL_PASSWORD']='Password12345!'

# init MYSQL
mysql = MySQL(app)

# init mail
mail = Mail(app)


api_bp = Blueprint('api', __name__)
api = Api(api_bp)
app.register_blueprint(api_bp, url_prefix='/api')
