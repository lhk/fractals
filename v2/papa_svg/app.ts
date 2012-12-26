/// <reference path="raphael-2.1.d.ts"/>
var toggle = true;
window.onload = () => {
    var paper: RaphaelPaper = Raphael(10, 50, 1000, 1000);
    /*var circle= paper.circle(100, 100, 50);
    circle.attr("fill", "blue");
    var line = paper.rect(10, 10, 100, 10);
    line.attr("fill", "green");
    line.transform("r45");
    */
    var word = "X";
    paper.clear();
    var n = 4;
    for (var i = 0; i < n; i++) {
        word = applyRules(word);
    }
    var set1 = paper.set();
    draw(paper, word, set1);
    set1.attr("fill", "green");
    set1.attr("stroke", "green");
    set1.attr("opacity", "1");

    var set2 = paper.set();
    draw(paper, word, set2);
    set2.attr("fill", "green");
    set2.attr("stroke", "green");
    set2.attr("opacity", "0");

    var toggle = true;

    /*redraw(paper, set2);
    alert("now fading");
    fadeInOut(set1, set2);
    redraw(paper, set1);
    alert("now fading");
    fadeInOut(set1, set2);*/
    var interval = window.setInterval(() =>{ redraw(paper, set1, set2); fadeInOut(set1, set2); }, 4000);
    //redraw(paper, set1, set2);
    //redraw(paper, set1, set2);

};

var remove = function (Element: RaphaelElement) { Element.remove(); Element = null; }

var fadeInOut=function(set1: RraphaelSet, set2: RraphaelSet) {
    if (toggle) {
        //set1.animate({ opacity: 0 }, 2000);
        //set2.animate({ opacity: 1 }, 2000);
        set1.attr("opacity","0");
        set2.attr("opacity", "1");
    }
    else {
        //set1.animate({ opacity: 1 }, 2000);
        //set2.animate({ opacity: 0 }, 2000);
        set1.attr("opacity","1");
        set2.attr("opacity", "0");
    }
    toggle = !toggle;
}

var redraw = function (paper:RaphaelPaper,set1:RraphaelSet,set2:RraphaelSet) {
    var n =4+ Math.floor(Math.random() * 2);
    var word = "X";
    for (var i = 0; i < n; i++) {
        word = applyRules(word);
    }
    var length = 2; //+ Math.floor(Math.random()*2);
    var deltaRot= 20 + Math.floor(Math.random()*20);
    if (toggle) {    
        set2.forEach(remove);
        draw(paper, word, set2, deltaRot, length);
        set2.attr("opacity", "0");
        var colour = 200+Math.floor(Math.random() * 55);
        set2.attr("fill", "#55" + colour.toString(16)+"55");
        set2.attr("stroke", "#55" + colour.toString(16)+"55"); 
    }
    else { 
        set1.forEach(remove);
        draw(paper, word, set1, deltaRot, length);
        set1.attr("opacity", "0");
        var colour = 155+Math.floor(Math.random() * 100);
        set1.attr("fill", "#55" + colour.toString(16)+"55");
        set1.attr("stroke", "#55" + colour.toString(16)+"55");
    }
}

class Entry { public X: number; public Y: number; public Rot: number;}

class List { public head: Entry; public tail: List; }

var draw = function (paper: RaphaelPaper, word: string,st:RraphaelSet, deltaRot=25, length=2) {
    var x: number = 0;
    var y: number = 0;
    var rot: number = 45;
    var stack: List = new List();
    for (var i = 0; i < word.length; i++) {
        var char = word[i];
        switch (char) {
            case "F":
                var xend = x + Math.cos(rot/180*Math.PI) * length;
                var yend = y + Math.sin(rot/180*Math.PI) * length;
                st.push( paper.path("M" + x + "," + y + "L" + xend + "," + yend));
                x = xend;
                y = yend;
                break;
            case "+":
                rot = rot + deltaRot;
                break;
            case "-":
                rot = rot - deltaRot;
                break;
            case "X":
                break;
            case "[":
                var current = new Entry();
                current.Rot = rot;
                current.X = x;
                current.Y = y;
                var newlist = new List();
                newlist.head = current;
                newlist.tail = stack;
                stack = newlist;
                break;
            case "]":
                //st.push(paper.circle(x, y, 1));
                var current = stack.head;
                x = current.X;
                y = current.Y;
                rot = current.Rot;
                stack = stack.tail;
                break;
        }
    }
}

var applyRules:(string)=>string = function (word: string) {
    var new_word: string = "";
    for (var i = 0; i < word.length; i++) {
        var char = word[i];
        switch (char) { 
            case "X":
                new_word=new_word+"F-[[X]+X]+F[+FX]-X"
                break;
            case "F":
                new_word = new_word + "FF";
                break;
            case "+":
                new_word = new_word + "+";
                break;
            case "-":
                new_word = new_word + "-";
                break;
            case "[":
                new_word = new_word + "[";
                break;
            case "]":
                new_word = new_word + "]";
                break;
        }
    }
    return new_word;
}