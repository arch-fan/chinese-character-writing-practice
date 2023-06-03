import requests

hanzi = input("Input the characters: ")
hanzi = hanzi.replace(" ", "").replace("\n", "")

n = 200
parts = [hanzi[i:i+n] for i in range(0, len(hanzi), n)]

url = "https://www.mangoworksheets.com/cn/generated"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0"
}

for i, x in enumerate(parts):
    print(x)
    payload = {
        "text": x,
        "miaohong": "option3",
        "ispinyin": "yes",
        "size": "2"
    }
    response = requests.post(url, headers=headers, data=payload)
    with open(f"chars{i}.pdf", "wb") as file:
        file.write(response.content)
    print(response)
