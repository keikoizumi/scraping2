# coding:utf-8
from bottle import request, route, get, post, hook, response, static_file, template, redirect, run
from selenium.webdriver.chrome.options import Options
from selenium import webdriver 
import mysql.connector
import datetime
import os.path
import random
import string 
import random
import time
import json
import os


#status
PASTDAY = 'pastday'
ALL = 'all'
KEY = 'key'
DEL = 'del'
DELONE= 'delone'
REGFAVO = 'regfavo'
DELFAVO = 'delfavo'
ALLCOUNT = 'allcount'


#ファイルパス
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

#JS
@route('/static/js/<filename:path>')
def send_static_js(filename):
    return static_file(filename, root=f'{STATIC_DIR}/js')

#img
@route('/static/img/<filename:path>')
def send_static_img(filename):
    return static_file(filename, root=f'{STATIC_DIR}/img')

#rootの場合
@route("/")
def index():
    return template('top')

#総件数
@post('/allcount')
def startscraping():
    #値取得
    qerytype = ALLCOUNT
    sendkey = None
    url = dbconn(qerytype, sendkey)
    #ID NULLチェック
    if isUrlCheck(url):
        print('checkedUrl:')
        #json作成
        jsonUrl = makeJson(url)
        print(type(jsonUrl))
        return jsonUrl

@post('/other')
def postOther():
    #値取得
    data = request.json
    date = data['date']
    qerytype = data['other']

    url = dbconn(qerytype, date)
    #ID NULLチェック
    if isUrlCheck(url):
        print('checkedUrl:')
        #json作成
        jsonUrl = makeJson(url)
        print(type(jsonUrl))
        return jsonUrl
    else:
        return postOther()

@post('/getPastDay')
def pastDay():
    date = None
    qerytype = PASTDAY
    url = dbconn(qerytype, date)
    #ID NULLチェック
    if isUrlCheck(url):
        print('checkedUrl:')
        #json作成
        jsonUrl = makeJson(url)
        print(type(jsonUrl))
        return jsonUrl
    else:   
        return postOther()

#スクレイピング
@post('/scraping')
def startscraping():
    #値取得
    data = request.json
    sendkey = data['sendkey']

    scraping(sendkey)
    
#キーワード削除
@post('/del')
def delete():
    #値取得
    data = request.json
    sendkey = data['sendkey']
    print(sendkey)
    
    qerytype = DEL
    dbconn(qerytype, sendkey)
    pastDay()

#1つ削除
@post('/delone')
def delone():
    #値取得
    data = request.json
    sendkey = data['sendkey']
    print(sendkey)
    print('/delone')
    
    qerytype = DELONE
    dbconn(qerytype, sendkey)
    pastDay()

#お気に入り
@post('/favorite')
def favorite():
    #値取得
    data = request.json
    sendkey = data['sendkey']
    print(sendkey)
    favotype = data['type']
    print(favotype)
    
    if favotype == '1':
        qerytype = REGFAVO
    else:
        qerytype = DELFAVO
    print(favotype)

    dbconn(qerytype, sendkey)

i = 0
def isUrlCheck(url):
    if url == None:
        print('チェックNG')
        global i
        i += 1
        print('i')
        print(i)
        if i < 5:
            return None 
        else:
            return True
    else:
        print('チェックOK')
        return True

def makeJson(url):
    jsonUrl = jsonDumps(url)
    return jsonUrl
    
def jsonDumps(url):
    url = json.dumps(url)
    return isTypeCheck(url)

def isTypeCheck(jsonUrl):
    if type(jsonUrl) is str:
        return jsonUrl
    else:
        jsonDumps(jsonUrl)
    

def dbconn(qerytype, sendkey):
    print("q")
    print(qerytype)
    print(sendkey)

    f = open('./conf/prop.json', 'r')
    info = json.load(f)
    f.close()
    #DB設定
    
    conn = mysql.connector.connect(
            host = info['host'],
            port = info['port'],
            user = info['user'],
            password = info['password'],
            database = info['database'],
    )
    
    cur = conn.cursor(dictionary=True)   
    
    try:    
        #接続クエリ
        if qerytype == ALL:
            sql = "SELECT id,site_id,title,url,img_id,CAST(dt AS CHAR) as dt,favorite FROM scrapingInfo2 WHERE delflg = '0' AND dt LIKE '"+sendkey+'%'"' ORDER BY dt DESC LIMIT 500"
        elif qerytype == KEY:
            sql = "SELECT id,site_id,title,url,img_id,CAST(dt AS CHAR) as dt,favorite FROM scrapingInfo2 WHERE  delflg = '0' AND img_id LIKE '"+sendkey+"'ORDER BY dt DESC  LIMIT 500"
        elif qerytype == PASTDAY:
            sql = "SELECT DISTINCT img_id as dt FROM scrapingInfo2 WHERE delflg = '0' ORDER BY dt DESC"
        elif qerytype == DEL:
            #キーワード削除
            sql = "UPDATE scraping.scrapinginfo2 SET delflg = '1' WHERE img_id = '"+sendkey+"'"
        elif qerytype == DELONE:
            #1つ削除
            sql = "UPDATE scraping.scrapinginfo2 SET delflg = '1' WHERE id = '"+sendkey+"'"
        elif qerytype == REGFAVO:
            #お気に入り登録
            sql = "UPDATE scraping.scrapinginfo2 SET favorite = '1' WHERE id = '"+sendkey+"'"
        elif qerytype == DELFAVO:
            #お気に入り解除
            sql = "UPDATE scraping.scrapinginfo2 SET favorite = '0' WHERE id = '"+sendkey+"'"
        elif qerytype == ALLCOUNT:
            sql = "SELECT count(*) as allcount FROM scrapingInfo2 WHERE delflg = '0'"

        print(sql)

        #クエリ発行
        if qerytype == DEL or qerytype == DELONE or qerytype == REGFAVO or qerytype == DELFAVO:
            print("update/del")
            cur.execute(sql)
            conn.commit()
        else:
            print("select")
            cur.execute(sql)
            cur.statement    
            url = cur.fetchall()

        if url is not None:
            return url
        else:
            print('None')
            return None
    except:
        print("DBエラーが発生しました")
        return None
    finally:
        print('finally')
        cur.close()
        conn.close()

def scraping(sendkey):
    print("scraping start")
    print(sendkey)
    # Chrome Optionsの設定
    options = Options()
    options.add_argument('--headless')                 # headlessモードを使用する
    options.add_argument('--disable-gpu')              # headlessモードで暫定的に必要なフラグ(そのうち不要になる)
    options.add_argument('--disable-extensions')       # すべての拡張機能を無効にする。ユーザースクリプトも無効にする
    options.add_argument('--proxy-server="direct://"') # Proxy経由ではなく直接接続する
    options.add_argument('--proxy-bypass-list=*')      # すべてのホスト名
    options.add_argument('--start-maximized')          # 起動時にウィンドウを最大化する
    driver = webdriver.Chrome(BASE_DIR+'./static/chromedriver.exe')
    driver.get('https://www.google.com/')
    driver.implicitly_wait(30)
    search = driver.find_element_by_name('q')
    
    search.send_keys(sendkey) 
    search.submit() 
    time.sleep(3)     

    i = 1
    i_max = 20
    try:
        while i <= i_max:
            #classがchromeのバージョンによてclassが変更されることあり
            class_group = driver.find_elements_by_class_name('g')
            print('before for loop')
            print(class_group)
            for elem in class_group:
                print('after for loop')
                title = elem.find_element_by_class_name('LC20lb').text 
                url = elem.find_element_by_tag_name('a').get_attribute('href') 

                #DB設定
                f = open('./conf/prop.json', 'r')
                info = json.load(f)
                f.close()
                conn = mysql.connector.connect(
                    host = info['host'],
                    port = info['port'],
                    user = info['user'],
                    password = info['password'],
                    database = info['database']
                )
                now = datetime.datetime.now()
                dt = "{0:%Y-%m-%d %H:%M:%S}".format(now)
                c = conn.cursor()
                #データ登録
                sql = "INSERT INTO scraping.scrapingInfo2(site_id,title,url,img_id,dt) VALUES (2,%s,%s,%s,%s)"
                print('insert')
                print(sql)
                c.execute(sql, (title, url, sendkey, dt))
                sql = 'SET @i := 0' 
                c.execute(sql)
                sql = 'UPDATE `scraping`.`scrapingInfo2` SET id = (@i := @i +1);'
                c.execute(sql)
                conn.commit()
                conn.close()
            if driver.find_elements_by_id('pnnext') == []:
                i = i_max + 1
            else:
                next_page = driver.find_element_by_id('pnnext').get_attribute('href')
                driver.get(next_page)   
                i = i + 1 
                print("next page")              
                time.sleep(5) 
    except:
        #driver.quit()
        print("DBエラーが発生しました")    
    finally:
        # ブラウザを閉じる
        driver.quit()  
              
if __name__ == "__main__":
    run(host='localhost', port=8085, reloader=True, debug=True)