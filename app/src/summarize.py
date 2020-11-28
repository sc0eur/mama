from summa import textrank as tr
from .utils import clean_text, parse_reply

def get_summary(text):
    text = parse_reply(text)['re']
    # text = clean_text(text)
    return list(filter(lambda x: x[0].isdigit() or x[0].isalpha(), tr.summarize(text,
                        ratio=0.2,
                        split=True,
                        scores=False)))
