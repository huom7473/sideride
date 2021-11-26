from datetime import datetime, date, timedelta
import mysql.connector as ms
from flask import json, jsonify
from Ride_manager import *

# Static global 
CONN_FAILURE = "Connection failed"
CONN_SUCCESS = "Connection established"

# for CORS: https://cors-anywhere.herokuapp.com/ before the hostname

default_config = {
    'user': 'SideRideProject',
    'password': 'SideRideProject130*',
    'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
    'database': 'SideRideSchema',
    'raise_on_warnings': True
}

class Database:
    """
    A class used to interact with the backend database and serve results to the frontend

    Attributes
    ---------
    config : dict
        a formatted dictionary holding the required parameters to establish a DB connection
    
    connection : mysql.connector.MySQLConnection 
        acts as a handle (i.e. file handle) to access the mySQL database after establishing connection
    
    cursor : mysql.connector.MySQLCursor
        responsible for executing specified queries on the database and buffering fetched results 
    

    Methods
    --------

    get_handle()
        returns the handle for the connected instance of the database
    
    connect_to_db()
        tries to establish a connection to the database using supplied config file
    
    add_ride(id, start, stop, date)
        adds an entry to the DB signifying the new ride with the given params 
    
    delete_ride(id)
        removes the unique ride from the system 
    
    find_rides_by_date(date)
        queries DB for rides matching given date and returns results in JSON format for frontend 
    
    """
    
    def __init__(self, config=default_config) -> None:
        """
        Parameters
        ----------
        config : dict
            A formatted dictionary holding the required parameters to establish a DB connection
            If none specified, defaults to a pre-tested config in order to connect to a mySQL DB 
    
        connection : mysql.connector.MySQLConnection 
            Acts as a handle (i.e. file handle) to access the mySQL database after establishing connection
    
        cursor : mysql.connector.MySQLCursor
            Responsible for executing specified queries on the database and buffering fetched results 
        
        """
        self.config = config
        self.connection = None
        self.cursor = None

    def get_handle(self) -> ms:
        """
        Returns handle to the DB instance 
        """
        return self.connection

    def connect_to_db(self) -> str:
        """
        Uses supplied config file to connect to a mySQL database, initialize the cursor, and return the handle
        for the connection to user 

        Returns a static message CONN_FAILURE on failure to establish connection
        """
        try:
            self.connection = ms.connect(**self.config) 
            self.cursor = self.connection.cursor()    
            return self.get_handle() 
        except:
            return CONN_FAILURE
    
    def create_ride(self, ride:Ride) -> bool:
        """
        Creates the specified ride and adds it to the MasterRides table in the backend DB

        Returns True if ride was succesfully added, False if not 

        Parameters
        -------- 
        
        from : str
            The starting location for the trip
        
        to : str
            The ending location for the trip
        
        date : 
            The date, in DATETIME formate (YYYY-MM-DD HH:MM:SS) for which the trip is scheduled

        """

        params = ride.getAll()
        
        insert_stmt = (
            "INSERT INTO MasterRides "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NULL)"
        )
        
        values = (
            params['driver'], params['from'], params['to'], params['fromLat'], params['fromLng'],
            params['make'], params['plate'], params['datetime'], 
            params['price'], params['seats'], params['model']
            )
        
        # This catches improper insertions 
        try:
            self.cursor.execute(insert_stmt,values)
            id = self.cursor.lastrowid
            ride.set_ride_id(id)
            self.connection.commit()
            return True
        except:
            error_msg = self.cursor._last_executed
            return False
    
    def add_driver(self, ride:Ride):
        """
            Add the driver to the secondary Riders table with following schema:
            
            ride_id | username | status | is_driver 
        """
        params = ride.getAll()
        id = ride.get_ride_id()
        insert_stmt = (
            "INSERT INTO Riders "
            "VALUES (%s, %s, %s, %s)"
        )
        
        values = (
            id, params['driver'], 'PENDING', True
            )
        
        # This catches improper insertions 
        try:
            self.cursor.execute(insert_stmt,values)
            self.connection.commit()
            return True
        except:
            error_msg = self.cursor._last_executed
            return False

    def add_rider(self, rider_id, rider_username):
        """
            Called from the "book seat" button, add the user to the requested ride 

            Takes in the ride_id and username, adds entry into Riders table

            Returns True on success, False on failure 
        """
        # First check that this rider is not already part of the specific ride 
        # Return False right away if they are 

        # Then add entry to Riders table w/ is_driver = False

        # Then UPDATE MasterRides by decrementing seat count for given ride_id 
    
    def delete_ride(self, id:str) -> bool:
        """
        Removes the given ride from the Rides table 

        Returns True upon successful deletion, False otherwise 

        Parameters
        ----------

        id : str
            The unique identifier for this ride 

        """
        query = (
            " DELETE FROM Rides WHERE driver_id = %s"
        )
        params = (id,)

        try:
            self.cursor.execute(query,params)
            self.connection.commit()
            return True
        except:
            return False


    
    def find_rides(self, params) -> dict:
        """
        Currently fetches all rides that occur on the specified date from the database
        Converts result into JSON format for easy processing in front end
        Returns an empty list if no rides found for the given date 


        Parameters
        --------

        params : dict
            The user-specified set of params on which to query for
        """
        
        query= (
            """SELECT *, 
                    (
                    3959 * acos (
                    cos ( radians(%(fromLat)s) )
                    * cos( radians( fromLat ) )
                    * cos( radians( fromLng ) - radians(%(fromLng)s))
                    + sin ( radians(%(fromLat)s) )
                    * sin( radians( fromLat ) ))
                    ) AS distance,
                    DATEDIFF(date, %(date)s) AS timeDelta
                FROM MasterRides
                HAVING distance < 35 AND timeDelta >= 0 AND seats > 0
                ORDER BY timeDelta, distance
                LIMIT 0 , 20"""
        )

        
        try:
            self.cursor.execute(query, params)     # must pass params as tuples, hence (x,) format
            rows = self.cursor.fetchall()
        except:
            return []

        # Now convert SQL output into JSON for frontend 
        results = []
        headers = [x[0] for x in self.cursor.description]   # grab column names

        for record in rows:
            results.append(dict(zip(headers,record)))
        

        return self.format_results(results)
    
    def format_results(self, results):
        #separates datetime objects into date and time key values
        for result in results:
            dtime = result['date']
            result.pop('date')
            result['date'] = dtime.strftime('%Y-%m-%d')
            result['time'] = dtime.strftime('%H:%M:%S')
        
        return results
    
    def test_add(self):
        query= (
        """
            INSERT INTO tester
            VALUES (7,''wooo', 'test');
        """
        )

        try:
            self.cursor.execute(query)     # must pass params as tuples, hence (x,) format
            self.connection.commit()
        except ms.Error as err:
            if err.errno == 1062:
                return "duplicate entry can't insert"

            else: return "random error dunno"
        return id

# params = {'from':'Los Angeles', 'to':'San Diego', 'fromLat': '12.12', 'fromLng': '54.2', 
# 'make':'toyota', 'plate':'HKG342', 'date':'2021-21-11 12:00:00', 'price':'4', 'seats':'5', 'model':'blah'
# }


db_handle = Database()
y = db_handle.connect_to_db()

if y == CONN_FAILURE:
    print("failed to connect")

print(db_handle.test_add())



# values = {'id':'1', 'seats': "5", 'to': "Los Angeles"}

# x = db_handle.find_rides(params)

# print(x)

