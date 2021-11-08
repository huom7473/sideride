import sys, os
sys.path.append(os.path.join(sys.path[0],'env','lib','python3.8','site-packages'))

from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS #comment this on deployment
import mysql.connector as ms

app = Flask(__name__, static_url_path='', static_folder='sideride/sideride/src')
CORS(app) #comment this on deployment

config = {
  'user': 'SideRideProject',
  'password': 'SideRideProject130*',
  'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
  'database': 'SideRideSchema',
  'raise_on_warnings': True
}

@app.route('/login', methods=['POST'])
def login():
    login_json = request.get_json()

    if not login_json:
        return jsonify({'msg': 'Missing JSON'}), 400

    username = login_json.get('username')
    password = login_json.get('password')
        
    if not username:
        return jsonify({'msg': 'Username is missing'}), 400

    if not password:
        return jsonify({'msg': 'Password is missing'}), 400

    try:
        connection = ms.connect(**config)
        cursor = connection.cursor()
    except:
        return jsonify({'msg': 'Failed to connect to database'}), 400

    query = f"""SELECT * FROM LoginInformation where Username = '{username}' and password = '{password}'"""

    if not query:
        return jsonify({'msg': 'Username and/or password not correct'}), 400

    else:
        print('NOT DONE')
        #This is not complete. The gaol here is to go to the page of the associated username
        #return jsonify({'access_token': access_token}), 200



# @app.route('/createaccount', methods=['POST'])
# def login():
#     login_json = request.get_json()

#     if not login_json:
#         return jsonify({'msg': 'Missing JSON'}), 400

#     username = login_json.get('username')
#     password = login_json.get('password')
        
#     if not username:
#         return jsonify({'msg': 'Username is missing'}), 400

#     if not password:
#         return jsonify({'msg': 'Password is missing'}), 400

#     try:
#         connection = ms.connect(**config)
#         cursor = connection.cursor()
#     except:
#         return jsonify({'msg': 'Failed to connect to database'}), 400

#     query = (f"SELECT * FROM LoginInformation where Username = '{username}' and password = '{password}'")

#     if not query:
#         return jsonify({'msg': 'Username and/or password not correct'}), 400

#     else:
#         print('NOT DONE')
#         #This is not complete. The gaol here is to go to the page of the associated username
#         #return jsonify({'access_token': access_token}), 200


# below will be used for creating an account and storing that data in sql
# @app.route('/createaccount', methods=['POST'])
# def createaccount():
#     login_json = request.get_json()

#     if not login_json:
#         return jsonify({'msg': 'Missing JSON'}), 400

#     username = login_json.get('username')
#     password = login_json.get('password')
        
#     if not username:
#         return jsonify({'msg': 'Username is missing'}), 400

#     if not password:
#         return jsonify({'msg': 'Password is missing'}), 400

#     try:
#         connection = ms.connect(**config)
#         cursor = connection.cursor()
#     except:
#         return jsonify({'msg': 'Failed to connect to database'}), 400

#     query = (f"SELECT * FROM LoginInformation where Username = '{username}'' and password = '{password}'")

#     if not query:
#         return jsonify({'msg': 'Username and/or password not correct'}), 400

#     else:
#         print('NOT DONE')
#         #This is not complete. The gaol here is to go to the page of the associated username
#         #return jsonify({'access_token': access_token}), 200

if __name__ == '__main__':
    app.run(debug=True,port=8080,host='0.0.0.0')