import requests

# def get_proxy():
#     return requests.get("http://127.0.0.1:5010/get/").json()

# def delete_proxy(proxy):
#     requests.get("http://127.0.0.1:5010/delete/?proxy={}".format(proxy))

# # your spider code

# def getHtml():
#     # ....
#     retry_count = 5
#     proxy = get_proxy().get("proxy")
#     while retry_count > 0:
#         try:
#             html = requests.get('http://www.example.com', 
#                                 headers={
#                                     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
#                                     'accept-language': 'zh-CN,zh;q=0.9',
#                                     'cookie': '_ga=GA1.1.817224944.1712020496; _ga_J74WJ3FL3J=GS1.1.1712037535.4.1.1712038069.0.0.0',
#                                     'referer': 'http://kkmzt.com/beauty/',
#                                     'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
#                                     'sec-ch-ua-mobile': '?0',
#                                     'sec-ch-ua-platform': '"macOS"',
#                                     'sec-fetch-dest': 'document',
#                                     'sec-fetch-mode': 'navigate',
#                                     'sec-fetch-site': 'same-origin',
#                                     'sec-fetch-user': '?1',
#                                     'upgrade-insecure-requests': '1',
#                                     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
#                                 },
#                                 proxies={"http": "http://{}".format(proxy)})
#             # 使用代理访问
#             return html
#         except Exception:
#             retry_count -= 1
#     # 删除代理池中代理
#     delete_proxy(proxy)
#     return None


import requests
requests.get("http://httpbin.org/ip", proxies={"http": "http://127.0.0.1:24000"}).json()

