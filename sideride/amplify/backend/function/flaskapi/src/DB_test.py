import unittest
from DB_manager import *

test_configs = [
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
        for config in test_configs:
            sql_db = DatabaseHandler(config)
            with self.subTest(config):
                self.assertEqual(sql_db.connect_to_db(), CONN_FAILURE)
    
    def test_connect_proper(self):
        sql_db = DatabaseHandler()
        self.assertNotEqual(sql_db.connect_to_db(), CONN_FAILURE)
    
    def test_add_ride(self):
        # First properly connect to DB and grab the handle 
        sql_db = DatabaseHandler()
        sql_db.connect_to_db()

        # Now try inserting a row and check response from DatabaseHandler 
        num, start, stop, date = '5', 'Santa Fe', 'ABQ', '2021-10-09'

        self.assertTrue(sql_db.add_ride(num, start, stop, date))


if __name__ == '__main__':
    unittest.main()