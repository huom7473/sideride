import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS
import DB_manager as dm
import Ride_manager as rm


app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api/"


@app.route(BASE_ROUTE + 'find/<username>')
def find(username):
    return {'arg': f"trying to find rides for {username}"}


# Add ride to database
@app.route(BASE_ROUTE + 'addride')
def addride():

    # First create a Ride object with the passed in args 
    # NOTE: we format the date into an appropriate DATETIME string for SQL
    try:
        ride = rm.Ride(request.args) 
        ride.formatDate()
    except:
        return {'Backend error': "Failed to create Ride instance"}

    # Then establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
        #return {'params': ride.getAll()}       # a test to see permuted args on console
    except:
        return {'Backend error': 'Failed to connect to DB'}

    # Then use db_handle to add the ride to the DB
    insertion = db_handle.add_ride(ride.getAll())
    if insertion:
        return {'SUCCESS': 'Added ride to DB'}
    else:
        return {'FAILURE': 'Failed to add ride to DB'}



# for testing purposes only 
@app.route(BASE_ROUTE + 'createride')
def createride():

    _from  = request.args.get('from', None)
    _to = request.args.get('to', None)
    _date = request.args.get('date', None)


    return {'arg': f"creating rides for {_from},{_to}"}

def handler(event, context):
    return awsgi.response(app, event, context)

