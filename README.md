# SideRide 2021
## Contributors: Michael, Tygan, Aditya, Malik, Austin, Anthony
## Project structure

### Frontend
The frontend was boostrapped with npm create-react-app. The contents are in the sideride directory, and by convention, the source code for the frontend
primarily resides in sideride/src. The frontend is written in Javascript and uses React. 

The React frontend can be started by running npm start in the sideride directory. Tests can be run from the sideride directory with ```npm test``` and you can generate a coverage report with ```npm test -- --coverage```.

### Backend
The backend was created in the form of an AWS Amplify (REST) API with a Python runtime. Because of this, the contents of the backend reside in an AWS Lambda function in sideride/amplify/backend/function/flaskapi/src. The API is implemented in Python with a Flask server, which is primarily contained in index.py, which imports from relevant files in the same directory. This backend is kept updated in the AWS server through AWS Amplify CLI.
