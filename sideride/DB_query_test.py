# mysql-connector is a Python package to get a Python hook into MySQL
# You'll need to install the package (i.e. pip install mysql-connector) first
import mysql.connector as ms

# These will be useful for serving queries based on date range
from datetime import datetime, date, timedelta

config = {
  'user': 'SideRideProject',
  'password': 'SideRideProject130*',
  'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
  'database': 'SideRideSchema4',
  'raise_on_warnings': True
}

try:
    connection = ms.connect(**config)
    print(connection.is_connected())
    cursor = connection.cursor()
except ms.Error as e:
    print(e.msg)
    print(connection.is_connected())
    exit()

# Once we have established a connection, do whatever you want 

query = ("SELECT * FROM LoginInformation WHERE Password = 'TestPassword' ")
x = cursor.execute(query)
if cursor: print("woo!")

for user, pw in cursor:
    print(f"We have user: {user} with password: {pw}")      # basic test to print to console 


# Always close connections when done
# NOTE: for table updates, need to call connection.commit() to persist changes
cursor.close()
connection.close()
