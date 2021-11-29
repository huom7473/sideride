import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS
import DB_manager as dm
import Ride_manager as rm


app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api/"

# Create and add ride to database
@app.route(BASE_ROUTE + 'addride')
def addride():

    # First create a Ride object with the passed in args 
    # NOTE: we format the date into an appropriate DATETIME string for SQL
    try:
        ride = rm.Ride(request.args) 
        ride.formatDate()
    except:
        return {'Backend error': "Failed to create Ride instance", "args": request.args}

    # Then establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
        #return {'params': ride.getAll()}       # a test to see permuted args on console
    except:
        return {'Backend error': 'Failed to connect to DB'}

    # Then use db_handle to add the ride to the DB in MasterRides table
    creation = db_handle.create_ride(ride)
    if creation:
        # Also update our Riders table with this driver's newly added ride
        response = db_handle.add_driver(ride)
        if response:
            return {'SUCCESS': 'Added ride to DB'}
        else:
            return {'FAILURE': 'Failed to add to secondary Rides table'}
    else:
        return {'FAILURE': 'Failed to add ride to MasterRides table'}


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

@app.route(BASE_ROUTE + 'myrides')
def myrides():
    user = dict(request.args)['username']
        
    # First establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    # Retreive all rides associated with user 
    return db_handle.myrides(user)
    
@app.route(BASE_ROUTE + 'bookseat')
def bookseat():
    user = dict(request.args)['user']
    id = dict(request.args)['id']

    # First establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    errno, status = db_handle.add_rider(id,user)

    if errno == 1062:
        return {'FAILURE': status}
    
    else: return {'SUCCESS': status}

@app.route(BASE_ROUTE + 'acceptride')
def acceptride():
    user = dict(request.args)['user']
    ride_id = dict(request.args)['ride_id']
    
    # First establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    errno, status = db_handle.accept_ride(ride_id, user)

    if not errno: return {'SUCCESS': 'Rider was accepted'}
    else: return {'FAILURE': status}



@app.route(BASE_ROUTE + 'denyride')
def denyride():
    user = dict(request.args)['user']
    ride_id = dict(request.args)['ride_id']

    # First establish connection to DB 
    try:
        db_handle = dm.Database() 
        db_handle.connect_to_db()
    except:
        return {'Backend error': 'Failed to connect to DB'}
    
    status = db_handle.deny_ride(ride_id, user)

    if status == True: return {'SUCCESS': 'Rider was denied'}
    else: return {'FAILURE': status}

def handler(event, context):
    return awsgi.response(app, event, context)



