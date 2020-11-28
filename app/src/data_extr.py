# from dateparser.search import search_dates
import phonenumbers


def find_all(text):
    dic = {"dates": [], "numbers":[]}
    # if search_dates(text):
    # for date, ts in search_dates(text):
    #     dic["dates"].append(date)
    for match in phonenumbers.PhoneNumberMatcher(text, "RU"):
        dic["numbers"].append(match.raw_string)
    return dic
