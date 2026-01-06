from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from pytubefix import YouTube
import os, uuid, time

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOWNLOAD_DIR = os.path.join(BASE_DIR, "downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

progress = 0

@app.route("/")
def home():
    return "Backend running"

# ---------------- INFO ----------------
@app.route("/info", methods=["POST"])
def info():
    url = request.json.get("url")
    yt = YouTube(url)

    qualities = []
    for s in yt.streams.filter(progressive=True, type="video"):
        if s.resolution:
            qualities.append({
                "quality": s.resolution.replace("p", ""),
                "size": round(s.filesize / (1024*1024), 2)
            })

    qualities.sort(key=lambda x: int(x["quality"]))

    return jsonify({
        "title": yt.title,
        "thumbnail": yt.thumbnail_url,
        "qualities": qualities
    })

# ---------------- DOWNLOAD ----------------
@app.route("/download")
def download():
    global progress
    progress = 0

    url = request.args.get("url")
    quality = request.args.get("quality")
    dtype = request.args.get("type")

    yt = YouTube(url)

    def on_progress(stream, chunk, bytes_remaining):
        global progress
        total = stream.filesize
        progress = int(100 - (bytes_remaining / total) * 100)

    yt.register_on_progress_callback(on_progress)

    safe_title = "".join(c for c in yt.title if c.isalnum() or c in " _-").strip()
    uid = str(uuid.uuid4())

    if dtype == "mp3":
        audio = yt.streams.filter(only_audio=True).first()
        path = audio.download(
            output_path=DOWNLOAD_DIR,
            filename=f"{safe_title}.mp3"
        )
        return send_file(path, as_attachment=True)

    video = yt.streams.filter(progressive=True, res=f"{quality}p").first()
    if not video:
        return "Quality not available", 400

    path = video.download(
        output_path=DOWNLOAD_DIR,
        filename=f"{safe_title}_{quality}p.mp4"
    )

    return send_file(path, as_attachment=True)

# ---------------- PROGRESS ----------------
@app.route("/progress")
def progress_stream():
    def generate():
        global progress
        while progress < 100:
            yield f"data:{progress}\n\n"
            time.sleep(0.3)
        yield "data:100\n\n"
    return Response(generate(), mimetype="text/event-stream")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
