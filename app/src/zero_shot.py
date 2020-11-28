from transformers import pipeline
from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoConfig
from .utils import parse_reply
from .summarize import get_summary
# load nli modes from models directory. script models/download_model.py must be ran beforehand
model = AutoModelForSequenceClassification.from_pretrained("./models/nli")
tokenizer = AutoTokenizer.from_pretrained("./models/nli")
config = AutoConfig.from_pretrained('./models/nli')

# initialize zero-shot-classifier
classifier = pipeline('zero-shot-classification',
                      model=model, tokenizer=tokenizer, config=config)


# labels = ["Жалоба", "Назначение встречи", "сотрудничество"]
# labels = ["complaint", "meeting", "cooperation", "question", "suggestion", "spam"]

def get_label(messages, labels = ["complaint", "meeting", "cooperation", "question", "suggestion", "spam"], hold=0.7):
    """Takes text as input and returns label, that has the highest score
    multi_class parameter set to True indicates, that text may belong to multiple classes
    """
    start = clock()
    ids = dict.fromkeys(labels, 0)
    texts = []
    for i in range(len(messages)):
        # texts.append(' '.join(get_summary(messages[i]['plain'])))
        texts.append(messages[i]['plain'])
        # print(text)
    # scores = classifier(text, labels, hypothesis_template=hypothesis_template}})
    scores = classifier(texts, labels, multi_class=True)
    print(scores)
    for i in range(len(scores)):
        for score, label in zip(scores[i]['scores'],scores[i]['labels']):
            if score > hold:
                if ids[label] == 0:
                    ids[label] = [messages[i]['id']]
                else:
                    ids[label].append(messages[i]['id'])
    print(clock()-start)
    return ids

    # print(scores)
    # if scores['scores'][0] > hold:
    #     return scores['labels'][0]
    # else:
    #     return False
    # return dict(zip(scores['labels'], scores['scores']))
