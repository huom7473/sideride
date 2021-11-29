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
    
    create_ride(params)
        adds an entry to the DB signifying the new ride with the given params 
        
    find_rides_(params)
        serves user list of rides meeting supplied params 
    
    add_driver()
        logs new driver into backend table 

    add_rider()
        logs new rider into backend table (called when user requests to book a seat in a ride)
    
    accept_ride()
        sets user's status for ride to ACCEPTED

    deny_ride()
        sets user's status for ride to DENIED
    
    update_seatCount()
        decrement seat count for given ride if possible
    
    cleanupRides()
        prune all rides that start before the current date 
    
    delete_riders()
        removes all entries from Riders table
    
    def find_rides()
        finds all rides matching given search parameters

    def format_results()
        formats SQL output into frotend-friendly form 
    
    def myrides()
        finds all rides for current user (both driving and riding)
    
    """
    #get rid of return none
    def __init__(self, config=default_config):
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
        
        ride: A Ride object composed of parameters such as from/to locations, date, price, car, etc.

        """

        params = ride.getAll()
        
        insert_stmt = (
            "INSERT INTO MasterRides "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NULL, %s, %s)"
        )
        
        values = (
            params['driver'], params['from'], params['to'], params['fromLat'], params['fromLng'],
            params['make'], params['plate'], params['datetime'], 
            params['price'], params['seats'], params['model'], params['toLat'], params['toLng']
            )
        
        # This catches improper insertions 
        try:
            self.cursor.execute(insert_stmt,values)
            id = self.cursor.lastrowid
            ride.set_ride_id(id)
            self.connection.commit()
            return True
            #GET RID OF THIS LINE AT 130
        except ms.Error as err:
            return err.msg
    
    def add_driver(self, ride:Ride) -> bool:
        """
            Adds the driver as a "user of the ride" to the secondary Riders table with following schema:
            
            ride_id | username | status | is_driver 

            Returns True on success, False on failure. 

            Parameters
            -------- 
        
            ride: A Ride object composed of parameters such as from/to locations, date, price, car, etc.
        """
        params = ride.getAll()
        id = ride.get_ride_id()
        insert_stmt = (
            "INSERT INTO Riders "
            "VALUES (%s, %s, %s, %s)"
        )
        
        values = (
            id, params['driver'], 'ACCEPTED', True
            )
        
        # This catches improper insertions 
        try:
            self.cursor.execute(insert_stmt,values)
            self.connection.commit()
            return True
        except ms.Error as err:
            return err.msg

    def add_rider(self, ride_id, rider_username):
        """
            Called from the "book seat" button, add the user to the requested ride 

            Takes in the ride_id and username, adds entry into Riders table

            Returns True on success, False on failure 

            Parameters
            --------
            ride_id: an integer describing a unique ride 

            rider_username: currently logged in username 

        """
        # First check that this rider is not already part of the specific ride 
        # Return False right away if they are 
        # Otherwise add entry 

        insert_stmt = (
            "INSERT INTO Riders "
            "VALUES (%s, %s, %s, %s)"
        )
        
        values = (
            ride_id, rider_username, 'PENDING', False
            )
        
        try:
            self.cursor.execute(insert_stmt,values)
            self.connection.commit()
            return (0, "Updated ride with new rider")
        except ms.Error as err:
            # Code 1062 = failed insertion due to duplicate primary key
            if err.errno == 1062: return (1062,err.msg)

    def accept_ride(self, ride_id, user):
        """
            Changes status of rider from PENDING->ACCEPTED
            Decrement seat count for the ride by 1 

            Parameters
            --------
            ride_id: an integer describing a unique ride 

            user: currently logged in username 

        """
        # First check if the ride has seats left, return false right away if it doesn't

        query = (
            "SELECT seats FROM MasterRides WHERE ride_id = %s "
        )
        i = (ride_id,)
        self.cursor.execute(query,i)
        rows = self.cursor.fetchall()
        results = []
        headers = [x[0] for x in self.cursor.description]   # grab column names

        for record in rows:
            results.append(dict(zip(headers,record)))
        
        results = results[0]
        if results['seats'] < 1:
            return (1, "No space left in ride")

        update = (
            "UPDATE Riders SET status = 'ACCEPTED' WHERE ride_id = %s AND username = %s "
        )

        values = (ride_id,user)

        try:
            self.cursor.execute(update,values)
            self.connection.commit()
        except ms.Error as err:
            return (1,err.msg)

        # Then UPDATE MasterRides by decrementing seat count for given ride_id 
        msg =  self.update_seatCount(ride_id)
        if msg == True: return (0,True)
        else: return (0,msg)

    def update_seatCount(self,ride_id):
        """
            Decrements seat count for given ride id

            Parameters
            -----------
            ride_id: an integer describing a unique ride 
        """

        update = (
            "UPDATE MasterRides SET seats = seats-1 WHERE ride_id = %s "
        )

        values = (ride_id,)

        try:
            self.cursor.execute(update,values)
            self.connection.commit()
            return True
        except ms.Error as err:
            return err.msg
    
    def deny_ride(self, ride_id, user):
        """
            Changes status of rider from PENDING->DENIED
            
            Parameters
            --------
            ride_id: an integer describing a unique ride 

            user: currently logged in username 
        """

        update = (
            "UPDATE Riders SET status = 'DENIED' WHERE ride_id = %s AND username = %s "
        )

        values = (ride_id,user)

        try:
            self.cursor.execute(update,values)
            self.connection.commit()
            return True
        except ms.Error as err:
            return (err.msg)
    
    def cleanup_rides(self):
        """
        Removes all entries from MasterRides with trip start dates that occur before current date  


        """
        queryA = ("""SET SQL_SAFE_UPDATES = 0""")
        queryB = ("""DELETE FROM MasterRides WHERE date < curdate()""")
        queryC = ("""SET SQL_SAFE_UPDATES = 1""")
        

        try:
            self.cursor.execute(queryA)
            self.cursor.execute(queryB)
            self.cursor.execute(queryC)
            self.connection.commit()
            return True
        except ms.Error as err:
            # Error code for attempting an unsafe update 
            if err.errno == 1175:
                return err.msg
            else: return err.msg

    def delete_riders(self):
        """
        Removes all entries from Rides


        """
        queryA = ("""SET SQL_SAFE_UPDATES = 0""")
        queryB = ("""DELETE FROM Riders""")
        queryC = ("""SET SQL_SAFE_UPDATES = 1""")
        

        try:
            self.cursor.execute(queryA)
            self.cursor.execute(queryB)
            self.cursor.execute(queryC)
            self.connection.commit()
            return True
        except ms.Error as err:
            # Error code for attempting an unsafe update 
            if err.errno == 1175:
                return err.msg
            else: return err.msg


    
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
        
        query = (
            """SELECT *, 
                (
                3959 * acos (
                cos ( radians(%(fromLat)s) )
                * cos( radians( fromLat ) )
                * cos( radians( fromLng ) - radians(%(fromLng)s))
                + sin ( radians(%(fromLat)s) )
                * sin( radians( fromLat ) ))
                ) AS fromDistance,
                (
                3959 * acos (
                cos ( radians(%(toLat)s) )
                * cos( radians( toLat ) )
                * cos( radians( toLng ) - radians(%(toLng)s))
                + sin ( radians(%(toLat)s) )
                * sin( radians( toLat ) ))
                ) AS toDistance,
                DATEDIFF(date, %(date)s) AS timeDelta
            FROM MasterRides
            HAVING fromDistance < 20 AND toDistance < 20 AND timeDelta >= 0
            ORDER BY timeDelta, fromDistance, toDistance
            LIMIT 0 , 20"""
        )
        
        try:
            self.cursor.execute(query, params)     # must pass params as tuples, hence (x,) format
            rows = self.cursor.fetchall()
        except ms.Error as err:
            return err.msg

        # Now convert SQL output into JSON for frontend 
        results = []
        headers = [x[0] for x in self.cursor.description]   # grab column names

        for record in rows:
            results.append(dict(zip(headers,record)))
        

        return self.format_results(results)
    
    def format_results(self, results):
        """
            Formats date time of SQL output 
        """
        #separates datetime objects into date and time key values
        for result in results:
            dtime = result['date']
            result.pop('date')
            result['date'] = dtime.strftime('%Y-%m-%d')
            result['time'] = dtime.strftime('%H:%M:%S')
        
        return results

    def myrides(self, username):
        """
            Displays all rides associated with given username 

            Parameters
            ----------
            username: the currently logged in username 
        """
        # First try to grab all riders that are associated with current driver's rides 
        driver_query = (
            """SELECT ride_id, username, status FROM Riders
                WHERE ride_id IN (
                SELECT ride_id FROM MasterRides
                WHERE driver_username = %s)
                AND is_driver = 0"""
        )

        value = (username,)
        
        try:
            self.cursor.execute(driver_query, value)     # must pass params as tuples, hence (x,) format
            driver_rows = self.cursor.fetchall()
        except:
            return "Failed to execute my rides querys"

        # Convert data into format for frontend
        driver_results = []
        headers = [x[0] for x in self.cursor.description]   # grab column names

        for record in driver_rows:
            driver_results.append(dict(zip(headers,record)))

        # Then execute the query for riders

        rider_query = (
            """SELECT * FROM MasterRides 
                INNER JOIN Riders ON
                MasterRides.ride_id=Riders.ride_id
                WHERE Riders.username = %s
                ORDER by MasterRides.date"""
        )

        self.cursor.execute(rider_query, value)
        rider_rows = self.cursor.fetchall()
        
        # Else convert SQL output into dict for frontend 
        rider_results = []
        headers = [x[0] for x in self.cursor.description]   # grab column names

        for record in rider_rows:
            rider_results.append(dict(zip(headers,record)))
        
        return {'my_passengers': driver_results, 'rides i am part of': rider_results}

    

# params = {'from':'Area 51, NV, USA', 'to':'Area 51, NV, USA', 'fromLat': '37.2431', 'fromLng': '-115.793', 
#  'datetime':'2021-12-12 12:00:00','toLat': '34.0195', 'toLng': '-118.491', 'price':'12', 'seats':'5', 'make':'Toy',
#  'model':'woo', 'plate':'SDFSADF', 'driver':'kuroodi'}

# test_config = {
#     'user': 'SideRideProject',
#     'password': 'SideRideProject130*',
#     'host': 'database-side-ride-project.ch9vjbv.oh8tk.us-east-2.rds.amazonaws.com',
#     'database': 'SideRideSchemaTest',
#     'raise_on_warnings': True
# }
db_handle = Database()
y = db_handle.connect_to_db()

if y == CONN_FAILURE:
    print("failed to connect")

# print(db_handle.accept_ride('81','kuroodi'))
# print(db_handle.create_ride(Ride(params)))
# print(db_handle.update_seatCount('22'))

# print(db_handle.find_rides(params))



# values = {'id':'1', 'seats': "5", 'to': "Los Angeles"}

# x = db_handle.find_rides(params)

# print(x)

