<p align="center" width="20%">
    <img src="https://raw.githubusercontent.com/seezaara/jsis/main/doc/ico.svg"> 
</p>

# what is Jsis ?
easy fast realtime reactive javascritp framework

# why you shuld use Jsis ?

- it's realtime and reactive
- it's very fast and optimized
- it's very compact (30kb)
- it's very easy to learn 
- it's very fast to write
- you can use other framework and library and vanilla JS

** Indeed JS it IS ;)**
  
# how to use
add this code to your html page

```html
<script src="https://github.com/seezaara/jsis/releases/latest/download/jsis.min.js"></script>
```

**native varables:**

- **_**: non reactive object in local component
- **__**: reactive object in local component
- **global**: non reactive global (in all components) 
- **_global**: reactive glbal object (in all components)
- **prop**: non reactive object prop input of component


**native attribute:**

- **:if**= if the value was false delete element. type: boolean
- **:elseif**= This attribute must be used in an element that is preceded by the element that contains :if attribute. if the :if attribute contains false value then check :elseif value. type: boolean 
- **:else**= This attribute must be used in an element that is preceded by the element that contains :if or :elseif attribute. type: none 
- **:wait**= the value contains the Promise async object. delete after emitted resolve or reject. type: Promise
- **:then**= this attribute must be used in an element that is preceded by the element that contains :wait attribute. and show after promise emitted resolve. type: none 
- **:catch**= this attribute must be used in an element that is preceded by the element that contains :then attribute. and show after promise emitted reject. type: none 
- **:for**= this attribute repeat the element and value must follow the syntax of javascript for operator. type: for
- **:class**= this attribute use for reactive calss. type: object,string
- **:style**= this attribute use for reactive calss. type: object,string
- **:scoped**= this attribute just use in comp element. if component not contains this attribute, all of native variable of parent component share with the component. type: none
- **:prop**= this attribute just use in comp element. any data use in this attribute value, transfer to the "prop" variable of the component. type: any

# example
how to crate main html file

```html
<!DOCTYPE html>
<html>

<head>
    <script src="https://github.com/seezaara/jsis/releases/latest/download/jsis.min.js"></script>
</head>

<body>
    <div id="myapp">
        ... your code ...
    </div>
    <script>
        const myapp = document.querySelector("#myapp")
        Jsis.create(myapp)
    </script>
</body>

</html>
```
text 

```html
<span>your screen width is {window.screen.width}px and your screen height is {window.screen.height}px</span> 
```

simple reactive 

```html
<span :load="__.count = 0" :onclick="count++">you {count} Times clicked me</span> 
```
if

```html
<span :load="__.toggle = true" :onclick="toggle = !toggle">click to  the box</span>
<br> 
<span :if="toggle">open</span> 
<span :else>close</span> 
```

promise await/async

```html
<button :load="__.link = fetch('https://ipinfo.io/json')" :onclick="link = fetch('https://ipinfo.io/json')">refresh</button>
<br>
<span :wait="link">please wait</span>
<span :then="req">
    <span :wait="req.json()">{"wait for parse"}</span>
    <span :then="data">
        your ip is {data.ip} and you location is {data.city} {data.region} {data.country}
    </span>
    <span :catch="err">{console.log(err) , "error cannot parse json"}</span>
</span>
<span :catch="err">{console.log(err) , "error cannot receive data"}</span>
```

atterbiute / class 

```html
<style>
    .tablink {
        background-color: #555;
        color: white;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        font-size: 17px;
        width: 25%;
    }

    .tabcontent {
        color: white;
        display: none;
        padding: 100px 20px;
        height: 100%;
        background-color: green;
    }

    .tablink.active {
        background-color: green;
    }

    .tabcontent.active {
        display: block;
    }
</style>
<button class="tablink" :onclick="__.tab = 'Home'">Home</button>
<button class="tablink" :onclick="__.tab = 'News'">News</button>
<button class="tablink" :onclick="__.tab = 'Contact'">Contact</button>
<button class="tablink" :onclick="__.tab = 'About'">About</button>
<div :class="__.tab == 'Home' ? 'active tabcontent' : 'tabcontent'">
    <h3>Home</h3>
    <p>Home is where the heart is..</p>
</div>
<div :class="{active:__.tab == 'News'}" class="tabcontent">
    <h3>News</h3>
    <p>Some news this fine day!</p>
</div>
<div :class="{active:__.tab == 'Contact'}" ct" class="tabcontent">
    <h3>Contact</h3>
    <p>Get in touch, or swing by for a cup of coffee.</p>
</div>
<div :class="{active:__.tab == 'About'}"" class=" tabcontent">
    <h3>About</h3>
    <p>Who we are and what we do.</p>
</div>
```

events

```html 
<span :onclick="alert('clicked !')" :load="alert('please click on text: '+this.innerText)">click me!</span>
```

component

```html
<comp :src="'./comp.html'" :prop="{id:12}" :scoped></comp> 
```

all in one example

```html
<!DOCTYPE html>
<html>

<head>
    <script src="https://github.com/seezaara/jsis/releases/latest/download/jsis.min.js"></script>
</head>

<body>
    <pre id="myapp">
    <script>
        var promise = new Promise(function (res, reg) { setTimeout(function () { res({ mess: 'ready', color: "green" }); }, 2000); })
        var list = [1, 3, 4, 6]
        var obj = { a: 1, b: 2 }
    </script>
                text                 :<span>1 + 2</span>
                textscript           :<span>{ 1 + 2 }</span>
                textscript safe text :<code>{ '&lt;b&gt;{"b"}old&lt;/b&gt; not bold &lt;b&gt;bold&lt;/b&gt;' }</code>
                textscript safe text :<code>{ text }</code>
                textscript HTML      :<code>${ '&lt;b&gt;{"b"}old&lt;/b&gt; not bold &lt;b&gt;bold&lt;/b&gt;' }</code>
                textscript HTML      :<code>${ text }</code>

                wrong textscript     :<code>${ '<b>{"b"}old</b> not bold <b>bold</b>' }</code>
                wrong textscript     :<code>{ '<b>{"b"}old</b> not bold <b>bold</b>' }</code>

                if                   :<span :if="false">false</span>
                elseif               :<span :elseif="false">false</span>
                elseif               :<span :elseif="true">true</span>
                else                 :<span :else>else</span>
 
                wait                 :<span :wait="promise" :style="{background: 'yellow'}">{"wait"}</span>
                then                 :<span :then="data" :style="{background: data.color}">{data.mess}</span>
                catch                :<span :catch="err">{console.log(err) , "error"}</span>
                
                for                  :<span :for="var i = 0; i < 5; i++">index:{i} </span><br> 
                for deep             :<span :for="var i = 0; i < 5; i++">
                                            <span :for="var j = 0; j < 5; j++">index:{i},{j} </span>
                                     </span>
                                     <br> 
                forof                :<span :for="var i of list">index:{i} </span><br> 
                forin                :<span :for="var i in obj">index:{i +"="+ obj[i]} </span><br> 
                

                class                :<span class="green" :class="true ? 'blue' : '' ">class</span>
                class2               :<span class="black" :class="{blue:true, red:false}">class2</span>

                style                :<span :style="true ? 'background:blue' : '' ">style</span>
                style2               :<span :style="{background: 'red'}">style2</span>

                attributes           :<span :src="window.img = 'img.png',img">attributes</span>
                attributes2          :<span :id="true ? 'myid' : ''">attributes2</span>
                attributes3          :<span :id="{myid: false}">attributes3</span>  

                expouse event        :<span onclick="alert('clicked !')">attributes3</span>
                event listiner       :<span :onclick="alert('clicked !')">attributes3</span>
                onload               :<span :load="console.log(this)">attributes3</span> 
                comp1                :<comp src="./comp.html"></comp>
                comp2                :<comp :src="'./comp.html'" :scoped></comp>
                comp3                :<comp :src="'./comp.html'" :prop="{id:12}" :scoped></comp>
        </pre>
    <script>
        const myapp = document.querySelector("#myapp")
        Jsis.create(myapp, { text: '<b>{"b"}old</b> not bold <b>bold</b>' })
    </script>
</body>

</html>
```

# licence
 <p>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://www.youtube.com/@seezaara">created by seezaara</a>
</p> 
