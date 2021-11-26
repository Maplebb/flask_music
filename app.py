import os
import json
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET'])
def music():
    mp3_dir = "./static/mp3"
    lyrics_dir = "./static/lyrics"
    mp3_files = os.listdir(mp3_dir)
    print(mp3_files)
    lyrics_files = os.listdir(lyrics_dir)
    mp3_lyrics_arr = []
    for each_mp3 in mp3_files:
        mp3_name = each_mp3.split('.')[0]
        for each_lyrics in lyrics_files:
            lyrics_name = each_lyrics.split('.')[0]
            if (mp3_name == lyrics_name):
                with open("./static/lyrics/"+each_lyrics, "r", encoding="utf-8") as f:
                    data = f.read()
                mp3_lyrics_arr.append([mp3_name, data])
                break
    return render_template("index.html", music_data=json.dumps(mp3_lyrics_arr))


if __name__ == '__main__':
    app.config['JSON_AS_ASCII'] = False
    app.run(port=5001)