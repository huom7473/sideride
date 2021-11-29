import pytest
import DB_manager as dm
import Ride_manager as rm
import mysql.connector as ms

#run test with: pytest .\src\ --cov=. --cov-branch
#from the flaskapi folder

default_config = {
    'user': 'SideRideProject',
    'password': 'SideRideProject130*',
    'host': 'database-side-ride-project.ch9vjbv.oh8tk.us-east-2.rds.amazonaws.com',
    'database': 'SideRideSchemaTest',
    'raise_on_warnings': True
}

@pytest.mark.parametrize("ride", [
    {
        'driver': 'Tom Cruise', 
        'from': 'Scientology Building',
        'to': 'Cedars Sinai Medical Center',
        'fromLat': 34.098091,
        'fromLng': -118.294243, 
        'toLat': 34.074940, 
        'toLng': -118.382420, 
        'make': 'Subaru', 
        'plate': '7XTD345', 
        'datetime': '2021-11-25 11:11:11', 
        'price': 17, 
        'seats': 3, 
        'model': 'Outback'  
    }, 
    {
        'driver': 'Red Riding Hood', 
        'from': 'Angeles National Forest',
        'to': 'Grandmas Deli Babushka',
        'fromLat': 34.291540,
        'fromLng': -118.362560, 
        'toLat': 34.097470, 
        'toLng': -118.349980, 
        'make': 'Harley Davidson', 
        'plate': 'R3DH00D', 
        'datetime': '2021-11-24 22:11:11', 
        'price': 5, 
        'seats': 2, 
        'model': 'Heritage'  
    }
])

@pytest.mark.parametrize("rider", [
    {
        'id': 1,
        'username': 'tony'
    },
        {
        'id': 2,
        'username': 'obama'
    }, 
        {
        'id': 3,
        'username': 'bush'
    },  
])

@pytest.mark.parametrize("searchParams", [
    {
        'fromLat': 34.098091,
        'fromLng': -118.294243,
        'toLat': 34.074940,
        'toLng': -118.382420, 
        'date': "2021-11-24",
    }, 
        {
        'fromLat': 39.098091,
        'fromLng': 118.294243,
        'toLat': 34.074940,
        'toLng': -118.382420, 
        'date': "2021-11-24",
    } 
])
#expect pass
def test_DB_pipeline(ride, rider, searchParams):
    errors = []
    db = dm.Database(default_config)
    
    if db.connect_to_db() == "Connection failed":
        errors.append("Connnection Failed")
    else: 
        #test create ride
        if db.create_ride(rm.Ride(ride)) == False:
            errors.append("Create Ride Failed")

        if db.add_driver(rm.Ride(ride)) != True: 
            errors.append("Add driver failed" + str(ride))
        
        if db.add_rider(rider['id'], rider['username']) != (0, True):
            errors.append("Add rider failed" + str(rider))
        
        # if db.update_seatCount(ride) != True:
        #     errors.append("Update Seat Count failed" + str(ride))


        #if find rides doenst return a list, it returned err
        if type(db.find_rides(searchParams)) != list:
            errors.append("Find rides failed" + str(db.find_rides(searchParams)))

        #if my rides doesnt return a list, it returned err
        if type(db.myrides(ride['driver'])) != dict:
            errors.append("Myrides failed" + str(db.myrides(ride['driver'])))

        if db.delete_riders() != True:
            errors.append("Delete riders failed")

        if db.cleanup_rides() != True:
             errors.append("Cleanup rides failed" + str(ride))        

    assert not errors, "errors occured:\n{}".format("\n".join(errors))