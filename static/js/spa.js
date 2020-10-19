//グローバル変数
var items = [];
var tUrl = 'http://localhost:8085/';
var all = 'all';
var key = 'key';
var sflag = 0;
var savedata;

//key session
var kye_today;
var kye_skeyword;
var kye_sfavo;

//condition
var condition = {};

//make condition
function make_condition() {
  if (kye_today !== null) {
    condition.date = today();
  }
  else 
  {
    condition.date = null;
  }
  if (kye_skeyword !== null) {
    condition.kye_skeyword = kye_skeyword;
  }
  else 
  {
    condition.kye_skeyword = null;
  }
  if (kye_sfavo === 1) {
    condition.kye_sfavo = kye_sfavo;
  }
  else
  {
    condition.kye_sfavo = null;
  }   
  console.log(condition);
  return condition;
}


//今日の日時
function today() {
  var d = new Date();
  var formatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  return formatted;
}

//総件数
function allcount() {
    $(function(){
      var targetUrl = tUrl+'allcount';
        $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          scriptCharset: 'utf-8',
        }).done(function(data){ 
            console.log(data);
            //$('.count').empty();
             $('.count').attr('data-num', 100);
             console.log(data[0].allcount);
             console.log(data[1].allcount);
             console.log(data.allcount);
             console.log(data[0]);
             console.log(data[1]);
             console.log(data[3]);
             console.log(data);
            sflag = 0;
          }).fail(function(data, XMLHttpRequest, textStatus) {
            console.log(data);
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
            sflag = 0;
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus     : " + textStatus);
        });
    });
}

//スクレイピング
function scraping(sendkey) {  
  $(function(){
    var targetUrl = tUrl+'scraping';
    console.log(sendkey);
    var request = {
      'sendkey': sendkey
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FINISH</div></td></tr>');
          gettoday();
          sflag = 0;
          gettoday();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//TODAY
function gettoday() {
  var request = {
    'condition': make_condition()
  };  
  $(function(){
    var targetUrl = tUrl+'gettoday';
      $.ajax({
        url: targetUrl,
        type: 'POST',
        dataType: 'JSON',
        contentType: 'application/JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
        if (data === null || data == "[]" || data == '') {
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
        } else {
          show(data);
          console.log(data);
        }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//ALLDAY
function getallday() {
  $(function() {
    var targetUrl = tUrl+'getallday';
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : null,
          scriptCharset: 'utf-8',
      }).done(function(data) { 
          if (data == null || data == '' || data[0] == '') {
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            show(data);
            savedata = data;
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//キーワード
function getkeyword() { 
  $(function(){
    var targetUrl = tUrl+'getkeyword';    
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : null,
          scriptCharset: 'utf-8',
      }).done(function(data) { 
        console.log(data);
          if (data == null || data == '' || data[0] == '') {
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            $('#ddmenu').empty(); 
            $("#ddmenu").append('<option value="all">ALL KEY WORDS</option>');
            for (var i = 0; i < data.length; i++) {
              $("#ddmenu").append('<option value="'+data[i].keyword+'"style="font-weight: 600;" >'+data[i].keyword+'</option>');
            }
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//キーワード検索
function skeyword() { 
  var request = {
    'condition': make_condition()
  };
  $(function(){
    var targetUrl = tUrl+'skeyword';    
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : JSON.stringify(request),
          scriptCharset: 'utf-8',
      }).done(function(data) {
        if (data == null || data == '' || data[0] == '') {
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
        } else {
          show(data);
          savedata = data;
        }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//削除画面
function delwords() {  
  $(function(){
    var targetUrl = tUrl+'getkeyword';    
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : null,
          scriptCharset: 'utf-8',
      }).done(function(data) { 
          if (data == null || data == '' || data[0] == '') {
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            $('#table').empty(); 
            for (var i = 0; i < data.length; i++) {
              $('#table').append('<tr><td>'+data[i].keyword+'</td><td><button type="button" id="'+data[i].keyword+'" class="godel btn-danger" class="btn btn-primary">DELETE</button></td></tr>');
            }
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//削除
function godelwords(sendkey) {  
  $(function(){
    var targetUrl = tUrl+'del';
    console.log(sendkey);
    var request = {
      'sendkey': sendkey
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        //dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          delwords();
          getkeyword();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//1つ削除
function godelonewords(sendkey) {  
  $(function(){
    var targetUrl = tUrl+'delone';
    console.log(sendkey);
    var request = {
      'sendkey': sendkey
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          getkeyword();
          gettoday();
          savedata = data;
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//MEMO
function memo(id, textmemo) {  
  $(function(){
    var targetUrl = tUrl+'memo';
    console.log(id);
    console.log(textmemo);
    var request = {
      'id': id,
      'textmemo': textmemo
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        //dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          gettoday();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//お気に入り検索
function gosfavo() {  
    var targetUrl = tUrl+'sfavo';
    var request = {
      'condition': make_condition()
    };
    $(function(){
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
        if (data == null || data == '' || data[0] == '') {
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
        } else {
          show(data);
          savedata = data;
        }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//お気に入り
function gofavorite(sendkey, type) {  
  $(function(){
    var targetUrl = tUrl+'favorite';
    console.log(sendkey);
    var request = {
      'sendkey': sendkey
      ,'type': type
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        //dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
        console.log(data);
        gettoday();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//既読
function goread(sendkey, type) {  
  $(function(){
    var targetUrl = tUrl+'read';
    console.log(sendkey);
    var request = {
      'sendkey': sendkey
      ,'type': type
    };
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        //dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
        gettoday();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

window.onload = function() {
  //allcount();
  kye_today = null;
  kye_skeyword = null;
  kye_sfavo = null;

  getallday();
  getkeyword();

  $('#table').empty();
  $('#iimg').empty();
  $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
}

//総件数
function allcouont() {
  $(function(){
    var countElm = $('.count'),
    countSpeed = 5;
  
    countElm.each(function(){
        var self = $(this),
        countMax = self.attr('data-num'),
        thisCount = self.text(),
        countTimer;
  
        function timer(){
            countTimer = setInterval(function(){
                var countNext = thisCount++;
                self.text(countNext);
  
                if(countNext == countMax){
                    clearInterval(countTimer);
                }
            },countSpeed);
        }
        timer();
    });
  });
}

//scraping
$(function(){ 
  $('#start').on('click',function(){
    if (sflag == 0) {
      sflag = 1;
      sendkey= $("#key").val();
      scraping(sendkey);
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    } else {
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING NOW ( PLEASE WAIT A MINUTE )　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    }  
  });
});

//ALLDAY
$(function() {
  $('#allday').on('click',function() {
    
    kye_today = null;
    kye_skeyword = null;
    kye_sfavo = null;

    getallday();

    $('#table').empty();
    $('#iimg').empty();
    $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
  });
});

//TODAY
$(function() {
  $('#today').on('click',function() {
      kye_today = today();
      gettoday();
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');  
  });
});

//プルダウン選択時
$(function() {
  $('#ddmenu').on('click',function() {
    var key = $("#ddmenu").val();
    kye_skeyword = key;
    skeyword();
  });
});

//削除画面
$(function() {
  $('#del').on('click',function() {
    delwords();
  });
});

//モーダルmemo
$(function(){ 
  $(document).on('click','.modalmemo',function() {
    var id = $(this).attr('id');
    var memo = $(this).attr('memo');
    console.log('モーダルメモ');
    console.log(id);
    console.log(memo);
    $('#save').attr('memo-id', id);
    $('#textmemo').text(memo);
  });
});

//memo
$(function(){ 
  $('#save').on('click',function(){
    var id = $("#save").attr('memo-id');
    var textmemo = $("#textmemo").val();
    console.log('モーダルメモ');
    console.log(id);
    console.log(textmemo);
    memo(id, textmemo);
  });
});

//お気に入り
$(function() {
  $(document).on('click','.favorite',function() {
    var id =  $(this).attr("id");
    var sendkey = id.substr(1);
    var type = id.substr(0,1);
    gofavorite(sendkey,type);
  });
});

//お気に入り検索
$(function() {
  $('#sfavo').on('click',function() {
    kye_sfavo = 1;
    gosfavo();
    console.log('sfavo');
  });
});

//削除
$(function() {
  $(document).on('click','.godel',function() {
    var sendkey =  $(this).attr("id");
    ret = window.confirm("データは完全に削除されます。本当によろしいですか？");
    console.log('sendkey');
    console.log(sendkey);
    if (ret == true) {
      godelwords(sendkey);
      console.log('send');
    }
  });
});

//1つ削除
$(function() {
  $(document).on('click','.one-del',function() {
    var sendkey =  $(this).attr("id");
    ret = window.confirm("データは完全に削除されます。本当によろしいですか？");
    console.log('sendkey');
    console.log(sendkey);
    if (ret == true) {
      godelonewords(sendkey);
      console.log('send');
    }
  });
});

//既読
$(function() {
  $(document).on('click','.read',function() {
    var id =  $(this).attr("id");
    var sendkey = id.substr(1);
    console.log('sendkey');
    console.log(sendkey);
    
    var type = id.substr(0,1);
    console.log('type');
    console.log(type);

    goread(sendkey,type);
  });
});

//テーブル表示
function show(data) {
  $(function() {
    //総件数
    //allcouont();
    //console.log(data);
    $('#table').empty();
    $('#iimg').empty();
    for (var i = 0; i < data.length; i++) {
      
    //var dirDay = data[i].dt;
    //var dirNaeme = dirDay.replace( /-/g , "" );
    //dirNaeme = dirNaeme.substr(0,8);
    
    //No
    var no = i+1;
    
    //おきに入り
    var favorite = data[i].favorite;
    if (favorite == '0') {
      var favo = 1;
      var favoword = '未登録';
      var color = 'btn-primary'
    } else if (favorite == '1') {
      var favo = 0;
      var favoword = '登録済';
      var color = 'btn-danger';
    }

    //既読
    var readflg = data[i].readflg;
    if (readflg == '0') {
      var read = 1;
      var readword = '未読';
      var readcolor = 'btn-primary'
      var readedcolor = '';
    } else if (readflg == '1') {
      var read = 0;
      var readword = '既読';
      var readcolor = 'btn-secondary';
      var readedcolor = 'table-dark';
    } 

    //詳細
    var detail = data[i].detail;
    if (detail == null) {
      detail = '詳細はありません'
    }

    //メモ
    var memo = data[i].memo;
    if (memo == null) {
      memo = 'メモはありません'
      var memocolor = '';
    } else {
      var memocolor = 'btn-warning';
    }

    $('#table').append('<tr class="'+ readedcolor +'"><td><b>'+ no +'</b></td><td><button type="button" id="' + favo + data[i].id+ '" class="favorite '+ color +'">'+ favoword +'</button></td><td><button type="button" id="' + read + data[i].id+ '" class="read '+ readcolor +'">'+ readword +'</button></td><td><button type="button" id="'+data[i].id+'" memo="'+ memo + '" class="modalmemo btn btn-success" data-toggle="modal" data-target="#memo">メモ</button></td><td><b>'+data[i].img_id+'</b></td><td><b><a href='+data[i].url+' target="_blank" style="font-size:large;">'+data[i].title+'</a></b></td><td>'+detail+'</td><td><div class="'+ memocolor +'">'+ memo +'</div></td><td>&emsp;('+data[i].dt+')</td><td><button type="button" id="'+data[i].id+'" class="one-del btn-danger">削除</button></td></tr>');
    }  
  });

  //Data Table
  $(function($){
    $("#data-table").DataTable({
      lengthMenu: [ 10, 20, 30, 40, 50, 100, 200, 300, 500 ],
      displayLength: 50,
      columnDefs: [
        { targets: 1, width: 50 },
        { targets: 2, width: 50 },
        { targets: 6, width: 500 },
        { targets: 9, width: 50 }
    ]
    });
  });

  return data;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//CSV download
//jsonをcsv文字列に編集する
function jsonToCsv(json, delimiter) {
  var header = Object.keys(json[0]).join(delimiter) + "\n";
  var body = json.map(function(d){
      return Object.keys(d).map(function(key) {
          return d[key];
      }).join(delimiter);
  }).join("\n");
  return header + body;
}

//csv変換
function exportCSV(items, delimiter, filename) {

  //文字列に変換する
  var csv = jsonToCsv(items, delimiter);

  //拡張子
  var extention = delimiter==","?"csv":"tsv";

  //出力ファイル名
  var exportedFilenmae = (filename  || 'export') + '.' + extention;
  //文字化け対策
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

  //BLOBに変換
  var blob = new Blob([bom,csv], { type: 'text/csv;charset=utf-8;' });

  if (navigator.msSaveBlob) { // for IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
      //anchorを生成してclickイベントを呼び出す。
      var link = document.createElement("a");
      if (link.download !== undefined) {
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

function output(){
    console.log(savedata);
    if (savedata == null || savedata == 0) {
      alert("No data");
    } else {
      var filename = savedata[0].dt;;
      exportCSV(savedata,',', filename);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////