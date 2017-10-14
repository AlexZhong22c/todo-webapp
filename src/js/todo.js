// 全局变量,以下是初始值：
var currentCateId = 0; 
var currentChildCateId = 0;
var currentTaskId = 0; //当前任务 id


initAll();

function initAll() {
    // localStorage.clear();
    checkDataBase(); // comes from localSorage util.js
    initCategory();
    initModal();
    initTaskList();
    initMain();
}


/**
 *
 * 分类表 cate
 * ----------------------
 * id* | name | child(fk)
 * ----------------------
 *
 * 子分类表 childCate
 * ----------------------------
 * id* | pid | name | child(fk)
 * ----------------------------
 *
 * 任务表 task
 * ------------------------------------------
 * id* | pid | finished | name | date | content
 * ------------------------------------------
 */

function initCategory() {
// “cate-list”区域：
    currentCateId = 0;
    currentChildCateId = 0;
    refreshCateList();
    // 设置高亮
    $("#cate-list ul>li>ul h3:first").addClass("active");
    $('#cate-list ul li h2 i:first').removeClass("fa-folder").addClass("fa-folder-o");

// add button区域：
    // 准备好单击事件：
    $("#add").click(function() {
        $(".cover").show();
    });
    // 增置图标：
    $('.all-tasks i').addClass("fa fa-bars");
    $('.cate-title i').addClass("fa fa-bars");
    $("#add").addClass("fa fa-plus"); 
}
function refreshCateList() {
    $("#allTasks span")[0].innerHTML = queryAllTasks().length;
    
    var cates = queryAllCates();
    var cateLiContent = "";
    for (var i = 0; i < cates.length; i++) {
        cateLiContent += '<li><h2 cateid="'+cates[i].id+'"><i></i><span>'+cates[i].name+' ('+queryTasksTotalByCateId(cates[i].id)+')</span><i></i></h2>';
        if (cates[i].child != null) {
            var childCateLiContent = "";
            var childcates = queryChildCatesByIdArray(cates[i].child);
            for (var j = 0; j < childcates.length; j++) {
                childCateLiContent += '<li><h3 childcateid="'+childcates[j].id +'"><i></i><span>'+childcates[j].name+'</span> ('+childcates[j].child.length+')<i></i></h3></li>';
            }
            cateLiContent += '<ul>'+childCateLiContent+'</ul>';
        }
        cateLiContent += '</li>';
    }
    $("#cate-list")[0].innerHTML = '<ul>'+cateLiContent+'</ul>';
    
    // 准备好单击事件
    $("#cate-list ul>li>h2 span").click(function() {
        if ($(this).parent().next()) {
            $(this).parent().next().toggle(500);
        }
    });
    // 这里要不要预防拿不到h3元素呢??
    $("#cate-list ul>li>ul").delegate("h3 span","click",function(){
        $("#cate-list ul>li>ul h3").removeClass("active");
        $(this).parent().addClass("active");
        currentChildCateId = parseInt($(this).parent().attr("childcateid"));
        $('#cate-list h2 span').prev().removeClass("fa-folder-o").addClass("fa-folder");
        $(this).parents("ul").prev("h2").children("span").prev().removeClass("fa-folder").addClass("fa-folder-o");
        currentCateId =  parseInt($(this).parents("ul").prev("h2").attr("cateid"));
        
        refreshTaskListByChildCateId(currentChildCateId);
    });

    // 高亮：
    $("#cate-list ul>li>ul h3").removeClass("active");
    $('#cate-list h2 span').prev().removeClass("fa-folder-o").addClass("fa-folder");
    var h3Arr = $("#cate-list ul>li>ul h3");
    for (var i = 0; i < h3Arr.length; i++) {
        if (parseInt(h3Arr[i].getAttribute("childcateid")) == currentChildCateId) {
            addClass(h3Arr[i], "active");
            // test here  x想加完任务之后，这个cate会被激活
            // 而且删除childcate之后，这个cate的任务数没有更新
            $(h3Arr[i]).parents("ul").prev("h2").children("span").prev().removeClass("fa-folder").addClass("fa-folder-o");
            break;
        }
    }

    // 增置图标：
    $("#cate-list ul>li>h2>span").prev().addClass("fa fa-folder");
    $("#cate-list ul>li>h2>span").next().addClass("fa fa-trash-o");
    $("#cate-list ul>li>h2>span:first").next().removeClass("fa fa-trash-o");
    $("#cate-list ul>li>ul>li>h3>span").prev().addClass("fa fa-file-o");
    $("#cate-list ul>li>ul>li>h3>span").next().addClass("fa fa-trash-o");
    $("#cate-list ul>li>ul>li>h3>span:first").next().removeClass("fa fa-trash-o");

    // 配置子分类的删除按钮
    $('#cate-list>ul>li>ul>li i.fa-trash-o').click(function(){
        var targetChildCateId = parseInt($(this).parent()[0].getAttribute("childcateid"));
        deleteChildCateById(targetChildCateId);

        initCategory();
        initTaskList();
        initMain();
    });
    // 配置分类的删除按钮
    $('#cate-list>ul>li>h2>i.fa-trash-o').click(function(){
        var targetCateId = parseInt($(this).parent()[0].getAttribute("cateid"));
        deleteCateById(targetCateId);
        initCategory();
        updateModalContent();
        initTaskList();
        initMain();
    });

}
    
function initTaskList() {
    prepareStatus();
    $("#all-tasks").addClass("active");
    // 一开始初始化了全局变量currentChildCateId = 0;
    refreshTaskListByChildCateId(currentChildCateId);
    $('#task-list ul>li').removeClass("active");
    $('#task-list ul>li[taskid="0"]').addClass("active");

    currentTaskId = 0;

    $('#add-task').click(function(){
        $("#todo-name").html('<input type="text" class="input-title" placeholder="请输入标题">');
        $(".manipulate").css('display' ,"none");
        $("#task-date span").html('<input type="date" class="input-date">');
        $("#content").html('<textarea class="textarea-content" placeholder="请输入任务内容"></textarea>');
        $(".button-area").html('<span class="info"></span>                    <button class="save">保存</button>                    <button class="cancel-save">放弃</button>');
        $(".button-area").css('display',"block");
        prepareSaveOrCancelWhenAddTask();
        $('.cover2').css('display',"block");
        $('.cover2').one("click",function(){
            $('.cover2').css('display',"none");
            $('.cancel-save').trigger("click");
        });
    });
    $("#add-task").addClass("fa fa-plus");
}
function prepareStatus() {
    $("#finished-tasks").click(function(){
        $('.status button').removeClass("active");
        $(this).addClass("active");
        $("#task-list ul>li.task-done").css('display',"block");
        $("#task-list ul>li.task-todo").css('display',"none");
        $("#task-list ul").each(function(i) {
            if($(this).children().not(":hidden").length == 0) {
                $(this).prev().css('display',"none");
            } else {
                $(this).prev().css('display',"block");
            }
        });
        // 体会到each的便捷
        // var ulArr = $("#task-list ul");
        // for (var i = 0; i < ulArr.length; i++) {

        //     }
        // }

    });
    $("#unfinish-tasks").click(function(){
        $('.status button').removeClass("active");
        $(this).addClass("active");
        $("#task-list ul>li.task-done").css('display',"none");
        $("#task-list ul>li.task-todo").css('display',"block");
        $("#task-list ul").each(function(i) {
            if($(this).children().not(":hidden").length == 0) {
                $(this).prev().css('display',"none");
            } else {
                $(this).prev().css('display',"block");
            }
        });
    });
    $("#all-tasks").click(function(){
        $('.status button').removeClass("active");
        $(this).addClass("active");
        $("#task-list ul>li").css('display',"block");
        $("#task-list div").css('display',"block");
    });
}
function prepareManipulate() {
    $('.manipulate a:first').click(function(){
        var targetTaskId = $('#task-list>ul>li.active')[0].getAttribute('taskid');
        updateTaskStatusById(targetTaskId);
        $('#task-list>ul>li.active').addClass("task-done").removeClass("task-todo");
        $('#task-list>ul>li.active').children('i').removeClass("fa fa-file-o").addClass("fa fa-check");
    });
    $('.manipulate a:last').click(function(){

        if (currentTaskId != 0) {
           $("#todo-name").html('<input type="text" class="input-title" placeholder="请输入标题">');
        }
        // 和点击add task button后的效果基本相同,
        $(".manipulate").css('display' ,"none");
        $("#task-date span").html('<input type="date" class="input-date">');
        $("#content").html('<textarea class="textarea-content" placeholder="请输入任务内容"></textarea>');
        $(".button-area").html('<span class="info"></span>                    <button class="save">保存</button>                    <button class="cancel-save">放弃</button>');
        $(".button-area").css('display',"block");
        prepareSaveOrCancelWhenModifyTask(); // 和prepareSaveOrCancelWhenAddTask()基本相同

        $('.cover2').css('display',"block");
        $('.cover2').one("click",function(){
            $('.cover2').css('display',"none");
            $('.cancel-save').trigger("click");
        });
    });
}
function initMain() {
    prepareManipulate();

    refreshMainByTaskId(0);
}
function refreshMainByTaskId(taskId) {
    var targetTask = queryTaskById(taskId);
    $("#todo-name")[0].innerHTML = targetTask.name;
    $("#task-date span")[0].innerHTML = targetTask.date;
    $("#content")[0].innerHTML = targetTask.content;
}
function refreshTaskListByChildCateId(childCateId) {
    var dateArr = [];
    var TasksInChildCate = queryTasksByChildCateId(childCateId);
    // console.log(TasksInChildCate);
    for (var i = 0; i < TasksInChildCate.length; i++) {
        // 巧用indexOf()
        if (dateArr.indexOf(TasksInChildCate[i].date) == -1) {
            dateArr.push(TasksInChildCate[i].date);
        }
    }
    dateArr = dateArr.sort();
    // console.log(dateArr);

    // 这里j怕不怕改成i呢?
    var tempStr = "";
    for (var j = 0; j < dateArr.length; j++) {
        var tempTasks = queryTasksByDateInTaskArr(dateArr[j], TasksInChildCate);
        var tempStr = tempStr + '<div><i class="fa fa-bars"></i>'+ dateArr[j] +'</div>'; 
        var liStr = "";
        for (var k = 0; k < tempTasks.length; k++) {
            if (tempTasks[k].finished == true) {
                liStr += '<li taskid="'+ tempTasks[k].id +'" class="task-done"><i class="fa fa-check"></i>'+ tempTasks[k].name +'<i class="fa fa-trash-o"></i></li>';
            } else {
                liStr += '<li taskid="'+ tempTasks[k].id +'" class="task-todo"><i class="fa fa-file-o"></i>'+ tempTasks[k].name +'<i class="fa fa-trash-o"></i></li>';
            }

            // 保存整个TaskList里面的第一个task,以便等等拿到它的id
            if (j==0 && k==0) {
                var firstTask = tempTasks[k];
            }
        }
        var tempStr = tempStr+'<ul>'+liStr+'</ul>';
    }
    $("#task-list")[0].innerHTML = tempStr;

    if ($("#task-list ul>li").length > 0) {
        currentTaskId = firstTask.id;
        // 给对应id的TaskLi加active：
        var TaskLiArr = $("#task-list>ul>li");
        for (var l = 0; l < TaskLiArr.length; l++) {
            if(parseInt(TaskLiArr[l].getAttribute("taskid")) == currentTaskId) {
                addClass(TaskLiArr[l], "active");
                break;
            }
        }
        // 配置任务的删除按钮
        $('#task-list>ul>li i.fa-trash-o').click(function(){
            var targetTaskId = parseInt($(this).parent()[0].getAttribute("taskid"));
            deleteTaskById(targetTaskId,currentChildCateId);

            $("#task-list ul>li").removeClass("active");
            refreshMainByTaskId(0);
            currentTaskId = 0;

            if ($(this).parent().siblings().length == 0) {
                $(this).parent().parent().prev()[0].innerHTML = "";
            }
            $(this).parent()[0].innerHTML = "";
            refreshCateList();
        });
        
        if (childCateId === 0) {
            $('#task-list>ul>li[taskid="0"]').children(":last").css('display', "none");
        }
        refreshMainByTaskId(currentTaskId);

        $("#task-list").delegate("ul>li","click",function(){
            $("#task-list ul>li").removeClass("active");
            $(this).addClass("active");
            currentTaskId = parseInt($(this).attr("taskid"));
            refreshMainByTaskId(currentTaskId);
        });


    } else {
        currentTaskId = 0;
        refreshMainByTaskId(currentTaskId);
    }
}


function initModal() {
    updateModalContent();
    prepareModalEvent();
}
function updateModalContent() {
    var cates = queryAllCates();
    var selectContent = '<option value="-1"> [无]</option>';
    for (var i = 0; i < cates.length; i++) {
        selectContent += '<option value="' + cates[i].id + '">' + cates[i].name + '</option>';
    } 

    $("#modal-select")[0].innerHTML = selectContent;
    $("#newCateName")[0].value = "";
}
function prepareModalEvent() {
    $("#modal-foot button.cancel").click(function() {
        $(".cover").hide();
    }); 
    $("#modal-foot button.ok").click(function(event) {
        var newName = $("#newCateName")[0].value;
        var selectValue = parseInt($("#modal-select")[0].value);
        if (newName === "") {
            alert("请输入分类名称");
        } else {
            if (selectValue == -1) {
                addCate(newName);
            } else {
                addChildCate(selectValue, newName);
            }
            refreshCateList(); //初始化分类
            $(".cover").hide();
        }
        updateModalContent();
        event.stopPropagation();
    });
    $(".modal").on("click",function(event){
        // 不做任何动作
        event.stopPropagation();
    });  
    $(".cover").on("click",function(){
        $(".cover").hide();
    });     
}

// 和prepareSaveOrCancelWhenAddTask()基本相同
function prepareSaveOrCancelWhenModifyTask() {
    $('.save').click(function(){

        var title = $(".input-title")[0];
        var content = $(".textarea-content")[0];
        var date = $(".input-date")[0];
        var info = $(".info")[0];
 
        if (title != undefined && title.value === "") {
            info.innerHTML = "标题不能为空";
        } else if (date.value === "") {
            info.innerHTML = "日期不能为空";
        } else if (content.value === "") {
            info.innerHTML = "内容不能为空";
        } else {
           var taskObject = {};

           taskObject.id = currentTaskId;
           if (currentTaskId != 0) {
                taskObject.name = title.value;
           }
            taskObject.date = date.value; 
            taskObject.content = content.value;
            // console.log(taskObject);
            updateTask(taskObject);

            $(".button-area").css('display',"none");
            $(".manipulate").css('display' ,"block");
            $('.cover2').trigger("click");

            refreshMainByTaskId(currentTaskId);
            refreshTaskListAndActiveThisTask(currentTaskId);
        }
    });
    $('.cancel-save').click(function(){
        refreshMainByTaskId(currentTaskId);
        $(".button-area").css('display',"none");
        $(".manipulate").css('display' ,"block");
        $('.cover2').trigger("click");
    });
}
function prepareSaveOrCancelWhenAddTask() {
    $('.save').click(function(){
        var title = $(".input-title")[0];
        var content = $(".textarea-content")[0];
        var date = $(".input-date")[0];
        var info = $(".info")[0];
        if (title.value === "") {
            info.innerHTML = "标题不能为空";
        } else if (date.value === "") {
            info.innerHTML = "日期不能为空";
        } else if (content.value === "") {
            info.innerHTML = "内容不能为空";
        } else {
           var taskObject = {};
            taskObject.pid = currentChildCateId;
            taskObject.finished = false;
            taskObject.name = title.value;
            taskObject.date = date.value; 
            taskObject.content = content.value;
            // console.log(taskObject);
            // 在addTask()里面补充taskObject的id,并返回id
            currentTaskId = addTask(taskObject);
            refreshMainByTaskId(currentTaskId);
            refreshTaskListAndActiveThisTask(currentTaskId);
            //就为了改一个数字刷新整个cate模块有点不值：
            refreshCateList();
            $(".button-area").css('display',"none");
            $(".manipulate").css('display' ,"block");
            $('.cover2').trigger("click");
        }
    });
    $('.cancel-save').click(function(){
        refreshMainByTaskId(currentTaskId);
        $(".button-area").css('display',"none");
        $(".manipulate").css('display' ,"block");
        $('.cover2').trigger("click");
    });

}

function refreshTaskListAndActiveThisTask(taskId) {
    //因为refreshTaskListByChildCateId()无法传进currentTaskId，所以把它函数内容抄过来重写一次
    var dateArr = [];
    var TasksInChildCate = queryTasksByChildCateId(currentChildCateId);
    for (var i = 0; i < TasksInChildCate.length; i++) {
        // 巧用indexOf()
        if (dateArr.indexOf(TasksInChildCate[i].date) == -1) {
            dateArr.push(TasksInChildCate[i].date);
        }
    }
    dateArr = dateArr.sort();

    // 这里j怕不怕改成i呢?
    var tempStr = "";
    for (var j = 0; j < dateArr.length; j++) {
        var tempTasks = queryTasksByDateInTaskArr(dateArr[j], TasksInChildCate);
        var tempStr = tempStr + '<div><i class="fa fa-bars"></i>'+ dateArr[j] +'</div>'; 
        var liStr = "";
        for (var k = 0; k < tempTasks.length; k++) {
            if (tempTasks[k].finished == true) {
                liStr += '<li taskid="'+ tempTasks[k].id +'" class="task-done"><i class="fa fa-check"></i>'+ tempTasks[k].name +'<i class="fa fa-trash-o"></i></li></li>';
            } else {
                liStr += '<li taskid="'+ tempTasks[k].id +'" class="task-todo"><i class="fa fa-file-o"></i>'+ tempTasks[k].name +'<i class="fa fa-trash-o"></i></li></li>';
            }
        }
        var tempStr = tempStr+'<ul>'+liStr+'</ul>';
    }
    $("#task-list")[0].innerHTML = tempStr;

    currentTaskId = taskId;
    // 给对应id的TaskLi加active：
    var TaskLiArr = $("#task-list>ul>li");
    for (var l = 0; l < TaskLiArr.length; l++) {
        if(parseInt(TaskLiArr[l].getAttribute("taskid")) == currentTaskId) {
            addClass(TaskLiArr[l], "active");
            break;
        }
    }
    // 去掉默认任务的删除按钮
    if (currentChildCateId === 0) {
        $('#task-list>ul>li[taskid="0"]').children(":last").css('display', "none");
    }
    $("#task-list").delegate("ul>li","click",function() {
        $("#task-list ul>li").removeClass("active");
        $(this).addClass("active");
        currentTaskId = parseInt($(this).attr("taskid"));
        refreshMainByTaskId(currentTaskId);
    });

    // 配置任务的删除按钮
    $('#task-list>ul>li i.fa-trash-o').click(function(){
        var targetTaskId = parseInt($(this).parent()[0].getAttribute("taskid"));
        deleteTaskById(targetTaskId,currentChildCateId);

        $("#task-list ul>li").removeClass("active");
        refreshMainByTaskId(0);
        currentTaskId = 0;
        // console.log($(this).parent()[0].getAttribute("taskid"));
        if ($(this).parent().siblings().length == 0) {
            $(this).parent().parent().prev()[0].innerHTML = "";
        }
        $(this).parent()[0].innerHTML = "";
        refreshCateList();
    });   
}


