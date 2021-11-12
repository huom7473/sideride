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
        self.connection
        self.cursor

    def get_handle(self):
        """
        Returns handle to the DB instance 
        """
        return self.connection

    def connect_to_db(self):
        """
        Uses supplied config file to connect to a mySQL database, initialize the cursor, and return the handle
        for the connection to user 

        Returns a static message CONN_FAILURE on failure to establish connection
        """
        try:
            self.connection = ms.connect(**self.config) 
            self.cursor = self.connection.cursor()    
            self.get_handle() 
        except:
            return CONN_FAILURE
    
    def add_ride(self, id:str, start:str, stop:str, date:str):
        """
        Adds the specified ride to the Rides table in the backend DB

        Parameters
        --------

        id : str
            A unique id that identifies the Driver object responsible for this ride 
        
        start : str
            The starting location for the trip
        
        stop : str
            The ending location for the trip
        
        date : 
            The date (YYYY-MM-DD) for which the trip is scheduled

        """
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
    
    def delete_ride(self, id:str):
        """
        Removes the given ride from the Rides table 

        Parameters
        ----------

        id : str
            The unique identifier for this ride 

        """
        query = (
            " DELETE FROM Rides WHERE driver_id = %s"
        )
        params = (id,)

        self.cursor.execute(query,params)
        self.connection.commit()

    def find_rides_by_date(self, date:str):
        """
        Fetches all rides that occur on the specified date from the database
        Converts result into JSON format for easy processing in front end
        Returns an empty list if no rides found for the given date 

        Parameters
        --------

        date : str
            The user-specified date to query for 
        """
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
        
    
