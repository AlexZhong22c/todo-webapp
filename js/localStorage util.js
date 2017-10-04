//*******数据库设计************

/**
 *
 * 使用数据库的思想，构建3张表。
 * cateJson 分类
 * childCateJson 子分类
 * taskJson 任务
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
function checkDataBase() {
    // 1.当一开始没有数据显示时，弄一些默认数据。
    if (!localStorage.cate || !localStorage.childCate || !localStorage.task) {
        var cateTable = [
            {
                id: 0,
                name: "默认分类",
                child:[0]
            }
        ];

        var childCateTable = [
            {
                id: 0,
                pid: 0,
                name: "默认子分类",
                child:[0,1]
            }
        ];

        var taskTable = [
            {
                id: 0,
                pid: 0,
                finished: true,
                name: "使用说明",
                date: "2017-01-20",
                content: "这是一个To-Do List，待办事项列表App：<br>本应用为离线应用，数据将存储在浏览器的本地<br>手机端横屏使用更佳<br><br>左侧为文件夹结构的分类列表<br>中间为当前分类下的任务列表<br>右侧为任务的内容详情<br><br>有 添加删除分类，添加删除任务，修改任务，以及标记任务是否已完成 等功能<br><br>by <a target='_blank' href='https://github.com/AlexZhong22c/ToDoApp-IFE2015'>az22c</a> with <a target='_blank' href='https://alexzhong22c.github.io/color-design-22c/color-design.html'>color</a><br>2017年2月"
            },
            {
                id: 1,
                pid: 0,
                finished: false,
                name: "随便写写",
                date: "2017-01-22",
                content: "随便写写。"
            }

        ];

        // 2.将默认数据转化为Json格式，并存进数据库。
        localStorage.cate = JSON.stringify(cateTable);
        localStorage.childCate = JSON.stringify(childCateTable);
        localStorage.task = JSON.stringify(taskTable);
    }
}
/**
 * query
 */
// queryAll: 
function queryAllCates() {
    return JSON.parse(localStorage.cate);
}
function queryAllChildCates() {
    return JSON.parse(localStorage.childCate);
}
function queryAllTasks() {
    return JSON.parse(localStorage.task);
}

// queryById: 
function queryCateById(id) {
    var cates = JSON.parse(localStorage.cate);
    for (var i = 0; i < cates.length; i++) {
        if (cates[i].id == id) {
            return cates[i];
        }
    }
}
function queryChildCateById(id) {
    var childCates = JSON.parse(localStorage.childCate);
    for (var i = 0; i < childCates.length; i++) {
        if (childCates[i].id == id) {
            return childCates[i];
        }
    }
}
function queryChildCatesByIdArray(idArr) {
    var childCateArr = [];
    for (var i = 0; i < idArr.length; i++) {
       childCateArr.push(queryChildCateById(idArr[i]));
    }
    return childCateArr;
}
function queryTaskById(id) {
    var tasks = JSON.parse(localStorage.task);
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
}
function queryTasksByChildCateId(childCateId) {
    var tasks = JSON.parse(localStorage.task);
    var taskArr = [];
    var tempChildCate = queryChildCateById(childCateId);
    console.log(tempChildCate);
    var tempTaskIdArr = tempChildCate.child;

    if (tempTaskIdArr.length > 0) {
        for (var i = 0; i < tempTaskIdArr.length; i++) {
            taskArr.push(queryTaskById(tempTaskIdArr[i]));
        }        
    }
    return taskArr;
}
function queryTasksByDateInTaskArr(dateStr, taskArr) {
    var resultArr = [];
    for (var i = 0; i < taskArr.length; i++) {
        if(taskArr[i].date == dateStr) {
            resultArr.push(taskArr[i]);
        }
    }
    return resultArr;
}
function queryTasksTotalByCateId(cateId) {
    var tasksTotal = 0;
    var tempChildCateArr =  queryChildCatesByIdArray(queryCateById(cateId).child);
    for (var i = 0; i < tempChildCateArr.length; i++) {
        tasksTotal += tempChildCateArr[i].child.length;
    }
    return tasksTotal;
}

/**
 * add
 */
function addCate(name) {
    var cates = JSON.parse(localStorage.cate);
    var cateIdArr = [];
    var newCateId = -1;
    for (var i = 0; i < cates.length; i++) {
        cateIdArr.push(cates[i].id);
    }
    // id数组按照数值大小升序排列
    cateIdArr = cateIdArr.sort(compareNumbers);
    // j的确是应该从1开始，而不是0
    for (var j = 1; j < cateIdArr.length; j++) {
        if (cateIdArr[j] - cateIdArr[j-1] >1) {
            newCateId = cateIdArr[j-1] + 1;
            break;
        }
    }
    if (j == cateIdArr.length) {
        newCateId = cateIdArr.length;
    }

    var newCate = {};
    newCate.id = newCateId;
    newCate.name = name;
    newCate.child = [];

    cates.push(newCate);
    localStorage.cate = JSON.stringify(cates);
}
function addChildCate(pid, name) {
    var childCates = JSON.parse(localStorage.childCate);
    var childCateIdArr = [];
    var newChildCateId = -1;
    for (var i = 0; i < childCates.length; i++) {
        childCateIdArr.push(childCates[i].id);
    }
    // id数组按照数值大小升序排列
    childCateIdArr = childCateIdArr.sort(compareNumbers);
    // j的确是应该从1开始，而不是0
    for (var j = 1; j < childCateIdArr.length; j++) {
        if (childCateIdArr[j] - childCateIdArr[j-1] >1) {
            newChildCateId = childCateIdArr[j-1] + 1;
            break;
        }
    }
    if (j == childCateIdArr.length) {
        newChildCateId = childCateIdArr.length;
    }

    var newChildCate = {};
    newChildCate.id = newChildCateId;
    newChildCate.pid = pid;
    newChildCate.name = name;
    newChildCate.child = [];

    childCates.push(newChildCate);
    localStorage.childCate = JSON.stringify(childCates);
    console.log("addcc:"+localStorage.childCate);

     // 同时更新数据库中 分类表 中的child
    updateCateWhenAddChildCate(pid, newChildCate.id);
}
function addTask(newTaskObject) {
    var tasks = JSON.parse(localStorage.task);
    var taskIdArr = [];
    var newTaskId = -1;
    for (var i = 0; i < tasks.length; i++) {
        taskIdArr.push(tasks[i].id);   
    }
    // id数组按照数值大小升序排列
    taskIdArr = taskIdArr.sort(compareNumbers);
    // j的确是应该从1开始，而不是0
    for (var j = 1; j < taskIdArr.length; j++) {
        if (taskIdArr[j] - taskIdArr[j-1] >1) {
            newTaskId = taskIdArr[j-1] + 1;
            break;
        }
    }
    if (j == taskIdArr.length) {
        newTaskId = taskIdArr.length;
    }

    newTaskObject.id = newTaskId;
    tasks.push(newTaskObject);
    localStorage.task = JSON.stringify(tasks);

    updateChildCateWhenAddTask(newTaskObject.pid, newTaskObject.id); //更新子分类的 child 字段
    return newTaskId; // 将当前任务 id 返回，方便调用
}
/**
 * update
 */
function updateCateWhenAddChildCate(id, childId) {
    var cates = JSON.parse(localStorage.cate);
    for (var i = 0; i < cates.length; i++) {
        if (cates[i].id == id) {
            cates[i].child.push(childId);
            break;
        }
    }
    localStorage.cate = JSON.stringify(cates);
}
function updateChildCateWhenAddTask(id, childId) {
    var childCates = JSON.parse(localStorage.childCate);
    for (var i = 0; i < childCates.length; i++) {
        if (childCates[i].id == id) {
            childCates[i].child.push(childId);
            break;
        }
    }
    localStorage.childCate = JSON.stringify(childCates);
}

// taskObject:id name date content
function updateTask(taskObject) {
    var tasks = JSON.parse(localStorage.task);
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == taskObject.id) {
            if (currentTaskId != 0) {
                tasks[i].name = taskObject.name;
            }
            
            tasks[i].date = taskObject.date;
            tasks[i].content = taskObject.content;
        }
    }    
    localStorage.task = JSON.stringify(tasks);
}
function updateTaskStatusById(id) {
    var tasks = JSON.parse(localStorage.task);
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].finished = true;
            break;
        }
    }
    localStorage.task = JSON.stringify(tasks);   
}
function updateCateWhenDelChildCate(cateId, childCateId) {
    console.log("ci:"+cateId+",cci:"+childCateId);
    var cates = JSON.parse(localStorage.cate);
    for (var i = 0; i < cates.length; i++) {
        if (cates[i].id == cateId) {
            var result = cates[i].child;
            var targetIndex = cates[i].child.indexOf(childCateId);
            result = result.slice(0, targetIndex).concat(result.slice(targetIndex+1));
            cates[i].child = result;
            localStorage.cate = JSON.stringify(cates); 
            break;
        }
    }
}
function updateChildCateWhenDelTask(childCateId, taskId) {
    var childCates = JSON.parse(localStorage.childCate);
    for (var i = 0; i < childCates.length; i++) {
        if(childCates[i].id == childCateId) {
            var result = childCates[i].child;
            var targetIndex = childCates[i].child.indexOf(taskId);
            result = result.slice(0, targetIndex).concat(result.slice(targetIndex+1));
            childCates[i].child = result;
            localStorage.childCate = JSON.stringify(childCates); 
            break;
        }
    }     
}
/**
 * delete
 */
function deleteTaskById(taskId, childCateId) {
    var result = [];
    var allTasksArr = queryAllTasks();
    for (var i = 0; i < allTasksArr.length; i++) {
        if (allTasksArr[i].id == taskId) {
            result = allTasksArr.slice(0, i).concat(allTasksArr.slice(i+1));
            // result = deleteInArray(allTasksArr, i);
        }
    }
    localStorage.task = JSON.stringify(result); //save
    updateChildCateWhenDelTask(childCateId, taskId);
}
function deleteTaskByIdArr(taskIdArr) {
    // 服务于deleteChildCateById
    // 在删除childCate的时候这个函数被调用，所以不用再updateChildCateWhenDelTask
    var allTasksArr = queryAllTasks();
    for (var i = 0; i < taskIdArr.length; i++) {
        for (var j = 0; j < allTasksArr.length; j++) {
            if (allTasksArr[j].id == taskIdArr[i]) {
                // concat和slice之后一定要找一个变量承接结果
               allTasksArr = allTasksArr.slice(0, j).concat(allTasksArr.slice(j+1));
               break; 
            }
        }
    }

    localStorage.task = JSON.stringify(allTasksArr); //save
}
function deleteChildCateById(childCateId) {
    var result = [];
    var cateId = -1;
    var taskIdArr = [];
    var allChildCate = queryAllChildCates();
    for (var i = 0; i < allChildCate.length; i++) {
        if (allChildCate[i].id == childCateId) {
            result = allChildCate.slice(0, i).concat(allChildCate.slice(i+1));
            cateId = allChildCate[i].pid;
            taskIdArr = allChildCate[i].child;
        }
    }
    localStorage.childCate = JSON.stringify(result);
    deleteTaskByIdArr(taskIdArr);
    updateCateWhenDelChildCate(cateId, childCateId);
}
function deleteCateById(cateId) {
    var result = [];
    var allCates = queryAllCates();
    for (var i = 0; i < allCates.length; i++) {
        if (allCates[i].id == cateId) {
            result = allCates.slice(0, i).concat(allCates.slice(i+1));
            
            var childCateArr = queryChildCatesByIdArray(allCates[i].child);
            var taskIdArr = [];
            for (var j = 0; j < childCateArr.length; j++) {
                taskIdArr = taskIdArr.concat(childCateArr[j].child);
            }
            deleteTaskByIdArr(taskIdArr);
            deleteChildCateByIdArr(allCates[i].child);
            break;
        }
    }
    localStorage.cate = JSON.stringify(result);
}

function deleteChildCateByIdArr(idArr) {
    // 服务于deleteCateById
    var childCates = queryAllChildCates();
    for (var i = 0; i < idArr.length; i++) {
        for (var j = 0; j < childCates.length; j++) {
            if (childCates[j].id == idArr[i]) {
                // concat和slice之后一定要找一个变量承接结果
               childCates = childCates.slice(0, j).concat(childCates.slice(j+1));
               break; 
            }
        }
    }
    localStorage.childCate = JSON.stringify(childCates);
}






// localStorage.clear();
listAllStorage();
function listAllStorage() {
    console.log("=============listAllStorage==============");
    for (var i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        var value = localStorage.getItem(name);
        console.log("name:\n\t" + name);
        console.log("value:\n\t" + value);
        console.log("---------------------");
    }
    console.log("=============listAllStorage==End=========");
}

