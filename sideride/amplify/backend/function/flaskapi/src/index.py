import json
from flask import Flask, jsonify, request
import awsgi

app = Flask(__name__)

BASE_ROUTE = "/api"

@app.route(BASE_ROUTE + '/<arg>', methods=['POST', 'GET'])
def base_route(arg):
    return {'arg': arg}

def handler(event, context):
    return awsgi.response(app, event, context)

