// 写入cookie
function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 读取cookie
function getcookie (name) {
    var cookieName=encodeURIComponent(name)+"=",
    cookieStart=document.cookie.indexOf(cookieName),
    cookieValue=null;
    if(cookieStart>-1){
        var cookieEnd=document.cookie.indexOf(";",cookieStart);
        if(cookieEnd===-1){
            cookieEnd=document.cookie.length;
        }
        cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
    }
    return cookieValue;
}
// 删除cookie
function removeCookie (name, path, domain) {
    setCookie(name, '', new Date(0), path, domain);
}

// 点击不再提醒使小黄条隐藏，并设置cookie
function closeclick(){
    document.getElementsByClassName('g-top')[0].style.display='none';
    setCookie('closeclick','closeclick');
}
// 检测是否设置小黄条的隐藏cookie
function closecheck(){
    var cookie=getcookie('closeclick');
    if(cookie === 'closeclick'){
        document.getElementsByClassName('g-top')[0].style.display='none';
    }else{
        document.getElementsByClassName('g-top')[0].style.display='block';
    }
}

// 检测是否设置关注cookie
function attYN(){
    var cookie=getcookie('followSuc');
    if(!!cookie){
        document.getElementsByClassName('usrAtt')[0].style.display='none';
        document.getElementsByClassName('usrAtt-af')[0].style.display='block';
    }else{
        document.getElementsByClassName('usrAtt')[0].style.display='block';
        document.getElementsByClassName('usrAtt-af')[0].style.display='none';
    }
}

// 点击关注，检测是否登录，若登录则
function loginYN(){
    var cookie=getcookie('loginSuc');
    if(!!cookie){
        //调用关注API
        attention();
    }else{
        // 弹出登录窗
        document.getElementsByClassName('m-mask')[0].style.display='block';
        document.getElementsByClassName('m-formwrap')[0].style.display='block';

    }
}

// 导航关注
function attention(){
    var xhr=new XMLHttpRequest();
     xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                if(xhr.responseText==1){
                    setCookie('followSuc','followSuc');
                    document.getElementsByClassName('usrAtt')[0].style.display='none';
                    document.getElementsByClassName('usrAtt-af')[0].style.display='block';
                }
            }
        }
    }
    xhr.open("get",'http://study.163.com/webDev/attention.htm',true);
    xhr.send(null);
}
// 取消关注，删除cookie
function attCancel(){
    removeCookie('followSuc');
    document.getElementsByClassName('usrAtt')[0].style.display='block';
    document.getElementsByClassName('usrAtt-af')[0].style.display='none';
}
// 关闭登录窗口
function closelogin(){
    document.getElementsByClassName('m-mask')[0].style.display='none';
    document.getElementsByClassName('m-formwrap')[0].style.display='none';
}

// 获取登录表单
var loginForm=document.forms.loginForm;
function submit(){
        var nameinput=loginForm.userName,
        name=nameinput.value,
        pswdinput=loginForm.password,
        pswd=pswdinput.value;
        var rightname='studyOnline',
        rightpswd='study.163.com';
        // 表单验证
        if(name!=rightname){
            showMessage('请使用studyOnline账号登录。');
            return;
        }
        else if(pswd!=rightpswd){
            showMessage('请输入正确的密码（study.163.com）。');
            return;
        }
        // 使用Md5加密用户数据
        var userName=md5(name),
        password=md5(pswd);
        // 调用Ajax登录
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4) {
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText==1){
                        // 成功
                        // 调用关注API
                        attention();
                        // 关闭登录窗口
                        closelogin();
                        // 设置登录的cookie......
                        setCookie('loginSuc','loginSuc');
                    }else{
                        // 失败
                        showMessage('登录失败！');
                    }
                }
            }
        }
        var url="http://study.163.com/webDev/login.htm";
        url=addURLParam(url,"userName",userName);
        url=addURLParam(url,"password",password);
        xhr.open("get",url,true);
        xhr.send(null);
    }
// 向现有URL的末尾添加查询字符串参数
function addURLParam(url,name,value){
    url+=(url.indexOf("?")==-1?"?":"&");
    url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}
// 错误提示信息
var nmsg = document.getElementById('message');
function showMessage(msg){
            nmsg.innerHTML = msg;
 }

// 调用浮层播放介绍视频
function playvedio(){
    document.getElementsByClassName('m-mask')[0].style.display='block';
    document.getElementsByClassName('m-player')[0].style.display='block';
}
// 关闭视频介绍浮层
function closeplayer(){
    document.getElementsByClassName('m-mask')[0].style.display='none';
    document.getElementsByClassName('m-player')[0].style.display='none';
    var video=document.getElementById('video');
    video.pause();
}

// 获取最热排行
function getHotlist(){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                var hotlist=JSON.parse(xhr.responseText),
                listnum=0;
                for(var i=0;i<10;i++){
                    var topi=document.getElementsByClassName('topi')[i],
                    detailtt=topi.getElementsByTagName('a')[0],
                    tophot=topi.getElementsByTagName('span')[0],
                    topimg=topi.getElementsByTagName('img')[0];
                    detailtt.innerHTML=hotlist[i].name;
                    detailtt.title=hotlist[i].name;
                    tophot.innerHTML=hotlist[i].learnerCount;
                    topimg.src=hotlist[i].smallPhotoUrl;
                }
                listnum=1;
                var changehot=setInterval(function(){
                    if(listnum==1){
                        for(var i=0;i<10;i++){
                            var topi=document.getElementsByClassName('topi')[i],
                            detailtt=topi.getElementsByTagName('a')[0],
                            tophot=topi.getElementsByTagName('span')[0],
                            topimg=topi.getElementsByTagName('img')[0]
                            xhri=i+10;
                            detailtt.innerHTML=hotlist[xhri].name;
                            detailtt.title=hotlist[xhri].name;
                            tophot.innerHTML=hotlist[xhri].learnerCount;
                            topimg.src=hotlist[xhri].smallPhotoUrl;
                        }
                        listnum--;
                    }else if(listnum==0){
                        for(var i=0;i<10;i++){
                            var topi=document.getElementsByClassName('topi')[i],
                            detailtt=topi.getElementsByTagName('a')[0],
                            tophot=topi.getElementsByTagName('span')[0],
                            topimg=topi.getElementsByTagName('img')[0]
                            xhri=i;
                            detailtt.innerHTML=hotlist[xhri].name;
                            detailtt.title=hotlist[xhri].name;
                            tophot.innerHTML=hotlist[xhri].learnerCount;
                            topimg.src=hotlist[xhri].smallPhotoUrl;
                        }
                        listnum++;
                    }
                },5000);
            }
        }
    }
    xhr.open("get",'http://study.163.com/webDev/hotcouresByCategory.htm',true);
    xhr.send(null);
    
}

// tab实现课程切换
var tabx='10';
function programList(){
    var tab=document.getElementsByClassName('m-tab')[0],
    program=tab.getElementsByTagName('a')[0],
    design=tab.getElementsByTagName('a')[1];
    if(design.className=="tabselect f-fl"){
        program.className="tabselect f-fl";
        design.className="tab f-fl";
        tabx='10';
        loadcourse('10','20','1');
        var pagex=page.getElementsByTagName('a');
         pagex[1].className="pgselected f-fl";
        for(var i=2;i<pagex.length-1;i++){
            pagex[i].className="pagei f-fl";
        }
    }
}
function designList(){
    var tab=document.getElementsByClassName('m-tab')[0],
    program=tab.getElementsByTagName('a')[0],
    design=tab.getElementsByTagName('a')[1];
    if(program.className=="tabselect f-fl"){
        program.className="tab f-fl";
        design.className="tabselect f-fl";
        tabx='20';
        loadcourse('20','20','1');
        var pagex=page.getElementsByTagName('a');
         pagex[1].className="pgselected f-fl";
        for(var i=2;i<pagex.length-1;i++){
                pagex[i].className="pagei f-fl";
        }
    }
}
// 加载课程列表
function loadcourse(tabi,psize,pageNo){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(tabi,psize,pageNo){
        if(xhr.readyState==4){
            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                var courselist=JSON.parse(xhr.responseText);
                for(var i=0;i<20;i++){
                    var course=document.getElementsByClassName('course')[i],
                    title=course.querySelectorAll('.title')[0],
                    name=title.getElementsByTagName('a')[0],
                    dtltitle=course.querySelectorAll('.dtl-title')[0],
                    dtlname=dtltitle.getElementsByTagName('a')[0],
                    provider=course.querySelectorAll('.provider'),
                    learner=course.querySelectorAll('.learner'),
                    category=course.querySelector('.category'),
                    description=course.querySelector('.description'),
                    imgPic=course.querySelectorAll('.imgPic'),
                    price=course.querySelector('.price');
                    name.innerHTML=courselist.list[i].name;
                    name.title=courselist.list[i].name;
                    dtlname.innerHTML=courselist.list[i].name;
                    dtlname.title=courselist.list[i].name;
                    for(var j=0;j<provider.length;j++){
                        provider[j].innerHTML=courselist.list[i].provider;
                        provider[j].href=courselist.list[i].providerLink;
                    }
                    learner[0].innerHTML=courselist.list[i].learnerCount+"人在学";
                    learner[1].innerHTML=courselist.list[i].learnerCount;
                    if(courselist.list[i].categoryName==null){
                        category.innerHTML="暂无";
                    }else{
                        category.innerHTML=courselist.list[i].categoryName;
                    }
                    description.innerHTML=courselist.list[i].description;
                    for(var j=0;j<imgPic.length;j++){
                        imgPic[j].src=courselist.list[i].middlePhotoUrl;
                    }
                    if(courselist.list[i].price=='0'){
                        price.innerHTML="免费";
                        price.style.color="#39a030";
                    }else{
                        price.innerHTML="¥"+courselist.list[i].price;
                    }
                }
            }
        }
    }
    var url="http://study.163.com/webDev/couresByCategory.htm";
    url=addURLParam(url,"pageNo",pageNo);
    url=addURLParam(url,"psize",psize);
    url=addURLParam(url,"type",tabi);
    xhr.open("get",url,true);
    xhr.send(null);
}


// 页码切换
var page=document.getElementById('pager');
page.addEventListener('click', (function () {
            var getElement = function (eve, filter) {
                var element = eve.target;
                while (element) {
                    if (filter(element))
                        return element;
                    element = element.parentNode;
                }
            }
            return function (event) {
                var pagei = getElement(event, function (ele) {
                    return ((ele.className.indexOf('pagei') !== -1)||(ele.className.indexOf('pageprv') !== -1)||(ele.className.indexOf('pagenxt') !== -1));
                });
                event.preventDefault();
                var index = pagei.dataset.index;
                var indexon=index;
                var pageon=document.getElementsByClassName('pgselected f-fl')[0];
                if(index=='prv'){
                    if(pageon.dataset.index=='1'){return ;}
                    indexon=pageon.dataset.index-1;
                }else if(index=='nxt'){
                    if(pageon.dataset.index=='8'){return ;}
                    indexon=-(-pageon.dataset.index-1);
                }else{
                    indexon=pagei.dataset.index;
                }
                var pagex=page.getElementsByTagName('a');
                for(var i=0;i<pagex.length;i++){
                    if(pagex[i].dataset.index==indexon){
                        pagex[i].className="pgselected f-fl";
                    }else if((pagex[i].dataset.index!='prv')&&(pagex[i].dataset.index!='nxt')){
                        pagex[i].className="pagei f-fl";
                    }
                }
                loadcourse(tabx,'20',indexon);
            }
        })());

// 轮播图
var picindex=0,
picwrap=document.getElementsByClassName('imgwrap')[0],
picArr=picwrap.getElementsByTagName('li'),
controlwrap=document.getElementsByClassName('circlewrap')[0],
controlArr=controlwrap.getElementsByTagName('span');
// 设置动画，隔5s一次
var autoChange=setInterval(function(){
    if(picindex<picArr.length-1){
        picindex++;
    }else{
        picindex=0;
    }
    changePic(picindex);
},5000);
// 调用淡入函数和改变控制小圆点
function changePic(index){
    for(var i=0;i<picArr.length;i++){
        if(i==index){
           picArr[i].id='imgon';
        }else{
           picArr[i].id='';
        }
    }
    for(var i=0;i<controlArr.length;i++){
        if(i==index){
            controlArr[i].id='on';
        }else{
            controlArr[i].id='';
        }
    }
    fadeIn(picArr[index]);
}
// 淡入函数
function fadeIn(ele){
    ele.style.opacity=0;
    // 每次透明度变化0.1，隔50ms一次，共10次
    for(var i=1;i<=10;i++){(function(){
        var num=i*0.1;
        setTimeout(function(){
            ele.style.opacity=num;
        },i*50);
    })(i);
    }
}
// 鼠标悬停，停止切换
picwrap.addEventListener('mouseover', (function () {
    return function(){
        clearInterval(autoChange);
    }
})());
// 鼠标移出，开始切换
picwrap.addEventListener('mouseout', (function () {
    var getElement = function (eve, filter) {
        var element = eve.target;
        while (element) {
            if (filter(element))
                return element;
            element = element.parentNode;
        }
    }
    return function (event) {
        var pici = getElement(event, function (ele) {
            return (ele.className.indexOf('banner') !== -1);
        });
        picindex=pici.dataset.index;
        autoChange=setInterval(function(){
            if(picindex<picArr.length-1){
                picindex++;
            }else{
                picindex=0;
            }
            changePic(picindex);
        },5000);
    }
})());
// 点击控制器，切换到对应图片
function controller(){
    for(var i=0;i<controlArr.length;i++){(function(i){
            controlArr[i].onclick=function(){
                picindex=controlArr[i].dataset.index;
                clearInterval(autoChange);
                changePic(picindex);
                autoChange=setInterval(function(){
                    if(picindex<picArr.length-1){
                        picindex++;
                    }else{
                        picindex=0;
                    }
                    changePic(picindex);
                },5000);
            }
        })(i);
    }
}

// 兼容低版本IE
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

window.onload=function(){
    closecheck();
    attYN();
    getHotlist();
    loadcourse('10','20','1');
    controller();
}
