from datetime import datetime, date, timedelta

class Ride:

    def __init__(self, params):
        """
            params is a Multidict passed in from Flask API, holding all attributes consisting of a Ride
        """
        self.attributes = dict(params)
    

    def formatDate(self):
        """
            Format the given Date and Time strings into a DATETIME object for the DB 

            We assume that users enter in a valid value for hour ([00-24])

            Output format: 'YYYY-MM-DD HH:MM:SS'
        """

        date_initial = self.attributes.get('date')
        del self.attributes['date']
        time = self.attributes.get('time')
        del self.attributes['time']

        # Now construct date and time strings into a DATETIME literal, and insert back in as attribute
        formatted_date = date_initial + " " + f"{time}:00:00"

        self.attributes['datetime'] = formatted_date

    def getAll(self):
        return self.attributes
        