from flask import Flask, request, session, render_template, url_for, request, redirect
from flask_restful import Resource, Api
from flask_jsglue import JSGlue
from automatic_testing import evaluate
import json

app = Flask(__name__)
api = Api(app)
jsglue = JSGlue(app)


@app.route('/')
def home():
    return render_template('main.html')


@app.route('/match/')
@app.route('/match/<path:match_id>/', methods=['GET', 'POST'])
def challenge(match_id=None):
    if not match_id:
        return redirect(url_for('home'))

    with open('./problems/longest-substring-without-repeating-characters.json') as json_file:
        data = json.load(json_file)

    # Check if match_id exists in firebase before rendering the tempalte.
    # And then pull all the problems data from the document at once.
    return render_template('challenge.html',
                            match_id=match_id,
                            description=data['description'],
                            java_code=data['java'],
                            python_code=data['python'])


@app.route('/leaderboard/')
def leaderboard():
    pass


class CodeBrawl(Resource):
    def get(self):
        return None

    def post(self):
        json = request.get_json()
        extension = '.java' if json.get('language') == 'java' else '.py'
        fileName = json.get('player') + extension
        with open(fileName, 'w+') as file:
            file.write(json.get('data'))


        # TODO: change 'input.txt' and 'expectedoutput.txt' + combine user's input with a master run class.
        # a master run class is a class used to run all files, and gives their output.

        status_code, status_message, console_output = evaluate(fileName,
                                                               input_file='input.txt',
                                                               expected_output_file='expectedoutput.txt',
                                                               timeout=10)
        data = {
            'status_code': status_code,
            'status_message': status_message,
            'console_output': console_output
        }

        return data

api.add_resource(CodeBrawl, '/code-brawl')

if __name__ == '__main__':
    app.run(debug=True)
