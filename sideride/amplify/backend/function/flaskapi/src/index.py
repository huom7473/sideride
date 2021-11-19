import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api/"


@app.route(BASE_ROUTE + '<arg>', methods=['POST', 'GET'])
def base_route(arg):
    
    passed_param = request.args.get('arg')
    
    if request.method == 'GET':
        return {'arg': passed_param}
    
    elif request.method == 'POST': return {'arg': arg+"POST"}

    else:
        return{'arg':arg}

@app.route(BASE_ROUTE, methods = ['POST', 'GET'] )
def base():
    return {'arg': "wooooo"}

def handler(event, context):
    return awsgi.response(app, event, context)

