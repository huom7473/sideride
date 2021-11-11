import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS
from DB_manager import *

app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api"

bad = {
        'user': 'SideRideProjectxyz',
        'password': 'SideRideProject130*',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
        'database': 'SideRideSchema',
        'raise_on_warnings': True
    }, 

# Setup connection to the DB prior to any routing 
db_instance = DatabaseHandler(bad) 
connection = db_instance.connect_to_db()

if connection != CONN_FAILURE:
    print("Successfully connecte!")

else:
    exit(1)



@app.route(BASE_ROUTE + '/<arg>', methods=['POST', 'GET'])
def base_route(arg):
    return {'arg': arg}

def handler(event, context):
    return awsgi.response(app, event, context)

