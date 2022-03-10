class PlurkEx_friends_battle {
    
    constructor(){

        var Ex = {
            "id":"PlurkEx_friends_battle",
            "DB":false,
            "Storage":{
                "local":{},
                "session":{}
            },
            "Clock":{
                "setInterval":{},
                "setTimeout":{}
            },
            "flag":{
                "money":500,
                "team":{},
                "friends":{}
            },
            "config":{
                "get_friend_money_min":50,
                "karma_min":50,
                "money":500,
                "unit":{
                    "lv":50,
                    "hp":2,
                    "atk":2,
                    "rad":5
                }
            },
            "template":{
                "unit_info":(info)=>{
                    return `<div id="${info.id}" class="info">
                        名稱：${ info.display_name }<BR>
                        素質：${ info.karma }<BR>
                        等級：${ info.game.lv }<BR>
                        經驗：${ info.game.exp }<BR>
                        生命：${ info.game.hp }<BR>
                        攻擊：${ info.game.atk }<BR>
                        </div>`;
                },
                "team_list":(info)=>{
                    return `
                    <div data-r_event="Game" data-mode="Action" id="${info.id}" class="info" 
                    title="LV：${ info.game.lv }\nHP：${ info.game.hp }\nATK：${ info.game.atk }">
                    ${ info.display_name }
                    </div>
                    `;
                },
                "action_menu":()=>{
                    return `
                    <ul>
                        <li>攻擊</li>
                        <li>休息</li>
                    </ul>
                    `
                }

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

                            if(typeof(func)==="function")
                                func();
                        }
                    },100);
                    
                },
                "style_set":function(){

                    var link = document.createElement('link');
                    link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css?s=${new Date().getTime()}`;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.prepend(link);
                },
                "obj_set":function(){


                    Ex.obj.friends = new FriendsSelectList({}).list;

                    Ex.obj.ifr_friends = document.createElement("iframe");
                    Ex.obj.ifr_friends.src = "/Friends";
                    Ex.obj.ifr_friends.style.display = "none";
                    document.body.appendChild(Ex.obj.ifr_friends);

                    if(Ex.Storage.local.save)
                        Ex.flag = JSON.parse(Ex.Storage.local.save);





                    Ex.obj.Ex_div = document.createElement("div");
                    
                    Ex.obj.Ex_div.id = Ex.id;

                    Ex.obj.Ex_div.innerHTML = `
                    <div id="Menu" draggable="true">
                        <div class="info">資金：$<span data-flag="money">${Ex.flag.money}</span></div>
                        <input type="button" data-event="Game" data-mode="GetFriend" value="徵召傭兵">
                        <input type="button" data-event="Game" data-mode="ShowFriend" value="傭兵狀態">
                        <input type="button" data-event="Game" data-mode="Battle" value="進入戰場">
                        <input type="button" data-event="System" data-mode="Reset" value="遊戲初始化">
                    </div>
                    <div id="Battle" draggable="true"></div>
                    `;



                    Ex.obj.msg = document.createElement("div");
                    Ex.obj.msg.id = `${Ex.id}-Msg`;
                    Ex.obj.msg.setAttribute("draggable","true");
                    Ex.obj.msg.innerHTML = `
                    <input type="button" value="X" data-event="close" data-obj="${Ex.id}-Msg">

                    <div></div>
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
                    
                    //document.body.prepend( Ex.obj.load );

                    document.body.appendChild( Ex.obj.Ex_div );
                    document.body.appendChild( Ex.obj.msg );
                    document.body.appendChild( Ex.obj.menu );
                },
                "System":(e)=>{

                    var mode = (typeof(e)==="string")?e:e.target.dataset.mode;

                    switch(mode)
                    {
                        case "Reset":
                            Ex.f.MsgPop(`
                            <div class="info">
                            確定要重置遊戲嗎?<BR>
                            (注意：全部記錄將會初始化)<BR>
                            <input type="button" value="確定" 
                            data-event="System" data-mode="RestConfirm">
                            </div>
                            `,e);

                        break;

                        case "RestConfirm":

                            Ex.flag.team = {};
                            Ex.f.Friend_set();
                            Ex.flag.money = Ex.config.money;
                        break;

                        case "Save":
                            Ex.Storage.local.save = JSON.stringify(Ex.flag);

                            Ex.f.StorageUpd();
                        break;
                    }

                },
                "Game":(e)=>{
                    
                    var mode = e.target.dataset.mode;

                    switch (mode)
                    {
                        case "GetFriend":
                            Ex.flag.team = Ex.flag.team||{};
                            Ex.flag.friends = Ex.flag.friends||{};

                            if( Object.keys(Ex.flag.friends).length===0 ) Ex.f.Friend_set();

                            var seed = Object.keys(Ex.flag.friends);
                            Ex.f.shuffle(seed);

                            var get = seed.pop();

                            Ex.obj.ifr_friends.contentDocument.querySelector(".search_box input").value = Ex.flag.friends[get].nick_name.split("@")[1];
                            Ex.obj.ifr_friends.contentDocument.querySelector(".search_box input").dispatchEvent(new KeyboardEvent('keydown',{'keyCode':'13'}));

                            setTimeout(()=>{
                                var info = Users.getUserById(get);
                                var need_money = (Math.ceil(info.karma)<Ex.config.get_friend_money_min)?Ex.config.get_friend_money_min:Math.ceil(info.karma);

                                if( need_money>Ex.flag.money )
                                {
                                    Ex.f.MsgPop(`<div class="info">資金不足,徵召失敗</div>`,e);

                                    //delete Ex.flag.friends[get];
                                    return;
                                }

                                var karma = info.karma;
                                if(info.karma<Ex.config.karma_min) info.karma = Ex.config.karma_min;


                                info.game = {};
                                info.game.lv = Math.floor(info.karma/Ex.config.unit.lv);

                                info.game.atk = Math.floor(info.karma/Ex.config.unit.atk);
                                info.game.hp = Math.floor(info.karma/Ex.config.unit.hp);

                                var x = Ex.f.rad( Math.floor(info.karma/Ex.config.unit.rad) )*1;

                                if( Ex.f.rad(2)===1 )
                                {
                                    info.game.atk += x;
                                    info.game.hp += Math.floor(info.karma/Ex.config.unit.hp) - x;
                                }
                                else
                                {
                                    info.game.hp += x;
                                    info.game.atk += Math.floor(info.karma/Ex.config.unit.atk) - x;
                                }

                                for(var attr in info.game) info.game[attr] = (info.game[attr]<1)?1:info.game[attr];

                                info.game.exp = 0;

                                info.karma = karma;

                                Ex.flag.team[info.uid] = info;

                                Ex.f.MsgPop(Ex.template.unit_info(info),e);

                                Ex.flag.money -= need_money;
                            
                                

                                delete Ex.flag.friends[get];
                            },500);

                        break;

                        case "ShowFriend":

                            var word = ``;
                            for(var uid in Ex.flag.team)
                            {
                                var info = Ex.flag.team[uid];

                                word += Ex.template.unit_info(info);
                            }

                            Ex.f.MsgPop(`
                            ${word}
                            `,e);

                        break;

                        case "Battle":
                            Ex.obj.Battle = Ex.obj.Ex_div.querySelector("#Battle");
                            Ex.obj.Battle.style.display = "grid";

                            Ex.obj.Battle.style.width = document.body.clientWidth*0.7 + 'px';
                            Ex.obj.Battle.style.height = document.body.clientHeight*0.7 + 'px';

                            Ex.obj.Battle.style.top = document.body.clientHeight*0.2 + 'px';
                            Ex.obj.Battle.style.left = document.body.clientWidth*0.2 + 'px';

                            Ex.obj.Battle.innerHTML = `
                            <input type="button" value="X" data-event="close" data-obj="Battle">
                            
                            <div id="enemy">
                            </div>

                            <div id="battle_area"></div>

                            <div id="team">
                            ${
                                Object.values(Ex.flag.team).map(unit=>{
                                    return Ex.template.team_list(unit)
                                }).join("")
                            }
                            </div>
                            
                            `
                        break;

                        case "Action":
                            
                            Ex.f.MsgPop(Ex.template.action_menu(),e);

                        break;

                        

                        default:

                        break;
                    }


                    Ex.f.System('Save');
                    
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
                "plurk_js":()=>{

                    Ex.obj.friends = new FriendsSelectList({}).list;

                    Ex.obj.ifr_friends = document.createElement("iframe");
                    Ex.obj.ifr_friends.src = "/Friends";
                    Ex.obj.ifr_friends.style.display = "none";
                    document.body.appendChild(Ex.obj.ifr_friends);

                    

                    if(Ex.Storage.local.save)
                        Ex.flag = JSON.parse(Ex.Storage.local.save);
                    

                    /*
                    document.querySelector("#dash-friends .show_all_friends a").click();

                    var _t = setInterval(()=>{
                        var pop = document.querySelector(".pop-window.show");
                        if(pop!==null)
                        {
                            clearInterval(_t);

                            var _t2 = setInterval(()=>{
                                var close = pop.querySelector("iframe").contentDocument.querySelector(".pop-window-close.pif-cancel");
                                
                                if( close!==null )
                                {
                                    clearInterval(_t2);
                                    close.click();
                                } 
                            },500);

                            setTimeout(()=>{
                                Ex.obj.load.style.opacity = "0";
                                setTimeout(()=>{
                                    Ex.obj.load.style.display = "none";
                                },2000);
                            },2000);


                            Ex.f.Friend_set();
                        }
                    },500);
                    */


                },
                "Friend_set":()=>{

                    Ex.flag.friends = {};
                    Ex.obj.friends.querySelectorAll("li").forEach(o=>{
                        Ex.flag.friends[ o.dataset.uid ] = {"uid":o.dataset.uid};

                        Object.values(o.children).forEach(o2=>{
                            Ex.flag.friends[ o.dataset.uid ][ o2.className ] = o2.src||o2.innerHTML;

                        });
                    });
                },
                "default":()=>{

                    Ex.Clock.setInterval.flag = setInterval(()=>{
                        Ex.f.FlagUpd();
                    },1000);


                    document.addEventListener("dragend",function(e){

                        if(e.target.getAttribute("draggable")==="true")
                        {
                            e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                            e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";
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

                    Ex.f.DB_set( ()=>{

                        Ex.f.style_set();
                        Ex.f.obj_set();

                    });
                    
                }
            }
        };

        Ex.f.default();

        return Ex;
    }

    

    //Ex.f.default();
};

var Ex = new PlurkEx_friends_battle();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/PlurkEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
//eval(atob('dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsvUGx1cmtFeC5qcz9zPTE2NDE4OTU2MTg0MDRgO2RvY3VtZW50LmhlYWQucHJlcGVuZChqcyk7'))



/*
撈出好友
var x = new FriendsSelectList({});
ID撈出個人訊息
Users.getUserById(4208109)

*/