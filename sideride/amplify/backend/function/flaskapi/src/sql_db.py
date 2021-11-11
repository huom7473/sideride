# These will be useful for serving queries based on date range
# from datetime import datetime, date, timedelta
#add database functionality here
import mysql.connector as ms

#config must pull from config file
#test we want:
#pass in config w wrong params
#pass in config w right params


#the purpose of this class is to connect to the database and 
#execute SQL queries upon it. 
class mysql_db:
    def __init__(self, config) -> None:
        self.config = config

    def connect_to_db(self):
        try:
            connection = ms.connect(**self.config)
            #cursor = connection.cursor()
            return connection 
        except:
            print("Connection failed")
            return None
    
    def query_db(self, query="SELECT * FROM LoginInformation"):
        connection = self.connect_to_db()

        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(query)

            for user, pw in cursor:
                print(f"We have user: {user} with password: {pw}")      # basic test to print to console 


            # Always close connections when done
            # NOTE: for table updates, need to call connection.commit() to persist changes
            cursor.close()
            connection.close()
