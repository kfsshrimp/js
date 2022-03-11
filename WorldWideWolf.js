var Ex;
(()=>{
    Ex = {
        "id":"WorldWideWolf",
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
            
        },
        "config":{
            "DB_url":"https://worldwidewolf-d5dd4-default-rtdb.firebaseio.com/",
            "game_id":new URLSearchParams(location.search).get("game"),
            "player":[
                "human",
                "wolf",
                "guard",
                "divine"
            ],
            "job":{
                "human":4,
                "wolf":2,
                "guard":1,
                "divine":1
            },
            "name":[
                "小明",
                "隔壁老王",
                "雨香",
                "張先生",
                "肥宅",
                "魯蛇",
                "文學少女",
                "熟女",
                "歐巴桑"
            ],
            "str":{
                "wolf":"人狼",
                "guard":"守衛",
                "divine":"先知",
                "human":"村民",
                "a_wolf":"咬殺",
                "a_guard":"守護",
                "a_divine":"占卜",
                "a_say":"發言",
                "a_vote":"投票"
            }
        },
        "template":{},
        "obj":{},
        "f":{
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
            "obj_set":()=>{
                var Main = document.createElement("div");
                Main.id = "Main";
                Main.innerHTML = `
                    <div id="Menu"></div>
                    <div id="Content"></div>
                    <div id="Chat"><textarea></textarea></div>
                `;


                var Msg = document.createElement("div");
                Msg.id = "Msg";
                Msg.setAttribute("hide","");
                Msg.innerHTML = `
                    <div></div>
                `;//draggable="true"

                Ex.obj.Msg = Msg;
                Ex.obj.Main = Main;
                

                document.body.appendChild(Ex.obj.Msg);
                document.body.appendChild(Ex.obj.Main);
                

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

                Ex.f.obj_set();

                Ex.Clock.setInterval.flag = setInterval(()=>{
                    Ex.f.FlagUpd();
                },1000);


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
            },
            "GameSet":()=>{

                Ex.DB.ref(`game`).once("value",r=>{

                    r = r.val()||{};

                    Ex.flag.game_id = Object.keys(r).length-1;
                    Ex.flag.game_day = 0;

                    if(Ex.flag.game_id<0) Ex.flag.game_id = 0;

                    if(Ex.config.game_id!==null) Ex.flag.game_id = Ex.config.game_id;

                    if(r[Ex.flag.game_id]===undefined)
                    {
                        Ex.DB.ref(`game/${Ex.flag.game_id}/day`).set(Ex.flag.game_day);

                        
                    }
                    else
                    {
                        if(r[Ex.flag.game_id].day===undefined)
                        {
                            Ex.DB.ref(`game/${Ex.flag.game_id}/day`).set(Ex.flag.game_day);

                            Ex.flag.game_day = 0;
                        }
                        else
                        {
                            Ex.flag.game_day = r[Ex.flag.game_id].day;
                            Ex.flag.log = r[Ex.flag.game_id].log;
                        }
                    }

                    
                    Ex.f.PlayerSet();
                });

            },
            "PlayerSet":()=>{

                var player = Ex.config.player;

                Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}`).once("value",r=>{

                    if(r.val()===null)
                    {
                        Ex.flag.player = {
                            "job":player[ Math.floor(player.length * Math.random()) ]
                        }

                        Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}`).set(Ex.flag.player);
                    }
                    else
                    {
                        Ex.flag.player = r.val();
                    }

                    Ex.obj.Main.querySelector("#Menu").innerHTML = `
                        <input type="button" value="${Ex.Storage.local.account.a}">
                        <input type="button" value="帳號登出"
                        data-event="LogoOut">
                        <input type="button" value="${Ex.config.str[Ex.flag.player.job]}">
                    `;

                    for(var i=0;i<=Ex.flag.game_day;i++)
                    {
                        Ex.obj.Main.querySelector("#Menu").innerHTML += `
                            <input type="button" value="第${i-(-1)}天記錄"
                            data-event="SelfLog" 
                            data-day="${i}">
                        `;
                    }

                    Ex.f.AdminCheck(()=>{

                        Ex.obj.Main.querySelector("#Menu").innerHTML += `
                            <input type="button" value="換日"
                            data-event="_Next">        
                        `;

                    });
                    

                    Ex.f.NpcSet();
                });

            },
            "NpcSet":()=>{


                Ex.DB.ref(`game/${Ex.flag.game_id}/npc`).once("value",r=>{

                    var list = [];
                    
                    if(r.val()===null)
                    {
                        var job = Ex.config.job;
                        var v = Object.values(job);
                        var k = Object.keys(job);
                        var n = Ex.config.name;
                        
    
                        for(var i=0;i<v.reduce((a,b)=>a+b);i++)
                        {
                            var j = k[ Math.floor(k.length * Math.random()) ];
                            var _n = n[ Math.floor(n.length * Math.random()) ];

                            n.splice(n.findIndex(a=>a===_n),1);
    
                            list.push( {
                                "name":_n,
                                "job":j
                            } );
    
                            if( list.filter( a=>a.job===j ).length === job[j] )
                            {
                                k.splice(k.findIndex(a=>a===j),1);
                            }
                        }

                        Ex.DB.ref(`game/${Ex.flag.game_id}/npc`).set( list );
                    }
                    else
                    {
                        list = r.val();
                    }

                    Ex.flag.npc = list;


                    list.forEach((a,idx)=>{

                        var player = document.createElement("div");
                        var job = "";
                        var dead = (a.dead===undefined)?``:`disabled="disabled"`;
                        var info = '';

                        for(var day in Ex.flag.log)
                        {
                            if(Ex.flag.log[day].divine!=="" && 
                            Ex.flag.player.job==="divine" && 
                            Ex.flag.log[day].divine*1===idx*1)
                            {
                                info += `
                                    第${day-(-1)}天：占卜${(a.job==="wolf")?"人狼":"人類"}<BR>
                                `;
                            }

                            if(Ex.flag.log[day].guard!=="" && 
                            Ex.flag.player.job==="guard" && 
                            Ex.flag.log[day].guard*1===idx*1)
                            {
                                info += `
                                    第${day-(-1)}天：守護<BR>
                                `;
                            }
                        }

                        if(a.dead!==undefined)
                        {
                            info += `
                                第${a.dead.day-(-1)}天：${(a.dead.type==="vote")?"投票處死":"人狼咬死"}<BR>
                            `;
                        }


                        player.className = "npc";
                        player.id = idx;


                        if(Ex.flag.player.job===a.job && 
                            Ex.flag.player.job!=="human")
                        {
                            job = `${Ex.config.str[a.job]}`;
                        }

                        var human_c = 0;
                        var wolf_c = 0;
                        for(var id in Ex.flag.npc)
                        {
                            if(Ex.flag.npc[id].dead!==undefined) continue;

                            (Ex.flag.npc[id].job==="wolf")?wolf_c++:human_c++;
                        }

                        if(wolf_c>=human_c)
                        {
                            job = `${Ex.config.str[a.job]}`;
                            Ex.DB.ref(`game/${Ex.flag.game_id}/end`).set("wolf");

                            Ex.flag.end = "wolf";
                            
                        }
                        else
                        {
                            if(wolf_c===0) 
                            {
                                job = `${Ex.config.str[a.job]}`;
                                Ex.DB.ref(`game/${Ex.flag.game_id}/end`).set("human");

                                Ex.flag.end = "human";
                            }
                        }

                        

                        player.innerHTML = `
                            <input ${dead} type="button" value="${a.name}">

                            <input ${dead} type="button" data-event="Action" data-mode="say" value="代表發言">

                            <input ${dead} type="button" data-event="Action" data-mode="vote" value="投票">

                            <input ${dead} type="button" data-event="Action" data-mode="divine" value="占卜">

                            <input ${dead} type="button" data-event="Action" data-mode="wolf"  value="咬殺">

                            <input ${dead} type="button" data-event="Action" data-mode="guard" value="守衛">

                            <input type="button" data-event="Log" value="發言記錄">

                            <input ${dead} type="button" value="${job||"???"}">

                            <div>
                            ${info}
                            </div>
                            
                        `;

                        Ex.obj.Main.querySelector("#Content").appendChild(player);
                    });

                    Ex.f.ActionCheck();


                    var chat = ``;
                    /*
                    for(var id in Ex.flag.npc)
                    {
                        var r = Ex.flag.npc[id].say||{};

                        for(var day in r)
                        {
                            Object.values(r[day]).forEach(str=>{
                                
                                chat += `【${Ex.flag.npc[id].name}】：『${str}』(第${day-(-1)}天)\n`;

                            });
                        }
                    }
                    */


                    for(var day=0;day<=Ex.flag.game_day;day++)
                    {
                        for(var id in Ex.flag.npc)
                        {
                            var r = Ex.flag.npc[id].say||{};

                            Object.values(r[day]||{}).forEach(str=>{
                                
                                chat += `【${Ex.flag.npc[id].name}】：『${str}』(第${day-(-1)}天)\n`;

                            });
                        }
                    }


                    var textarea = Ex.obj.Main.querySelector("#Chat textarea");

                    textarea.value = chat;
                    textarea.scrollTo(0,textarea.scrollHeight);


                });


            },
            "ActionCheck":()=>{

                document.querySelectorAll(`[data-mode]`).forEach(obj=>{

                    if(Ex.flag.player[Ex.flag.game_day]!==undefined)
                    if(Ex.flag.player[Ex.flag.game_day][obj.dataset.mode]!==undefined)
                    {
                        obj.setAttribute("disabled","disabled");
                    }
                });

            },
            "Log":(e)=>{

                var npc_id = e.target.parentElement.id;
                var html = ``;
                var r = Ex.flag.npc[npc_id].say||{};


                html = `<textarea style="height:${window.innerHeight/2}px">`;

                for(var day in r)
                {
                    Object.values(r[day]).forEach(str=>{
                        
                        html += `=======第${day-(-1)}天=======\n${str}\n`;

                    });
                }

                html += `</textarea>
                <input type="button" data-event="MsgShow" value="關閉">`;
                Ex.f.MsgShow(html);

                

            },
            "SelfLog":(e)=>{

                var html = ``;

                html = `<textarea style="height:${window.innerHeight/2}px">`;

                for(var act in Ex.flag.player[e.target.dataset.day])
                {
                    var data = Ex.flag.player[e.target.dataset.day][act];
                    var str = "";

                    if(data.npc_id!==undefined)
                        str = `代表${Ex.flag.npc[data.npc_id].name}發言\n「${data.str}」`;
                    else
                        str = Ex.flag.npc[data].name;

                    html += `=======${Ex.config.str['a_'+act]}=======\n${str}\n`;

                }

                html += `</textarea>
                <input type="button" data-event="MsgShow" value="關閉">`;
                Ex.f.MsgShow(html);


            },
            "Action":(e)=>{

                if(Ex.flag.end!==undefined)
                {
                    Ex.f.MsgShow(`
                        此局遊戲結束,${Ex.config.str[Ex.flag.end]}側的勝利
                        <input type="button" data-event="MsgShow" value="關閉">
                    `);
                    return;
                }

                var npc_id = e.target.parentElement.id;
                var mode = e.target.dataset.mode;
                
                Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}/${Ex.flag.game_day}/${mode}`).once("value",r=>{

                    if(r.val()===null)
                    {
                        if(mode==="say")
                        {

                            Ex.f.MsgShow(`
                                <textarea placeholder="發言內容"></textarea>
                                <input type="button" 
                                data-npc_id="${npc_id}" 
                                data-game_day="${Ex.flag.game_day}"
                                data-event="Say" 
                                value="送出">
                                <input type="button" data-event="MsgShow" value="關閉">`
                            );

                        }
                        else
                        {
                            if(confirm(`確定要選【${Ex.flag.npc[npc_id].name}】為【${Ex.config.str["a_"+mode]}】目標嗎?\n(不可更改)`)===false) return;


                            Ex.DB.ref(`game/${Ex.flag.game_id}/npc/${npc_id}/${mode}/${Ex.flag.game_day}/${Ex.Storage.local.account.a}`).set(1);

                            Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}/${Ex.flag.game_day}/${mode}`).set(npc_id);

                            location.reload();
                        }
                    }

                });

                
            },
            "Say":(e)=>{

                var mode = "say";
                var npc_id = e.target.dataset.npc_id;
                var game_day = e.target.dataset.game_day;
                var str = e.target.parentElement.querySelector("textarea").value;

                if(str==="") return;

                if(confirm(`確定要代表【${Ex.flag.npc[npc_id].name}】發言嗎?\n(不可更改)`)===false) return;




                Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}/${game_day}/${mode}`).once("value",r=>{

                    if(r.val()===null)
                    {
                        Ex.DB.ref(`game/${Ex.flag.game_id}/npc/${npc_id}/${mode}/${game_day}/${Ex.Storage.local.account.a}`).set(str);
    
                        Ex.DB.ref(`game/${Ex.flag.game_id}/player/${Ex.Storage.local.account.a}/${game_day}/${mode}`).set({
                            "npc_id":npc_id,
                            "str":str
                        });

                        //Ex.obj.Msg.setAttribute("hide","");

                        location.reload();
                    }
                    
                });

            },
            "_Next":()=>{

                Ex.f.AdminCheck(()=>{

                    if(Ex.flag.end!==undefined)
                    {
                        Ex.f.MsgShow(`
                            此局遊戲結束【${Ex.config.str[Ex.flag.end]}】方的勝利
                            <input type="button" data-event="MsgShow" value="關閉">
                        `);
                        return;
                    }

                    var total = {
                        "vote":{},
                        "guard":{},
                        "divine":{},
                        "wolf":{}
                    };

                    Ex.DB.ref(`game/${Ex.flag.game_id}`).once("value",r=>{

                        r = r.val();

                        r.npc.forEach((npc,id)=>{

                            for(var key in total)
                            {
                                if(npc[key]!==undefined)
                                {
                                    if(npc[key][Ex.flag.game_day]!==undefined)
                                    {
                                        total[key][ id ] = Object.keys( npc[key][Ex.flag.game_day] ).length;
                                    }
                                }
                            }

                        });

                        var _max = {};

                        for(var key in total)
                        {
                            _max[key] = Math.max( ...Object.values(total[key]) );
                        }
                        console.log(total);
                        console.log(_max);

                        var _target = {};

                        for(var key in total)
                        {
                            _target[key] = _target[key]||[];

                            for(var npc in total[key])
                            {
                                if(total[key][npc]===_max[key])
                                {
                                    _target[key].push(npc);
                                }
                            }
                        }

                        console.log(_target);
                    

                        for(var key in _target)
                        {
                            if(_target[key].length===0)
                            {
                                for(var id in Ex.flag.npc)
                                {
                                    if(Ex.flag.npc[id].dead===undefined)
                                        _target[key].push(id);
                                }
                            }

                            if(_target[key].length>1)
                            {
                                _target[key] = _target[key].splice(
                                    Math.floor(_target[key].length * Math.random())
                                    ,1);
                            }
                        }

                        if( Ex.flag.npc[ _target.wolf[0] ].job==="wolf" || 
                        _target.wolf[0]===_target.vote[0] )
                        {
                            var wolf_other = [];
                            for(var id in Ex.flag.npc)
                            {
                                if(Ex.flag.npc[id].dead===undefined && 
                                    Ex.flag.npc[id].job!=="wolf" && 
                                    id!==_target.vote[0])
                                    wolf_other.push(id);
                            }

                            _target.wolf = wolf_other.splice(
                                Math.floor(wolf_other.length * Math.random())
                                ,1);
                        }


                        Ex.flag.npc[ _target.vote[0] ].dead = {
                            "type":"vote",
                            "day":Ex.flag.game_day
                        }


                        
                        for(var id in Ex.flag.npc)
                        {
                            if(Ex.flag.npc[id].job==="guard" && Ex.flag.npc[id].dead!==undefined) _target.guard[0] = "";

                            if(Ex.flag.npc[id].job==="divine" && Ex.flag.npc[id].dead!==undefined) _target.divine[0] = "";
                        }

                        
                        if(_target.guard[0]!==_target.wolf[0])
                            Ex.flag.npc[ _target.wolf[0] ].dead = {
                                "type":"wolf",
                                "day":Ex.flag.game_day
                            }

                        Ex.flag.log = {};

                        Ex.flag.log[ Ex.flag.game_day ] = {
                            "wolf":_target.wolf[0],
                            "divine":_target.divine[0],
                            "guard":_target.guard[0],
                            "vote":_target.vote[0]
                        }

                        console.log(Ex.flag.log);

                        Ex.DB.ref(`game/${Ex.flag.game_id}/npc`).update( Ex.flag.npc );
                        Ex.DB.ref(`game/${Ex.flag.game_id}/log`).update( Ex.flag.log );
                        Ex.DB.ref(`game/${Ex.flag.game_id}/day`).set(Ex.flag.game_day-(-1));

                        location.reload();
                    });


                });
            },
            "LogoOut":()=>{

                delete localStorage[Ex.id];
                
                location.reload();
            },
            "AccountCheck":()=>{

                if(Ex.Storage.local.account!==undefined)
                {
                    Ex.f.LoginRegister();
                    return;
                }


                Ex.f.MsgShow(`
                    <input type="text" placeholder="帳號" value="${(Ex.Storage.local.account)?Ex.Storage.local.account.a:""}">
                    <input type="password" placeholder="密碼" value="${(Ex.Storage.local.account)?Ex.Storage.local.account.p:""}">
                    <input type="button" data-event="LoginRegister" value="登入/註冊">`
                );

            },
            "AdminCheck":(func)=>{

                Ex.DB.ref(`admin/${Ex.Storage.local.account.a}`).once("value",r=>{

                    if(r.val()==="on")
                    {    
                        func();
                    }

                });

            },
            "MsgShow":(html)=>{

                if(Ex.obj.Msg.getAttribute("hide")===null)
                {
                    Ex.obj.Msg.setAttribute("hide","");
                    return;
                }

                Ex.obj.Msg.removeAttribute("hide");

                Ex.obj.Msg.querySelector("div").innerHTML = html;

            },
            "LoginRegister":(e)=>{

                var a = (Ex.Storage.local.account)?Ex.Storage.local.account.a:e.target.parentElement.querySelector("[type=text]").value;
                var p = (Ex.Storage.local.account)?Ex.Storage.local.account.p:e.target.parentElement.querySelector("[type=password]").value;


                Ex.DB.ref(`account/${a}`).once("value",r=>{

                    if(r.val()===null)
                    {
                        Ex.Storage.local.account = {
                            a:a,
                            p:CryptoJS.HmacSHA1(p,a).toString( CryptoJS.enc.Base64 ) 
                        };
                        Ex.f.StorageUpd();

                        Ex.DB.ref(`account/${a}`).set( Ex.Storage.local.account );

                    }
                    else
                    {
                        if( CryptoJS.HmacSHA1(p,a).toString( CryptoJS.enc.Base64 )!==r.val().p && p!==r.val().p)
                        {
                            alert("密碼錯誤");
                            return;
                        }

                        Ex.Storage.local.account = {
                            a:a,
                            p:r.val().p
                        };
                        
                        Ex.f.StorageUpd();
                    }

                    Ex.obj.Msg.setAttribute("hide","");

                    Ex.f.GameSet();

                    

                });

            }

        }
    };

    window.onload = ()=>{ 

        Ex.f.default();

        Ex.f.DB_set( Ex.config.DB_url, ()=>{

            Ex.f.AccountCheck();
        

        } );       
        
    
    }

})();


