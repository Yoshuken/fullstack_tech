# fullstack_tech

## Setbacks
I used the OpenLibray instead of the Google API because the Google API was blocking my requests from the get go. Somehow it just kept on sending 429 responses even on my first requests to the API. Not sure if it is because I've been doing something wrong or becaues in the past I've worked with this API which may have triggered a IP constraint but I've found somewhat of a workaround with another open source API. https://openlibrary.org/dev/docs/api/search


## Getting Started

### API setup

To setup the Flask server for the backend will need to install the packages first, ideally into a virtualenv

```
python -m venv venv # or virtualenv venv
source venv/bin/activate # On windows venv/Scripts/activate
pip3 install -r requirements.txt
```

Once you have the dependencies installed you can start the script from the root backend directory, you can also make the venv inside the backend directory if you chose to

```
cd backend
python3 main.py
```

### APP setup

For the frontend we just need to start a localhost with the index.html, eveything else should run directly through that. For example, we can use the python http server command to the port of our chosing, that way we can set the API server and the APP on the same host

```
cd frontend
python3 -m http.server 5500
```

#### Resources

- *https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch*

- *https://github.com/techwithtim/Flask-React-Full-Stack-App/tree/main*

- *https://github.com/Yoshuken/BOMICS*

- *https://flask.palletsprojects.com/en/stable/patterns/sqlite3/*

- *https://www.geeksforgeeks.org/python/flask-http-methods-handle-get-post-requests/*

- *https://stackoverflow.com/questions/3842614/how-do-i-call-a-javascript-function-on-page-load*

- *https://stackoverflow.com/questions/63046477/how-to-get-an-element-from-event-target-closestname*

- *https://openlibrary.org/dev/docs/api/search*

- *https://github.com/othneildrew/Best-README-Template*
