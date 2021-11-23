import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS
import DB_manager


app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api/"


@app.route(BASE_ROUTE + 'find/<username>')
def find(username):
    return {'arg': f"trying to find rides for {username}"}


# Add ride to database
@app.route(BASE_ROUTE + 'addride')
def addride():
    _id = request.args.get('id', None)
    _start  = request.args.get('start', None)
    _stop = request.args.get('stop', None)
    _start_coord = request.args.get('start_coord', None)
    _stop_coord = request.args.get('stop_coord', None)
    _car = request.args.get('car_model', None) 
    _license_plate = request.args.get('license_plate', None)
    _driver_id = request.args.get('driver_id', None)
    _date = request.args.get('date', None)

    # TODO: add seats, price variables and deal with DATETIME conversion for SQL table 




# for testing purposes only 
@app.route(BASE_ROUTE + 'createride')
def createride():

    _from  = request.args.get('from', None)
    _to = request.args.get('to', None)
    _date = request.args.get('date', None)

    # db = DB_manager.DatabaseHandler()
    # if db.connect_to_db() == db.CONN_FAILURE:
    #     return {'msg':'Error conneting to database'}
    
    # if db.add_ride('0',start=params['from'],stop=params['to'],date=params['date']):
    #     return {'msg': 'Ride added to database'}
    # else:
    #     return {'msg':'Error with adding ride to database'}
    return {'arg': f"trying to find rides for {_from},{_to}"}

def handler(event, context):
    return awsgi.response(app, event, context)

