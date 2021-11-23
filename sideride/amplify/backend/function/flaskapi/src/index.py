import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS
import DB_manager


app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api/"


@app.route(BASE_ROUTE + 'login/<arg>', methods=['POST', 'GET'])
def base_route(arg):

    params =  dict(x.split("=") for x in arg.split("&"))

    if request.method == 'GET':
        return params

    else:
        return {'arg': "POST_Test"}


@app.route(BASE_ROUTE, methods = ['POST', 'GET'] )
def base():
    if request.method == 'POST': return {'arg': "wooooo"}


@app.route(BASE_ROUTE + 'find/<username>')
def find(username):
    return {'arg': f"trying to find rides for {username}"}

@app.route(BASE_ROUTE + 'createride/<arg>', methods = ['POST', 'GET'])
def createride(arg):
    params =  dict(x.split("=") for x in arg.split("&"))

    db = DB_manager.DatabaseHandler()
    if db.connect_to_db() == db.CONN_FAILURE:
        return {'msg':'Error conneting to database'}
    
    if db.add_ride('0',start=params['from'],stop=params['to'],date=params['date']):
        return {'msg': 'Ride added to database'}
    else:
        return {'msg':'Error with adding ride to database'}

def handler(event, context):
    return awsgi.response(app, event, context)

