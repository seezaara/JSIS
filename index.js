"use strict";
window.JSIS = function () {
    window.request = request
    window.require = require
    var compLine = {}
    var compLineLoaded = {}
    var orderCompLineCount = -1;
    var compLineLoadedCount = 0;
    // =========================
    var scopeGlobal = {}
    var scopeGlobalReactive = collectorProxy({})

    // =========================
    var collectorTempCaller
    var collectorTempKeys
    var collectorRecall = new WeakMap()
    var collectorKeyHolder = new Map();
    var collectorRemove = {}

    var config = {
        selector: "*:not(" +
            "style," +
            "script:not([type='jsis' i])," +
            "[\\:not]," +
            "[\\:if] *," +
            "[\\:for] *," +
            "[\\:if]+[\\:elseif],[\\:elseif]+[\\:elseif],[\\:elseif] *," +
            "[\\:if]+[\\:else],[\\:elseif]+[\\:else],[\\:else] *," +
            "[\\:wait] *," +
            "[\\:wait]+[\\:then],[\\:catch]+[\\:then],[\\:then] *," +
            "[\\:wait]+[\\:catch],[\\:then]+[\\:catch],[\\:catch] *)"
        ,
        text_selector: /\$?{([^}]*?{[^]*?}[^}]*?)}|\$?{([^]*?)}/g,
        css_selector: /(([^,{}\n]+?)(?=(,.*)?\{[^}]*?\}\s*))(?=([^'\\]*(\\.|'([^'\\]*\\.)*[^'\\]*'))*[^']*$)(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)(?=([^`\\]*(\\.|`([^`\\]*\\.)*[^`\\]*`))*[^`]*$)/g,
        css_minify: /((\/\*[^*]*\*+([^/][^*]*\*+)*\/)|((\s+(?=[{:};]))|((?<=.+\s*[{:}])\s+))|(;\s*(?=}))|(\s{2,})|(\n\s*)|(\r\n|\n|\r|\t))(?=([^'\\]*(\\.|'([^'\\]*\\.)*[^'\\]*'))*[^']*$)(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)(?=([^`\\]*(\\.|`([^`\\]*\\.)*[^`\\]*`))*[^`]*$)/g,
        load: ":load",
        // loaded: ":loaded",
        attr: ":",
        event: "@",
        event2: ":on",
        this_test: /[^0-9a-zA-Z_$](this)[^0-9a-zA-Z_$]/,
        test_loop: /((let|var|const) )? *(([0-9a-zA-Z_$]+)[0-9a-zA-Z_$\[\].'"`]*) *(=|in|of)/,
        comp_name: "COMP",
        script_name: "SCRIPT",
        fake: function () { return "" }
    };
    var operators = {
        for: config.attr + "for",
        if: config.attr + "if",
        forif: config.attr + "forif",
        elseif: config.attr + "elseif",
        else: config.attr + "else",

        wait: config.attr + "wait",
        then: config.attr + "then",
        catch: config.attr + "catch",
    }
    // ============================================= execute rendering 
    function renderList(elements, local_scope) {
        for (let i = 0; i < elements.length; i++) {
            render(elements[i], local_scope)
        }
    }

    function render(element, local_scope) {
        renderSingle(element, local_scope);

        var elements = element.querySelectorAll(config.selector)

        for (let i = 0; i < elements.length; i++) {
            renderSingle(elements[i], local_scope);
        }
        // for (let i = 0; i < elements.length; i++) {
        //     if (config.loaded in elements[i].attributes) {
        //         renderAttrCustomEvent(elements[i].attributes[config.loaded], local_scope)
        //     }
        // } 
        // if (config.loaded in element.attributes) {
        //     renderAttrCustomEvent(element.attributes[config.loaded], local_scope)
        // }
    }

    function renderSingle(element, local_scope) {
        if (element.nodeName == config.comp_name)
            return renderComp(element, local_scope);
        if (element.nodeName == config.script_name && element.type.toUpperCase() == "JSIS")
            return renderScript(element, local_scope);
        var attrs = element.getAttributeNames().join("")
        if (attrs.includes(config.attr)) {
            if (!renderoperator(element, local_scope))
                return;
            renderAttr(element, local_scope);
        } else if (attrs.includes(config.event)) {
            renderAttr(element, local_scope)
        }
        renderText(element, local_scope);
        //==============================
        if (config.load in element.attributes) {
            renderAttrCustomEvent(element.attributes[config.load], local_scope)
        }
        //==============================
    }

    // ============================================= execute raw js 
    function execEval(script, scope, element) {
        try {
            return Function('_', '__', '_$', '__$', 'prop', 'with(__$){with(_$){with(__){with(_){with(prop){return function(){"use strict";return (' + script + ') }}}}}}')(...scope);
        } catch (e) {
            console.error(e.message, "at:'", script, "'", element);
            return config.fake
        }
    }
    function execEvent(script, scope, element) {
        try {
            if (check_name(script))
                return Function('_', '__', '_$', '__$', 'prop', 'with(__$){with(_$){with(__){with(_){with(prop){return (' + script + ') }}}}}')(...scope);
            else
                return Function('_', '__', '_$', '__$', 'prop', 'with(__$){with(_$){with(__){with(_){with(prop){return function(event){"use strict";return (' + script + ') }}}}}}')(...scope);
        } catch (e) {
            console.error(e.message, "at:'", script, "'", element);
            return config.fake
        }
    }
    function execLoop(script, scope, element) {
        if (config.this_test.test(script)) {
            console.error("Uncaught SyntaxError: Illegal this usage", "at:'", script, "'");
            return config.fake
        }
        try {
            var index = script.match(config.test_loop)[4]
            return Function('_', '__', '_$', '__$', 'prop', 'with(__$){with(_$){with(__){with(_){with(prop){return function(){"use strict";for(' + script + '){this(' + index + ',"' + index + '")} }}}}}}')(...scope)
        } catch (e) {
            console.error(e.message, "at:'", script, "'", element);
            return config.fake
        }
    }
    // ============================================= execute js
    function execScript(before, after, scope) {
        try {
            return Function('_', '__', '_$', '__$', 'prop', 'with(__$){with(_$){with(__){with(_){with(prop){' + before + ';return function(){ with(this){ return function(){' + after + '}}}}}}}}')(...scope);
        } catch (e) {
            console.error(e);
            return config.fake
        }
    }
    function execRequire(script) {
        return new Promise(function (res) {
            try {
                var module = {
                    set exports(x) { res(x) }
                }
                Function('require', 'module', '"use strict";' + script + '').call(data, require, module);
                res({})
            } catch (e) {
                console.error(e);
            }
        })
    }
    // ============================================ renders 
    function renderScript(element, local_scope) {
        return execScript(element.src ? syncRequest(element.src, undefined, undefined, true) : element.innerText, '', local_scope)([]);
    };
    function popAttr(element, attr) {

        element.removeAttributeNode(attr)
        return attr.value
    }
    function getIndex(nodelist, node) {
        return Array.prototype.indexOf.call(nodelist, node)
    }
    function renderoperator(element, local_scope) {
        if (operators.if in element.attributes) {
            operatorIf(element, operators.if, local_scope)
            return;
        }
        if (operators.for in element.attributes) {
            operatorFor(element, element.attributes[operators.for], local_scope)
            return;
        }
        if (operators.forif in element.attributes) {
            operatorIf(element, operators.forif, local_scope)
            return;
        }
        if (operators.else in element.attributes || operators.elseif in element.attributes) {
            var attr = (element.attributes[operators.else] || element.attributes[operators.elseif])
            console.error("Uncaught SyntaxError: Unexpected token", attr.name, "without previous if", element);
            return;
        }
        if (operators.wait in element.attributes) {
            operatorWait(element, local_scope)
            return;
        }
        if (operators.then in element.attributes || operators.catch in element.attributes) {
            var attr = (element.attributes[operators.then] || element.attributes[operators.catch])
            console.error("Uncaught SyntaxError: Unexpected token", attr.name, "without previous wait", element);
            return;
        }
        return true;
    };
    function operatorFor(element, attr, local_scope) {
        var parent = element.parentNode
        var last = element.previousSibling
        parent.removeChild(element)
        execReactiveCleaner(operatorForReactive, popAttr(element, attr), element, last, parent, local_scope)
    };
    function operatorForReactive(script, element, last, parent, local_scope) {
        if (last == null) last = parent.firstChild
        var nodes = [];
        var started = false;

        execLoop(script, local_scope, element).call(function (index, name) {
            if (!started) {
                started = true;
                execReactiveEnd();
            }

            last = parent.insertBefore(element.cloneNode(true), last.nextSibling);

            var scope = [...local_scope];
            scope[4] = { ...scope[4] };
            scope[4][name] = index;

            nodes.push(last);
            render(last, scope);
        });
        if (!started)
            execReactiveEnd();
        return nodes;
    }
    function operatorIf(element, attr, local_scope) {
        var df = document.createDocumentFragment()
        var parent = element.parentNode
        var parentnodes = parent.childNodes
        var nextel = element.nextElementSibling;
        var indexes = [getIndex(parentnodes, element)];
        df.appendChild(element)
        while (nextel != null && operators.elseif in nextel.attributes) {
            var hold = nextel.nextElementSibling
            indexes.push(getIndex(parentnodes, nextel));
            df.appendChild(nextel)
            nextel = hold
        }
        if (nextel != null && operators.else in nextel.attributes) {
            indexes.push(getIndex(parentnodes, nextel));
            df.appendChild(nextel)
        }
        execReactiveCleaner(operatorIfReactive, df, indexes, attr, parent, local_scope)
    };

    function operatorIfReactive(df, indexes, attr, parent, local_scope) {
        var elements = df.cloneNode(true).children
        var element = elements[0]
        if (!!execEval(popAttr(element, element.attributes[attr]), local_scope, element).call(element)) {
            execReactiveEnd()
            parent.insertBefore(element, parent.childNodes[indexes[0]])
            render(element, local_scope)
            return element;
        } else {
            execReactiveEnd()
            // remove the if element for check else if and else
            elements[0].remove()
            //  ======================== else if operator
            for (let i = 0; i < elements.length; i++) {
                var element = elements[i]
                if (operators.elseif in element.attributes) {
                    if (!!execEval(popAttr(element, element.attributes[operators.elseif]), local_scope, element).call(element)) {
                        // execReactiveEnd()
                        // render(element, local_scope)
                        parent.insertBefore(element, parent.childNodes[indexes[i + 1]])
                        render(element, local_scope) 
                        return element;
                    }
                } else
                    break
            }
            //  ======================== else operator 
            element = elements[elements.length - 1]
            if (element && operators.else in element.attributes) {
                element.removeAttributeNode(element.attributes[operators.else])
                // render(element, local_scope)
                parent.insertBefore(element, parent.childNodes[indexes[indexes.length - 1]])
                render(element, local_scope) 
                return element;
            }
            return false
        }
    };
    // ============================================ operator promise
    function operatorWait(element, local_scope) {
        var parent = element.parentNode
        var parentnodes = parent.childNodes
        var indexes = { wait: getIndex(parentnodes, element) };

        var next = element.nextElementSibling
        if (next) {
            var nextnext = next.nextElementSibling
            if (nextnext) {
                var then_el = next.attributes[operators.then] || nextnext.attributes[operators.then]
                var catch_el = next.attributes[operators.catch] || nextnext.attributes[operators.catch]
            } else {
                var then_el = next.attributes[operators.then]
                var catch_el = next.attributes[operators.catch]
            }
        }
        parent.removeChild(element)

        if (then_el != undefined) {
            then_el = then_el.ownerElement
            indexes.then = getIndex(parentnodes, then_el)
            parent.removeChild(then_el)
        }
        if (catch_el != undefined) {

            catch_el = catch_el.ownerElement
            indexes.catch = getIndex(parentnodes, catch_el)
            parent.removeChild(catch_el)
        }
        // window.parent = parentnodes
        execReactiveCleaner(operatorWaitReactive, element, then_el, catch_el, parent, indexes, local_scope)

    };
    function operatorWaitReactive(element, then_el, catch_el, parent, indexes, local_scope) {
        element = element.cloneNode(true)
        if (then_el != undefined)
            then_el = then_el.cloneNode(true)
        if (catch_el != undefined)
            catch_el = catch_el.cloneNode(true)

        var promise = execEval(popAttr(element, element.attributes[operators.wait]), local_scope, element).call(element)
        execReactiveEnd()
        parent.insertBefore(element, parent.childNodes[indexes.wait])
        render(element, local_scope)
        if (promise instanceof Promise) {
            var parent = element.parentNode
            promise.then(function (a) {
                if (element != undefined)
                    element.remove()
                if (then_el != undefined) {
                    parent.insertBefore(then_el, parent.childNodes[indexes.then])
                    local_scope[4] = { ...local_scope[4] }
                    local_scope[4][popAttr(then_el, then_el.attributes[operators.then])] = a
                    render(then_el, local_scope)
                }
            }, function (a) {
                if (element != undefined)
                    element.remove()
                if (catch_el != undefined) {
                    parent.insertBefore(catch_el, parent.childNodes[indexes.catch])
                    local_scope[4] = { ...local_scope[4] }
                    local_scope[4][popAttr(catch_el, catch_el.attributes[operators.catch])] = a
                    render(catch_el, local_scope)
                }
            })
        } else {
            if (element != undefined)
                element.remove()
            if (then_el != undefined) {
                parent.insertBefore(then_el, parent.childNodes[indexes.then])
                local_scope[4] = { ...local_scope[4] }
                local_scope[4][popAttr(then_el, then_el.attributes[operators.then])] = promise
                render(then_el, local_scope)
            }
        }
        return function () {
            let disconnected = true;
            if (element != undefined) {
                if (element.isConnected)
                    disconnected = false;
                element.remove()
                element = undefined
            }
            if (then_el != undefined) {
                if (then_el.isConnected)
                    disconnected = false;
                then_el.remove()
                then_el = undefined
            }
            if (catch_el != undefined) {
                if (catch_el.isConnected)
                    disconnected = false;
                catch_el.remove()
                catch_el = undefined
            }
            return disconnected;
        }
    };
    // ============================================ attributes
    function renderAttr(element, local_scope) {
        var attrs = element.attributes
        for (let s = 0; s < attrs.length;) {
            if (coreAttr(attrs[s], local_scope)) {
                attrs[s].ownerElement.removeAttributeNode(attrs[s])
            } else
                s++;
        }
    };
    function renderAttrCustomEvent(attr, local_scope) {
        execEval(attr.value, local_scope, attr.ownerElement).call(attr.ownerElement)
        attr.ownerElement.removeAttributeNode(attr)
    };
    function coreAttr(attr, local_scope) {
        if (attr.name.substring(0, 3) == config.event2) {
            attr.ownerElement.addEventListener(attr.name.substring(3), execEvent(attr.value, local_scope, attr.ownerElement));
            // event don't need reactive proxy
            return true
        } else if (attr.name[0] == config.event) {
            attr.ownerElement.addEventListener(attr.name.substring(1), execEvent(attr.value, local_scope, attr.ownerElement));
            // event don't need reactive proxy
            return true
        } else if ((attr.name !== config.load) && attr.name[0] == config.attr) {
            execReactive(coreAttrReactive, attr.value, attr.name.substring(1), attr.ownerElement, local_scope)
            return true
        }
        return false;
    };
    function coreAttrReactive(script, name, element, local_scope) {
        if (!element.isConnected)
            return true
        var check = checkAttr(element, name, execEval(script, local_scope, element).call(element))
        execReactiveEnd()
        if (check != null)
            element.setAttribute(name, check);

    };
    function checkAttr(element, name, value) {
        if (typeof value == "object") {
            if (name == "class") {
                for (var i in value) {
                    if (value[i])
                        element.classList.add(i)
                    else
                        element.classList.remove(i)
                }
                return null;
            } else if (name == "style") {
                for (var i in value) {
                    if (i in element.style) {
                        element.style[i] = value[i]
                    }
                }
                return null;
            } else {
                for (var i in value) {
                    if (value[i])
                        return i;
                }
            }
        } else
            return value
        return null;
    }

    // =================================================================== text
    function renderText(element, local_scope) {
        var elemetnRange = []
        var elemetnScript = []
        var elemetnIsHtml = []
        var nodes = element.childNodes;
        var datajs;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType == 3 && nodes[i].data.trim() != "") {
                while ((datajs = config.text_selector.exec(nodes[i].data)) !== null) {
                    var range = document.createRange();
                    range.setStart(nodes[i], datajs.index);
                    range.setEnd(nodes[i], config.text_selector.lastIndex);
                    elemetnRange.unshift(range);
                    elemetnScript.unshift(datajs[1] || datajs[2]);
                    elemetnIsHtml.unshift(datajs[0][0] == "$");
                }
            };
        }
        for (var i in elemetnRange) {
            execReactive(renderTextReactive, element, elemetnScript[i], elemetnRange[i], elemetnIsHtml[i], local_scope)
        }
    };
    function renderTextReactive(element, script, range, is_html, local_scope) {
        if (!element.isConnected)
            return true
        range.deleteContents();
        var text = execEval(script, local_scope, element).call(element)
        execReactiveEnd()
        if (is_html) {
            var df = range.createContextualFragment(text)
            renderList(df.children, local_scope);
            range.insertNode(df)
        } else {
            range.insertNode(document.createTextNode(text))
        }
    };

    // =================================================================== component

    function renderComp(element, local_scope) {

        var reactive_src = element.getAttribute(config.attr + "src")
        var src = element.getAttribute("src")
        var prop = element.getAttribute(config.attr + "prop")
        var scoped = element.getAttribute(config.attr + "global") != null
        element.removeAttribute("src")
        element.removeAttribute(config.attr + "src")
        element.removeAttribute(config.attr + "prop")
        element.removeAttribute(config.attr + "global")
        var attrs = element.getAttributeNames()
        if (Object.values(operators).some(function (e) {
            if (attrs.includes(e)) {
                console.error("Uncaught SyntaxError: Unexpected token", e, element);
                return true
            }
            return
        }))
            return
        //=========================================================
        var new_element = document.createElement('div')
        for (var index = element.attributes.length - 1; index >= 0; --index) {
            new_element.attributes.setNamedItem(element.attributes[index].cloneNode());
        }

        // Replace it
        element.parentNode.replaceChild(new_element, element);
        element.remove()
        if (reactive_src != null) {
            execReactiveCleaner(renderCompReactive, reactive_src, new_element, prop, scoped, local_scope)
        } else {
            if (src)
                renderCompReactive(src, new_element, prop, scoped, local_scope, false)
        }
    };
    function renderCompReactive(src, element, prop, scoped, local_scope, is = true) {
        if (is) {
            src = execEval(src, local_scope, element).call(element)
            execReactiveEnd()
        }

        if (prop != null) {
            if (typeof prop == "string")
                prop = execEval(prop, local_scope, element).call(element) || {}
        } else {
            prop = {}
        }

        if (!scoped) {
            local_scope = [
                {},                   // _
                collectorProxy({}),     // __
                scopeGlobal,            // _$
                scopeGlobalReactive,    // __$ 
                prop,                   // prop
            ]
        } else {
            local_scope = local_scope.slice(0, 4)
            local_scope[4] = prop
        }
        var random = 'comp' + Math.floor(Math.random() * 10000000)
        element.setAttribute("data-id", random)
        request(src).then(orderCompLine(function (data) {
            element.innerHTML = '';
            var hold = document.createElement('div')
            hold.innerHTML = data;
            var template = hold.querySelector("template")
            if (template) {
                renderCompReactiveCodes(hold, 'div[data-id=' + random + ']', function (before, after, styles) {
                    if (styles != '') {
                        var style = document.createElement('style');
                        style.innerHTML = styles;
                        element.appendChild(style)
                    }
                    //-----------------------------------------
                    var call = execScript(before, after, local_scope)
                    //-----------------------------------------
                    element.appendChild(template.content)
                    render(element, local_scope);
                    var ids = renderCompId(element)
                    ids.template = element
                    call.call(ids)()
                })
            } else
                console.error('Cannot find "template" in component:', src);
        }))
    };
    function orderCompLine(fun) {
        var index = ++orderCompLineCount;
        compLine[orderCompLineCount] = fun;
        return function (data) {

            if (index == compLineLoadedCount) {
                compLine[index](data)
                delete compLine[index]
                compLineLoadedCount++;

                while (compLineLoadedCount in compLineLoaded) {
                    compLineLoaded[compLineLoadedCount].fun(compLineLoaded[compLineLoadedCount].data)
                    delete compLineLoaded[compLineLoadedCount]
                    compLineLoadedCount++;
                }
            } else {
                delete compLine[index]
                compLineLoaded[index] = { fun: fun, data: data }
            }
        }
    }

    function renderCompId(fg) {
        var hold = fg.querySelectorAll("[id]:not([\\:not] [id],[\\:not])")
        var elements = {}
        for (let i = 0; i < hold.length; i++) {
            elements[hold[i].id] = hold[i]
        }
        return elements;
    }

    function renderCompReactiveCodes(hold, comp_scope, callback) {
        var scripts = hold.querySelectorAll("script")
        var styles = hold.querySelectorAll("style")
        if (scripts.length + styles.length == 0)
            return callback('', '', '')
        var caller = getCode(callback, scripts.length + styles.length)
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src) {
                request(scripts[i].src).then(scripts[i].hasAttribute(config.attr + "ready") ? caller.after_load.bind(null, i) : caller.before_load.bind(null, i))
            } else if (scripts[i].hasAttribute(config.attr + "ready"))
                caller.after_load(i, scripts[i].innerText)
            else
                caller.before_load(i, scripts[i].innerText)

        }
        //======================
        for (let i = 0; i < styles.length; i++) {
            var style_scope = styles[i].getAttribute(config.attr + "global") == null
            if (style_scope)
                style_scope = comp_scope;

            if (styles[i].hasAttribute("src")) {
                request(styles[i].getAttribute("src")).then(caller.styles.bind(null, style_scope, i))
            } else {
                caller.styles(style_scope, i, styles[i].innerText)
            }
        }
    }

    function getCode(end, max) {

        var coutn = 0
        var before_load = []
        var after_load = []
        var styles = [];
        return {
            before_load: function (key, val) {
                before_load[key] = val
                coutn++
                if (coutn == max) {
                    end(before_load.join('\n'), after_load.join('\n'), styles.join(''))
                }
            },
            after_load: function (key, val) {
                after_load[key] = val
                coutn++
                if (coutn == max) {
                    end(before_load.join('\n'), after_load.join('\n'), styles.join(''))
                }
            },
            styles: function (scopeStype, key, val) {
                if (scopeStype)
                    // styles[key] = val.replace(config.css_minify, "").replace(config.css_selector, scopeStype + " $1")
                    styles[key] = val
                else {
                    styles[key] = val
                }
                coutn++
                if (coutn == max) {
                    end(before_load.join('\n'), after_load.join('\n'), styles.join(''))
                }
            }
        }
    }

    // ============================================ create reactive proxy
    function collectorProxy(target) {
        return new Proxy(target, {
            get: collectorProxyGetter,
            set: collectorProxySetter
        });
    };

    // called when reactive value is READ
    function collectorProxyGetter(target, key) {
        // register dependency if temp was set
        if (typeof key === "string" && collectorTempCaller !== undefined) {

            // target -> key -> callers
            var scopeMap = collectorRecall.get(target);
            if (!scopeMap)
                collectorRecall.set(target, scopeMap = new Map());

            // get all renders using this key
            var callers = scopeMap.get(key);
            if (!callers)
                scopeMap.set(key, callers = []);

            callers.push(collectorTempCaller);

            // save special remove/rebuild key
            // used by :if / :for
            if (collectorTempKeys) {
                var kMap = collectorKeyHolder.get(key);
                if (!kMap)
                    collectorKeyHolder.set(key, kMap = new WeakMap());
                kMap.set(collectorTempCaller, collectorTempKeys);
            }
        }
        return target[key];
    }

    // called when reactive value is CHANGED
    function collectorProxySetter(target, key, value) {
        target[key] = value;
        // run all reactives of this key  
        if (typeof key === "string") {
            var scopeMap = collectorRecall.get(target);
            var callers = scopeMap && scopeMap.get(key);

            if (callers)
                execReactiveCaller(callers, collectorKeyHolder.get(key));
        }

        return true;
    }

    // rerun all reactive renders
    function execReactiveCaller(call, CleanerMap) {
        // if was no need for removing old element
        if (!CleanerMap) {
            for (let i = 0; i < call.length; i++) {
                // if  disconnected remove from watcher list
                if (call[i]()) {
                    call.splice(i, 1);
                    i--;
                }
            }
            return;
        }
        // call the reactive cleaner
        for (let i = 0; i < call.length; i++) {
            var currentCaller = call[i];
            // get remove key
            var customKeys = CleanerMap.get(currentCaller);
            if (customKeys) {
                // remove old DOM
                if (execReactiveCallerRemove(collectorRemove[customKeys])) {
                    // if disconnected remove watcher
                    call.splice(i, 1);
                    i--;
                    delete collectorRemove[customKeys];
                } else {  // rerender and save new nodes
                    collectorRemove[customKeys] = currentCaller();
                }
            } else {
                // normal rerender
                if (currentCaller()) {
                    call.splice(i, 1);
                    i--;
                }
            }
        }

    }

    // remove old rendered nodes
    function execReactiveCallerRemove(node) { 
        if (node == undefined) return true;
        let disconnected = false;

        if (typeof node == 'object' && node.length) {
            for (let i = 0; i < node.length; i++) {
                var single = node[i]; 
                if (!single || !single.isConnected)
                    disconnected = true; 
                if (single && single.remove)
                    single.remove();
            }
        } else if (typeof node == 'function') {
            return node();
        } else if (node.remove) {
            if (!node.isConnected)
                disconnected = true;
            node.remove();
        }

        return disconnected;
    };

    // ========= 
    function execReactive(reactive) {
        collectorTempCaller = reactive.bind.apply(reactive, arguments);
        collectorTempCaller(true)
    };
    function execReactiveCleaner(reactive) {
        var kye = Math.floor(Math.random() * 10000000)
        collectorTempKeys = kye
        collectorTempCaller = reactive.bind.apply(reactive, arguments);
        collectorRemove[kye] = collectorTempCaller(true)

    };
    function execReactiveEnd() { 
        if (collectorTempCaller != undefined) {
            collectorTempCaller = undefined;
            collectorTempKeys = undefined;
        }
    };
    // ========================================================= out
    function request(url, data, opt) {
        if (opt == undefined) {
            opt = {}
        }
        if (data == undefined) {
            if (!opt.method)
                opt.method = 'get'
        } else if (typeof data == "object" && !(data instanceof FormData)) {
            data = new URLSearchParams(data)
        }
        if (!opt.method)
            opt.method = "post"
        return new Promise(function (res) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    res(this.response);
                }
            }
            if (opt.responseType)
                xhttp.responseType = opt.responseType;

            xhttp.onerror = opt.onerror
            xhttp.onabort = opt.onerror
            xhttp.ontimeout = opt.onerror
            xhttp.onprogress = opt.ondownload
            xhttp.upload.onprogress = opt.onupload
            xhttp.open(opt.method, url, true);
            if (opt.cache != undefined ? !opt.cache : opt.method != "post") {
                xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
                xhttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
                xhttp.setRequestHeader("Pragma", "no-cache");
            } else {
                xhttp.setRequestHeader("Cache-Control", "public, max-age=604800, immutable");
            }
            xhttp.send(data);
        })
    }
    function syncRequest(url, data, opt) {
        if (opt == undefined) {
            opt = {}
        }
        if (data == undefined) {
            if (!opt.method)
                opt.method = 'get'
        } else if (typeof data == "object" && !(data instanceof FormData)) {
            data = new URLSearchParams(data)
        }
        if (!opt.method)
            opt.method = "post"

        var xhttp = new XMLHttpRequest();
        if (opt.responseType)
            xhttp.responseType = opt.responseType;

        xhttp.onerror = opt.onerror
        xhttp.onabort = opt.onerror
        xhttp.ontimeout = opt.onerror
        xhttp.onprogress = opt.ondownload
        xhttp.upload.onprogress = opt.onupload
        xhttp.open(opt.method, url, false);
        if (opt.cache != undefined ? !opt.cache : opt.method != "post") {
            xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
            xhttp.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
            xhttp.setRequestHeader("Pragma", "no-cache");
        } else {
            xhttp.setRequestHeader("Cache-Control", "public, max-age=604800, immutable");
        }
        xhttp.send(data);

        if (xhttp.readyState == 4) {
            return xhttp.response;
        }
    }
    function require(url) {
        return syncRequest(url).then(execRequire)
    }
    function component(src, new_element, prop = {}, local_scope = {}) {
        renderCompReactive(src, new_element, prop, !local_scope, local_scope, false)
    }
    function check_name(name) {
        name = name.trim();
        if (!name) return false;
        var first = name.charCodeAt(0);
        if (!(first === 36 || first === 95 || (first >= 65 && first <= 90) || (first >= 97 && first <= 122)))
            return false;

        let i = 1;
        while (i < name.length) {
            var c = name.charCodeAt(i);
            if (!(c === 36 || c === 95 || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57)))
                return false;
            i++;
        }

        return true;
    }
    function create(element, prop) {
        if (prop == undefined && !(element instanceof Element)) {
            prop = element
            element = document.querySelector("*[JSIS]")
            if (!element)
                return
        }
        if (!element)
            return console.error('Cannot find "JSIS" element in document');
        render(element, [
            {},
            collectorProxy({}),
            scopeGlobal,
            scopeGlobalReactive,
            prop || {}
        ])
    }
    if (document.readyState === "complete" || document.readyState === "interactive") {
        create();
    } else {
        document.addEventListener("DOMContentLoaded", function () { create() });
    }
    return {
        component: component,
        create: create
    }
}()
