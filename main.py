import requests
from PyPDF2 import PdfMerger
from io import BytesIO
import sys

merger = PdfMerger()

if len(sys.argv) > 1:
    hanzi = sys.argv[1]
else:
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
    merger.append(BytesIO(response.content))

merger.write("pdf/result.pdf")
merger.close()