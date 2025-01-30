var style = document.createElement("style");
style.innerHTML = `
#FileUpLoadMenu{
    color:#fff;
    text-align: center;
    width: 100%;
    padding: 5% 0 0 0;
}
button{
    cursor:pointer;
}

#Progress{
    padding: 10px;
    width: 100%;
    height: 60px;
    position: absolute;
    z-index: 99;
}
#Progress>div{
    background: linear-gradient(to right, #00F 0%,  #000 0%);
    color: #fff;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    height: 100%;
    border-radius: 99px;
    
}

#YearMonthList{
    color: #fff;
    text-align: center;
    width: 100%;
    padding: 5% 0 0 0;
}
#YearMonthList div{
    display: inline-table;
    width: 200px;
    height: 30px;
    padding: 20px;
    border: 1px solid;
    font-size: 20px;
    text-align: left;
}
`;
document.head.appendChild(style);



var ImagesList = {};
var nav_count = 0;
var all_img = 0;
var now_img = 0;
var load_sec = 1;
var NavMoItemList = document.querySelectorAll(".nav-mo-item");




var file;
var reader;
var link;
var download_sec = 2;
var y_m_now = 0;

(()=>{

    if(NavMoItemList.length===0){

        document.body.innerHTML = `
        <div id="FileUpLoadMenu">
        <span>圖片清單檔案：</span>
        <input type="file">
        <button onclick="UpLoadTxt();">開始批次下載</button>
        </div>`

        return;
    }


    document.querySelectorAll(".nav-mo-item").forEach(i=>{
        all_img+=(i.dataset.count*1);
    });


    
    
    var div = document.createElement("div");
    div.innerHTML = `<div></div>`;
    div.id = "Progress";
    document.querySelector("#pop-window-header").prepend(div);
    
    document.querySelector("#Progress>div").innerHTML = `0/${all_img}`;


    NavMoItemLoop();
    

    

})();

function UpLoadTxt(){

    file = document.querySelector(`[type="file"]`).files[0];

    reader = new FileReader();

    reader.onload = ()=>{

        link = document.createElement("a");
        document.body.appendChild(link);

        ImagesList = JSON.parse(reader.result);


        var div = document.createElement("div");
        div.id = "YearMonthList";
        var html = ``;

        Object.keys(ImagesList).reverse().forEach(i=>{
            all_img+=ImagesList[i].length;

            html += `

                <div data-ym="${i}">
                ${i}：${ImagesList[i].length}
                <BR><button data-ym="${i}" onclick="DownLoadImageLoop(this)">該月下載</button>
                </div>
            
            `;

        });

        div.innerHTML = `總數：${all_img}
        <BR><button onclick="DownLoadImageLoop(this)">全部下載</button>
        <P>${html}`;

        document.body.appendChild(div);

       



    }

    reader.readAsText(file);
}



function NavMoItemLoop(){


    if(NavMoItemList[nav_count]===undefined){

        var file = new File( [ JSON.stringify(ImagesList) ],
            `圖片清單.json`,
            {
                type: "application/json"
            }
        );
            
        var link = document.createElement("a");
        var url = URL.createObjectURL(file);
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();

        return;
    }


    if(NavMoItemList[nav_count].classList.contains("current")===false){    

        NavMoItemList[nav_count].click();
        setTimeout(()=>{
            NavMoItemLoop();
        },1000 * load_sec);
        return;
    }


    var _imagelist = [];
    ImagesList[ NavMoItemList[nav_count].dataset.yearmo ] = ImagesList[ NavMoItemList[nav_count].dataset.yearmo ]||_imagelist;

    document.querySelectorAll(`[data-yearmo="${NavMoItemList[nav_count].dataset.yearmo}"] div.img`).forEach((img,img_i)=>{
        now_img++;
        if(_imagelist.indexOf(`${img.dataset.filename}`)===-1){
            _imagelist.push(`${img.dataset.filename}`);
        }


        if(NavMoItemList[nav_count].dataset.count*1===img_i+1){

            console.log(`ImagesList:${Object.keys(ImagesList).length}\n
                count:${NavMoItemList[nav_count].dataset.count}\n
                ${NavMoItemList[nav_count].dataset.yearmo}`);


            document.querySelector("#Progress>div").innerHTML = `${now_img}/${all_img}`;
            document.querySelector("#Progress>div").style.background = `linear-gradient(to right, #00F ${now_img/all_img*100}%,  #000 0%)`;
            
            setTimeout(()=>{
                nav_count++;
                NavMoItemLoop();
            },1000 * load_sec);
        }
    });


}

function DownLoadImageLoop(obj){

    
    if(Object.keys(ImagesList).reverse()[y_m_now]===undefined) return;

    ym = obj.dataset.ym||Object.keys(ImagesList).reverse()[y_m_now];
    var img = ImagesList[ ym ][now_img];

    link.href = `https://images.plurk.com/${img}`;
    link.download = img;
    link.click();

    console.log(ym +','+ now_img +  '==>' + img);

    now_img++;

    document.querySelector(`#YearMonthList>div[data-ym="${ym}"]`).style.background = `linear-gradient(to right, #00F ${now_img/ImagesList[ ym ].length*100}%,  #000 0%)`;

    
    if( ImagesList[ ym ][now_img]===undefined ){

        now_img = 0;
        y_m_now++;

        if(obj.dataset.ym!==undefined){

            console.log("該月結束");
            return;
        }
    }

    setTimeout(()=>{
        DownLoadImageLoop(obj);
    },1000 * download_sec);

}

