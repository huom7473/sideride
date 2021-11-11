import unittest
from sql_db import *

goodconfig =     {
    'user': 'SideRideProject',
    'password': 'SideRideProject130*',
    'host': 'database-side-ride-project.ch9vjbvoh8tk.us-east-2.rds.amazonaws.com',
    'database': 'SideRideSchema',
    'raise_on_warnings': True
}

poorconfigs = [
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

    def test_connect_failures(self):
        for config in poorconfigs:
            sql_db = mysql_db(config)
            with self.subTest(config):
                self.assertEqual(sql_db.connect_to_db(), "Connection failed")
    
    def test_connect_proper(self):
        sql_db = mysql_db(goodconfig)
        self.assertNotEqual(sql_db.connect_to_db(), "Connection failed")


if __name__ == '__main__':
    unittest.main()