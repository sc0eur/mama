from transformers import pipeline
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, AutoConfig
from .utils import parse_reply

# load nli modes from models directory. script models/download_model.py must be ran beforehand
model = AutoModelForQuestionAnswering.from_pretrained("./models/qna")
tokenizer = AutoTokenizer.from_pretrained("./models/qna")
config = AutoConfig.from_pretrained('./models/qna')

answer = pipeline("question-answering",
                      model=model, tokenizer=tokenizer, config=config)


def get_answer(question, context):
    # scores = classifier(text, labels, hypothesis_template=hypothesis_template}})
    context = parse_reply(context)['re']
    # with open("cont.txt", "w") as f:
    #     f.write(context)
    result = answer(question=question, context=context)

    return result["answer"]
