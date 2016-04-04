# -*- coding: utf-8 -*-

import os
from os import listdir
from os.path import isfile, join
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask import send_file
from werkzeug import secure_filename
import json, uuid
import io

# http://flask.pocoo.org/docs/0.10/patterns/fileuploads/

UPLOAD_FOLDER = 'files/'
ALLOWED_EXTENSIONS = set(['jpg'])

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DEBUG'] = True

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload():
    if request.method != 'POST':
        return ""
    file = request.files['file']
    extension = os.path.splitext(file.filename)[1]
    filename = str(uuid.uuid4()) + extension

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return json.dumps({'filename':filename})

@app.route("/")
def index():
    folder = app.config['UPLOAD_FOLDER']
    onlyfiles = [f for f in listdir(folder) if isfile(join(folder, f))]
    return json.dumps({
        'count':len(onlyfiles),
        'files':onlyfiles
    })

@app.route("/images/<filename>")
def getImage(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

if  __name__ == '__main__':
    app.run(debug=True)
