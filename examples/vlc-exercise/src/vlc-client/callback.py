from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/callback', methods=['POST'])
def callback():
    data = request.json
    print("Notifica ricevuta:", data)

    
    return jsonify({"status": "received", "data": data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090, debug=True)
