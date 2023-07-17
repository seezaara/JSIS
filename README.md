<p align="center" width="20%">
    <img src="https://raw.githubusercontent.com/seezaara/jsis/main/doc/ico.svg"> 
</p>

# Jsis
easy fast realtime reactive javascritp framework, truly JS it IS ;)
 
# how to use
add this code to your html page

```html
    <script src="https://raw.githubusercontent.com/seezaara/jsis/main/min.js"></script>  
```

# example
how to crate main html file

```html
<!DOCTYPE html>
<html>

<head>
    <script src="https://raw.githubusercontent.com/seezaara/jsis/main/min.js"></script>
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

# example
simple sample

```html
<!DOCTYPE html>
<html>

<head>
    <script src="https://raw.githubusercontent.com/seezaara/jsis/main/min.js"></script>
</head>

<body>
    <pre id="myapp">
    <script>
        var text = '<b>{"b"}old</b> not bold <b>bold</b>'
        var promise = new Promise(function (res, reg) { setTimeout(function () { reg({ mess: 'ready', color: "green" }); }, 2000); })
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
                forof                :<span :for="var i  of list">index:{i} </span><br> 
                forin                :<span :for="var i  in obj">index:{i +"="+ obj[i]} </span><br> 
                

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
        </pre>
    <script>
        const myapp = document.querySelector("#myapp")
        Jsis.create(myapp)
    </script>
</body>

</html>
```
# licence
 <p>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://www.youtube.com/@seezaara">created by seezaara</a>
</p> 
