# ToDoApp-IFE2015
完成了百度IFE2015的 [task3](https://github.com/baidu-ife/ife/tree/master/2015_spring/task/task0003) ，实现了一个 ToDo 的单页应用，功能颇为强大。

使用 localStorage 存储数据，JSON 模拟数据表，实现了分类和待办状态的改变，具有良好的交互体验。

博文地址：https://alexzhong22c.github.io/2017/02/17/todo-app/

在线预览：https://alexzhong22c.github.io/ToDoApp-IFE2015/

## 知识收获

### 自适应高度布局

分为上中下三栏，中间的一栏自适应浏览器高度。这是参考了横向的三栏布局来写的。

- 中间一栏要在外面包一层div，如果外面本来就有一层div这种布局就非常合适。上栏和下栏用绝对定位即可。
- 外面的这层div使用大面积的padding

### 在JavaScript 中创建HTML元素，用createElement()还是innerHTML好一点？

- 最叼的好像是 使用[模板技术](https://github.com/xwcoder/template)，其实我的静态博客用的就是这种。
- 在用js代码的循环创建元素的时候就顺便一个个绑定好事件这是一种比较简单的思路，这样就不用给每个元素增加id或者class了。这时候用createElement来创建元素就比较方便绑定事件，而如果用innerHTML来创建元素的话肯定不能在形成元素的循环里面给元素绑定事件了，这样太硬编码了。


> 《高性能JavaScript》：
> - 如果在对性能有苛刻要求更新一大段的HTML，innerHTML在大多数浏览器中执行更快。在旧版本浏览器中innerHTML方法更快，在基于Webkit内核却相反。
> - 对于大多数日常操作而言，差异不大，根据代码可读性、可维护性、团队习惯、代码风格来决定采用哪种方法。
> - 某答主说：**他一般大段就使用innerHTML了，而用dom创建单个元素或少量元素。 **
> - 或者DOM结构嵌套的级数比较多的就用innerHTML
> - 如果要使用createElement()，强烈推荐一下createDocumentFragment()
>   - [documentFragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment) 被所有主流浏览器支持，甚至是IE 6。所以，没有理由不用。

### html属性用双引号、使用小写英文

- **HTML4标准里没有单引号的对应实体，** 所以单引号里写单引号很麻烦。后来XML规范才加入了' 并由XHTML 1.0引入HTML。不过考虑到兼容性，前端几乎从来不写。
  - 刚才在单引号里面写单引号只能用实体不能用反斜杠转移字符，根据HTML标准，反斜杠是不行的。
- **而JS中字符串用单引号，其实可能是HTML属性用双引号的结果。**
- 另外，一般大家惯用的做法是 HTML 用双引号，JS 用单引号的原因是，这样在 JS 中拼 HTML 片段不用转义：
  - `elem.innerHTML = '<div class="post"></div>';`
  - 当然你要反过来也可以，但不是主流做法。
- HTML属性不仅仅只有URL，另外引号出现在URL也是合法的。
- 根据W3Cschool的说法，**要求属性和属性值使用小写，属性值应该始终被包括在引号内。**
  - 用innerHTML来创建taskid=1和cateid=0这种属性好像没有用啊，因为浏览器自动解析成：taskid="1"和cateid="0"

### ul里面能放除了li的其他标签吗？

不能，`<ul>`里面只能放`<li>`。但是`<li>`里面可以放`<hx>`,`<p>`等标签。

ul里面放其他标签，不光不符合语义，在IE7- 里面也会有问题：

如果`<other>`标签前面有`<li>`标签，浏览器会认为`<other>`为`<li>`的子节点。

### box-shadow

是CSS3里面的属性。只要shadow不占太多px的地方，用一下还是非常好的

### JQuery

- JQuery的`not()`方法非常好用，`each()`也非常好


- 在绑定事件 函数中的 JQuery选择器 在函数触发后才会去选择对象
- 像这个App中分类列表的单击交互，如果想要只有被单击选择的HTML元素有 高亮，那么在绑定单击事件来响应单击选择的时候，记得先清除所有同类HTML元素的 高亮

#### JQuery中 this 和 $("this")有区别：

[JQuery中 this 和 $("this")有区别](http://www.jb51.net/article/57376.htm)

如果你要使用html元素本身的属性或方法就需要使用this,如果你要使用jQuery包装后的方法或属性就要$(this),一般则有如下的关系.

```
$(this)[0] == this;
```

上文的代码是要使用this的地方是要调用表单form的有reset方法,而这一方法jQuery没有包装支持,所以才有this.reset(),也可以使用$(this)[0].reset();

------

关于什么时候使用二者?可以看如下例子:

```
$('a').click(function(){
        this.innerHTML==$(this).html()=='jQuery';//三者是一样的.
        this.getAttribute('href')==this.href==$(this).attr('href')//三者是一样的;
        this.getAttribute('target')==this.target==$(this).attr('target')//三者是一样的;
        this.getAttribute('data-id')==$(this).attr('data-id')//二者是一样的;
    });
```

### caller的经典用法

注：**该特性是非标准的，请尽量不要在生产环境中使用它！**

![](http://olqa2s510.bkt.clouddn.com/caller%E7%9A%84%E7%BB%8F%E5%85%B8%E7%94%A8%E6%B3%95.png)

## 匠心勿失

### HTML+CSS

- [CSS命名惯例语义化](http://blog.bingo929.com/CSS-coding-semantic-naming.html)
- 把需要的li全都设成了``cursor:pointer``
- 虽然DOM结构是由js代码渲染的，在HTML留下一些**template**方便参考和编写代码
- 将颜色抽象成单独的class，方便更换颜色：

```
.white-bg {background: #FFFFCC;}
.black-bg {background: #3F3A39;}
.green-bg {background: #CFE8CC;}
.blue-bg {background: #5D6684;}
.grey-bg {background: #E9E9E9;}
.lt-blue-bg {background: #DADADA;}
```

我认为，只有占**大块区域**的元素才用色彩的class来设置**背景颜色**。因为如果要上色的元素很多的话，或者元素会短时间内存在再消失的话，一个一个加class就很麻烦。

### JavaScript

- 优化了 JavaScript 函数的命名，使得风格统一，语义明确。
  - 这个App里面，用来控制视图层的函数最好用refresh来命名，用update命名的函数用于更新数据库的信息


- 一般留下数组index为0的位置来存放一些默认的数组元素。比如存储“分类”的数组就将“默认分类”设为是它的0号元素。
- 深刻感受到使用主键等等概念管理数据库的简便
- 如果是 JavaScript 对象字面量，键值对的 键 最好不要用""包着，转成JSON的时候 键 会自动被""包上
- **util.js**是基于前面的小任务写的，它的功能很薄弱。例如`$(#modal-foot button)`返回来的只是一个元素对象，不合理，所以为了省事我直接用JQuery库就好了。

### 改进代码

```
function queryCateById(id) {
    var allCates = queryAllCates();
    var result = null;
    for (var i = 0; i < allCates.length; i++) {
        if (allCates[i].id == id) {
            result = allCates[i];
            break;
        }
    }
    return result;
}
```

简化为：

```
function queryCateById(id) {
    var allCates = queryAllCates();
    for (var i = 0; i < allCates.length; i++) {
        if (allCates[i].id == id) {
            return allCates[i];
        }
    }
}
```

### 容易犯的错误

- JQuery中使用id选择器返回的也是**元素数组**。

```
console.log($("#modal-foot"))// 元素数组
console.log($("#modal-foot")[0])// 这才是想要的元素
```

- HTML会自动忽略空格，要空格请用``&nbsp;``

------

在JQuery中，$(selector)[0]中的[0]会将JQuery对象转化为JavaScript对象。所以onclick有两种写法：

```
$("#modal-foot button.cancel")[0].onclick = function() {
	// ```
}; 
///////分割线
$("#modal-foot button.cancel").click(function() {
	$(".cover").hide();
}); 
// $(selector).click(function() {});
```

另外还有一个例子可以看一下：

```
$(".cover").show();
$(".cover").css("display","block");
$(".cover")[0].style.display = "block";
```

### 优化命名

**函数名**中包含"all"还是挺有用的，但是**函数中的变量名**包含"all"就没什么作用，如果是数组用"arr"命名就可以了。

比如：

```
// 函数名中包含all，比较容易与其他类似的函数区分
function queryAllCates() {
    return JSON.parse(localStorage.cate);
}
```

再比如：

```
function queryCateById(id) {
    var allCates = JSON.parse(localStorage.cate);
    for (var i = 0; i < allCates.length; i++) {
        if (allCates[i].id == id) {
            return allCates[i];
        }
    }
}
// 函数内变量名带all好像也没什么用。allCates还不如直接叫cates或者叫catesArr
```

但是：

如果用addNewTask作为函数名，肯定不够用addTask作为函数名好。

## 发现的bug，找时间再fix

1. 火狐浏览器不实现`<input type="date">`
2. 实际上该应用没有做移动端的适配，所以手机横屏来看会好一点

## 最后：

>[color design](https://alexzhong22c.github.io/color-design-22c/color-design.html)：https://alexzhong22c.github.io/color-design-22c/color-design.html
>
>如果各位看官喜欢的话留一个Star吧！

