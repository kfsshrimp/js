


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
                "plurkinfolist_max":50
                
            },
            "obj":{},
            "f":{
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
    
    
    
                            for(var plurk_id in P_Ex.Storage.local.plurks)
                            {
                                var time = P_Ex.Storage.local.plurks[plurk_id][1];
    
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
                            
    
                            P_Ex.f.MsgPop(`
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
                            type="button" value="統計數：${Object.keys(P_Ex.Storage.local.plurks).length}">
                            <input 
                            data-other_ex="PlurkEx_Rank" 
                            data-event="ClickEvent" 
                            data-mode="ShowPlurkInfo"
                            type="button" value="顯示統計">
    
                            <div id="plurkInfo"></div>
    
    
                            </div>`,e);
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

                        case "ShowPlurkInfo":

                            var select_option = {};
                            document.querySelectorAll("#SearchOption select").forEach(o=>{
                                select_option[o.id] = o;
                            });

                            console.log(select_option);
                            return;

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