from datetime import datetime, date, timedelta
import mysql.connector as ms

class mysql_db:
    def __init__(self, config) -> None:
        self.config = config

    def connect_to_db(self):
        try:
            connection = ms.connect(**self.config)
            cursor = connection.cursor()
            return connection 
        except:
            return "Connection failed"
    
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
