# Getting Started

To run this project, run the following commands in the project's root directory:

- ```npm install``` (to install all packages for the React front-end)
- ```virtualenv venv``` (to create a virtual environment for downloading the requisite python packages)
- ```pip install requirements.txt``` (after activating a virtualenv)
- ```python manage.py runserver``` (to launch the Django back-end server)
- ```npm start``` (to launch the React front-end server)

It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

At present, there is no database of Youtubers included in this repo (nor a script to generate a default QuerySet),
so you will need to go to localhost:8000/api/youtubers/ or launch a shell session (via ```python manage.py shell```) to manually enter
a list of Youtubers for the site to function correctly.

# Why YourTube?
I wanted a Youtube feed that de-emphasized Youtubers that uploaded often (restricting Youtubers to one entry per feed),
as well as the ability to easily generate different playlists for different moods. 

If you use Youtube often enough to make it worth your while 
and find you have similar preferences to what I outlined above, feel free to give YourTube a try.