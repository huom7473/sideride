SideRide 2021

Contributors: Michael, Tygan, Aditya, Malik, Austin, Anthony

Project structure:

Frontend: the frontend was boostrapped with npm create-react-app. The contents are in the sideride directory, and by convention, the source code for the frontend
primarily resides in sideride/src. The frontend is written in Javascript and uses React. The React frontend can be started by running npm start in the sideride directory. They can be run with ```npm test -- --verbose``` from the sideride directory.

Backend: the backend was created in the form of an AWS Amplify (REST) API with a Python runtime. Because of this, the contents of the backend reside in an AWS Lambda function in sideride/amplify/backend/function/flaskapi/src. The API is implemented in Python with a Flask server, which is primarily contained in index.py, which imports from relevant files in the same directory. This backend is kept updated in the AWS server through AWS Amplify CLI.

Frontend testing: JavaScript tests are in sideride/src/test. They focus on making sure the frontend behaves properly with some preliminary inputs.

Example frontend test case - Testing the handle_update method: 
```
test('Update username ', () => {
    instance._handleUpdate(username_event)
    expect(instance.state.username).toBe(username_event.target.value);
    });
```

Backend testing: Tests for the Python backend are in sideride/amplify/backend/function/flaskapi/src/DB_test.py; they're designed to be run with python's built in module unit testing framework: ```python3 -m unittest -v DB_test.py```

Example backend test case - testing the database connection:
```
def test_connect_failures(self):
        for config in test_configs:
            sql_db = DatabaseHandler(config)
            with self.subTest(config):
                self.assertEqual(sql_db.connect_to_db(), CONN_FAILURE)
```                
