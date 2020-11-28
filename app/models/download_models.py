from transformers import *

# directory where models should be stored
summary_dir = './models/qna'
nli_dir = "./models/qna"


# if other model is wanted then you should visit https://huggingface.co/models

# here we download pretrained models and their tokenizer
model2 = AutoModelForSequenceClassification.from_pretrained('joeddav/xlm-roberta-large-xnli')
tokenizer2 = AutoTokenizer.from_pretrained('joeddav/xlm-roberta-large-xnli')
model2.save_pretrained(nli_dir)
tokenizer2.save_pretrained(nli_dir)
del model2
del tokenizer2
model = AutoModelForQuestionAnswering.from_pretrained("mrm8488/bert-multi-cased-finedtuned-xquad-tydiqa-goldp")
tokenizer = AutoTokenizer.from_pretrained("mrm8488/bert-multi-cased-finedtuned-xquad-tydiqa-goldp")

# save them to defined directory
model.save_pretrained(summary_dir)
tokenizer.save_pretrained(summary_dir)
