DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

DBFX.Web.Controls.Pagination = function (b) {
    var pi = DBFX.Web.Controls.Control("Pagination");
    pi.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.PaginationDesigner");
    pi.ClassDescriptor.Serializer = "DBFX.Serializer.PaginationSerializer";

    pi.VisualElement = document.createElement("DIV");
    pi.VisualElement.className = "Pagination";
    pi.OnCreateHandle();
    pi.OnCreateHandle = function () {
        var ve = pi.VisualElement;

        pi.innerContainer = document.createElement('div');
        pi.innerContainer.className = "Pagination_InnerContainer";
        ve.appendChild(pi.innerContainer);

        //创建分页容器div
        pi.container = document.createElement("div");
        pi.container.className = "Pagination_Container";
        pi.innerContainer.appendChild(pi.container);

        //先刷新数据
        pi.refreshData();
        //布局按钮
        pi.reLayoutViews();
    }

    pi.defaults = {
        perPageDatasCount: 30,//每页展示数据量
        totalDatasCount: 0.1,//总数据量
        currentPage: 1,//当前第几页,默认当前页为第1页
        totalPages: 1,//总页数
        prevCls: 'prev',            //上一页class
        nextCls: 'next',            //下一页class
        prevContent: '<',        //上一页内容
        nextContent: '>',        //下一页内容
        ellipsis: '...',         //省略文本内容
        count: 3,                //当前页前后分页个数
        jump: false,                //跳转到指定页数
        jumpIptCls: 'jump-ipt',    //文本框内容
        jumpBtnCls: 'jump-btn',    //跳转按钮
        jumpBtn: '跳转',            //跳转按钮文本
        callback: function () { }    //回调
    }

    pi.totalDatasCount = 1;

    //接收数据对象
    pi.dataSource = {};
    Object.defineProperty(pi, "DataSource", {
        get: function () {
            return pi.dataSource;
        },
        set: function (v) {
            pi.dataSource = v;
            pi.defaults.currentPage = 1;
            //解析拿到的数据
            pi.analysisSource(v);

            //刷新数据
            pi.refreshData();
            //布局按钮
            pi.reLayoutViews();
        }
    });

    //所有按钮字符串集合
    pi.allBtnTexts = [];

    //解析数据源数据
    pi.analysisSource = function (dataSource) {

        if (Object.prototype.toString.call(pi.dataSource) == "[object Object]") {
            // console.log(dataSource);
            pi.totalDatasCount = dataSource.dataCount || 0;
            pi.defaults.perPageDatasCount = dataSource.perPageCount || 20;
        }
        if (Object.prototype.toString.call(pi.dataSource) == "[object String]") {
            // console.log("json字符串");
            var jsonObj = JSON.parse(dataSource);
            pi.totalDatasCount = jsonObj.dataCount || 0;
            pi.defaults.perPageDatasCount = jsonObj.perPageCount || 20;
        }
    }

    //刷新显示数据方法 获取到显示字符集合
    pi.refreshData = function () {
        //确定需要展示的总页数
        pi.defaults.totalPages = Math.ceil(pi.totalDatasCount / pi.defaults.perPageDatasCount);

        pi.defaults.totalPages = pi.defaults.totalPages == 0 ? 1 : pi.defaults.totalPages;

        pi.defaults.currentPage = pi.defaults.currentPage > pi.defaults.totalPages && pi.defaults.currentPage > 1 ? pi.defaults.totalPages : pi.defaults.currentPage;

        console.log("当前选中页数：" + pi.defaults.currentPage);

        var curPage = pi.defaults.currentPage;
        var totalPages = pi.defaults.totalPages;
        var sideCount = pi.defaults.count % 2 == 0 ? pi.defaults.count - 1 : pi.defaults.count;

        sideCount = sideCount < 3 ? 3 : sideCount;

        //保存所有按钮的显示字符
        pi.allBtnTexts = [];

        //测试
        // sideCount = 5;
        // curPage = 43;
        // totalPages = 2;

        //总页数是否大于两倍的sidecount
        if (totalPages > sideCount * 2) {
            //判断当前点击的页数
            if (curPage - 1 >= sideCount && totalPages - curPage >= sideCount) {//1、当前点击页面处于中间地带时
                for (var i = 0; i < sideCount * 2 + 3; i++) {
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[Math.floor(sideCount / 2) + 1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount + 1] = curPage;
                    pi.allBtnTexts[sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount * 2 + 2] = pi.defaults.nextContent;

                    //<和省略号之间显示的数值
                    if (i > 0 && i < Math.floor(sideCount / 2) + 1) {
                        pi.allBtnTexts[i] = i;
                    }
                    //第一个省略号和当前选中页面之间数值
                    if (i > Math.floor(sideCount / 2) + 1 && i < sideCount + 1) {
                        pi.allBtnTexts[i] = curPage - (sideCount + 1 - i);
                    }
                    //当前选中页面和第二个省略号之间数值
                    if (i > sideCount + 1 && i < (sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1)) {
                        pi.allBtnTexts[i] = curPage + (i - (sideCount + 1));
                    }

                    if (i > (sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1) && i < sideCount * 2 + 2) {
                        pi.allBtnTexts[i] = totalPages - (sideCount * 2 + 1 - i);
                    }

                }
            } else if (curPage - 1 < sideCount) {//2、当前点击页处于左侧时
                for (var i = 0; i < (sideCount + 1) * 2; i++) {
                    pi.allBtnTexts[i] = i;
                    if (i > sideCount + 1) {
                        pi.allBtnTexts[i] = totalPages - ((sideCount * 2) - i);
                    }
                    pi.allBtnTexts[sideCount + 2] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount * 2 + 1] = pi.defaults.nextContent;
                }

            } else {//3、当前点击页处于右侧时
                // console.log('右=============');
                for (var i = 0; i < (sideCount + 1) * 2; i++) {
                    pi.allBtnTexts[i] = totalPages - ((sideCount * 2) - i);
                    if (i < sideCount) {
                        pi.allBtnTexts[i] = i;
                    }
                    pi.allBtnTexts[sideCount - 1] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount * 2 + 1] = pi.defaults.nextContent;

                }
            }

        } else if (totalPages > 0) {//总页数少于两倍sidecound且大于0时
            for (var i = 0; i < totalPages + 2; i++) {
                pi.allBtnTexts[i] = i;
                pi.allBtnTexts[0] = pi.defaults.prevContent;
                pi.allBtnTexts[totalPages + 1] = pi.defaults.nextContent;
            }
        } else {//总页数为0时
            // pi.allBtnTexts[0] = "暂无数据";
            // pi.container.style.color = "red";
            pi.allBtnTexts[1] = 1;
            pi.allBtnTexts[0] = pi.defaults.prevContent;
            pi.allBtnTexts[2] = pi.defaults.nextContent;
        }
    }


    //重新布局控件
    pi.reLayoutViews = function () {
        //当前页数
        var curPage = pi.defaults.currentPage;

        //按钮少于3个时
        if (pi.allBtnTexts.length < 3) {
            pi.container.innerText = pi.allBtnTexts[0];
            return;
        }
        //清空已经存在的列表
        pi.container.innerHTML = '';

        //根据计算的显示字符集合创建按钮
        for (var j = 0; j < pi.allBtnTexts.length; j++) {


            var liE = document.createElement('div');
            liE.className = "Pagination_Button";
            var span = document.createElement('span');
            span.className = "Pagination_ButtonText";
            span.innerText = pi.allBtnTexts[j];
            liE.addEventListener('mousedown', pi.mouseClick, false);
            liE.appendChild(span);

            //当前显示页面添加激活样式
            if (pi.allBtnTexts[j] == curPage) {

                liE.classList.add("Pagination_ButtonSelected")
            }

            //设置前一页和后一页为不可用状态
            if ((curPage == 1 && j == 0) || (curPage == pi.defaults.totalPages && j == pi.allBtnTexts.length - 1)) {
                //设置"不可用"样式
                // liE.className = "Pagination_ButtonDisabled";
                liE.classList.add("Pagination_ButtonDisabled");

                liE.removeEventListener('mousedown', pi.mouseClick, false);
            }

            //显示"省略号"时样式
            if (span.innerText == pi.defaults.ellipsis) {
                span.className = "Pagination_ButtonEllipsis";
            }
            pi.container.appendChild(liE);
        }
    }

    //TODO:点击时执行的方法  参数包含：当前页码、总页码、每页数据量……
    // pi.PageIndexChanged = function () {
    //
    // }

    pi.SetPage = function (page) {
        var p = parseInt(page);
        var t = Math.ceil(pi.totalDatasCount / pi.defaults.perPageDatasCount);
        p = isNaN(p) ? 1 : p;
        p = p < 1 ? 1 : p;
        p = p > t ? t : p;

        pi.defaults.currentPage = p;
        pi.currentPage = pi.defaults.currentPage;
        pi.perPageCount = pi.defaults.perPageDatasCount;


        if (pi.Command != undefined && pi.Command != null) {
            pi.Command.Sender = pi;
            pi.Command.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "Command") {
            pi.PageIndexChanged.Sender = pi;
            pi.PageIndexChanged.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "function") {
            pi.PageIndexChanged(null, pi);
        }

        //先刷新显示数据
        pi.refreshData();
        //创建并布局按钮
        pi.reLayoutViews();

    }

    //处理点击事件
    pi.mouseClick = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var target = e.target;

        switch (target.innerText) {
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
        //TODO:执行pi.PageIndexChanged,

        pi.currentPage = pi.defaults.currentPage;
        pi.perPageCount = pi.defaults.perPageDatasCount;


        if (pi.Command != undefined && pi.Command != null) {
            pi.Command.Sender = pi;
            pi.Command.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "Command") {
            pi.PageIndexChanged.Sender = pi;
            pi.PageIndexChanged.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "function") {
            pi.PageIndexChanged(e, pi);
        }

        //先刷新显示数据
        pi.refreshData();
        //创建并布局按钮
        pi.reLayoutViews();


    }

    pi.pWidth = "400px";
    pi.pHeight = "25px";

    //按钮样式设置
    //按钮边框宽度
    pi.btnBorderW = "1px";
    Object.defineProperty(pi, "BtnBorderW", {
        get: function () {
            return pi.btnBorderW;
        },
        set: function (v) {
            pi.btnBorderW = v;
        }
    });
    //按钮圆角
    pi.btnBorderR = "5px";
    Object.defineProperty(pi, "BtnBorderR", {
        get: function () {
            return pi.btnBorderR;
        },
        set: function (v) {
            pi.btnBorderR = v;
        }
    });
    //按钮边框颜色
    pi.btnBorderC = "#E5E5E5";
    Object.defineProperty(pi, "BtnBorderC", {
        get: function () {
            return pi.btnBorderC;
        },
        set: function (v) {
            pi.btnBorderC = v;
        }
    });
    //按钮背景色
    pi.btnBgC = "transparent";
    Object.defineProperty(pi, "BtnBgC", {
        get: function () {
            return pi.btnBgC;
        },
        set: function (v) {
            pi.btnBgC = v;
        }
    });

    //按钮高亮（被选中）时背景色
    pi.selectedC = "#13d1be";
    Object.defineProperty(pi, "SelectedC", {
        get: function () {
            return pi.selectedC;
        },
        set: function (v) {
            pi.selectedC = v;
        }
    });
    pi.selectedTextC = "#f9f9f9";
    Object.defineProperty(pi, "SelectedTextC", {
        get: function () {
            return pi.selectedTextC;
        },
        set: function (v) {
            pi.selectedTextC = v;
        }
    });



    /*==================================平台属性配置begin=======================================================*/
    pi.SetHeight = function (v) {
        // if (v.indexOf("%") != -1 || v.indexOf("px") != -1) {
        //     pi.VisualElement.style.height = v;
        // } else {
        //     pi.VisualElement.style.height = parseInt(v) + 'px';
        // }
        pi.VisualElement.style.height = v;

        var cssObj = window.getComputedStyle(pi.VisualElement, null);
        // console.log(cssObj.height);
        pi.VisualElement.style.lineHeight = cssObj.height;
        pi.pHeight = cssObj.height;

        pi.reLayoutViews();
    }

    pi.SetWidth = function (v) {

        // if (v.indexOf("%") != -1 || v.indexOf("px") != -1) {
        //     pi.VisualElement.style.width = v;
        // } else {
        //     pi.VisualElement.style.width = parseFloat(v) + 'px';
        // }

        pi.VisualElement.style.width = v;
        var cssObj = window.getComputedStyle(pi.VisualElement, null);
        pi.pWidth = cssObj.width;
        // console.log(cssObj.width);
        pi.reLayoutViews();
    }

    pi.fSize = "12px";
    pi.SetFontSize = function (v) {
        pi.fSize = v;
    }

    pi.fFamily = "宋体";
    pi.SetFontFamily = function (v) {
        pi.fFamily = v;
    }

    pi.fStyle = "normal";
    pi.SetFontStyle = function (v) {
        pi.fStyle = v;
    }

    pi.fColor = "#666";
    pi.SetColor = function (v) {
        pi.fColor = v;
    }
    /**==================================平台属性配置end=======================================================*/



    pi.OnCreateHandle();
    return pi;
}

DBFX.Serializer.PaginationSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        // DBFX.Serializer.SerialProperty("BtnBorderW", c.BtnBorderW, xe);
        // DBFX.Serializer.SerialProperty("BtnBorderR", c.BtnBorderR, xe);
        // DBFX.Serializer.SerialProperty("BtnBorderC", c.BtnBorderC, xe);
        // DBFX.Serializer.SerialProperty("BtnBgC", c.BtnBgC, xe);
        // DBFX.Serializer.SerialProperty("SelectedC", c.SelectedC, xe);
        // DBFX.Serializer.SerialProperty("SelectedTextC", c.SelectedTextC, xe);
        //序列化方法
        DBFX.Serializer.SerializeCommand("PageIndexChanged", c.PageIndexChanged, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        // DBFX.Serializer.DeSerialProperty("BtnBorderW", c, xe);
        // DBFX.Serializer.DeSerialProperty("BtnBorderR", c, xe);
        // DBFX.Serializer.DeSerialProperty("BtnBorderC", c, xe);
        // DBFX.Serializer.DeSerialProperty("BtnBgC", c, xe);
        // DBFX.Serializer.DeSerialProperty("SelectedC", c, xe);
        // DBFX.Serializer.DeSerialProperty("SelectedTextC", c, xe);
        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("PageIndexChanged", xe, c);
    }


}
DBFX.Design.ControlDesigners.PaginationDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/PaginationDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{EventName:"PageIndexChanged",EventCode:undefined,Command:od.dataContext.PageIndexChanged,Control:od.dataContext}];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if(obdc.EventListBox != undefined){
            obdc.EventListBox.ItemSource = [{EventName:"PageIndexChanged",EventCode:undefined,Command:obdc.dataContext.PageIndexChanged,Control:obdc.dataContext}];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "分页导航控件";
    return obdc;
}