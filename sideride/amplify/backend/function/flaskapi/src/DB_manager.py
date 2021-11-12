from datetime import datetime, date, timedelta
import mysql.connector as ms
from flask import jsonify

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
        self.connection
        self.cursor

    def get_handle(self):
        return self.connection

    def connect_to_db(self):
        try:
            self.connection = ms.connect(**self.config) 
            self.cursor = self.connection.cursor()    
            self.get_handle() 
        except:
            return CONN_FAILURE
    
    def add_ride(self, id, start, stop, date):
        insert_stmt = (
            "INSERT INTO Rides (driver_id, start, stop, date) "
            "VALUES (%s, %s, %s, %s)"
        )
        
        params = (id, start, stop, date)

        # This catches improper insertions 
        try:
            self.cursor.execute(insert_stmt,params)
            self.connection.commit()
            return True
        except:
            self.cursor.fetchwarnings()
            return False
    
    def delete_ride(self, id):
        query = (
            " DELETE FROM Rides WHERE driver_id = %s"
        )
        params = (id,)

        self.cursor.execute(query,params)

    def find_rides_by_date(self, date):
        
        # Grab all rides matching with given value
        # Defaults to empty literals in case user doesn't input a search field (i.e. no date)
        query= (
            "SELECT * FROM Rides WHERE date = %s"
        )

        try:
            self.cursor.execute(query, (date,))     # must pass params as tuples, hence (x,) format
            rows = self.cursor.fetchall()
        except:
            return []

        # Now convert SQL output into JSON for frontend 
        results = []
        headers = [ x[0] for x in self.cursor.description]   # grab column names

        for record in rows:
            results.append(dict(zip(headers,record)))
        
        # NOTE: 'date' return as datetime.date object
        # TODO: So '2015-9-22' will come back as datetime.date(2015,9,22) so convert prior to displaying
        return jsonify(results)
        
    
