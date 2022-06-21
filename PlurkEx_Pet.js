/*
餵食限制
限制自己噗? 按讚數 轉噗數 回噗數 影響

好感度 上升條件?
依happy_status當前狀態 以及hungry上升狀態 上升好感度


體重 上升條件?


*/


class PlurkEx_Pet {
    
    constructor(P_Ex){

        var Ex = {
            "P_Ex":P_Ex,
            "id":"PlurkEx_Pet",
            "config":{
                "hungry_sec":60*10,
                "PetStatus":{
                    "weight":5.1,
                    "happy":50,
                    "hungry":50,
                    "happy_status":"none",
                    "time_food":P_Ex.f.Num36( new Date().getTime() ),
                    "time":P_Ex.f.Num36( new Date().getTime() )
                }
            },
            "obj":{},
            "f":{
                "style_set":function(){

                    var link = document.createElement('link');
                    link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css?s=${new Date().getTime()}`;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.prepend(link);
                },
                "Pet":(e,opt)=>{               

                    switch( (e.target!==undefined)?e.target.dataset.case:e ){
                        case "move":
                            Ex.obj.petDiv.style.left = `${opt.x}px`;
                            Ex.obj.petDiv.style.top = `${opt.y}px`;
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
    
                            
                            if(pass_time>=3600 || plurk_info.posted.getTime()<=P_Ex.f.Num36(P_Ex.Storage.local.Pet.time_food))
                            {
                                P_Ex.f.MsgPop(`飼料已過期`,e);
                                return;
                            }
    
                            P_Ex.Storage.local.Pet.time_food = P_Ex.f.Num36(plurk_info.posted.getTime());
    
                            P_Ex.Storage.local.Pet.hungry+=1;

                            P_Ex.f.StorageUpd();
    
                            var plurk = document.body.querySelector(`[data-pid="${e.target.dataset.pid}"]`);
                            var plurk_pos = plurk.getBoundingClientRect();
    
    
    
                            Ex.f.Pet("move",{x:plurk_pos.x,y:plurk_pos.y+window.scrollY});
    
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
                            
                            var weight = P_Ex.Storage.local.Pet.weight;
                            var happy = P_Ex.Storage.local.Pet.happy;
                            var hungry = P_Ex.Storage.local.Pet.hungry;


                            P_Ex.f.MsgPop(`
                            <div id="PetStatus">
                            <div id="Weight" data-flag="PetWeight" style="background:linear-gradient(to right, #0f0 ${weight}% , #fff 0%);" title="體重">${weight}kg</div>
                            <div id="Happy" data-flag="PetHappy"  style="background:linear-gradient(to right, #0f0 ${happy}% , #fff 0%);" title="好感度">${happy}</div>
                            <div id="Hungry" data-flag="PetHungry"  style="background:linear-gradient(to right, #0f0 ${hungry}% , #fff 0%);" title="飽足度">${hungry}</div>
                            </div>`,e);
                        break;

                        case "set":

                            P_Ex.Storage.local.Pet = P_Ex.Storage.local.Pet||Ex.config.PetStatus;
                            P_Ex.f.StorageUpd();
                            

                            Ex.obj.petDiv = document.querySelector("#dynamic_logo");
                            Ex.obj.petImg = Ex.obj.petDiv.querySelector("img");

                            setTimeout(()=>{
                                Ex.obj.petDiv.style = `opacity: 0;`;
        
                                setTimeout(()=>{
        
                                    Ex.obj.petImg.src = "https://s.plurk.com/creatures/big/72e28d113423eccdc548.png";

                                    Ex.obj.petDiv.style = `
                                        opacity:1;
                                        top: 0px;
                                        left: 0px;
                                        z-index: 999999;
                                        cursor: grab;
                                    `;

                                    //Ex.obj.petImg.dataset.event = "ClickEvent";
                                    Ex.obj.petImg.dataset.r_event = "ClickEvent";
                                    Ex.obj.petImg.dataset.mode = "Pet";
                                    Ex.obj.petImg.dataset.case = "PetStatus";

                                },1000);
        
                            },100);
        

                        break;
                    }
                },
                "PetClock":()=>{

                    P_Ex.flag.PetWeight = P_Ex.Storage.local.Pet.weight+'kg';
                    P_Ex.flag.PetHappy = P_Ex.Storage.local.Pet.happy;
                    P_Ex.flag.PetHungry = P_Ex.Storage.local.Pet.hungry;

                    var time = P_Ex.f.Num36(P_Ex.Storage.local.Pet.time);
                    

                    var pass_time = (new Date().getTime() - time) / 1000;
                    if( pass_time >= Ex.config.hungry_sec )
                    {
                        var count = Math.floor( pass_time  / Ex.config.hungry_sec );

                        P_Ex.Storage.local.Pet.hungry-=count;

                        P_Ex.Storage.local.Pet.time = P_Ex.f.Num36( new Date().getTime() );

                        if(P_Ex.Storage.local.Pet.hungry<=10)
                        {
                            P_Ex.f.FlashMsgPop(`
                            <div class="petDiv">肚子餓了</div>
                            `,undefined,3);
                        }
                        

                        P_Ex.f.StorageUpd();
                    }

                    if(document.querySelector("#PetStatus")!==null)
                    {
                        document.querySelector("#PetStatus #Weight").style = `background:linear-gradient(to right, #0f0 ${P_Ex.Storage.local.Pet.weight}% , #fff 0%);`;

                        document.querySelector("#PetStatus #Happy").style = `background:linear-gradient(to right, #0f0 ${P_Ex.Storage.local.Pet.happy}% , #fff 0%);`;

                        document.querySelector("#PetStatus #Hungry").style = `background:linear-gradient(to right, #0f0 ${P_Ex.Storage.local.Pet.hungry}% , #fff 0%);`;

                    }
                },
                default:()=>{


                    Ex.f.style_set();
                    Ex.f.Pet('set');

                    /*
                    <div class="pop-view pop-menu" style="display: block; left: 899.271px; top: 295.885px; z-index: 999999;">
                    <ul>
                    <li>
                    <a>複製網址</a>
                    </li>
                    </ul>
                    </div>
                    */


                    P_Ex.Clock.setInterval.PLurkEx_Pet_Clock = setInterval(()=>{

                        var menu = document.querySelector(".pop-menu .pop-view-content ul");

                        if(menu!==null && menu.querySelector(`[data-event="ClickEvent"]`)===null)
                        {
                            var pid = P_Ex.f.PlurkId(menu.querySelector("a[href]").toString().split("/").pop());
                            
                            var plurk = PlurksManager.getPlurkById(pid);
                            console.log(plurk);

                            if(plurk.owner_id===GLOBAL.session_user.uid)
                            {
                                var li = document.createElement("li");
                                li.innerHTML = `<li><a data-event="ClickEvent" data-mode="Pet" data-case="PetFood" data-pid="${pid}" class="">餵寵物</a></li>`;
    
                                menu.prepend(li);
                            }
                        }

                    },1000);

                    

                }
            }
        };

        Ex.f.default();


        return Ex;
    }

};

//var pet = new PlurkEx_Pet({"Clock":{"setInterval":{}}});
//var pet = new PlurkEx_pet();
Ex.OtherEx.PlurkEx_Pet = new PlurkEx_Pet(Ex);