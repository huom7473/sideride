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

# Test route for Tygan
@app.route(BASE_ROUTE + 'tygan')
def get_prepared_query_results():
    # Establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    # Grab prepared results from DB using handle
    return {'Query results': db_handle.find_rides_tygan()}

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
        return {'FAILURE': ride.getAll()}


@app.route(BASE_ROUTE + 'findrides')
def findrides():
    # Call the DB search query using passed in params 
    
    # First establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    # Query the MasterRides table using given args
    try:
        query_results = db_handle.find_rides(dict(request.args))
    except:
        return {'FAILURE': 'Failed to query DB'}

    # Return results back to frontend
    return {'Query results': query_results}



# for testing purposes only 
@app.route(BASE_ROUTE + 'createride')
def createride():

    _from  = request.args.get('from', None)
    _to = request.args.get('to', None)
    _date = request.args.get('date', None)


    return {'arg': f"creating rides for {_from},{_to}"}

def handler(event, context):
    return awsgi.response(app, event, context)

