from flask import Flask, render_template, send_from_directory, abort, request
from werkzeug.utils import secure_filename
import json
import os

import settings

app = Flask(
    __name__,
    static_folder=settings.STATIC_FOLDER,
    template_folder=settings.TEMPLATE_FOLDER,
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/<path:file>")
def root_asset(file):
    if file in settings.PUBLIC_FILES:
        return send_from_directory(app.template_folder, file)
    else:
        abort(404)

@app.route("/scripts/<path:file>")
def scripts(file):
    return send_from_directory(os.path.join(app.template_folder, "scripts"), file)

@app.route("/users")
def users():
    return json.dumps(os.listdir(os.path.join(settings.DATA,"users")))

@app.route("/program/<path:user>")
def program(user):
    return send_from_directory(os.path.join(settings.DATA,"users",user),"program.json")

@app.route("/<path:dtype>/<path:user>", methods=["GET", "POST"])
def maxes(dtype, user):
    
    if dtype not in settings.DTYPES:
        abort(404)
    elif user not in os.listdir(os.path.join(settings.DATA,"users")):
        abort(404)
    elif request.method == "POST":
        # validate the json here
        # TODO add "append"
        with open(os.path.join(settings.DATA,"users",user,f"{dtype}.json"),"w") as f:
            json.dump(request.json,f,indent=4)
        return ("",204)
    
    elif request.method == "GET":
        # TODO add pagination
        return send_from_directory(os.path.join(settings.DATA,"users",user), f"{dtype}.json")


if __name__ == "__main__":
    app.run(debug=True)