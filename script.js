
var script_dom = document.getElementById("script");
var sigmoisds_for_sum_dom = document.getElementById("sigmmoids_for_sum");
var toggle_dom = document.getElementById("toggle");
let canvas_sum=document.getElementById("sum");
let ctx_sum=canvas_sum.getContext("2d")
canvas_sum.width=canvas_sum.clientWidth;
canvas_sum.height=canvas_sum.clientHeight;
sinusoid_sum={
    canvas:canvas_sum,
    ctx:ctx_sum,
    params: {
        unitX:1/9*canvas_sum.width,
        unitY:50,
        offsetX:canvas_sum.width/9,
        offsetY:canvas_sum.height/2,
        startX:-canvas_sum.width/9,
        length: canvas_sum.width
    }
}

let sinusoids=[

];

function createCanvas(id){


    let canvas = document.createElement("canvas");

    let w_input=document.createElement("input");
    w_input.addEventListener("input", function (){
        sinusoids[id].w=w_input.value;
        update(sinusoids[id]);
    })
    w_input.type="number"
    w_input.value=1;

    let range= document.createElement("input");
    range.type="range";
    let listener= function () {
        apmlitude_set(id,range.value)
    }
    range.addEventListener("click", listener);
    range.addEventListener("touchmove", listener);
    range.addEventListener("mousedown", function() {
        range.addEventListener("mousemove",listener);
    });
    range.addEventListener("mouseup", function() {
        range.removeEventListener("mousemove", listener);
    });

    let range_div=document.createElement("div");
    range.value=50
    range_div.className="range_div";
    range_div.appendChild(range)
    

    let newDiv = document.createElement("div");
    newDiv.className="sigm"
    newDiv.appendChild(canvas);
    newDiv.appendChild(range_div)
    newDiv.appendChild(w_input);
    sigmoisds_for_sum_dom.appendChild(newDiv);
    return {
        canvas:canvas,
        range:range,
        w_input:w_input
    }
}

function createSinusoid(){
    let id = sinusoids.length;
    let {canvas,range,w_input}=createCanvas(id);
    canvas.width=canvas.clientWidth;
    canvas.height=canvas.clientHeight;
    let drawSinusoid_params={
        unitX:sinusoid_sum.params.unitX,
        unitY:sinusoid_sum.params.unitY,
        offsetX:canvas.width/9,
        offsetY:canvas.height/2,
        startX:-canvas.width/9,
        length: canvas.width
    }
    let newSinusoid={
        A: 0,
        w: 1,
        phi: 0,
        canvas:canvas,
        ctx:canvas.getContext("2d"),
        params: drawSinusoid_params,
        values_DOM: {
            range: range,
            w_input: w_input
        }
    }
    
    sinusoids.push(newSinusoid)
    update(newSinusoid)


}

function updateSum(){
    function getSumValue(x){
        res=0;
        for (let i=0;i<sinusoids.length;i++){
            res+=getSinusoidValue(sinusoids[i],x)
        }
        return res;
    }
    
    let params=sinusoid_sum.params;
    let ctx=ctx_sum;
    
    ctx.clearRect(0,0, canvas_sum.width, canvas_sum.height);
    draw(sinusoid_sum);
    ctx.lineWidth = 2;
    ctx.beginPath();
    let y=0;
    ctx.moveTo(params.startX+params.offsetX,getSumValue(params.startX/params.unitX*Math.PI)+params.offsetY)
    for (let x=params.startX;x<params.length;x++){
        y=getSumValue(x/params.unitX*Math.PI)
        ctx.lineTo(x+params.offsetX,y+params.offsetY)
        ctx.moveTo(x+params.offsetX,y+params.offsetY)
    }
    ctx.stroke();

}

function getSinusoidValue(sinusoid,x){
    return -sinusoid.A*Math.sin(x*sinusoid.w+sinusoid.phi)
}

function draw_sin(sinusoid){
    let params=sinusoid.params;
    let ctx=sinusoid.ctx;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let y=0;
    ctx.moveTo(params.startX+params.offsetX,getSinusoidValue(sinusoid,params.startX/params.unitX*Math.PI)+params.offsetY)
    for (let x=params.startX;x<params.length;x++){
        y=getSinusoidValue(sinusoid,x/params.unitX*Math.PI)
        ctx.lineTo(x+params.offsetX,y+params.offsetY)
        ctx.moveTo(x+params.offsetX,y+params.offsetY)
    }
    ctx.stroke();
}

function draw(sinusoid){
    ctx=sinusoid.ctx;
    canvas=sinusoid.canvas
    params=sinusoid.params;
    ctx.fillStyle = "#010101";
    
    ctx.lineWidth = 1;
    ctx.font = "30px serif";

    ctx.beginPath();
    ctx.moveTo(0,canvas.height/2);
    ctx.lineTo(canvas.width,canvas.height/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-params.startX, canvas.height/2, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(params.unitX-params.startX, canvas.height/2, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(2*params.unitX-params.startX, canvas.height/2, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-params.startX, canvas.height/2-params.unitY, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-params.startX,0);
    ctx.lineTo(-params.startX,canvas.height);
    ctx.stroke();

    
    
    ctx.fillText("π", params.unitX-params.startX-15, canvas.height/2+25);
    ctx.fillText("2π", 2*params.unitX-params.startX-25, canvas.height/2+25);    
}



function apmlitude_set(id){
    update(sinusoids[id]);
}


function updateCanvas(sinusoid){
    sinusoid.ctx.clearRect(0,0, sinusoid.canvas.width, sinusoid.canvas.height);
    draw(sinusoid);
    draw_sin(sinusoid)
}

function update(sinusoid){
    sinusoid.A=sinusoid.values_DOM.range.value-50
    sinusoid.w=sinusoid.values_DOM.w_input.value
    updateCanvas(sinusoid)
    updateSum();
}

function f2(x){
    return -Math.sin(x)*Math.sin(x)*sinusoid_sum.params.unitY
}

function f3(x){
    x=Math.abs(x)
    x=Math.abs(x-Math.PI)%(2*Math.PI)-Math.PI
    x=x*x/5
    return -x*sinusoid_sum.params.unitY
}

function f4(x){
    x=Math.abs(x)
    x=Math.abs(x-Math.PI)%(2*Math.PI)-Math.PI
    x=0.5+x*x/5*(x*x/10-1)
    return -x*sinusoid_sum.params.unitY
}

function f(x){
    x=(x+5*Math.PI)%(2*Math.PI)-Math.PI
    
    if (x>0){
        x=0.5
    } else {
        x=-0.5
    }

    return -x*sinusoid_sum.params.unitY
}

function updateSum_mode2(func){
    let params=sinusoid_sum.params;
    let ctx=ctx_sum;
    ctx.clearRect(0,0, canvas_sum.width, canvas_sum.height);
    draw(sinusoid_sum);
    ctx.lineWidth = 2;
    ctx.beginPath();
    let y=0;
    ctx.moveTo(params.startX+params.offsetX,func(params.startX/params.unitX*Math.PI)+params.offsetY)
    console.log(func(params.startX/params.unitX*Math.PI)+params.offsetY);
    for (let x=params.startX;x<params.length;x++){
        y=func(x/params.unitX*Math.PI)
        ctx.lineTo(x+params.offsetX,y+params.offsetY)
        ctx.moveTo(x+params.offsetX,y+params.offsetY)
    }
    ctx.stroke();
}
function set_garmonic(func,i){
    let dx=0.01;
    let a_i=0
    let b_i=0
    for (let x=-Math.PI;x<Math.PI;x+=dx){
        a_i+=-func(x)*Math.cos(i*x);
        b_i+=-func(x)*Math.sin(i*x);
    }
    a_i=a_i/Math.PI*dx
    if (i==0){
        a_i=a_i/2
    }
    b_i=b_i/Math.PI*dx
    let A=Math.hypot(a_i,b_i);
    let phi=Math.atan2(a_i/A,b_i/A);
    console.log(i,A,phi,a_i,b_i);
    sinusoids[i].values_DOM.range.value=A+50;
    sinusoids[i].A=A;
    sinusoids[i].phi=phi;
    sinusoids[i].w=i
    sinusoids[i].values_DOM.w_input.value=i;

    updateCanvas(sinusoids[i],false);
    
}

function changeMode(event){
    let f=funcs[event.target[event.target.selectedIndex].text]
    updateSum_mode2(f);
    for (let i=0;i<sinusoids.length;i++){
        set_garmonic(f,i)
    }
}

const funcs ={
    "sin^2 x": f2,
    "x^2":f3,
    "x^4":f4,
    "квадрат":f
}
for (let func in funcs){
    let option=document.createElement('option')
    option.text=func
    toggle_dom.appendChild(option)
}

toggle_dom.onchange=changeMode;


for (let  i=0; i<20;i++){
    createSinusoid();
}

