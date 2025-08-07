<p align="center" width="20%">
    <img src="https://raw.githubusercontent.com/seezaara/jsis/main/doc/ico.svg"> 
</p>

# What is Jsis (JavaScript Is Simple) ?
JSIS is a fast performance, reactive JavaScript framework designed for developers who want the simplicity of vanilla JS without the hassle of manually managing the DOM and templates. It works with just HTML, requiring minimal separate scripts, making it lightweight and easy to use and it's Realtime and **`NOT NEED TO COMPILE`**

# Why Should You Use Jsis?

- **Realtime and Reactive**: Automatically updates your UI based on data changes.
- **Optimized Performance**: Very fast and lightweight, only 10KB.
- **Compact and Easy to Learn**: Simplified syntax for rapid development.
- **Interoperable**: Works with other frameworks, libraries, and vanilla JavaScript.

**Indeed, JS it IS!**

# How to Use
Add the following script to your HTML page:

```html
<script src="https://github.com/seezaara/jsis/releases/latest/download/jsis.min.js"></script>
```

### Native Variables:

- **_**: Non-reactive object in the local component.
- **__**: Reactive object in the local component.
- **_$**: Non-reactive global object shared across components.
- **__$**: Reactive global object shared across components.
- **prop**: Non-reactive input props passed to the component.

### Native Attributes:

- **:if**: Removes the element if the value is false (type: boolean).
- **:elseif**: Used after a `:if`. Checks the value if `:if` is false (type: boolean).
- **:else**: Used after a `:if` or `:elseif` if they are false (type: none).
- **:wait**: Waits for a Promise. Removes the element after resolve or reject (type: Promise).
- **:then**: Used after `:wait` to display content on resolve (type: none).
- **:catch**: Used after `:then` to display content on reject (type: none).
- **:for**: Loops and repeats the element. Value must follow JavaScript loop syntax (type: for).
- **:class**: Reactive class binding (type: object, string).
- **:style**: Reactive style binding (type: object, string).
- **:global**: Used in components to limit variable sharing with the parent (type: none).
- **:prop**: Passes data to the component’s `prop` variable (type: any).

# Examples

### Main HTML File

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://github.com/seezaara/jsis/releases/latest/download/jsis.min.js"></script>
</head>
<body>
    <div id="myapp" JSIS>
        ... your code ...
    </div> 
</body>
</html>
```
or 

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
        const myapp = document.querySelector("#myapp");
        Jsis.create(myapp);
    </script>
</body>
</html>
```
---

### Dynamic Text (Comparison)

**Jsis:**
```html
<span>Your screen width is {window.screen.width}px and height is {window.screen.height}px</span>
```

**Vue:**
```html
<template>
  <span>Your screen width is {{ screenWidth }}px and height is {{ screenHeight }}px</span>
</template>
<script>
export default {
  data() {
    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };
  }
};
</script>
```

**React:**
```jsx
import React from 'react';
export default function App() {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);

  return (
    <span>Your screen width is {screenWidth}px and height is {screenHeight}px</span>
  );
}
```
 
---

## Dynamic Text (Comparison with HTML Rendering)
 
**Jsis:**
```html
<script>
  var text = '<b>{"b"}old</b> not bold <b>bold</b>';
</script>
<!-- This will escape HTML, rendering it as Safe plain text -->
<code>{ text }</code>
<!-- Embedding HTML -->
<code>${ text }</code>
<!-- Displaying the text with an explanation -->
<code>this is the code : ${ text }</code>
```

**Vue:**
```html
<template>
  <!-- This will escape HTML, rendering it as plain text -->
  <code>{{ text }}</code>
  <!-- To render HTML, you must use v-html (not reactive by default) -->
  <code v-html="text"></code>
  <!-- Vue cannot mix explanations with HTML embedding without v-html -->
  <code>This is the code: <span v-html="text"></span></code>
</template>
<script>
export default {
  data() {
    return {
      text: '<b>{"b"}old</b> not bold <b>bold</b>',
    };
  },
};
</script>
```

**React:**
```jsx
import React from 'react';

export default function App() {
  const text = '<b>{"b"}old</b> not bold <b>bold</b>';
  return (
    <>
      {/* Escaped HTML to render as plain text */}
      <code>{'<b>{"b"}old</b> not bold <b>bold</b>'}</code>
      {/* Rendering raw HTML - React requires dangerouslySetInnerHTML */}
      <code dangerouslySetInnerHTML={{ __html: text }}></code>
      {/* Displaying the text with an explanation */}
      <code>
        This is the code: <span dangerouslySetInnerHTML={{ __html: text }}></span>
      </code>
    </>
  );
}
```

---
### Simple Reactive Example (Comparison)

**Jsis:**
```html
<span :load="__.count = 0" :onclick="count++">You clicked me {count} times</span>
```

**Vue:**
```html
<template>
  <span @click="count++">You clicked me {{ count }} times</span>
</template>
<script>
export default {
  data() {
    return {
      count: 0
    };
  }
};
</script>
```

**React:**
```jsx
import React, { useState } from 'react';
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <span onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </span>
  );
}
```

---

### Conditional Rendering (Comparison)

**Jsis:**
```html
<span :load="__.toggle = true" :onclick="toggle = !toggle">Click to toggle the box</span>
<br>
<span :if="toggle">Open</span>
<span :else>Close</span>
```

**Vue:**
```html
<template>
  <div>
    <span @click="toggle = !toggle">Click to toggle the box</span>
    <br>
    <span v-if="toggle">Open</span>
    <span v-else>Close</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      toggle: true
    };
  }
};
</script>
```

**React:**
```jsx
import React, { useState } from 'react';
export default function App() {
  const [toggle, setToggle] = useState(true);

  return (
    <div>
      <span onClick={() => setToggle(!toggle)}>Click to toggle the box</span>
      <br />
      {toggle ? <span>Open</span> : <span>Close</span>}
    </div>
  );
}
```

---

### Promise Handling (Comparison)

**Jsis:**
```html
<button :load="__.link = fetch('https://ipinfo.io/json')" :onclick="link = fetch('https://ipinfo.io/json')">Refresh</button>
<br>
<span :wait="link">Please wait...</span>
<span :then="req">
    <span :wait="req.json()">Parsing...</span>
    <span :then="data">
        Your IP is {data.ip}, located in {data.city}, {data.region}, {data.country}.
    </span>
    <span :catch="err">Error parsing JSON</span>
</span>
<span :catch="err">Error fetching data</span>
```

**Vue:**
```html
<template>
  <div>
    <button @click="refresh">Refresh</button>
    <p v-if="loading">Please wait...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Your IP is {{ data.ip }}, located in {{ data.city }}, {{ data.region }}, {{ data.country }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async refresh() {
      this.loading = true;
      try {
        const response = await fetch('https://ipinfo.io/json');
        this.data = await response.json();
      } catch (err) {
        this.error = 'Error fetching data';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

**React:**
```jsx
import React, { useState } from 'react';
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ipinfo.io/json');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {loading ? (
        <p>Please wait...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>
          Your IP is {data.ip}, located in {data.city}, {data.region}, {data.country}.
        </p>
      )}
    </div>
  );
}
```

## Attributes/Class/Style Object

**Jsis:**
```html
<span class="green" :class="{blue: true, red: false}">Styled with Jsis</span>
<span :style="{background: 'yellow', color: 'black'}">Dynamic styling</span>
<span :id="'my-id'">Dynamic attributes</span>
```

**Vue:**
```html
<template>
  <span :class="{ blue: true, red: false }">Styled with Vue</span>
  <span :style="{ background: 'yellow', color: 'black' }">Dynamic styling</span>
  <span :id="'my-id'">Dynamic attributes</span>
</template>
```

**React:**
```jsx
import React from 'react';
export default function App() {
  return (
    <>
      <span className="green" style={{ background: 'yellow', color: 'black' }}>
        Styled with React
      </span>
      <span id="my-id">Dynamic attributes</span>
    </>
  );
}
```

---

## Events

**Jsis:**
```html
<button :onclick="alert('Button clicked!')">Click Me</button>
or
<button @click="alert('Button clicked!')">Click Me</button>

<span :load="console.log('Loaded')">Loaded element</span>
```

**Vue:**
```html
<template>
  <button @click="handleClick">Click Me</button>
</template>
<script>
export default {
  methods: {
    handleClick() {
      alert('Button clicked!');
    }
  }
};
</script>
```

**React:**
```jsx
import React from 'react';
export default function App() {
  const handleClick = () => alert('Button clicked!');
  return <button onClick={handleClick}>Click Me</button>;
}
```

---

## For Loops (Standard, Of, and In)

**Jsis:**
```html
<ul>
  <li :for="var i = 0; i < 5; i++">Index: {i}</li>
  <li :for="var item of [1, 2, 3]" >Item: {item}</li>
  <li :for="var key in {a: 1, b: 2}">Key: {key}</li>
</ul>
```

**Vue:**
```html
<template>
  <ul>
    <li v-for="i in 5" :key="i">Index: {{ i - 1 }}</li>
    <li v-for="item in [1, 2, 3]" :key="item">Item: {{ item }}</li>
    <li v-for="(value, key) in { a: 1, b: 2 }" :key="key">Key: {{ key }}</li>
  </ul>
</template>
```

**React:**
```jsx
import React from 'react';
export default function App() {
  const items = [1, 2, 3];
  const obj = { a: 1, b: 2 };
  return (
    <ul>
      {[...Array(5)].map((_, i) => (
        <li key={i}>Index: {i}</li>
      ))}
      {items.map((item) => (
        <li key={item}>Item: {item}</li>
      ))}
      {Object.keys(obj).map((key) => (
        <li key={key}>Key: {key}</li>
      ))}
    </ul>
  );
}
```

---

# Conditional Looping with :forif

The `:forif` attribute allows filtering elements within a loop based on a condition.


**Jsis:** Uses `:for` to loop and `:forif` to filter directly in the HTML.  
```html
<div :forif="u % 2 == 0" :for="var u of ([0,1,2,3,4,5,6,7,8,9])">
    ${u}
</div>
```

**Vue:** Uses `.filter()` within `v-for` to achieve the same behavior as React.  
```html
<template>
  <div v-for="u in [0,1,2,3,4,5,6,7,8,9].filter(u => u % 2 == 0)" :key="u">
    {{ u }}
  </div>
</template>
```

**React:**  Uses `.filter()` before mapping over the elements.  
```jsx
import React from 'react';

export default function App() {
  const numbers = [0,1,2,3,4,5,6,7,8,9];

  return (
    <>
      {numbers.filter(u => u % 2 === 0).map(u => (
        <div key={u}>{u}</div>
      ))}
    </>
  );
}
``` 
---

## Component

**Jsis:**
```html
<comp src="./mycomponent.html"></comp>
<comp :src="'./mycomponent.html'" :prop="{key: 'value'}"></comp>
```
or
```js
JSIS.component("./mycomponent.html",element) // it load the component to the element
```

**Vue:**
```html
<template>
  <MyComponent :prop="value" />
</template>
<script>
import MyComponent from './MyComponent.vue';
export default {
  components: { MyComponent },
  data() {
    return { value: { key: 'value' } };
  }
};
</script>
```

**React:**
```jsx
import React from 'react';
import MyComponent from './MyComponent';
export default function App() {
  return <MyComponent prop={{ key: 'value' }} />;
}
```

---

## all in one example

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
                comp3                :<comp :src="'./comp.html'" :prop="{id:12}" :global></comp>
        </pre>
    <script>
        const myapp = document.querySelector("#myapp")
        Jsis.create(myapp, { text: '<b>{"b"}old</b> not bold <b>bold</b>' })
    </script>
</body>

</html>
```


# components syntax
```

project/
│
├── index.html
├── jsis.js 
└── counter.jsis

````

---

## 1. index.html

```html
<!DOCTYPE html>
<html>
<head>
  <script src="jsis.js"></script>
</head>
<body>
    <div jsis>
      <h1>Welcome to Jsis!</h1>

      <!-- Mount a component -->
      <comp src="counter.jsis"></comp>
      <!-- or -->
      <script>
          // JSIS.component("counter.jsis", document.body)
      </script>
    </div>
</body>
</html>
````

---

## 2. counter.jsis

```html
<style>
 /* your styles */
  button { padding: 6px 12px; font-size: 16px; }
</style>

<script>
  _.title = "Click the counter" // non-reactive
  __.count = 0                  // reactive
</script>

<script :ready>
    // This script with :ready runs after component is mounted
  console.log("Counter ready:", count.innerText) // access <p id="count"> by id
</script>

<template>
  <h2>{title}</h2>
  <button @click="count++">Clicked {count} times</button>
  <p id="count">{count}</p>
</template>
```
 
---

# 📚 Jsis Component Examples

---

### 🧭 1. **Tabs Component**

**tabs.jsis**

```html
<style>
  .tab-btn { padding: 8px; cursor: pointer; }
  .active { font-weight: bold; }
</style>

<script>
  __.activeTab = "Home"
  _.tabs = ["Home", "About", "Contact"]
</script>

<template>
  <div>
    <div>
      <button :for="let tab of tabs"
              :class="activeTab === tab ? 'tab-btn active' : 'tab-btn'"
              @click="activeTab = tab">{tab}</button>
    </div>

    <div>
      <p :if="activeTab === 'Home'">This is the home tab.</p>
      <p :if="activeTab === 'About'">About us goes here.</p>
      <p :if="activeTab === 'Contact'">Contact details here.</p>
    </div>
  </div>
</template>
```
 
---

### 💬 2. **Alert Box Component with Props**

**alert.jsis**

```html
<style>
  .alert { padding: 10px; border: 1px solid red; color: red; margin: 10px 0; }
</style>

<script>
  _.message = prop.message || "Something went wrong!"
</script>

<template>
  <div class="alert">{message}</div>
</template>
``` 
**Usage:**

```html
<comp :src="'alert.jsis'" :prop="{ message: 'Custom error message!' }"></comp>
```
or 
```js
JSIS.component("counter.jsis", element, { message: 'Custom error message!' }) // load the component to the element
```

---

### ✍️ 3. **Two-Way Binding Input Form**

**form.jsis**

```html
<script>
  __.name = ""
</script>

<template>
  <label>Enter your name:</label>
  <input type="text" @input="name = this.value" />

  <p>Hello, {name || "Guest"}!</p>
</template>
```

---

### 📑 4. **Accordion Component**

**accordion.jsis**

```html
<script>
  _.items = [
    { title: "Section 1", content: "Content of section 1" },
    { title: "Section 2", content: "Content of section 2" },
    { title: "Section 3", content: "Content of section 3" }
  ]
  __.openIndex = -1
</script>

<template>
  <div>
    <div :for="let i in items">
      <h3 @click="openIndex = openIndex === i ? -1 : i">{items[i].title}</h3>
      <p :if="openIndex === i">{items[i].content}</p>
    </div>
  </div>
</template>
```

---

### ⏱️ 5. **Timer / Clock Component**

**clock.jsis**

```html
<script>
  __.now = new Date().toLocaleTimeString()

  setInterval(() => {
    now = new Date().toLocaleTimeString()
  }, 1000)
</script>

<template>
  <h2>Current Time:</h2>
  <p>{now}</p>
</template>
```
 




# licence
 <p>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://www.youtube.com/@seezaara">seezaara youtube</a>
<br>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://t.me/seezaara">seezaara telegram</a>
</p> 
