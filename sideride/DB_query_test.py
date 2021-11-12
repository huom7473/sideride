# mysql-connector is a Python package to get a Python hook into MySQL
# You'll need to install the package (i.e. pip install mysql-connector) first
import mysql.connector as ms

# These will be useful for serving queries based on date range
from datetime import datetime, date, timedelta

config = {
  'user': 'SideRideProject',
  'password': 'SideRideProject130*',
  'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
  'database': 'SideRideSchema',
  'raise_on_warnings': True
}

try:
    connection = ms.connect(**config)
    connection.get_warnings = True
    cursor = connection.cursor()
except ms.Error as e:
    print(e.msg)
    #print(connection.is_connected())       use to check if connection still alive 
    exit()

# Once we have established a connection, do whatever you want to the table
insert_stmt = (
  "INSERT INTO Rides (driver_id, start, stop, date) "
  "VALUES (%s, %s, %s, %s)"
)
data = (0, 'Santa Fe', 'Salinas', '2019-12-02')

table = "LoginInformation"

query_stmt = (
    "SELECT * FROM Rides"
)

data2 = ('Tijuana',)
# query = ("SELECT * FROM " +table+ " WHERE Password = 'TestPassword1f' ")

# This catches improper queries 
try:
    cursor.execute(query_stmt)
    connection.commit()
except:
    cursor.fetchwarnings()

rows = cursor.fetchall()

# Now convert results into JSON format for React to be happy 
results = []
headers = [ x[0] for x in cursor.description]   # grab column names

for record in rows:
    results.append(dict(zip(headers,record)))

for result in results:
    print(result)



# Always close connections when done
# NOTE: for table updates, need to call connection.commit() to persist changes
cursor.close()
connection.close()
