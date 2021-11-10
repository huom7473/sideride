import json
from flask import Flask, jsonify, request
import awsgi
<<<<<<< HEAD

app = Flask(__name__)
=======
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
>>>>>>> 55de2cdc472bff61be50510875169c7bcf0e3cb4

BASE_ROUTE = "/api"

@app.route(BASE_ROUTE + '/<arg>', methods=['POST', 'GET'])
def base_route(arg):
    return {'arg': arg}

def handler(event, context):
    return awsgi.response(app, event, context)

