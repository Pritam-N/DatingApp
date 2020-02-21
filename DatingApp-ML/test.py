import flask
import sentencePredictor as sp
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"


@app.route('/SentenceComplete', methods=['GET'])
def predict():
    text = request.args.get("text")
    print(text)
    if text:
        output = sp.predict(text)
        print(output)
        return jsonify(output)
    else:
        return "Error: No text field provided. Please update the request to send text."
    

app.run(port=5001)