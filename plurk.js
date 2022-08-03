(()=>{

    var Ex = {
        "OtherExSet":(ExName)=>{

            if( (eval(`typeof(${ExName})`))==='undefined' )
            {
                var js = document.createElement("script");
                js.src =  `https://kfsshrimp.github.io/js/${ExName}.js?s=${new Date().getTime()}`;
                document.head.prepend(js);
            }

            var _t = setInterval(()=>{
                if( (eval(`typeof(${ExName})`))!==undefined )
                {
                    Ex.OtherEx[ ExName ] = eval(`new ${ExName}(Ex)`);
                    clearInterval(_t);
                }
            },1000);

        },
        "OtherEx":{

        },
        "id":"plurk",
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
            "plurk":{}
           
        },
        "config":{
            "canvas":{
                "height":80,
                "width":80
            },
            "vote_max":6
            
        },
        "template":{},
        "obj":{},
        "f":{
            "GetPlurk":(pid)=>{

                Ex.flag.plurk[ pid ] = PlurksManager.getPlurkById(pid);

                Ex.f.GetRePlurk( pid );

            },
            "GetRePlurk":(pid)=>{

                ResponsesManager.loadResponses( pid );

                var _t = setInterval(()=>{

                    if(ResponsesManager.getPlurkResponses( pid ).length!==0)
                    {
                        clearInterval(_t);

                        ResponsesManager.loadOlderResponses( pid,!0);
                        Ex.flag.plurk[ pid ]._replurk =  ResponsesManager.getPlurkResponses( pid );

                        if(Ex.flag.plurk[ pid ].owner_id!==99999)
                        {
                            Ex.flag.plurk[ pid ]._re_user = ResponsesManager.getPlurkResponsesUsers(pid).map( d=>{
                                return Users.getUserById(d)
                            });
                        }
                        
                    }

                },1);

                /*"ResponsesManager":ResponsesManager
                ResponsesManager.loadResponses( parseInt('ophxn9',36) )
                ResponsesManager.loadOlderResponses( parseInt('ophxn9',36) , !0)
                ResponsesManager.getPlurkResponses( parseInt('ophxn9',36) )


                PlurkAdder.addPlurk({qualifier: ":",content:"test1" })
                PlurkAdder.addResponse( {plurk_id:parseInt("opmub0",36),owner_id:14556765},"test2",":")
                PlurkAdder.editPlurk({plurk_id:parseInt("opmub0",36),id:parseInt("opmub0",36)},"aaa")

                */
            },
            "RePlurkToPieChart":(pid)=>{

                replurk = Ex.flag.plurk[ pid ]._replurk

                //console.log(replurk);
                if(replurk[0]===undefined)
                {
                    document.querySelector(`.block_cnt:nth-child(1)>div[data-uid="${GLOBAL.session_user.uid}"][data-pid="${pid}"]`).querySelectorAll("canvas,#VoteInfo").forEach(o=>{o.remove();})

                    return;
                }

                //[data-uid="${GLOBAL.session_user.uid}"]
                var plurk_div = document.querySelector(`.block_cnt:nth-child(1)>div[data-pid="${pid}"]`);

                var plurk = Ex.flag.plurk[ replurk[0].plurk_id ];

                plurk._vote = {
                    "1":0,
                    "2":0,
                    "3":0,
                    "4":0,
                    "5":0,
                    "6":0
                };

                var user_check = [];
                replurk.forEach(v=>{
                    
                    
                    v.content = v.content.match(/[0-9]/);
                    v.content = (v.content===null)?v.content:v.content[0];
                    if(
                        isNaN(parseInt(v.content))===true ||
                        user_check.indexOf( v.handle||v.user_id )!==-1 || 
                        v.content>Ex.config.vote_max
                    ) return;

                    user_check.push( v.handle||v.user_id );


                    plurk._vote[ v.content ] = 
                    (plurk._vote[ v.content ]||0)+1;
                });

                if(Object.keys(plurk._vote).length>0)
                {
                    Ex.f.PieChart(plurk_div);
                }

            },
            "plurk_obj_set":()=>{

                Ex.Clock.setInterval.GetVotePlurk = setInterval(()=>{

                    
                    document.querySelectorAll(`#cbox_response,#form_holder,#plurk_responses`).forEach(o=>{

                        if(o.querySelector(`#response-search`)!==null)
                        {
                            if(o.id==="plurk_responses")
                            {
                                var mtop = window.scrollY - document.querySelector(".bigplurk").clientHeight;
                                mtop = (mtop<0)?0:mtop;

                                o.querySelector(`#response-search`).style.marginTop = mtop + 'px';
                                o.querySelector(`#response-search`).style.right = '0px'
                            }
                            else
                            {
                                o.querySelector(`#response-search`).style.marginTop = o.querySelector(".response_box").scrollTop + 'px';
                            }
                        }
                        else
                        {


                            var search_div = document.createElement("div");
                            search_div.id = "response-search";
                            search_div.innerHTML = `
                            
                                <input type="text" id="content" placeholder="內容">
                                <input type="text" id="name" placeholder="暱稱(帳號)">
                            `;

                            o.querySelector(".response_info").prepend(search_div);
                            
                            search_div.querySelectorAll("input").forEach(input=>{

                                input.addEventListener("keydown",Ex.f.ReplurkSearch);

                            });
                        }
                    });

                },1000);

            },
            "ReplurkSearch":(e)=>{
                                
                if(
                    e.code.toLocaleLowerCase()==="enter" || 
                    e.code.toLocaleLowerCase()==="numpadenter")
                {
                    var response_box = e.path[3]; 
                    var pid = response_box.querySelector(".list .cboxAnchor").dataset.pid;

                    Ex.f.GetPlurk(pid);

                    response_box.querySelectorAll(`[data-rid]`).forEach(o=>{
                        o.style.display = "none";
                    });

                    var content = e.target.parentElement.querySelector("#content").value;
                    var name = e.target.parentElement.querySelector("#name").value;
                    


                    var _t = setInterval(()=>{

                        if(Ex.flag.plurk[pid]._replurk.length===0) return;

                        clearInterval(_t);
                        
                        Ex.flag.plurk[pid]._replurk.forEach(r=>{

                            var _re_user = Ex.flag.plurk[pid]._re_user||[];

                            var display_name = (_re_user.find(a=>a.uid===r.user_id)||{}).display_name||"";
                            var nick_name = (_re_user.find(a=>a.uid===r.user_id)||{}).nick_name||"";
                            var handle = r.handle||"";


                            if(
                                r.content_raw.indexOf(content)!==-1 &&
                                ( 
                                    handle.indexOf(name)!==-1 || 
                                    display_name.indexOf(name)!==-1 || 
                                    nick_name.indexOf(name)!==-1
                                )
                            ){
                                if(document.querySelector(`[data-rid="${r.id}"]`))
                                document.querySelector(`[data-rid="${r.id}"]`).style.display = "block";
                            }
                        });
                        response_box.scrollTo(0,0);

                    },1);
                }
            },
            "ChangeEvent":(e)=>{

                console.log(e);

                if(e.target.dataset.other_ex!==undefined)
                {
                    Ex.OtherEx[ e.target.dataset.other_ex ].f.ChangeEvent(e);
                    return;
                }

                switch (e.target.dataset.mode)
                {
                    case "SearchDate":
                        if(e.target.dataset.group==="date") return;

                        var y = document.querySelector(`[data-mode="${e.target.dataset.mode}"][data-group="year"]`).value;

                        var m = document.querySelector(`[data-mode="${e.target.dataset.mode}"][data-group="month"]`).value;

                        var d = new Date( y , m ,0).getDate();

                        document.querySelector(`[data-mode="${e.target.dataset.mode}"][data-group="date"]`).innerHTML = ``;

                        var date_html = '';

                        for(var i=0;i<=d;i++) date_html+=`<option>${i.toString().padStart(2,'0')}</option>`;

                        document.querySelector(`[data-mode="${e.target.dataset.mode}"][data-group="date"]`).innerHTML = date_html;

                        


                    break;
                }


            },
            "ClickEvent":(e)=>{

                console.log(e);

                if(e.target.dataset.other_ex!==undefined)
                {
                    Ex.OtherEx[ e.target.dataset.other_ex ].f.ClickEvent(e);
                    return;
                }


                switch (e.target.dataset.mode)
                {
                    

                    case "Pet":

                        Ex.OtherEx.PlurkEx_Pet.f.Pet(e);

                    break;


                    case "PetFood":
                        
                        document.querySelector(".pop-view.pop-menu").remove();

                        /*
                        var ul = Ex.f.parentSearch(e.target,{"tag":"ul"});
                        var pid = Ex.f.PlurkId( ul.querySelector(".pif-outlink").href.toString().split("/").pop() );
                        */
                        var pid = e.target.dataset.pid;
                        var plurk_info = PlurksManager.getPlurkById(pid);

                        var pass_time = (new Date().getTime() - plurk_info.posted.getTime())/1000;

                        if(pass_time>=3600 || plurk_info.posted.getTime()<Ex.f.Num36(Ex.Storage.local.Pet.time_food))
                        {
                            Ex.f.MsgPop(`飼料已過期`,e);
                            return;
                        }

                        Ex.Storage.local.Pet.time_food = Ex.f.Num36(plurk_info.posted.getTime());

                        Ex.Storage.local.Pet.hungry+=1;
                        Ex.f.StorageUpd();

                        var plurk = document.body.querySelector(`[data-pid="${e.target.dataset.pid}"]`);
                        var plurk_pos = plurk.getBoundingClientRect();



                        Ex.OtherEx.PlurkEx_Pet.f.Pet("move",{x:plurk_pos.x,y:plurk_pos.y+window.scrollY});

                        setTimeout(()=>{
                            plurk.style.opacity = 1;
                            var _t = setInterval(()=>{
                                plurk.style.opacity -= 0.1;
                                if(plurk.style.opacity<=0) clearInterval(_t);
                            },100);
                        },1000);

                    break;

                    case "PetStatus":
                        /*
                        e =  new MouseEvent("click",{
                            clientX: Math.floor(window.innerWidth/2),
                            clientY: Math.floor(window.innerHeight/4)
                        });*/

                        e.preventDefault();
                        
                        var weight = Ex.Storage.local.Pet.weight;
                        var happy = Ex.Storage.local.Pet.happy;
                        var hungry = Ex.Storage.local.Pet.hungry;


                        Ex.f.MsgPop(`
                        <div id="PetStatus">
                        <div id="Weight" data-flag="PetWeight" style="background:linear-gradient(to right, #0f0 ${weight}% , #fff 0%);" title="體重">${weight}kg</div>
                        <div id="Happy" data-flag="PetHappy"  style="background:linear-gradient(to right, #0f0 ${happy}% , #fff 0%);" title="好感度">${happy}</div>
                        <div id="Hungry" data-flag="PetHungry"  style="background:linear-gradient(to right, #0f0 ${hungry}% , #fff 0%);" title="飽足度">${hungry}</div>
                        </div>`,e);

                    break;
                    

                }
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
                link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css?s=${new Date().getTime()}`;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                document.head.prepend(link);
            },
            "js_set":()=>{
               

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

                Ex.obj.flashmsg = document.createElement("div");
                Ex.obj.flashmsg.id = `${Ex.id}-FlashMsg`;
                Ex.obj.flashmsg.setAttribute("draggable","true");
                Ex.obj.flashmsg.innerHTML = `
                <div></div>
                <input type="button" data-event="close" data-obj="${Ex.id}-FlashMsg" value="關閉">
                `;

                Ex.obj.file = document.createElement("a");
                Ex.obj.file.id = `${Ex.id}-File`;


                
                //document.body.prepend( Ex.obj.load );
                document.body.appendChild( Ex.obj.file );
                document.body.appendChild( Ex.obj.Ex_div );
                document.body.appendChild( Ex.obj.msg );
                document.body.appendChild( Ex.obj.flashmsg );
                document.body.appendChild( Ex.obj.menu );




            },
            "FlagUpd":()=>{
                document.querySelectorAll(`[data-flag]`).forEach(o=>{
                    o.innerHTML = Ex.flag[o.dataset.flag];
                    o.value = Ex.flag[o.dataset.flag];
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
            "FlashMsgPop":(str,e = document.createEvent("mouseEvents"),sec = Ex.config.flashmsgsec)=>{

                clearTimeout(Ex.Clock.setTimeout.flashmsg);


                var x = e.clientX,y = e.clientY;
                console.log(e);
                

                Ex.obj.flashmsg.style.left = `${x}px`;
                Ex.obj.flashmsg.style.top = `${y}px`;

                if(Ex.obj.flashmsg.style.display==="block")
                {
                    Ex.obj.flashmsg.querySelector("div").innerHTML += str;
                }
                else
                {
                    Ex.obj.flashmsg.style.display = "block";
                    Ex.obj.flashmsg.querySelector("div").innerHTML = str;
                }

                

                Ex.Clock.setTimeout.flashmsg = setTimeout(()=>{
                    Ex.obj.flashmsg.style.opacity = 0;
                    setTimeout(()=>{
                        Ex.obj.flashmsg.style.display = "none";
                        Ex.obj.flashmsg.style.opacity = 1;
                    },1000);
                },sec * 1000);

            },
            "close":(e)=>{
                document.querySelector(`#${e.target.dataset.obj}`).style.display = "none";
            },
            "parentSearch":(target,selector)=>{

                var parent = target.parentElement;
                selector.tag = selector.tag||'';
                selector.class = selector.class||'';
                selector.id = selector.id||'';


                if(
                    (
                        selector.tag.toString().toUpperCase()===parent.tagName.toString().toUpperCase() && 
                        selector.tag!==''
                    ) || 
                    (
                        parent.className.split(" ").indexOf(selector.class)!==-1 && selector.class!==''
                    ) || 
                    (
                        parent.id===selector.id && 
                        selector.id!==''
                    ) ||
                        parent.tagName==="BODY"
                    )
                {
                    return parent;
                }

                return Ex.f.parentSearch(parent,selector);
            },
            "PlurkDate":(IOSDate)=>{

                return `${new Date(IOSDate).getFullYear()}-${new Date(IOSDate).getMonth()+1}-${new Date(IOSDate).getDate()} ${new Date(IOSDate).getHours().toString().padStart(2,'0')}:${new Date(IOSDate).getMinutes().toString().padStart(2,'0')}:${new Date(IOSDate).getSeconds().toString().padStart(2,'0')}`

            },
            "PlurkId":(pid)=>{
                return (isNaN(parseInt(pid))) ? parseInt(pid,36) : parseInt(pid);
            },
            "Num36":(input)=>{
                input =  isNaN(parseInt(input)) ? input:parseInt(input);
                return (isNaN((input))) ? parseInt(input,36) : (input).toString(36);
            },
            "default":()=>{

                Ex.Storage = {
                    "local":JSON.parse(localStorage[Ex.id]||`{}`),
                    "session":JSON.parse(sessionStorage[Ex.id]||`{}`)
                }


                Ex.Storage.local.plurks = Ex.Storage.local.plurks||{};
                Ex.Storage.session.plurks = Ex.Storage.session.plurks||{};

                
                Ex.Clock.setInterval.flag = setInterval(()=>{
                    Ex.f.FlagUpd();

                    if(Ex.OtherEx.PlurkEx_Pet!==undefined)
                        Ex.OtherEx.PlurkEx_Pet.f.PetClock();

                },500);


                if(document.querySelectorAll(".plurkForm:not(.mini-mode) .submit_img").length>1)
                {
                    return;
                }


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

                document.addEventListener("mouseover",function(e){
                    if(e.target.dataset.m_event!==undefined) Ex.f[ e.target.dataset.m_event ](e);
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

                
                //Ex.f.js_set();

                Ex.f.style_set();
                Ex.f.obj_set();
                Ex.f.plurk_obj_set();


                

                
                
            }
        }
    };

    Ex.f.default();

})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/YtScreenShot.js?s=${new Date().getTime()}`;document.head.prepend(js);


/*


ResponsesManager.loadResponses( parseInt('ophxn9',36) )
ResponsesManager.loadOlderResponses( parseInt('ophxn9',36) , !0)
ResponsesManager.getPlurkResponses( parseInt('ophxn9',36) )


PlurkAdder.addPlurk({qualifier: ":",content:"test1" })
PlurkAdder.addResponse( {plurk_id:parseInt("opmub0",36),owner_id:GLOBAL.session_user.uid},"test2",":")
PlurkAdder.editPlurk({plurk_id:parseInt("opmub0",36),id:parseInt("opmub0",36)},"aaa")


Poll.newPlurksPoll.getNewPlurks() //撈新消息噗
Poll.newResponsesPoll.getUnreadPlurks() //撈未讀訊息噗

*/