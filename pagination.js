DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

DBFX.Web.Controls.Pagination = function (b) {
    var pi = DBFX.Web.Controls.Control("PageIndex");

    pi.VisualElement = document.createElement("DIV");
    pi.OnCreateHandle();


    pi.defaults = {
        perPageDatasCount:30,//每页展示数据量
        totalDatasCount:2003,//总数据量
        currentPage:1,//当前第几页,默认当前页为第1页
        totalPages:0,//总页数
        prevCls:'prev',            //上一页class
        nextCls:'next',            //下一页class
        prevContent:'<',        //上一页内容
        nextContent:'>',        //下一页内容
        ellipsis:'...',         //省略文本内容
        count:3,                //当前页前后分页个数
        jump:false,                //跳转到指定页数
        jumpIptCls:'jump-ipt',    //文本框内容
        jumpBtnCls:'jump-btn',    //跳转按钮
        jumpBtn:'跳转',            //跳转按钮文本
        callback:function(){}    //回调
    }

    //TODO:接收数据对象
    pi.dataSource = { };
    Object.defineProperty(pi,"DataSource",{
       get:function() {
           return pi.dataSource;
       },
        set:function(v){
           pi.dataSource = v;
           //刷新数据
            pi.refreshData();
        }
    });

    //所有按钮字符串集合
    pi.allBtnTexts = [];

    //刷新显示数据方法 获取到显示字符集合
    pi.refreshData = function () {
        //确定需要展示的总页数
        pi.defaults.totalPages = Math.ceil(pi.defaults.totalDatasCount/pi.defaults.perPageDatasCount);
        var curPage = pi.defaults.currentPage;
        var totalPages = pi.defaults.totalPages;
        var sideCount = pi.defaults.count%2==0 ? pi.defaults.count-1 : pi.defaults.count;

        sideCount = sideCount<3 ? 3 : sideCount;

        //保存所有按钮的显示字符
        pi.allBtnTexts = [];

        //测试
        // sideCount = 5;
        // curPage = 43;
        // totalPages = 2;

        //总页数是否大于两倍的sidecount
        if(totalPages>sideCount*2){
            //判断当前点击的页数
            if(curPage-1>=sideCount && totalPages-curPage>=sideCount){//1、当前点击页面处于中间地带时
                for(var i=0;i<sideCount*2+3;i++){
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[Math.floor(sideCount/2)+1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount+1] = curPage;
                    pi.allBtnTexts[sideCount*2+2-Math.floor(sideCount/2)-1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount*2+2] = pi.defaults.nextContent;

                    //<和省略号之间显示的数值
                    if(i>0 && i<Math.floor(sideCount/2)+1){
                        pi.allBtnTexts[i] = i;
                    }
                    //第一个省略号和当前选中页面之间数值
                    if(i>Math.floor(sideCount/2)+1 && i<sideCount+1){
                        pi.allBtnTexts[i] = curPage-(sideCount+1-i);
                    }
                    //当前选中页面和第二个省略号之间数值
                    if(i>sideCount+1 && i<(sideCount*2+2-Math.floor(sideCount/2)-1)){
                        pi.allBtnTexts[i] = curPage+(i-(sideCount+1));
                    }

                    if(i>(sideCount*2+2-Math.floor(sideCount/2)-1) && i<sideCount*2+2){
                        pi.allBtnTexts[i] = totalPages-(sideCount*2+1-i);
                    }

                }
            }else if(curPage-1 < sideCount){//2、当前点击页处于左侧时
                for (var i=0;i<(sideCount+1)*2;i++){
                    pi.allBtnTexts[i]= i;
                    if(i>sideCount+1){
                        pi.allBtnTexts[i] = totalPages - ((sideCount*2)-i);
                    }
                    pi.allBtnTexts[sideCount+2] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount*2+1] = pi.defaults.nextContent;
                }

            }else {//3、当前点击页处于右侧时
                console.log('右=============');
                for (var i=0;i<(sideCount+1)*2;i++){
                    pi.allBtnTexts[i]= totalPages - ((sideCount*2)-i);
                    if(i<sideCount){
                        pi.allBtnTexts[i] = i;
                    }
                    pi.allBtnTexts[sideCount-1] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount*2+1] = pi.defaults.nextContent;

                }
            }

        }else if(totalPages>0) {//总页数少于两倍sidecound且大于0时
            for (var i=0;i<totalPages+2;i++){
                pi.allBtnTexts[i] = i;
                pi.allBtnTexts[0] = pi.defaults.prevContent;
                pi.allBtnTexts[totalPages+1] = pi.defaults.nextContent;
            }
        }else {//总页数为0时
            pi.allBtnTexts[0] = "暂无数据";
        }
    }

    //重新布局控件
    pi.reLayoutViews = function () {
        var curPage = pi.defaults.currentPage;
        //按钮少于3个时
        if(pi.allBtnTexts.length < 3){
            pi.VisualElement.innerText = pi.allBtnTexts[0];
            return ;
        }
        //清空已经存在的列表
        pi.container.innerHTML = '';

        //根据计算的显示字符集合创建按钮
        for(var j=0;j<pi.allBtnTexts.length;j++){
            var liE = document.createElement('li');
            liE.addEventListener('mousedown',pi.mouseClick,false);
            var span = document.createElement('span');
            span.innerText = pi.allBtnTexts[j];
            liE.appendChild(span);

            //TODO:设定显示样式
            // liE.classList.add("basedli");
            liE.style.width = "40px";
            liE.style.height = "40px";
            liE.style.fontSize = "16px";
            liE.style.cssFloat = "left";
            liE.style.textAlign = "center";
            liE.style.transition = "background-color 0.5s";
            liE.style.borderRadius = "50%";
            liE.style.margin = "0px 10px";
            liE.style.color = "#666";


            //
            span.style.display = "block";
            span.style.width = "100%";
            span.style.borderRadius = "50%";
            span.style.cursor = "pointer";
            span.style.lineHeight = "40px";
            span.style.textDecoration = "none";
            span.style.border = "1px solid #E5E5E5";



            //当前显示页面添加激活样式
            if(pi.allBtnTexts[j]==curPage){
                // span.classList.add("active");
                span.style.backgroundColor = "#13d1be";
                span.style.borderColor = "#13d1be";
                span.style.color = "#f9f9f9";

            }

            //设置前一页和后一页为不可用状态
            if(curPage==1 && j==0){
                // span.classList.add('disabled');
                //设置"不可用"样式
                span.style.color = "silver";
                span.style.cursor = "not-allowed";
                liE.removeEventListener('mousedown',pi.mouseClick,false);
            }

            if(curPage==pi.defaults.totalPages && j==pi.allBtnTexts.length-1){
                // span.classList.add('disabled');
                //设置"不可用"样式
                span.style.color = "silver";
                span.style.cursor = "not-allowed";
                liE.removeEventListener('mousedown',pi.mouseClick,false);
            }

            //显示"省略号"时样式

            if(span.innerText == pi.defaults.ellipsis){
                span.style.cursor = "default";
                span.style.border = "0";
            }

            pi.container.appendChild(liE);
        }

    }

    //处理点击事件
    pi.mouseClick = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var target = e.target;

        switch (target.innerText){
            case pi.defaults.prevContent:
                console.log('上一页按钮');
                pi.defaults.currentPage -= 1;
                break;
            case pi.defaults.nextContent:
                console.log('下一页按钮');
                pi.defaults.currentPage += 1;
                break;
            case pi.defaults.ellipsis:
                console.log('省略号按钮');
                return;
                break;
            default:
                console.log('数字键');
                pi.defaults.currentPage = parseInt(target.innerText);
                break;
        }

        console.log('刷新数据');

        //先刷新显示数据
        pi.refreshData();
        //创建并布局按钮
        pi.reLayoutViews();
    }
    

    pi.onload = function () {
        var ve = pi.VisualElement;
        ve.style.width = "800px";
        ve.style.height = "50px";
        ve.style.borderRadius = "5px";
        ve.style.border = "2px solid black";
        ve.style.textAlign = "center";
        ve.style.lineHeight = "50px";
        ve.style.backgroundColor = "#96baff";

        //创建分页容器ul
        pi.container = document.createElement("ul");
        // pi.container.classList.add("db-pagination");
        pi.container.style.listStyle = "none";
        pi.container.style.padding = "0px";
        pi.container.style.margin = "0px";
        pi.container.style.textAlign = "center";
        pi.container.style.display = "inline-block";




        ve.appendChild(pi.container);

        //先刷新数据
        pi.refreshData();
        //布局按钮
        pi.reLayoutViews();
    }

    pi.onload();



    return pi;
}