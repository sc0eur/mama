

from flask import Flask, request, make_response, abort, jsonify
from src.zero_shot import get_label
from src.qna import get_answer
from src.summarize import get_summary
from src.sim import get_sim
from src.data_extr import find_all
from flask_cors import CORS
import json
# from json_writer import *

PORT = 8000

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET'], strict_slashes=False)
def root():
    # text = request.args.get('text')
    return "Привет"

@app.route("/labels/", methods=['POST'], strict_slashes=False)
def ids():
    data = request.get_json()
    id = data.get("id")
    with open("data/"+str(id)+'.txt', "r") as f:
        labels = f.read().split(", ")
    res = []
    for i, label in enumerate(labels):
        res.append({"id": i, "name": label[1:-1]})
    resp = make_response(jsonify(res), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True }
    return resp

@app.route("/classify_cache/", methods=['POST'], strict_slashes=False)
def zero_cache():
    data = request.get_json()
    messages = data.get('messages')
    labels = data.get("labels")
    id = data.get("id")
    with open("data/"+str(id)+"_cache"+".json",) as f:
        scores = json.load(f)
    # print(messages)
    # scores = get_label(messages, labels)
    resp = make_response(jsonify(scores), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True }
    return resp

@app.route("/classify/", methods=['POST'], strict_slashes=False)
def zero():
    data = request.get_json()
    messages = data.get('messages')
    labels = data.get("labels")
    id = data.get("id")
    with open("data/"+str(id)+'.txt', "w") as f:
        f.write(str(labels)[1:-1])
    # print(messages)
    scores = get_label(messages, labels)
    with open("data/"+str(id)+"_cache"+".json", "w") as f:
        json.dump(scores, f, indent=4)
    resp = make_response(jsonify(scores), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True }
    return resp

@app.route("/qna/", methods=['POST'], strict_slashes=False)
def qna():
    data = request.get_json()
    # print(data)
    context = str(data.get('context'))
    question = str(data.get('question'))
    res = get_answer(question, context)
    # print("question: ", question)

    resp = make_response(jsonify(res), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True}
    return resp

@app.route("/summary/", methods=['POST'], strict_slashes=False)
def summ():
    data = request.get_json()
    # print(data)
    text = str(data.get('text'))
    res = get_summary(text)
    resp = make_response(jsonify(res), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True}
    return resp

@app.route("/dates/", methods=['POST'], strict_slashes=False)
def dates():
    data = request.get_json()
    text = str(data.get('text'))
    resp = make_response(jsonify(find_all(text)), 200)
    resp.headers = {"Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Credentials" : True }
    return resp

@app.route("/recommend/", methods=['POST'], strict_slashes=False)
def recommend():
    data = request.get_json()

    # print(data)
    text = data.get("text")
    sent = data.get("sent")
    res = get_sim(text)
    resp = make_response(jsonify(res), 200)
    resp.headers = {"Access-Control-Allow-Origin" : 'http://localhost:3000',
                    "Access-Control-Allow-Credentials" : True}
    return resp


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=PORT, threaded=True)
