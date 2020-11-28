from cleantext import clean

from bs4 import BeautifulSoup
from bs4.element import Comment



def tag_visible(element):
    if element.parent.name in ['blockquote','style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def text_from_html(body):
    dots = ['.', '!', '?', ';', ':', " "]
    # reply =
    to = []
    # print(body.split("<blockquote>"))
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    # print(texts[0].parent.name)
    to = [t for t in texts if t.parent.name == "blockquote"]
    print(to)
    visible_texts = filter(tag_visible, texts)
    strp_text = [t.strip() for t in visible_texts if len(t.strip())>0]

    return {"re": u" ".join([t if t[-1] in dots else t + "." for t in strp_text]), "to": u" ".join([t if t[-1] in dots else t + "." for t in to])}

def clean_text(text):
    return clean(text,
        fix_unicode=True,               # fix various unicode errors
        to_ascii=False,                  # transliterate to closest ASCII representation
        lower=False,                     # lowercase text
        no_line_breaks=True,           # fully strip line breaks as opposed to only normalizing them
        no_urls=True,                  # replace all URLs with a special token
        no_emails=True,                # replace all email addresses with a special token
        no_phone_numbers=False,         # replace all phone numbers with a special token
        no_numbers=False,               # replace all numbers with a special token
        no_digits=False,                # replace all digits with a special token
        no_currency_symbols=False,      # replace all currency symbols with a special token
        no_punct=False,                 # remove punctuations
        replace_with_punct="",          # instead of removing punctuations you may replace them
        replace_with_url="",
        replace_with_email="",
        replace_with_phone_number="<PHONE>",
        replace_with_number="<NUMBER>",
        replace_with_digit="0",
        replace_with_currency_symbol="<CUR>",
        lang="ru"                       # set to 'de' for German special handling
    )

def parse_reply(text):
    html_text = "<div>"+text+"</div>"
    text = text_from_html(html_text)
    # splt_txt = text.split("\n> ")
    # re = clean_text(splt_txt[0]).replace(">", '').replace("<", '')
    # if "\n>> " in splt_txt[-1]:
    text["re"] = clean_text(text["re"])
    text["to"] = clean_text(text["to"])
    # else:
    #     to = clean_text(' '.join(splt_txt[1:])).replace(">", '').replace("<", '')
    return text
