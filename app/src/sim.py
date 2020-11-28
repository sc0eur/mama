import spacy
import numpy as np
from .utils import parse_reply, clean_text
import pandas as pd

en_use = spacy.load("en_use_md")
df_pasha_2 = pd.read_json("pochistil2.json")
dict_txt = df_pasha_2.to_dict("records")

def get_sim(text, hold = 0.8):
    emb_text = en_use(text)
    # list_txt = list(map(parse_reply, list_txt))

    embs = np.array([emb_text.similarity(en_use(clean_text(txt["to"]))) for txt in dict_txt])
    # print(dict_txt[np.argmax(embs)]["re"])
    # print(dict_txt[np.argmax(embs)]["to"])
    # print(embs)
    # print(dict_txt)
    if max(embs) > hold:
        return dict_txt[np.argmax(embs)]["re"]
    else: return ""

# print(get_sim("Hey!", ["Hello!", "Good morning!", "Good Bye!"]))
