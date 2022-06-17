var Ex;
(()=>{
    if(location.host!=="www.plurk.com")
    {
        document.querySelector(`[src^="https://kfsshrimp.github.io/js/Plurk.js"]`).remove();
        return;
    }
    Ex = {
        "OtherExSet":(ExName)=>{
            var js = document.createElement("script");
            js.src =  `https://kfsshrimp.github.io/js/${ExName}.js?s=${new Date().getTime()}`;
            document.head.prepend(js);

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
        "id":"Plurk",
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
            "vote_max":6,
            "fav_rep":{
                "favorite":"喜歡",
                "replurk":"轉噗",
                "date":"日期"
            },
            "por_select":{
                "no":"全部",
                "true":"成人",
                "false":"非成人"
            },
            "fav_select":50,
            "rep_select":50,
            "flashmsgsec":10*1000,
            "plurkinfolist_max":50
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
                        
                        if(document.querySelector(`div[data-pid="${pid}"]`).innerHTML.indexOf("【投票】")!==-1)
                        {
                            Ex.f.RePlurkToPieChart( pid );
                        }
                        
                    }

                },500);

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



                Ex.obj.vote_btn = document.createElement("div");
                Ex.obj.vote_btn.className = "submit_img submit_img_color";
                Ex.obj.vote_btn.style.fontSize = "20px";
                Ex.obj.vote_btn.innerHTML = "發噗統計";

                Ex.obj.vote_btn.dataset.event = "ClickEvent";
                Ex.obj.vote_btn.dataset.mode = "PlurkInfo";

                if( document.querySelector("#input_big")!==null)
                {
                    document.querySelector(".plurkForm:not(.mini-mode) .submit_img").parentElement.insertBefore( Ex.obj.vote_btn ,document.querySelector(".plurkForm:not(.mini-mode) .submit_img"));
                }

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


                return;
                
                Ex.obj.vote_btn = document.createElement("div");
                Ex.obj.vote_btn.className = "submit_img submit_img_color";
                Ex.obj.vote_btn.style.fontSize = "20px";
                Ex.obj.vote_btn.innerHTML = "建立投票";

                Ex.obj.vote_btn.dataset.event = "ClickEvent";
                Ex.obj.vote_btn.dataset.mode = "CreateVote";

                if( document.querySelector("#input_big")!==null)
                {
                    document.querySelector(".plurkForm:not(.mini-mode) .submit_img").parentElement.insertBefore( Ex.obj.vote_btn ,document.querySelector(".plurkForm:not(.mini-mode) .submit_img"));
                }

                Ex.Clock.setInterval.GetVotePlurk = setInterval(()=>{

                    /*
                    :not(${Object.keys(Ex.flag.plurk).map(a=>{return `[data-pid="${a}"]`;}).join(",")||'a'})`
                    */

                    document.querySelectorAll(`.block_cnt:nth-child(1)>div[data-uid="${GLOBAL.session_user.uid}"],.block_cnt:nth-child(1)>div[data-uid="99999"]`).forEach(o=>{

                        if(o.innerHTML.indexOf("【投票】")===-1) return;
    
                        if(Ex.flag.plurk[ o.dataset.pid ]===undefined) 
                            Ex.f.GetPlurk( o.dataset.pid );

                       
                        if( Ex.flag.plurk[ o.dataset.pid ]._replurk!==undefined )
                            Ex.f.RePlurkToPieChart( o.dataset.pid );

                    });

                    
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
                    


                    setTimeout(()=>{

                        
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

                    },500);
                }
            },
            "PieChart":(plurk_div)=>{


                if(plurk_div.querySelector("canvas")===null)
                {
                    plurk_div.innerHTML = `
                        <canvas style="opacity:0;" 
                        data-m_event="MouseEvent" 
                        data-mode="VoteInfo" 
                        height="${Ex.config.canvas.height}" width="${Ex.config.canvas.width}">
                        </canvas>
                        <div id="VoteInfo"></div>
                        ${plurk_div.innerHTML}
                    `;

                    plurk_div.querySelector("canvas").addEventListener("mouseleave",(e)=>{
                        e.target.parentElement.querySelector("div#VoteInfo").style.opacity = "0";
                    });

                }

                var canvas = plurk_div.querySelector("canvas")
                var c2d = canvas.getContext("2d");
                var x = Math.floor(canvas.width/2);
                var y = Math.floor(canvas.height/2);
                var r = x;
                var p = 2*Math.PI;
                var deg_start = 0;
                var deg_end; 
                var vote = Ex.flag.plurk[ canvas.parentElement.dataset.pid ]._vote;

                var total = Object.values(vote).reduce( (a,b)=>{return a+b;});


                var color = [
                    "#8f8681",
                    "#32435F",
                    "#E4B660",
                    "#FE7773",
                    "#028C6A",
                    "#1D6A96"
                ];

                
                /*
                var color = [
                    "#f00",
                    "#0f0",
                    "#00f",
                    "#ff0",
                    "#f0f",
                    "#0ff",
                    "#000"
                ]
                */
               
                var word = ``;
                var count = 0;
                for(var i in vote)
                {
                    word+=`<li style="background:${color[count]}8">${count+1}：${vote[i]}票(${Math.floor((vote[i]/total*100)||0)}%)</li>`;

                    deg_end = deg_start + vote[i];

                    c2d.beginPath();
                    c2d.moveTo(x,y);
                    c2d.arc(x,y,r,deg_start/total*p,deg_end/total*p);

                    var grd = c2d.createRadialGradient(x,y,0,x,y,r);
                    grd.addColorStop(0,"#888");
                    grd.addColorStop(1,color[count]);


                    c2d.fillStyle = grd;
                    c2d.strokeStyle = "#fff";
                    c2d.fill();
                    //c2d.stroke();

                    count++;

                    deg_start = deg_end;
                }
                
                word +=`<li>總票數：${total}</li>`;

                plurk_div.querySelector("#VoteInfo").innerHTML = `<ul>${word}</ul>`;

                setTimeout(()=>{
                    if(plurk_div.querySelector("canvas")!==null)
                    plurk_div.querySelector("canvas").style.opacity = "1";
                },1000);
                

            },
            "ClickEvent":(e)=>{

                switch (e.target.dataset.mode)
                {
                    case "CreateVote":

                        e =  new MouseEvent("click",{
                            clientX: Math.floor(window.innerWidth/2),
                            clientY: Math.floor(window.innerHeight/4)
                        });
                        

                        Ex.f.MsgPop(`
                        <div id="VoteOption">
                        <div>
                        <input type="text" placeholder="選項1"><span class="validate">*</span>
                        <input type="text" placeholder="選項2"><span class="validate">*</span>
                        </div>
                        <input 
                        data-event="ClickEvent" 
                        data-mode="SubmitVote"
                        type="button" value="完成">
                        <input 
                        data-event="ClickEvent" 
                        data-mode="AddOption"
                        type="button" value="增加選項">
                        </div>`,e);

                    break;

                    case "AddOption":

                        var option = document.createElement("input");
                        option.type = "text";
                        option.setAttribute("placeholder",`選項${e.target.parentElement.querySelectorAll(`input[type="text"]`).length+1}`);
                        var span = document.createElement("span");
                        span.innerHTML = "*";


                        e.target.parentElement.querySelector("div").appendChild(option);
                        e.target.parentElement.querySelector("div").appendChild(span);

                        if(e.target.parentElement.querySelectorAll(`input[type="text"]`).length>=Ex.config.vote_max) e.target.setAttribute("disabled","disabled");

                    break;

                    case "SubmitVote":

                        var content = `【投票】\n`;
                        var check = false;
                        var opt = [];

                        e.target.parentElement.querySelectorAll(`input[type="text"]`).forEach( (o,i)=>{
                            if(o.value===``)
                            {
                                o.focus();
                                e.target.parentElement.querySelectorAll(`span`)[i].classList.add("error");
                                check = true;
                            }
                            else
                            {
                                e.target.parentElement.querySelectorAll(`span`)[i].classList.remove("error");
                            }

                            opt.push(`【${i+1}】${o.value}`);
                        });

                        content += opt.join("\n");
                        

                        if(check)
                        {
                            return;
                        }

                        document.querySelector("#input_big").value = content;

                        document.querySelector("#input_big").style.height = document.querySelector("#input_big").scrollHeight + 'px'

                        /*
                        PlurkAdder.addPlurk({
                            qualifier: ":",
                            content:content
                        });
                        

                        Ex.f.MsgPop('投票噗建立完成',e);
                        */
                    break;

                    case "PlurkInfo":

                        var post_data_select = {
                            "y":[],
                            "m":[],
                            "d":[]
                        }
                        for(var m=1;m<=12;m++) post_data_select.m.push(m.toString().padStart(2,'0'));
                        for(var d=0;d<=31;d++) post_data_select.d.push(d.toString().padStart(2,'0'));


                        var fav_rep = ``;
                        for(var k in Ex.config.fav_rep)
                        {
                            fav_rep += `<option value="${k}">${Ex.config.fav_rep[k]}</option>`;
                        }

                        var por_select = ``;
                        for(var k in Ex.config.por_select)
                        {
                            por_select += `<option value="${k}">${Ex.config.por_select[k]}</option>`;
                        }

                        var fav_select = '<option value="no">喜歡大於</option>';
                        for(var i=1;i<=Ex.config.fav_select;i++)
                        {
                            fav_select += `<option>${i}</option>`;
                        }

                        var rep_select = '<option value="no">轉噗小於</option>';
                        for(var i=0;i<=Ex.config.rep_select;i++)
                        {
                            rep_select += `<option>${i}</option>`;
                        }



                        for(var plurk_id in Ex.Storage.local.plurks)
                        {
                            var time = Ex.Storage.local.plurks[plurk_id][1];

                            if(post_data_select["y"].indexOf(time.split("-")[0])===-1) post_data_select["y"].push(time.split("-")[0]);

                            /*
                            if(post_data_select["m"].indexOf(time.split("-")[1])===-1) post_data_select["m"].push(time.split("-")[1]);

                            if(post_data_select["d"].indexOf(time.split("-")[2])===-1) post_data_select["d"].push(time.split("-")[2]);
                            */
                        }

                        e =  new MouseEvent("click",{
                            clientX: 0,
                            clientY: 0
                        });
                        

                        Ex.f.MsgPop(`
                        <div id="VoteOption">
                        <div id="SearchOption">
                        <select id="y">${post_data_select.y.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===new Date().getFullYear().toString())?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}</select>
                        <select id="m">${post_data_select.m.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===(new Date().getMonth()+1).toString().padStart(2,'0'))?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}</select>
                        <select id="d" style="display:none;">${post_data_select.d.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===(new Date().getDate()).toString().padStart(2,'0'))?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}</select>
                        <select title="排序" id="fav_rep">${fav_rep}</select>
                        <select title="喜歡大於" id="fav_select">${fav_select}</select>
                        <select title="轉噗小於" id="rep_select">${rep_select}</select>
                        <select title="成人向" id="por_select">${por_select}</select>
                        </div>
                        
                        <input data-flag="LocalPlurksCount" 
                        type="button" value="統計數：${Object.keys(Ex.Storage.local.plurks).length}">
                        <input 
                        data-event="ClickEvent" 
                        data-mode="ShowPlurkInfo"
                        type="button" value="顯示統計">
                        <!--<input 
                        data-event="ClickEvent" 
                        data-mode="ClosePlurkInfo"
                        type="button" value="關閉統計">
                        <input 
                        data-event="ClickEvent" 
                        data-mode="DelPlurkInfo"
                        type="button" value="清除記錄">-->
                        <input 
                        data-event="ClickEvent" 
                        data-mode="InPlurkInfo" 
                        data-file="PlurkInfoFile" 
                        type="button" value="載入記錄">
                        <input id="PlurkInfoFile" type="file" style="display:none;">
                        <input 
                        data-event="ClickEvent" 
                        data-mode="OutPlurkInfo"
                        type="button" value="匯出記錄">

                        <div id="PlurkInfo"></div>


                        </div>`,e);
                    break;

                    case "DelPlurkInfo":
                        Ex.Storage.local.plurks = {};
                        Ex.Storage.session.plurks = {};
                        Ex.f.StorageUpd();
                    break;

                    case "OutPlurkInfo":

                        Ex.obj.file.setAttribute('href',`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(Ex.Storage.local.plurks))}`);
                        Ex.obj.file.setAttribute('download','記錄檔');
                        Ex.obj.file.click();
                        
                    break;

                    case "InPlurkInfo":

                        document.querySelector(`#${e.target.dataset.file}[type="file"]`).click();

                        var reader = new FileReader();
                        reader.onload = ()=>{

                            Ex.Storage.local.plurks = JSON.parse(reader.result);
                            Ex.f.StorageUpd();
                            document.querySelector(`#Plurk-Msg`).style.display = "none";
                        }

                        var _t = setInterval(()=>{

                            var files = document.querySelector(`#${e.target.dataset.file}[type="file"]`).files[0];

                            if(!files) return;

                            clearInterval(_t);
    
                            reader.readAsText(files);

                        },100);
                        

                    break;

                    case "ClosePlurkInfo":
                        document.querySelector("#PlurkInfo").innerHTML = ``;
                        document.querySelector("#PlurkInfo").style.height = '0px';
                    break;

                    case "ShowPlurkInfoDetail":
                        var pid = e.target.dataset.pid;

                        var detail_div = e.target.parentElement.parentElement.querySelectorAll("div")[0];
                        var detail_count_info = e.target.parentElement.parentElement.querySelectorAll("div")[1];

                        if(detail_div.dataset.type==="text")
                        {
                            detail_div.dataset.type = "html";

                            //detail_div.innerHTML = Ex.Storage.local.plurks[pid]["4"];
                            Ex.api.arg.plurk_id = pid;
                            Ex.api.Send();
                            console.log(Ex.api.data[pid]);
                            detail_div.innerHTML = Ex.api.data[pid].plurk.content;
                            
                            
                            Ex.Storage.local.plurks[pid]["2"] = Ex.api.data[pid].plurk.favorite_count;
                            Ex.Storage.local.plurks[pid]["3"] = Ex.api.data[pid].plurk.replurkers_count;

                            detail_count_info.querySelector(".fav").innerHTML = Ex.api.data[pid].plurk.favorite_count;

                            detail_count_info.querySelector(".rep").innerHTML = Ex.api.data[pid].plurk.replurkers_count;
                            

                            Ex.f.StorageUpd();
                        }
                        else
                        {
                            detail_div.dataset.type = "text";

                            detail_div.innerHTML = detail_div.innerText;
                            
                        }

                    break;

                    case "ShowPlurkInfo":

                        var select_option = {};
                        document.querySelectorAll("#SearchOption select").forEach(o=>{
                            select_option[o.id] = o;
                        });

                        var search_plurks = [];

                        for(let plurk_id in Ex.Storage.local.plurks)
                        {
                            let f_data = Ex.Storage.local.plurks[plurk_id];
                            let time = f_data[1];

                            if(Ex.Storage.local.plurks[plurk_id][2].toString()==="0" &&  
                            Ex.Storage.local.plurks[plurk_id][3].toString()==="0") continue;

                            /* select篩選 日

                                (select_option[2].value==="00" ||  
                                time.split("-")[2]===select_option[2].value) 
                            */

                            if(
                                time.split("-")[0]===select_option.y.value && 
                                time.split("-")[1]===select_option.m.value && 
                                (parseInt(f_data[2])>=parseInt(select_option.fav_select.value) || select_option.fav_select.value==="no") && 
                                (parseInt(f_data[3])<=parseInt(select_option.rep_select.value) || select_option.rep_select.value==="no") && 
                                (select_option.por_select.value===f_data[5].toString() || select_option.por_select.value==="no")
                            )
                            {
                                search_plurks.push( Ex.Storage.local.plurks[plurk_id] );
                            }
                        }

                        if(select_option.fav_rep.value==="favorite")
                            search_plurks.sort( (a,b)=>{return (b[2]!==a[2])?b[2] - a[2]:b[3] - a[3]});
                        else if(select_option.fav_rep.value==="replurk")
                            search_plurks.sort( (a,b)=>{return (b[3]!==a[3])?b[3] - a[3]:b[2] - a[2]});
                        else
                            search_plurks.sort( (a,b)=>{return b[0] - a[0]});

                            
                        document.querySelector("#PlurkInfo").innerHTML = ``;
                        document.querySelector("#PlurkInfo").style.height = `${(Math.floor(window.innerHeight*0.7))}px`;
                        var no = 1;
                        for(let ary of search_plurks)
                        {
                            if(no>Ex.config.plurkinfolist_max) break;

                            let f_data = Ex.Storage.local.plurks[ary[0]];

                            document.querySelector("#PlurkInfo").innerHTML += 
                            `<div data-pid="${ary[0]}" class="plurkinfolist">
                            ${no++}<BR>
                                <div data-type="text">
                                    ${f_data[4]}
                                </div>
                                <hr>
                                <div>
                                    ${f_data[1]} / 喜歡：<span class="fav">${f_data[2]}</span> / 轉噗：<span class="rep">${f_data[3]}</span> / <a href="https://www.plurk.com/p/${parseInt(ary[0]).toString(36)}" target="_blank">PLURK</a> / <a 
                                    data-event="ClickEvent" data-pid="${ary[0]}" 
                                    data-mode="ShowPlurkInfoDetail">顯示</a>
                                </div>
                            </div>`;
                        }

                    break;


                    case "pet_food":
                        
                        document.querySelector(".pop-view.pop-menu").remove();
                        var ul = Ex.f.parentSearch(e.target,{"tag":"ul"});

                        console.log( ul.querySelector(".pif-outlink") );

                    break;
                    

                }
            },
            "MouseEvent":(e)=>{

                switch (e.target.dataset.mode)
                {
                    case "VoteInfo":
                        e.target.parentElement.querySelector("div#VoteInfo").style.opacity = "1";
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


                 

                var js_a = [
                    'https://kfsshrimp.github.io/sha1/core-min.js',
                    'https://kfsshrimp.github.io/sha1/sha1-min.js',
                    'https://kfsshrimp.github.io/sha1/hmac-min.js',
                    'https://kfsshrimp.github.io/sha1/enc-base64-min.js',
                    `https://kfsshrimp.github.io/plurk/api.js?s=${new Date().getTime()}`
                ]                
                for(var i in js_a){
                    let j_src = js_a[i];

                    setTimeout(()=>{
                        var js = document.createElement("script");
                        js.src = j_src;document.head.prepend(js);
                    },(i+1)*100);

                }
                setTimeout(()=>{ 

                    

                    Ex.api = new PlurkApi();
                    Ex.api.act = "Timeline/getPlurk"; // Timeline/getPlurkCountsInfo
                    Ex.api.mode = "no"
                    Ex.api.func = (r)=>{ 
                        var r = JSON.parse(r.response);
                        Ex.api.data = Ex.api.data||{};
                        Ex.api.data[ r.plurk.plurk_id ] = r;
                    }
                },js_a.length*1000);



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
            "FlashMsgPop":(str,e = document.createEvent("mouseEvents"))=>{

                clearTimeout(Ex.Clock.setTimeout.flashmsg);


                var x = e.clientX,y = e.clientY;
                

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
                },Ex.config.flashmsgsec);

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
            "default":()=>{

                Ex.Storage = {
                    "local":JSON.parse(localStorage[Ex.id]||`{}`),
                    "session":JSON.parse(sessionStorage[Ex.id]||`{}`)
                }


                Ex.Storage.local.plurks = Ex.Storage.local.plurks||{};
                Ex.Storage.session.plurks = Ex.Storage.session.plurks||{};

                
                Ex.Clock.setInterval.flag = setInterval(()=>{
                    Ex.f.FlagUpd();
                    

                    Ex.flag.LocalPlurksCount = `統計數：${Object.keys(Ex.Storage.local.plurks).length}`;

                    if(GLOBAL.session_user!==null)
                    {
                        document.querySelectorAll(`[data-pid][data-uid="${GLOBAL.session_user.uid}"]`).forEach(o=>{

                            var pid = o.dataset.pid;
                            var p_data = PlurksManager.getPlurkById(pid);

                            if(
                                (p_data.favorite_count===0 && 
                                p_data.replurkers_count===0) || 
                                Ex.Storage.local.plurks[pid]!==undefined
                            ) return;
    
                            Ex.Storage.local.plurks[pid] = [
                                pid,//0
                                `${p_data.posted.getFullYear()}-${(p_data.posted.getMonth()+1).toString().padStart(2,'0')}-${p_data.posted.getDate().toString().padStart(2,'0')}`,//1
                                p_data.favorite_count,//2
                                p_data.replurkers_count,//3
                                o.querySelector(".text_holder").innerText,//p_data.content
                                p_data.porn//5
                            ];

                             console.log(pid);

                             Ex.f.FlashMsgPop(`<div class="plurkinfolist">${o.querySelector(".text_holder").innerText}<hr>
                             <div>
                             ${Ex.Storage.local.plurks[pid][1]} / 喜歡：<span class="fav">${Ex.Storage.local.plurks[pid][2]}</span> / 轉噗：<span class="rep">${Ex.Storage.local.plurks[pid][3]}</span> / <a href="https://www.plurk.com/p/${parseInt(pid).toString(36)}" target="_blank">PLURK</a>
                             </div></div>`);
                            
                        });

                        if(document.querySelector(".pop-window-view [data-pid]")!==null)
                        {
                            var o = document.querySelector(".pop-window-view [data-pid]");
                            var pid = document.querySelector(".pop-window-view [data-pid]").dataset.pid;

                            var p_data = PlurksManager.getPlurkById(pid);

                            if(
                                (p_data.favorite_count!==0 || 
                                p_data.replurkers_count!==0 ) && 
                                Ex.Storage.local.plurks[pid]!==undefined
                            ){
                                Ex.Storage.local.plurks[pid] = [
                                    pid,//0
                                    `${p_data.posted.getFullYear()}-${(p_data.posted.getMonth()+1).toString().padStart(2,'0')}-${p_data.posted.getDate().toString().padStart(2,'0')}`,//1
                                    p_data.favorite_count,//2
                                    p_data.replurkers_count,//3
                                    o.querySelector(".text_holder").innerText,//p_data.content
                                    p_data.porn//5
                                ];
    
                                console.log(`REF：${pid}`);
                            }                            
                        }

                        Ex.f.StorageUpd();
                    }

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
PlurkAdder.addResponse( {plurk_id:parseInt("opmub0",36),owner_id:14556765},"test2",":")
PlurkAdder.editPlurk({plurk_id:parseInt("opmub0",36),id:parseInt("opmub0",36)},"aaa")


Poll.newPlurksPoll.getNewPlurks() //撈新消息噗
Poll.newResponsesPoll.getUnreadPlurks() //撈未讀訊息噗

*/