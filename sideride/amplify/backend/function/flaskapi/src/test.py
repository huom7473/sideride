import unittest

from mysql.connector.connection import MySQLConnection
from sql_db import mysql_db

#test db class file from this test script
#testing just the connect method from module, few different tests
#each test needs an input and expected value

configs = [
    #correct info, expect pass
    {
        'user': 'SideRideProject',
        'password': 'SideRideProject130*',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
        'database': 'SideRideSchema',
        'raise_on_warnings': True
    }, 
    
    #user is incorrect, expect fail
    {
        'user': 'SideRideProjectxyz',
        'password': 'SideRideProject130*',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
        'database': 'SideRideSchema',
        'raise_on_warnings': True
    }, 

    #password is incorrect, expect fail
    {
        'user': 'SideRideProject',
        'password': 'wrongpassword',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
        'database': 'SideRideSchema',
        'raise_on_warnings': True
    }, 

    #host is incorrect, expect fail
    {
        'user': 'SideRideProject',
        'password': 'SideRideProject130*',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonafdsafasdfws.com',
        'database': 'SideRideSchema',
        'raise_on_warnings': True
    }, 

    #db is incorrect, expect fail
    {
        'user': 'SideRideProject',
        'password': 'SideRideProject130*',
        'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
        'database': 'SideRide',
        'raise_on_warnings': True
    }, 

]

class TestDBConnection(unittest.TestCase):

    def test_connect(self):
        for config in configs:
            with self.subTest(config):
                sql_db = mysql_db(config)
                self.assertIsInstance(sql_db.connect_to_db(), MySQLConnection)


#or
#  
# def suite():
#     test_suite = unittest.TestSuite()
#     test_suite.addTest(unittest.makeSuite(TestDBConnection))
#     return test_suite
# mySuite = suite()
# runner = unittest.TextTestRunner()
# runner.run(mySuite)

if __name__ == '__main__':
    unittest.main()