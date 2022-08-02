var Ex;
(()=>{

    Ex = {
        "id":"youtube",
        "DB":false,
        "Storage":{
            "local":false,
            "session":false
        },
        "Clock":{
            "setInterval":{},
            "setTimeout":{}
        },
        "flag":{
            "SpeechRecordStatus":true,
            "SpeechRecordSec":0,
            "SpeechRecord":false,
            "yt_chat":{
                
            },
            "yt_chat_on":false
        },
        "config":{
            "DB_url":"https://kfs-plurk-default-rtdb.firebaseio.com/",
            "selector":`[author-type="moderator"]`,
            "yt_id":new URLSearchParams(location.search).get("v"),
            "SpeechRecordLang":{
                "ja-JP":"日文",
                "en-US":"英文",
                "cmn-Hant-TW":"中文",
                "id-ID":"印尼",
                "ko-KR":"韓文"
            },
            "SpeechRecordSecLimit":10
        },
        "template":{},
        "obj":{},
        "f":{
            "ChatEx":()=>{

                var yt_id = Ex.config.yt_id;
                var flag_yt = Ex.flag.yt_chat;

                if(Ex.obj.chatframe===null)
                {
                    setTimeout(()=>{Ex.f.ChatEx();},1000);
                    return;
                }
                   
                Ex.DB.ref(`YtChatEx/${yt_id}`).once("value",YtChatEx=>{

                    YtChatEx = YtChatEx.val()||{};

                    flag_yt = {};
                    flag_yt[yt_id] = {"list":{}};

                    for(var k in YtChatEx)
                    {
                        if(k==="list")
                        {
                            for(var id in YtChatEx.list)
                            {
                                flag_yt[yt_id].list[id] = YtChatEx.list[id];
                            }
                        }
                        else
                        {
                            flag_yt[yt_id][k] = YtChatEx[k];
                        }
                    }

                    if(YtChatEx.chanel!==undefined)
                    {
                        YtChatEx.chanel = document.querySelector("yt-formatted-string.ytd-channel-name a").innerText;
                        YtChatEx.title = document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML;
                        YtChatEx.date = document.querySelector("#info-strings yt-formatted-string").innerText;
        
                        Ex.DB.ref(`YtChatEx/${yt_id}`).update(YtChatEx);
                    }

                    var ary = [];
                    
                    for(var id in flag_yt[yt_id].list)
                    {
                        ary.push( flag_yt[yt_id].list[id] );
                    }

                    ary.sort( (a,b)=>{ return a.sec-b.sec;} );

                    for(var i=0;i<ary.length;i++)
                    {
                        var message = ary[i];

                        if(Ex.obj.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

                        var div = document.createElement("div");
                        div.id = message.id;

                        div.innerHTML = 
                        `<a data-event="ClickEvent" 
                        data-mode="SearchTime" 
                        data-time="${message.sec}">${Ex.f.YtCurrentTime(message.sec)}</a> 
                        <a>${message.user}</a> 
                        <a>${message.msg}</a>`            
                        Ex.obj.chat.appendChild(div);
                    }


                    Ex.Clock.setInterval.ChatEx = setInterval(()=>{

                        console.log('Ex.Clock.setInterval.ChatEx')
                        if(Ex.flag.yt_chat_on)
                        {
                            Ex.f.ChatRef();
                        }
                        else
                        {
                            clearInterval(Ex.Clock.setInterval.ChatEx);
                            delete Ex.Clock.setInterval.ChatEx;
                        }

                    },1000);
                });

            },
            "ChatRef":()=>{


                var yt_id = Ex.config.yt_id;
                var flag_yt = Ex.flag.yt_chat;

                var message_list = Ex.obj.chatframe.contentDocument.querySelectorAll(Ex.config.selector);
                var new_messages = [];

                for(var i=0;i<message_list.length;i++)
                {
                    var message = message_list[i];

                    if(Ex.obj.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

                    var div = document.createElement("div");
                    div.id = message.id;

                    var sec = message.querySelector("#timestamp").innerText;

                    if(sec.toLocaleLowerCase().indexOf("am")!==-1 || 
                    sec.toLocaleLowerCase().indexOf("pm")!==-1)
                    {
                        sec = Ex.f.YtCurrentTime(Math.floor(Ex.obj.video.currentTime));
                    }
                    
                    div.innerHTML = 
                    `<a data-event="ClickEvent" 
                    data-mode="SearchTime" 
                    data-time="${Ex.f.YtCurrentTime(sec.split(":"))}">${(sec)}</a> 
                    <a>${message.querySelector("#author-name").innerText}</a> 
                    <a>${message.querySelector("#message").innerHTML}</a>`  

                    Ex.obj.chat.appendChild(div);

                    new_messages.push( message.id );
                }

                if(new_messages.length>0)
                {
                    var list = {};
                    for(var id of new_messages)
                    {
                        var msg = Ex.obj.chat.querySelector(`[id="${id}"]`);

                        list[ msg.id ] = {
                            "id":msg.id,
                            "sec":msg.querySelectorAll("a")[0].dataset.time,
                            "user":msg.querySelectorAll("a")[1].innerText,
                            "msg":msg.querySelectorAll("a")[2].innerHTML
                        }
                    }

                    flag_yt[ yt_id ] = {
                        "chanel":document.querySelector("yt-formatted-string.ytd-channel-name a").innerText,
                        "title":document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML,
                        "date":document.querySelector("#info-strings yt-formatted-string").innerText,
                        "list":list
                    }

                    Ex.DB.ref(`YtChatEx/${yt_id}`).once("value",YtChatEx=>{
                
                        YtChatEx = YtChatEx.val()||{"list":{}};
            
                        for(var k in flag_yt[ yt_id ])
                        {
                            if(k==="list")
                            {
                                for(var id in flag_yt[ yt_id ].list)
                                {
                                    YtChatEx.list[ id ] = 
                                    flag_yt[ yt_id ].list[ id ];
                                }
                            }
                            else
                            {
                                YtChatEx[k] = 
                                flag_yt[ yt_id ][k];
                            }
                        }
            

                        Ex.DB.ref(`YtChatEx/${yt_id}`).update(YtChatEx);
                    });
                }
                //setTimeout(()=>{Ex.f.ChatRef();},1000);

            },
            "custome_obj_set":()=>{

                Ex.obj.video = document.querySelector("video");
                
                Ex.obj.screenshot = document.createElement("div");
                Ex.obj.screenshot.id = "screenshot";
                document.body.prepend(Ex.obj.screenshot);


                var div2 = document.createElement("div");
                div2.id = Ex.id;
                div2.className = `ytp-menuitem`;
                div2.setAttribute("aria-checked","true");
                div2.innerHTML = `
                <div class="ytp-menuitem-icon"></div>
                <div class="ytp-menuitem-label">影像90度</div>
                <div class="ytp-menuitem-content"></div>
                </div>
                </div>`;
                div2.addEventListener("click",e=>{
                    
                })


                var ExMenu = `


                <div id="${Ex.id}" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" data-event="ClickEvent" data-mode="ExInfo">
                <img title="外掛資訊" 
                class="icon-img"  data-event="ClickEvent" data-mode="ExInfo" 
                src="https://avatars.plurk.com/14556765-small9788529.gif">
                </div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="Video90">影像90度</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="Video90"></div>
                </div>

                <div id="${Ex.id}" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="VideoTimeJump"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="VideoTimeJump">時間切換</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="VideoTimeJump"></div>
                </div>

                <div id="${Ex.id}" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="PopVideo"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="PopVideo">子母視窗</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="PopVideo"></div>
                </div>

                <div id="${Ex.id}" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="ChatRecord"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="ChatRecord">監錄聊天視窗</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="ChatRecord"></div>
                </div>

                <!--
                <div id="${Ex.id}" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="SpeechRecord"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="SpeechRecord">即時字幕</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="SpeechRecord"></div>
                </div>
                -->
                `

                /*
                <div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="SpeechRecord"></div>
                */


                if(typeof(webkitSpeechRecognition)!=="undefined")
                {
                    Ex.obj.SpeechRecord = document.createElement("div");
                    Ex.obj.SpeechRecord.id = "SpeechRecord";
                    Ex.obj.SpeechRecord.style.display = "none";
                    Ex.obj.SpeechRecord.setAttribute("draggable","true");
                    Ex.obj.SpeechRecord.dataset.r_event = "SpeechRecordMenu";

                    if(document.querySelector("#primary-inner")!==null)
                    {

                        document.querySelector("#primary-inner").prepend(Ex.obj.SpeechRecord);
        
                        Ex.f.SpeechRecord('ja-JP');
                    }
                }
                


                document.addEventListener("contextmenu",(e)=>{

                    var video = Ex.obj.video;

                    if(document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu")!==null && 
                    document.querySelector(`.ytp-popup.ytp-contextmenu .ytp-panel-menu #${Ex.id}`)===null)
                    {
                        /*
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div3);
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div2);
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div);
                        */

                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").innerHTML = ExMenu + document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").innerHTML;


                    }

                    
                });


            },
            "ClickEvent":(e)=>{
                

                switch (e.target.dataset.mode)
                {
                    case "VideoTimeJump":
                        document.querySelectorAll('#content-text .yt-simple-endpoint').forEach(o=>{
                            var span = document.createElement("span");
                            span.className = o.className;
                            span.innerHTML = `${o.innerHTML}`;
                            if(o.href===undefined) return;
                            span.dataset.sec = parseInt( new URL(o.href).searchParams.get("t") ) ;
                            o.parentElement.appendChild(span);
                        
                            o.parentElement.insertBefore(span,o);
                        
                            o.remove();
                            span.addEventListener("click",(e)=>{
                                console.log(e.target.dataset.sec);
                                document.querySelector("video").currentTime = e.target.dataset.sec;
                            });
                        });

                        document.querySelector(".ytp-popup.ytp-contextmenu").style.display = 'none';


                    break;

                    case "SearchTime":
                        
                        Ex.obj.video.currentTime = Ex.f.YtCurrentTime( 
                            e.target.dataset.time.split(":")
                        );

                    break;

                    case "ExInfo":
                        window.open("https://www.plurk.com/p/oplic7","plurk");
                    break;

                    case "Video90":
                        if(e.target.parentElement.querySelector(".ytp-menuitem-content").children.length===0)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="Video90"></div>`;
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                        }
                        Ex.f.VideoRotate();


                    break;

                    case "PopVideo":
                        if(document.pictureInPictureElement===null)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="PopVideo"></div>`;
                            Ex.obj.video.requestPictureInPicture();
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                            document.exitPictureInPicture();
                        }

                        
                    break;


                    case "ChatRecord":

                        Ex.obj.chat = (!document.querySelector("#top_chat"))?document.createElement("div"):document.querySelector("#top_chat");
                        Ex.obj.chat.id = "top_chat";
                        Ex.obj.chat.setAttribute("draggable","true");
        
                        Ex.obj.chatframe = document.querySelector("iframe#chatframe");
                        var chat_info = Ex.obj.chatframe.getBoundingClientRect();
                        Ex.obj.chat.style.left = `${chat_info.left}px`;
                        Ex.obj.chat.style.top = `${chat_info.top}px`;
                        Ex.obj.chat.style.height = `${chat_info.height}px`;
                        Ex.obj.chat.style.width = `${chat_info.width}px`;
                        document.body.prepend(Ex.obj.chat);

                        if(Ex.Clock.setInterval.ChatEx===undefined)
                        {
                            Ex.f.DB_set( Ex.config.DB_url, ()=>{Ex.f.ChatEx();} );
                        }

                        if(e.target.parentElement.querySelector(".ytp-menuitem-content").children.length===0)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="ChatRecord"></div>`;
                            Ex.flag.yt_chat_on = true;
                            Ex.obj.chat.style.display = "block";
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                            Ex.flag.yt_chat_on = false;
                            Ex.obj.chat.style.display = "none";
                        }


                    break;


                    case "SpeechRecord":


                        if(e.target.parentElement.querySelector(".ytp-menuitem-content").children.length===0)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="SpeechRecord"></div>`;
                            Ex.flag.SpeechRecordStatus = true;
                            Ex.flag.SpeechRecord.start();
                            Ex.obj.SpeechRecord.style.display = "block";
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                            Ex.flag.SpeechRecordStatus = false;
                            Ex.flag.SpeechRecord.stop();
                            Ex.obj.SpeechRecord.style.display = "none";
                        }

                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").style.display = 'none';

                    break;

                    case "SpeechRecordSet":

                        Ex.obj.SpeechRecord.style.fontSize = Ex.obj.SpeechRecord.style.fontSize||'20px';

                        switch (e.target.dataset.option)
                        {
                            case "copy":
                                var word = `「${Ex.obj.SpeechRecord.innerHTML}」(${Ex.f.YtCurrentTime(Math.floor(Ex.obj.video.currentTime))})`;
                                navigator.clipboard.writeText(word);
                            break;

                            case "color":
                                Ex.obj.SpeechRecord.classList.toggle("color2");
                            break;

                            case "+":
                                Ex.obj.SpeechRecord.style.fontSize = Ex.obj.SpeechRecord.style.fontSize.split("px")[0] - (-2) + 'px';
                            break;

                            case "-":
                                Ex.obj.SpeechRecord.style.fontSize = Ex.obj.SpeechRecord.style.fontSize.split("px")[0] - (2) + 'px';
                            break;


                            default :

                                Ex.f.SpeechRecord(
                                    Object.keys(Ex.config.SpeechRecordLang)[e.target.dataset.option]
                                );
                                
                            break;
                        }




                        Ex.obj.msg.style.display = "none";

                    break;

                }

                
            },
            "VideoRotate":()=>{

                if(document.querySelector("#player").style.transform!==``){
                    document.querySelector("#player").style.transform=``;
                    document.querySelector(".ytp-chrome-bottom").style=``;
                    document.querySelector(".html5-video-player").appendChild(document.querySelector(".ytp-chrome-bottom"));
                }else{
                    document.querySelector("#player").style.transform ="translate(-450px, 0px) rotateZ(90deg) scale(0.7)";
                    document.querySelector(".ytp-chrome-bottom").style = `width:`+document.querySelector(".ytp-chrome-bottom").style.width+`;left:300px;top:10px;opacity: 1;z-index: 9999;background: #000;`;
                    document.querySelector("#player").parentElement.prepend( document.querySelector(".ytp-chrome-bottom") );
                }
            },
            "SpeechRecord":(lang)=>{

                if(typeof(webkitSpeechRecognition)==="undefined") return;

                //if(Ex.flag.SpeechRecord!==false) Ex.flag.SpeechRecord.stop();

                Ex.flag.SpeechRecord = new webkitSpeechRecognition()

                var r = Ex.flag.SpeechRecord;
                r.continuous = true;
                r.interimResults = true;
                r.lang = lang;
                r.onresult=function(e){
                    Object.values(e.results).forEach(r => {
                        Ex.flag.SpeechRecordSec = 0;
                        Ex.flag.SpeechRecord_r = r;
                        Ex.obj.SpeechRecord.innerHTML = r[0].transcript;
                    });
                };
                r.onend = ()=>{
                    //console.log("SpeechRecordend");
                    Ex.flag.SpeechRecordSec = 0;

                    if(Ex.flag.SpeechRecordStatus)
                        setTimeout(()=>{
                            r.start();
                        },1000);
                }
                //r.start();

                Ex.obj.msg.style.display = "none";

            },
            "SpeechRecordMenu":(e)=>{

                Ex.f.MsgPop(`
                <ul>

                ${
                    Object.values(Ex.config.SpeechRecordLang).map( (lang,idx)=>{
                        return `<li data-event="ClickEvent" data-mode="SpeechRecordSet" data-option="${idx}">${lang}</li>`
                    }).join("")

                }
                
                <li data-event="ClickEvent" data-mode="SpeechRecordSet" data-option="copy">複製</li>
                <li data-event="ClickEvent" data-mode="SpeechRecordSet" data-option="+">字體+</li>
                <li data-event="ClickEvent" data-mode="SpeechRecordSet" data-option="-">字體-</li>
                <li data-event="ClickEvent" data-mode="SpeechRecordSet" data-option="color">色反轉</li>
                </ul>
                `,e);

            },
            "SpeechRecordSecCounter":()=>{
                //console.log(Ex.flag.SpeechRecordSec);
                Ex.flag.SpeechRecordSec++;
                if(Ex.flag.SpeechRecordSec>Ex.config.SpeechRecordSecLimit)
                {
                    Ex.flag.SpeechRecordSec = 0;
                    Ex.flag.SpeechRecord.stop();
                }
            },
            "YtCurrentTime":(sec)=>{

                if(Array.isArray(sec))
                {
                    if(
                    sec.some( w=>{ 
                        return (w.toLocaleLowerCase().indexOf("am")!==-1 || 
                        w.toLocaleLowerCase().indexOf("pm")!==-1) ;
                    }) )
                    {
                        return "";
                    }

                    return sec.reverse().map((sec,i)=>{return sec*Math.pow(60,i);}).reduce((a,b)=>a+b);
                }
                else
                    return `${ Math.floor(sec/3600).toString().padStart(2,"0") }:${ Math.floor(sec%3600/60).toString().padStart(2,"0") }:${ Math.floor(sec%60).toString().padStart(2,"0") }`;
                
            },
            "DB_set":function( URL,func ){

                if( typeof(firebase)!=='undefined' )
                {
                    Ex.DB = firebase;
                    Ex.DB = Ex.DB.database();

                    func();
                    return;
                }

                var firebasejs1 = document.createElement("script");
                firebasejs1.src="https://www.gstatic.com/firebasejs/5.5.6/firebase.js";
                document.head.appendChild(firebasejs1);

                var _t = setInterval(() => {
                    if( typeof(firebase)!=='undefined' )
                    {
                        clearInterval(_t);
                        Ex.DB = firebase;
                        Ex.DB.initializeApp({databaseURL:URL});
                        Ex.DB = Ex.DB.database();

                        func();
                    }
                },100);
                
            },
            "style_set":function(){
                
                var link = document.createElement('link');
                link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css`;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                document.head.prepend(link);
            },
            "js_set":(url_ary,func)=>{


                for(let i in url_ary)
                {
                    setTimeout(()=>{
                        var js = document.createElement("script");
                        js.src = `${url_ary[i]}?s=${new Date().getTime()}`;
                        document.head.prepend(js);
                    },i*200);
                }
    
                if(typeof(func)==="function") func();
    
            },
            "obj_set":function(){

                Ex.obj.Ex_div = document.createElement("div");
                Ex.obj.Ex_div.setAttribute("draggable","true");
                Ex.obj.Ex_div.id = Ex.id;

                Ex.obj.Ex_div.innerHTML = ``;


                Ex.obj.msg = document.createElement("div");
                Ex.obj.msg.id = `${Ex.id}-Msg`;
                Ex.obj.msg.setAttribute("draggable","true");
                Ex.obj.msg.innerHTML = `
                <div></div>
                <input type="button" data-event="close" data-obj="${Ex.id}-Msg" value="關閉">
                `;

                Ex.obj.menu = document.createElement("div");
                Ex.obj.menu.id = `${Ex.id}-Menu`;
                Ex.obj.menu.setAttribute("draggable","true");
                Ex.obj.menu.innerHTML = `
                <ul>
                </ul>
                `;

                Ex.obj.load = document.createElement("div");
                Ex.obj.load.id = `${Ex.id}-Loading`;
                Ex.obj.load.innerHTML = `
                <div></div>
                <div>LOADING...</div>
                `;


                Ex.obj.YtTime = document.createElement("div");
                Ex.obj.YtTime.id = `${Ex.id}-YtTime`;
                Ex.obj.YtTime.innerHTML = `${Ex.f.YtCurrentTime(document.querySelector("video").currentTime)}`;

                Ex.Clock.setInterval.YtTime = setInterval(()=>{
                    Ex.obj.YtTime.innerHTML = `${Ex.f.YtCurrentTime(document.querySelector("video").currentTime)}`;
                },500);

                
                
                //document.body.prepend( Ex.obj.load );

                document.body.appendChild( Ex.obj.Ex_div );
                document.body.appendChild( Ex.obj.msg );
                document.body.appendChild( Ex.obj.menu );
                document.body.appendChild( Ex.obj.YtTime );

            },
            "FlagUpd":()=>{
                document.querySelectorAll(`[data-flag]`).forEach(o=>{
                    o.innerHTML = Ex.flag[o.dataset.flag];
                });
            },
            "StorageUpd":()=>{
                localStorage[Ex.id] = JSON.stringify(Ex.Storage.local);
                sessionStorage[Ex.id] = JSON.stringify(Ex.Storage.session);
            },
            "MsgPop":(str,e = document.createEvent("mouseEvents"))=>{

                Ex.obj.msg.style.left = e.clientX + 'px';
                Ex.obj.msg.style.top = e.clientY + 'px';
                Ex.obj.msg.style.display = "block";
                Ex.obj.msg.querySelector("div").innerHTML = str;

            },
            "close":(e)=>{
                document.querySelector(`#${e.target.dataset.obj}`).style.display = "none";
            },
            "rad":(n)=>{
                return Math.floor(Math.random() * n)+1;
            },
            "shuffle":(ary)=>{
                for (let i = ary.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [ary[i], ary[j]] = [ary[j], ary[i]];
                }
            },
            "default":()=>{

                /*
                Ex.Clock.setInterval.flag = setInterval(()=>{

                    Ex.flag.YtTime = Ex.f.YtCurrentTime(document.querySelector("video").currentTime);

                    Ex.f.FlagUpd();


                    if(typeof(webkitSpeechRecognition)==="undefined") return;
                    Ex.f.SpeechRecordSecCounter();
            

                },1000);
                */


                document.addEventListener("dragend",function(e){


                    if(e.target.getAttribute("draggable")==="true")
                    {
                        e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                        e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";

                        if(e.target.dataset.draggable_remove==="true" && e.target.style.top.split("px")[0]*-1>=Math.floor(e.target.clientHeight/2))
                        {
                            e.target.remove();
                        }

                    }
                });
                    

                document.addEventListener("mousedown",function(e){
                    Ex.flag.mousedown = e;
                });

                document.addEventListener("click",(e)=>{
                    

                    if(e.target.dataset.event!==undefined) Ex.f[ e.target.dataset.event ](e);
                });
            
                document.addEventListener("contextmenu",(e)=>{

                    if(e.target.dataset.r_event!==undefined)
                    {
                        e.stopPropagation();
                        e.preventDefault();

                        Ex.f[ e.target.dataset.r_event ](e);
                    }
                });

                Ex.Storage = {
                    "local":JSON.parse(localStorage[Ex.id]||`{}`),
                    "session":JSON.parse(sessionStorage[Ex.id]||`{}`)
                }

                
                Ex.f.style_set();
                Ex.f.obj_set();
                Ex.f.custome_obj_set();

                Ex.f.js_set(
                    ['https://kfsshrimp.github.io/js/GetImg.js']
                ,()=>{
                    var _t = setInterval(()=>{
                        if(typeof(GetImg)==="function")
                        {
                            Ex.GetImg = new GetImg({loop_sec:50});
                            clearInterval(_t);
                        }
                    },1);
                    
                });
    
                
            }
        }
    };

    Ex.f.default();

})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/youtube.js?s=${new Date().getTime()}`;document.head.prepend(js);
//'dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsveW91dHViZS5qcz9zPSR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YDtkb2N1bWVudC5oZWFkLnByZXBlbmQoanMpOw=='


/*
document.querySelectorAll('#content-text .yt-simple-endpoint').forEach(o=>{
    var span = document.createElement("span");
    span.className = o.className;
    span.innerHTML = `${o.innerHTML}`;
    if(o.href===undefined) return;
    span.dataset.sec = parseInt( new URL(o.href).searchParams.get("t") ) ;
    o.parentElement.appendChild(span);

    o.parentElement.insertBefore(span,o);

    o.remove();
    span.addEventListener("click",(e)=>{
        console.log(e.target.dataset.sec);
        document.querySelector("video").currentTime = e.target.dataset.sec;
    });
});
*/

