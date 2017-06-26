from gensim.summarization import summarize
import flask
from flask_cors import CORS
from flask import Flask, jsonify, request, Response, abort
from nltk.tokenize import sent_tokenize
import math
from langdetect import detect
from time import sleep

def encode_utf8(sentence):
	"""
	encodes the given sentence in from unicode to utf-8
	"""
	if isinstance(sentence, unicode):
		sentence = sentence.encode("ascii", "ignore").decode("ascii")
	if isinstance(sentence, str):
		sentence = sentence.decode("ascii", "ignore").encode("ascii")
	sentence = sentence.encode('utf-8')
	return sentence				

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/summarize', methods=['POST'])
def api_summarize():
	if not request.json:
		abort(400)

	
	text = request.json['selected_text']
	
	if detect(text)!="u'en'":
		text=text.encode('utf-8')
		text = text.replace('\xe0\xa5\xa4', '.')
		text=text.decode('utf-8')
	
	else:
		text = encode_utf8(text)
	sentencelist = sent_tokenize(text)

	input_len = len(sentencelist)
	output_len = 2 * math.sqrt(input_len)

	compression_ratio = output_len / input_len
	
	print "Compression ratio ", compression_ratio 
	summary = ""
	try:
		#summary = summarize(text, ratio=compression_ratio)
		summary = summarize(text)
		print "OUTPUTTT\n\n"
		print type(summary)
	except: 
		pass

	return jsonify({'200': "OK", 'sentences': sent_tokenize(summary)})


@app.route('/', methods=['POST', 'GET'])
def my_form():
	return Response("hi there")

if __name__ == '__main__':
	app.run(debug=True)
