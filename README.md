# SideRide 2021
## Contributors: Michael, Tygan, Aditya, Malik, Austin, Anthony

## Motivation 
Long distance travel can be costly, time-consuming, and inconvenient for those who do not own personal vehicles. Current options include either taking public transport, both time-consuming and inconvenient, or using services such as Uber or Lyft, which become extremely expensive as travel distance increases. The ideal solution to this issue is ride-share, having people aiming to reach the same destination carpool, thus only requiring one vehicle for many riders, saving both time and gas money. While there do exist groups on social media sites like Facebook which aim to connect drivers and riders through a ride-share marketplace, there is no effective search method with regard to locations, so groups are forced to be very specific, such as the UCLA rideshare group that only allows rides to or from UCLA. Even then it can be hard to find the exact ride you desire.

Our application SideRide aims to solve this issue. In our web application, we aim to create a similar marketplace for rides, but with an efficient way to organize drivers and riders in rides and a way to easily find rides with the locations the user is traveling to and from. Users would no longer have to scroll through the long list of posts to find the destination they need, and drivers could post rides from any starting location, not just UCLA. Our application simplifies the entire ride-share process as a whole for both drivers and riders. 

## Project structure

### Frontend
The frontend was boostrapped with npm create-react-app. The contents are in the sideride directory, and by convention, the source code for the frontend
primarily resides in sideride/src. The frontend is written in Javascript and uses React. 

The React frontend can be started by running npm start in the sideride directory. Tests can be run from the sideride directory with ```npm test``` and you can generate a coverage report with ```npm test -- --coverage --watchAll```.

### Backend
The backend was created in the form of an AWS Amplify (REST) API with a Python runtime. Because of this, the contents of the backend reside in an AWS Lambda function in sideride/amplify/backend/function/flaskapi/src. The API is implemented in Python with a Flask server, which is primarily contained in index.py, which imports from relevant files in the same directory. This backend is kept updated in the AWS server through AWS Amplify CLI.

To conduct tests on our backend, cd into sideride/amplify/backend/function/flaskapi and start a pipenv shell with the command ```pipenv shell```. Ensure that pytest and pytest-cov are installed with ```pipenv install pytest``` and ```pipenv install pytest-cov```. Run the tests with ```pytest .\src\ --cov=. --cov-branch```. 
