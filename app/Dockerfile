FROM python:3.8

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
COPY . .

RUN python3 -m pip install https://github.com/MartinoMensio/spacy-universal-sentence-encoder/releases/download/v0.3.1/en_use_md-0.3.1.tar.gz#en_use_md-0.3.1
RUN python3 -c "import spacy; spacy.load('en_use_md')"
RUN python3 app/models/download_models.py

EXPOSE 8000
CMD ["python3", "-u", "main.py"]
