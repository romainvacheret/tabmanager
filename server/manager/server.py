from flask import Flask, request, jsonify

from manager.service import retrieve_collection, store_scollection

app = Flask(__name__)


@app.route('/collection/store', methods=['POST'])
def store_tabs():
    try:
        data = request.get_json()
        collection_name = data['collection']
        urls = data['urls']
        store_scollection(collection_name, urls)
    except KeyError as e:
        return jsonify({'error': f'Missing key {e}'}), 400
    return jsonify({'message': 'Tabs stored successfully'}), 200


@app.route('/collection/retrieve', methods=['GET'])
def retrieve_tabs():
    if (collection_name := request.args.get('collection')) is None:
        return jsonify({'error': 'Missing parameter \'collection\''}), 400

    returned_collection = retrieve_collection(collection_name)
    return jsonify({'collection_name': collection_name, 'collection': returned_collection}), 200

