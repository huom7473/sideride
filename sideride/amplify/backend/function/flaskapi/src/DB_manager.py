from datetime import datetime, date, timedelta
import mysql.connector as ms

CONN_FAILURE = "Connection failed"

default_config =     {
    'user': 'SideRideProject',
    'password': 'SideRideProject130*',
    'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
    'database': 'SideRideSchema',
    'raise_on_warnings': True
}

class DatabaseHandler:
    def __init__(self, config=default_config) -> None:
        self.config = config

    def connect_to_db(self):
        try:
            connection = ms.connect(**self.config)     
            return connection 
        except:
            return CONN_FAILURE
    
    def query_db(self, query="SELECT * FROM LoginInformation"):
        connection = self.connect_to_db()

        if connection is not CONN_FAILURE:
            cursor = connection.cursor()
            cursor.execute(query)

            for user, pw in cursor:
                print(f"We have user: {user} with password: {pw}")      # basic test to print to console 


            # Always close connections when done
            # NOTE: for table updates, need to call connection.commit() to persist changes
            cursor.close()
            connection.close()
