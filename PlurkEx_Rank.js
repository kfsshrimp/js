
class PlurkEx_Rank {
    
    constructor(P_Ex){

        var Ex = {
            "P_Ex":P_Ex,
            "id":"PlurkEx_Rank",
            "config":{
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
                "plurkinfolist_max":2000,
                "plurks_page":50,
                "loop_safe_max":150,
                "loop_sec":1000 * 0.5
                
            },
            "obj":{},
            "f":{
                "ApiLoop":(offset)=>{

                    var api = Ex.api;
                    Ex.api = api;
                    api.act = "Timeline/getPublicPlurks";
                    api.arg.minimal_data = "true";
                    api.arg.minimal_user = "true";
                    api.arg.nick_name = GLOBAL.session_user.nick_name;
                    api.arg.limit = "100";
                    api.arg.only_user = "true";
                    api.mode = "no";
                    
                    api.arg.offset = (offset.split("/").length>=3)?new Date( new Date(offset).setHours(24+8) ).toISOString():new Date( new Date(offset).setMonth( new Date(offset).getMonth()+1 ) ).toISOString();
                    
                    console.log(api.arg.offset);
                    
                    api.func = (r)=>{ 
                        api.plurks = api.plurks||[];
                    
                        var r = JSON.parse(r.response);
                        //console.log(api.arg.offset);
                        console.log(r.plurks[0].posted + '=>' );
                    
                        api.plurks = api.plurks.concat(r.plurks);
                    
                        //console.log( new Date(api.plurks[api.plurks.length-1].posted).getMonth()+1 + '???' + new Date(offset).getMonth() );
                        
                    
                        if(
                            r.plurks.length!==0 && 
                            new Date(api.plurks[api.plurks.length-1].posted).getMonth() === new Date(offset).getMonth() &&  
                            (
                                offset.split("/").length<3 || 
                                new Date(api.plurks[api.plurks.length-1].posted).getDate() === new Date(offset).getDate() )
                            )
                        {
                            if(api.plurks.length>=Ex.config.loop_safe_max) {console.log('max end');Ex.f.PlurkList(api.plurks);return;}
                    
                            console.log(api.plurks.length + '=>setTimeout');
                            setTimeout(()=>{
                                
                                if(api.plurks.length!==0)
                                api.arg.offset = new Date( new Date(api.plurks[api.plurks.length-1].posted) ).toISOString();

                                api.Send();
                    
                            },Ex.config.loop_sec);
                        }
                        else
                        {
                            console.log('month end');
                            
                            
                            Ex.f.PlurkList(api.plurks);
                        }
                    }
                    api.Send();

                },
                "PageControl":(page,total)=>{


                    if(page>=Math.ceil(total/Ex.config.plurks_page))
                    {
                        document.querySelector(`#page_bar [data-path="next"]`).setAttribute("disabled","");
                        document.querySelector(`#page_bar [data-path="prev"]`).removeAttribute("disabled");
                    }

                    if(page*Ex.config.plurks_page<=0)
                    {
                        document.querySelector(`#page_bar [data-path="prev"]`).setAttribute("disabled","");

                        document.querySelector(`#page_bar [data-path="next"]`).removeAttribute("disabled");
                    }

                    if(total<=Ex.config.plurks_page)
                    {
                        document.querySelectorAll(`#page_bar [data-mode="PageChange"]`).forEach(o=>{
                            o.setAttribute("disabled","");
                        });
                    }
                    

                },
                "PlurkList":(plurks)=>{

                    console.log(plurks);

                    var search_plurks = [];

                    for(let i in plurks)
                    {

                        let f_data = plurks[i];
                        let time = new Date(plurks[i].posted);

                        var select_option = {};
                        document.querySelectorAll("#SearchOption select").forEach(o=>{
                            select_option[o.id] = o;
                        });

                        if(
                            time.getFullYear().toString()===select_option.y.value && 

                            (time.getMonth()+1).toString().padStart(2,'0')===select_option.m.value && 

                            (select_option.d.value==="00" ||  
                            time.getDate().toString().padStart(2,'0')===select_option.d.value) &&

                            (parseInt(f_data.favorite_count)>=parseInt(select_option.fav_select.value) || select_option.fav_select.value==="no") && 

                            (parseInt(f_data.replurkers_count)<=parseInt(select_option.rep_select.value) || select_option.rep_select.value==="no") && 

                            (select_option.por_select.value===f_data.porn.toString() || select_option.por_select.value==="no")
                        )
                        {
                            search_plurks.push( f_data );
                        }
                    }

                    if(select_option.fav_rep.value==="favorite")
                        search_plurks.sort( (a,b)=>{return (b.favorite_count!==a.favorite_count)?b.favorite_count - a.favorite_count:b.replurkers_count - a.replurkers_count});
                    else if(select_option.fav_rep.value==="replurk")
                        search_plurks.sort( (a,b)=>{return (b.replurkers_count!==a.replurkers_count)?b.replurkers_count - a.replurkers_count:b.favorite_count - a.favorite_count});

                    document.querySelector("#plurkInfo").innerHTML = ``;
                    document.querySelector("#plurkInfo").style.height = `${(Math.floor(window.innerHeight*0.7))}px`;

                    console.log(search_plurks);

                    document.querySelector("#page_bar").dataset.total = search_plurks.length;

                    var total = search_plurks.length;
                    var page = document.querySelector("#page_bar").dataset.page;
                    var html = ``;
                    var no = 0;
                    
                    

                    Ex.f.PageControl(page,total);

                    for(let f_data of search_plurks)
                    {
                        no++;

                        if(no>Ex.config.plurkinfolist_max) break;

                        if( (page-1)*Ex.config.plurks_page>=no || page*Ex.config.plurks_page<no ) continue;

                        html += 
                        `<div data-pid="${f_data.plurk_id}" class="plurkinfolist">
                        ${no}<BR>
                            <div data-type="text">
                                ${f_data.content}
                            </div>
                            <hr>
                            <div>
                                ${P_Ex.f.PlurkDate(f_data.posted)} / 喜歡：<span class="fav">${f_data.favorite_count}</span> / 轉噗：<span class="rep">${f_data.replurkers_count}</span> / <a href="https://www.plurk.com/p/${parseInt(f_data.plurk_id).toString(36)}" target="_blank">PLURK</a> / <a 
                                data-other_ex="PlurkEx_Rank" 
                                data-event="ClickEvent" data-pid="${f_data.plurk_id}" 
                                data-mode="ShowPlurkInfoDetail">顯示</a>
                            </div>
                        </div>`;
                    }

                    document.querySelector("#plurkInfo").innerHTML = html;

                },
                "ChangeEvent":(e)=>{
                    console.log("OTHER EX");
                    console.log(e);

                    switch (e.target.dataset.mode)
                    {
                        case "ReSearch":
                            
                            if(Ex.api.plurks!==undefined)
                            {
                                Ex.f.PlurkList(Ex.api.plurks);
                            }

                        break;
                    }

                },
                "ClickEvent":(e)=>{

                    console.log("OTHER EX");
                    console.log(e);

                    switch (e.target.dataset.mode)
                    {
                        case "PlurkInfo":

                            var post_data_select = {
                                "y":[],
                                "m":[],
                                "d":[]
                            }

                            for(var y=new Date().getFullYear()-10;y<=new Date().getFullYear();y++) post_data_select.y.push(y.toString());
                            for(var m=1;m<=12;m++) post_data_select.m.push(m.toString().padStart(2,'0'));
                            for(var d=0;d<=new Date( new Date().getFullYear() , new Date().getMonth()+1 ,0).getDate();d++) post_data_select.d.push(d.toString().padStart(2,'0'));
    
    
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
    
    
                            e =  new MouseEvent("click",{
                                clientX: 0,
                                clientY: 0
                            });
                            
    
                            P_Ex.f.MsgPop(`
                            <div id="VoteOption">
                            <div id="SearchOption">

                            <select id="y" data-mode="SearchDate" 
                            data-group="year">
                            ${post_data_select.y.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===new Date().getFullYear().toString())?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}
                            </select>

                            <select id="m" data-mode="SearchDate" data-group="month">
                            ${post_data_select.m.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===(new Date().getMonth()+1).toString().padStart(2,'0'))?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}
                            </select>

                            <select id="d" data-mode="SearchDate" 
                            data-group="date">
                            ${post_data_select.d.sort( (a,b)=>{return a-b;} ).map(v=>{return (v===(new Date().getDate()).toString().padStart(2,'0'))?`<option selected>${v}</option>`:`<option>${v}</option>`}).join(``)}
                            </select>

                            <select data-other_ex="PlurkEx_Rank" data-mode="ReSearch" title="排序" id="fav_rep">${fav_rep}</select>

                            <select data-other_ex="PlurkEx_Rank" data-mode="ReSearch" title="喜歡大於" id="fav_select">${fav_select}</select>

                            <select data-other_ex="PlurkEx_Rank" data-mode="ReSearch" title="轉噗小於" id="rep_select">${rep_select}</select>

                            <select data-other_ex="PlurkEx_Rank" data-mode="ReSearch" title="成人向" id="por_select">${por_select}</select>
                            </div>
                            
                            <input 
                            style="linear-gradient(to right, #FF574D 40% , #fff5 0%);"
                            data-flag="RankProgress" 
                            data-other_ex="PlurkEx_Rank" 
                            data-event="ClickEvent" 
                            data-mode="ApiLoop"
                            type="button" value="顯示統計">
    
                            <div id="plurkInfo"></div>

                            <div id="page_bar" data-page="1" data-total="">

                            <input 
                            data-other_ex="PlurkEx_Rank" 
                            data-event="ClickEvent" 
                            data-mode="PageChange" 
                            data-path="prev" 
                            type="button" value="上一頁">

                            <input data-flag="page" type="button" value="第1頁">

                            <input 
                            data-other_ex="PlurkEx_Rank" 
                            data-event="ClickEvent" 
                            data-mode="PageChange" 
                            data-path="next" 
                            type="button" value="下一頁">
                            </div>
    
    
                            </div>`,e);

                            document.querySelectorAll(`#SearchOption select`).forEach(o=>{
                                o.addEventListener("change",(e)=>{
                                    P_Ex.f.ChangeEvent(e);
                                });
                            });

                        break;
    

                        case "ClosePlurkInfo":
                            document.querySelector("#plurkInfo").innerHTML = ``;
                            document.querySelector("#plurkInfo").style.height = '0px';
                        break;

                        case "ShowPlurkInfoDetail":
                            var pid = e.target.dataset.pid;

                            var detail_div = e.target.parentElement.parentElement.querySelectorAll("div")[0];
                            var detail_count_info = e.target.parentElement.parentElement.querySelectorAll("div")[1];

                            if(detail_div.dataset.type==="text")
                            {
                                detail_div.dataset.type = "html";

                                //detail_div.innerHTML = Ex.Storage.local.plurks[pid]["4"];
                                P_Ex.api.arg.plurk_id = pid;
                                P_Ex.api.Send();
                                console.log(P_Ex.api.data[pid]);
                                detail_div.innerHTML = P_Ex.api.data[pid].plurk.content;
                                
                                
                                P_Ex.Storage.local.plurks[pid]["2"] = P_Ex.api.data[pid].plurk.favorite_count;
                                P_Ex.Storage.local.plurks[pid]["3"] = P_Ex.api.data[pid].plurk.replurkers_count;

                                detail_count_info.querySelector(".fav").innerHTML = P_Ex.api.data[pid].plurk.favorite_count;

                                detail_count_info.querySelector(".rep").innerHTML = P_Ex.api.data[pid].plurk.replurkers_count;
                                

                                P_Ex.f.StorageUpd();
                            }
                            else
                            {
                                detail_div.dataset.type = "text";

                                detail_div.innerHTML = detail_div.innerText;
                                
                            }

                        break;

                        case "ApiLoop":

                            var select_option = {};
                            document.querySelectorAll("#SearchOption select").forEach(o=>{
                                select_option[o.id] = o;
                            });

                            console.log(select_option);

                            var offset = `${select_option.y.value}/${select_option.m.value}`;

                            if(select_option.d.value!=="00") offset += `/${select_option.d.value}`;

                           
                            console.log(offset);

                            Ex.f.ApiLoop(offset);

                        break;

                        case "ShowPlurkInfo":

                            var search_plurks = [];

                            for(let plurk_id in P_Ex.Storage.local.plurks)
                            {
                                let f_data = P_Ex.Storage.local.plurks[plurk_id];
                                let time = f_data[1];

                                if(P_Ex.Storage.local.plurks[plurk_id][2].toString()==="0" &&  
                                P_Ex.Storage.local.plurks[plurk_id][3].toString()==="0") continue;

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
                                    search_plurks.push( P_Ex.Storage.local.plurks[plurk_id] );
                                }
                            }

                            if(select_option.fav_rep.value==="favorite")
                                search_plurks.sort( (a,b)=>{return (b[2]!==a[2])?b[2] - a[2]:b[3] - a[3]});
                            else if(select_option.fav_rep.value==="replurk")
                                search_plurks.sort( (a,b)=>{return (b[3]!==a[3])?b[3] - a[3]:b[2] - a[2]});
                            else
                                search_plurks.sort( (a,b)=>{return b[0] - a[0]});

                                
                            document.querySelector("#plurkInfo").innerHTML = ``;
                            document.querySelector("#plurkInfo").style.height = `${(Math.floor(window.innerHeight*0.7))}px`;
                            var no = 1;
                            for(let ary of search_plurks)
                            {
                                if(no>Ex.config.plurkinfolist_max) break;

                                let f_data = P_Ex.Storage.local.plurks[ary[0]];

                                document.querySelector("#plurkInfo").innerHTML += 
                                `<div data-pid="${ary[0]}" class="plurkinfolist">
                                ${no++}<BR>
                                    <div data-type="text">
                                        ${f_data[4]}
                                    </div>
                                    <hr>
                                    <div>
                                        ${f_data[1]} / 喜歡：<span class="fav">${f_data[2]}</span> / 轉噗：<span class="rep">${f_data[3]}</span> / <a href="https://www.plurk.com/p/${parseInt(ary[0]).toString(36)}" target="_blank">PLURK</a> / <a 
                                        data-other_ex="PlurkEx_Rank" 
                                        data-event="ClickEvent" data-pid="${ary[0]}" 
                                        data-mode="ShowPlurkInfoDetail">顯示</a>
                                    </div>
                                </div>`;
                            }

                            break;


                            case "PageChange":

                                var parent_obj = e.target.parentElement;
                                var path = e.target.dataset.path;
                                var total = parseInt(parent_obj.dataset.total);
                                var now_page = parseInt(parent_obj.dataset.page);
                                var page;

                                if(path==="next")
                                {
                                    page = now_page + 1;
                                }
                                else if(path==="prev")
                                {
                                    page = now_page - 1;
                                }
                                console.log(page);

                                if(page>Math.ceil(total/Ex.config.plurks_page) || 
                                    page*Ex.config.plurks_page<=0) return;


                                parent_obj.dataset.page = page;
                                P_Ex.flag.page = page;

                                Ex.f.PlurkList( Ex.api.plurks );

                                Ex.f.PageControl(page,total);


                            break;
                        }


                },
                "style_set":function(){

                    var link = document.createElement('link');
                    link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css?s=${new Date().getTime()}`;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.prepend(link);
                },
                default:()=>{


                    Ex.f.style_set();


                    Ex.obj.btn = document.createElement("div");
                    Ex.obj.btn.className = "submit_img submit_img_color";
                    Ex.obj.btn.style.fontSize = "20px";
                    Ex.obj.btn.innerHTML = "發噗統計";

                    Ex.obj.btn.dataset.other_ex = "PlurkEx_Rank";
                    Ex.obj.btn.dataset.event = "ClickEvent";
                    Ex.obj.btn.dataset.mode = "PlurkInfo";

                    if( document.querySelector("#input_big")!==null)
                    {
                        document.querySelector(".plurkForm:not(.mini-mode) .submit_img").parentElement.insertBefore( Ex.obj.btn ,document.querySelector(".plurkForm:not(.mini-mode) .submit_img"));
                    }

                    P_Ex.flag.RankProgress = '顯示統計 進度 %數';
                    P_Ex.flag.page = 1;

                    Ex.api = P_Ex.api;

                }
            }
        };

        Ex.f.default();

        return Ex;
    }

};

//var pet = new PlurkEx_Pet({"Clock":{"setInterval":{}}});
//var pet = new PlurkEx_pet();
//Ex.OtherEx.PlurkEx_Rank = new PlurkEx_Rank(Ex);