import json
from flask import Flask, jsonify, request
import awsgi
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_ROUTE = "/api"

@app.route(BASE_ROUTE + '/<arg>', methods=['POST', 'GET'])
def base_route(arg):
    return {'arg': arg+"rocks"}

def handler(event, context):
    return awsgi.response(app, event, context)

