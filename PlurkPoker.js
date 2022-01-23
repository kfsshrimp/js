class PlurkPoker {
    
    constructor(){
    
        Ex = {
            "id":"PlurkPoker",
            "DB":false,
            "Storage":{
                "local":{},
                "session":{}
            },
            "obj":{},
            "f":{
                "DB_set":function( func ){

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
                            Ex.DB.initializeApp({databaseURL:"https://kfs-plurk-default-rtdb.firebaseio.com/"});
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
                "obj_set":function(){

                    Ex.obj.Ex_div = document.createElement("div");
                    Ex.obj.Ex_div.id = Ex.id;

                    Ex.obj.msg = document.createElement("div");
                    Ex.obj.msg.id = `${Ex.id}-Msg`;
                    Ex.obj.msg.innerHTML = `
                    <div></div>
                    <a data-event="close" data-obj="${Ex.id}-Msg">關閉</a>
                    `;

                    Ex.obj.menu = document.createElement("div");
                    Ex.obj.menu.id = `${Ex.id}-Menu`;
                    Ex.obj.menu.innerHTML = `
                    <ul>
                    <li><a data-event="Game" data-mode="PostCard">出牌</a></li>
                    <li><a data-event="Game" data-mode="PostCard2">收回出牌</a></li>
                    <li><a data-event="Game" data-mode="PostCardPass">結束出牌</a></li>
                    </ul>
                    `;
                    

                    document.body.appendChild( Ex.obj.Ex_div );
                    document.body.appendChild( Ex.obj.msg );
                    document.body.appendChild( Ex.obj.menu );
                },
                "DB_on":(r)=>{



                    if(r===null)
                    {
                        delete Ex.Storage.local.game_id;
                        Ex.f.StorageUpd();
                        Ex.f.MsgPop(`牌局已結束<BR><a data-event="Restart">刷新</a>`);
                        return;
                    }

                    Ex.flag.game = r;
                    
                    
                    Ex.obj.Ex_div.querySelector("ul#players").innerHTML = '';

                    for(var k in r.players)
                    {
                        Ex.obj.Ex_div.querySelector("ul#players").innerHTML += 
                        `<li 
                        data-event="Game" data-mode="Kick" 
                        ${(r.players[k].nick_name===Ex.flag.game.flag)?`class="now_turn"`:""}>${r.players[k].nick_name}</li>`;
                    }
                    

                    if(Ex.flag.game.flag!=="wait")
                    {
                        Ex.f.game_start();
                    }

                    
                },
                "game_start":()=>{

                    //var players = Object.values(Ex.flag.game.players);
                    var player_div = document.querySelectorAll(".player_cards");

                    var players = [];
                    var values = Object.values(Ex.flag.game.players);
                    var self_i;

                    values.forEach((p,i)=>{
                        if(p.nick_name===GLOBAL.session_user.nick_name)
                        {
                            self_i = i;
                        }
                    });
                    
                    players[0] = values[ self_i ];
                    for(var i=1;i<4;i++)
                    {
                        self_i++;
                        if(self_i>3) self_i = 0;
                        
                        players[i] = values[ self_i ];

                        
                        
                    }
                    
                    
                    for(var i in players)
                    {
                        if(players[i].nick_name===GLOBAL.session_user.nick_name)
                        {
                            player_div[0].dataset.player = players[i].nick_name;
                            player_div[0].innerHTML = ``;
                            for(var card of players[i].cards||[])
                            {
                                var _class = `color${card.split(",")[0]} nu${card.split(",")[1]}`;

                                player_div[0].innerHTML += 
                                `<div draggable="true" class="poker ${_class}" data-event="Game" 
                                data-r_event="PokerMenu" data-mode="PokerSelect"></div>`;
                            }
                            players.splice(i,1);
                        }
                    }

                    for(var i in players)
                    {
                        player_div[i*1+1].dataset.player = players[i].nick_name;
                        player_div[i*1+1].innerHTML = ``;

                        for(var card of players[i].cards)
                        {
                            player_div[i*1+1].innerHTML += 
                            `<div draggable="true" class="poker back"></div>`;
                        }
                    }

                    player_div.forEach((o,eq)=>{
                        o.style.display = (eq%2===0)?"flex":"block";

                        (o.dataset.player===Ex.flag.game.flag)?o.classList.add("now_trun"):o.classList.remove("now_trun");
                    });

                    
                    if(Ex.flag.game.post_card===undefined)
                    {
                        document.querySelectorAll(`.post_card`).forEach(o=>{
                            o.remove();
                        });
                    }

                    document.querySelectorAll(`.post_card`).forEach(o=>{
                        
                        if( Object.keys(Ex.flag.game.post_card).indexOf(o.id)===-1 )
                        {
                            o.remove();
                        }

                    });

                    for(var id in Ex.flag.game.post_card)
                    {
                        if(document.querySelector(`[id="${id}"].post_card`)!==null)
                        {
                            continue;
                        }

                        var post_card_info = Ex.flag.game.post_card[id];

                        var post_card_div = document.createElement("div");
                        post_card_div.className = "post_card";
                        post_card_div.id = id;
                        post_card_div.dataset.post_card_id = id;
                        post_card_div.dataset.r_event = "PokerMenu";
                        post_card_div.setAttribute("draggable","true");
                        post_card_div.innerHTML = `<span>${post_card_info.nick_name}</span>`;

                        post_card_info.cards.forEach(c=>{

                            var _class = `color${c.split(",")[0]} nu${c.split(",")[1]}`;

                            post_card_div.innerHTML += `<div
                            data-post_card_id="${id}" 
                            data-r_event="PokerMenu" 
                            draggable="true" class="poker ${_class}" ></div>`;
                        });

                        var count = document.querySelectorAll(".post_card").length;

                        post_card_div.style.top = `${window.innerHeight/4+count*20}px`;
                        post_card_div.style.left = `${window.innerWidth/4+count*20}px`;


                        Ex.obj.Ex_div.appendChild(post_card_div);
                    }


                    Ex.obj.Ex_div.querySelectorAll(`[data-mode="start"]`).forEach(o=>{o.remove()});


                },
                "game_join":(path)=>{
                    
                    Ex.DB.ref(path).off();

                    Ex.DB.ref(path).on("value",r=>{
                        
                        Ex.f.DB_on(r.val());

                    });

                    Ex.obj.msg.style.display = "none";
                },
                "game_set":function(){

                    var word = '';
                    if(GLOBAL.session_user===null)
                    {
                        word = `<input data-event="PlurkLogin" type="button" value="必須登入PLURK帳號"><hr>`;
                    }

                    if(Ex.Storage.local.game_id!==undefined)
                    {
                        word = `目前加入牌局：${Ex.Storage.local.game_id}<BR>`;
                    }

                    Ex.obj.Ex_div.innerHTML = `

                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>


                            <div draggable="true">
                            ${word}
                                <input ${(word!='')?`disabled="disabled"`:""} 
                                type="button" data-event="Game" data-mode="join" value="參加牌局">
                                <input ${(word!='')?`disabled="disabled"`:""} 
                                type="button" data-event="Game" data-mode="new" value="建立牌局">
                                <BR>
                                <input 
                                        type="button" data-event="Exit" value="關閉外掛">
                                        <input 
                                        type="button" data-event="Restart" value="重啟外掛">
                                <ul id="players">
                                </ul>
                            </div>
                        `;

                    if(Ex.Storage.local.game_id!==undefined)
                    {
                        Ex.f.game_join(`poker/${Ex.Storage.local.game_id}/`);

                        if(Ex.Storage.local.game_id===GLOBAL.session_user.nick_name)
                        {
                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="start" value="開始牌局">';
                        }

                        Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += 
                        '<input type="button" data-event="Game" data-mode="leave" value="離開牌局">';
                    }                    

                },
                "PokerMenu":(e)=>{

                    Ex.obj.menu.style.left = e.clientX + 'px';
                    Ex.obj.menu.style.top = e.clientY + 'px';
                    Ex.obj.menu.style.display = "block";

                    for(var k in e.target.dataset)
                    {
                        if(k.indexOf("event")===-1)
                            Ex.obj.menu.dataset[k] = e.target.dataset[k];
                    }
                    
                },
                "Game":(e)=>{
                    

                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                        //o.setAttribute("disabled","disabled");
                    });

                    (Ex.flag.confirm[ e.target.dataset.mode ]===undefined)?Ex.flag.confirm[ e.target.dataset.mode ]=true:'';


                    switch(e.target.dataset.mode)
                    {
                        case "new":


                            Ex.obj.Ex_div.querySelectorAll(`[data-mode="join"],[data-mode="new"]`).forEach(o=>{o.setAttribute("disabled","disabled")});

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).off();

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).on("value",r=>{

                                Ex.f.DB_on(r.val());

                            });

                            Ex.Storage.local.game_id = GLOBAL.session_user.nick_name;

                            Ex.f.StorageUpd();



                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).set( Ex.flag.game );

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/players`).push( {
                                "nick_name":GLOBAL.session_user.nick_name
                            } );

                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML = `目前加入牌局：${Ex.Storage.local.game_id}<BR>` + Ex.obj.Ex_div.querySelector("div:last-child").innerHTML;

                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="start" value="開始牌局"><input type="button" data-event="Game" data-mode="leave" value="離開牌局">';

                        break;

                        case "join":
                            Ex.f.MsgPop(`
                            開局噗浪帳號：
                            <input type="text" value=""><BR>
                            <a data-event="Game" data-mode="join2">加入</a>
                            `,e);
                            
                        break;

                        case "join2":
                            var join_nick_name = e.target.parentElement.querySelector(`input[type="text"]`).value;

                            if(join_nick_name===GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`不可輸入自己帳號`,e);
                                return;
                            }
                        

                            Ex.DB.ref(`poker/${join_nick_name}/`).once("value",r=>{
                                
                                r = r.val();
                                Ex.flag.game = r;

                                if(Ex.flag.game===null)
                                {
                                    Ex.f.MsgPop(`無此牌局`,e);
                                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                        o.removeAttribute("disabled","disabled");
                                    });
                                    return;
                                }

                                if(Object.keys(Ex.flag.game.players).length>=4)
                                {
                                    Ex.f.MsgPop("玩家人數已滿",e);
                                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                        o.removeAttribute("disabled","disabled");
                                    });
                                    return;
                                }

                                Ex.Storage.local.game_id = join_nick_name;

                                Ex.f.StorageUpd();



                                Ex.DB.ref(`poker/${join_nick_name}/players`).push( {
                                    "nick_name":GLOBAL.session_user.nick_name
                                } );


                                Ex.f.game_join(`poker/${join_nick_name}/`);
                                

                                Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="leave" value="離開牌局">';

                            });
                            

                        break;

                        case "leave":
                            if( Ex.flag.confirm.leave )
                            {
                                Ex.f.MsgPop(`確定要離開牌局嗎？<BR>
                                <a data-event="Game" data-mode="leave">離開牌局</a>
                                `,e);
                                Ex.flag.confirm.leave = false;

                                setTimeout(()=>{
                                    Ex.flag.confirm.leave = true;
                                },5000);
                                return;
                            }


                            for(var i in Ex.flag.game.players)
                            {
                                var player = Ex.flag.game.players[i];
                                
                                if(player.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    delete Ex.flag.game.players[i];
                                }
                            }


                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).off();

                            if(Object.keys(Ex.flag.game.players||{}).length===0 || Ex.Storage.local.game_id===GLOBAL.session_user.nick_name)
                            {
                                Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).set( {} );
                            }
                            else
                            {
                                Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).set( Ex.flag.game );
                            }

                            

                            delete Ex.Storage.local.game_id;

                            Ex.f.StorageUpd();
                            Ex.f.Restart();

                        break;


                        case "Kick":

                            if(e.target.innerHTML===GLOBAL.session_user.nick_name || GLOBAL.session_user.nick_name!==Ex.Storage.local.game_id) return;


                            if( Ex.flag.confirm.Kick )
                            {
                                Ex.f.MsgPop(`確定要退出【${e.target.innerHTML}】該玩家？<BR>
                                <a data-event="Game" data-mode="Kick" data-player="${e.target.innerHTML}">確定</a>
                                `,e);
                                Ex.flag.confirm.Kick = false;

                                setTimeout(()=>{
                                    Ex.flag.confirm.Kick = true;
                                },5000);
                                return;
                            }

                            
                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${Ex.f.GetPlayerNo(e.target.dataset.player)}`).remove();

                            Ex.obj.msg.style.display = "none";

                        break;


                        case "start":

                            if(Object.keys(Ex.flag.game.players).length<4)
                            {
                                Ex.f.MsgPop("玩家人數未滿",e);
                                Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                    //o.removeAttribute("disabled","disabled");
                                });
                                return;
                            }

                            var poker = [];
                            for(var nu=1;nu<=13;nu++)
                            for(var color=1;color<=4;color++)
                            {
                                poker.push( `${color},${nu}` )
                            }
                            Ex.f.shuffle(poker);

                            for(var i in Ex.flag.game.players)
                            {
                                Ex.flag.game.players[i].cards = [];

                                for(var card=1;card<=13;card++)
                                {
                                    var get_card = poker.pop();
                                    if(get_card==="1,3") Ex.flag.game.flag = Ex.flag.game.players[i].nick_name;

                                    Ex.flag.game.players[i].cards.push( get_card );
                                }
                            }

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                        break;

                        case "PokerSelect":
                            e.target.classList.add("select");
                            e.target.innerHTML = `<div 
                            data-post_card_id="" 
                            data-r_event="PokerMenu" 
                            data-event="Game" data-mode="PokerUnSelect"></div>`;
                        break;

                        case "PokerUnSelect":
                            e.target.parentElement.classList.remove("select");
                            e.target.remove();
                        break;


                        case "PostCard":
                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            var post_card = [];
                        /*
                            Ex.flag.game.post_card = Ex.flag.game.post_card||[];
                            var post_card = [];
                            
                            var post_card_div = document.createElement("div");
                            post_card_div.className = "post_card";
                            post_card_div.setAttribute("draggable","true");
                            post_card_div.innerHTML = `<span>${GLOBAL.session_user.nick_name}</span>`;
                        */ 
                            if(document.querySelectorAll(".poker.select").length===0)
                            {
                                Ex.f.MsgPop('未選擇牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }
                            

                            document.querySelectorAll(".poker.select").forEach(o=>{

                                o.classList.remove("select");
                                //post_card_div.appendChild( o );

                                post_card.push( 

                                    [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")

                                );
                            });

                            /*
                            Ex.flag.game.post_card[ Ex.flag.game.post_card.length ] = {
                                "nick_name":GLOBAL.session_user.nick_name,
                                "cards":post_card
                            };
                            */

                            Object.values(Ex.flag.game.players).forEach((p)=>{
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    var new_cards = [];
                                    p.cards.forEach( (c)=>{
                                        if(post_card.indexOf(c)===-1)
                                        {
                                            new_cards.push( c );
                                        }
                                    });
                                    p.cards = new_cards;
                                }
                            });

                            for(var id in Ex.flag.game.players)
                            {
                                var p = Ex.flag.game.players[id];
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    var new_cards = [];
                                    p.cards.forEach( (c)=>{
                                        if(post_card.indexOf(c)===-1)
                                        {
                                            new_cards.push( c );
                                        }
                                    });
                                    //p.cards = new_cards;
                                    Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${id}/cards`).set( new_cards );
                                }
                            }


                            //Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/turn`).set( Ex.flag.game.turn*1+1 );


                            //Ex.obj.Ex_div.appendChild(post_card_div);

                            //Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/post_card`).push({
                                "turn":Ex.flag.game.turn,
                                "nick_name":GLOBAL.session_user.nick_name,
                                "cards":post_card
                            });

                            Ex.obj.menu.style.display = "none";
                            
                        break;

                        case "PostCard2":

                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            if(Ex.flag.game.post_card[ Ex.obj.menu.dataset.post_card_id ].turn!==Ex.flag.game.turn)
                            {
                                Ex.f.MsgPop('不可收回之前的出牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            if(Ex.obj.menu.dataset.post_card_id===``)
                            {
                                Ex.f.MsgPop('未選擇出牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }
                            var post_card_div = document.querySelector(`[id="${Ex.obj.menu.dataset.post_card_id}"].post_card`);

                            if(post_card_div.querySelector("span").innerHTML!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop('不可回收其他玩家的牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            post_card_div.querySelectorAll(".poker").forEach(o=>{
                                
                                Object.values(Ex.flag.game.players).forEach(p=>{
                                    if(p.nick_name===GLOBAL.session_user.nick_name)
                                    {
                                        p.cards = p.cards||[];
                                        p.cards.push(
                                            [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")
                                        );
                                    }
                                });
                            });

                            
                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players`).update(Ex.flag.game.players);

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/post_card/${Ex.obj.menu.dataset.post_card_id}`).remove();


                            Ex.obj.menu.style.display = "none";
                        break;

                        case "PostCardPass":

                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            var values = Object.values(Ex.flag.game.players);
                            var keys = Object.keys(Ex.flag.game.players);

                            
                            var _flag;
                            values.forEach((p,i)=>{
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    _flag = (i+1>=values.length)?Ex.flag.game.players[ keys[0] ].nick_name:Ex.flag.game.players[ keys[i+1] ].nick_name;
                                }
                            });

                            Ex.flag.game.turn++;
                            Ex.flag.game.flag = _flag;

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                            Ex.obj.menu.style.display = "none";


                        break;


                        default:
                        break;
                    }


                },
                "Restart":()=>{
                    
                    Ex.f.Exit();
                    setTimeout(()=>{
                        
                        Ex.f.obj_set();
                        Ex.f.game_set();

                    },500);
                    
                },
                "Exit":()=>{
                    for(var k in Ex.obj)
                    {
                        Ex.obj[k].remove();
                        delete Ex.obj[k];
                    }
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
                "PlurkLogin":()=>{
                    location.href = 'https://www.plurk.com/login';
                },
                "shuffle":(ary)=>{
                    for (let i = ary.length - 1; i > 0; i--) {
                        let j = Math.floor(Math.random() * (i + 1));
                        [ary[i], ary[j]] = [ary[j], ary[i]];
                    }
                },
                "GetPlayerNo":(nick_name)=>{
                    for(var no in Ex.flag.game.players)
                    {
                        if(Ex.flag.game.players[no].nick_name===nick_name)
                        {
                            return no;
                        }
                    }
                },
                "default":()=>{

                    document.addEventListener("dragend",function(e){

                        if(e.target.getAttribute("draggable")==="true")
                        {
                            e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                            e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";

                            if(e.target.classList.contains("poker"))
                            {
                                for(var i=0;i<e.target.parentElement.children.length;i++)
                                {
                                    var o = e.target.parentElement.children[i];

                                    if(o===e.target)
                                    {
                                        var x_move = Math.round( (e.clientX - Ex.flag.mousedown.clientX) / 70);

                                        if(x_move>0)x_move++;
                                        if(x_move<0 && i===0) x_move = 0;
                                        
                                        e.target.parentElement.insertBefore(e.target,e.target.parentElement.children[i*1 + x_move*1]);

                                        var new_cards = [];

                                        e.target.parentElement.children.forEach(o=>{ 
                                            
                                            new_cards.push(
                                                [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")
                                            );
                                        });


                                        Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${Ex.f.GetPlayerNo(GLOBAL.session_user.nick_name)}/cards`).update( new_cards );

                                        break;
                                    }
                                }

                            }
                        }
                    });
                    

                    document.addEventListener("mousedown",function(e){
                        Ex.flag.mousedown = e;
                    });


                    document.addEventListener("click",(e)=>{

                        if(e.target.dataset.event!==undefined) Ex.f[ e.target.dataset.event ](e);
                    
                        if(e.target.dataset.flag!==undefined)
                        {
                            Ex.flag[ e.target.dataset.flag.split(":")[0] ] = e.target.dataset.flag.split(":")[1];
                        }
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

                        

                    Ex.f.DB_set( ()=>{

                        Ex.f.style_set();
                        Ex.f.obj_set();
                        Ex.f.game_set();
                    });
                    
                }
            },
            "flag":{
                "game":{
                    "players":{
                        
                    },
                    "flag":'wait',
                    "turn":1
                },
                "confirm":{}
            }
        };

        Ex.f.default();

        return Ex;
    }

}

//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/PlurkEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
//eval(atob('dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsvUGx1cmtFeC5qcz9zPTE2NDE4OTU2MTg0MDRgO2RvY3VtZW50LmhlYWQucHJlcGVuZChqcyk7'))