

const width=500,    
      height=500,
      font='Roboto Mono';

let size=Math.min(width,height);
let margin=0.1*size; //margin for text
let r1=size/2-margin/2;
let r2=3*size/8-margin/2;
let r3=size/4-margin/2;
let top1=margin/2;
let top2=r1-r2+margin/2;
let top3=r1-r3+margin/2;

test1= "Trois mille six cents fois par heure, la Seconde Chuchote: Souviens toi ! – Rapide, avec sa voix D\’insecte, Maintenant dit: Je suis Autrefois, Et j\’ai pompé ta vie avec ma trompe immonde!";
test2= "Les minutes, mortel folâtre, sont des gangues Qu\’il ne faut pas lâcher sans en extraire l\’or !";
test3= "Tantôt sonnera l\’heure ... Où tout te dira : Meurs, vieux lâche ! il est trop tard !";
      
//Create the SVG
var svg = d3.select(".visualisation").append("svg")
            .attr("width", size)
            .attr("height", size);


function createClock(sentence,radius,top,hand,color){
  words=sentence.split(' ').map(d => d+"  ");
  length=words.map(d=>d.length).reduce((a, b)=> a + b,0)
  let cumulativeSum = (sum => value => sum += (value))(0);
  cumsum=words.map(d=> d.length).map(cumulativeSum);
  cumsum.unshift(0);
  cumsum.pop();

  let fontWidth= 2*Math.PI*radius/length;
  let fontSize= dichotomy(getTextWidth,fontWidth,fontWidth);
  let circle=createCirclePath(top,radius);
  let scale=createScale(sentence,hand);

  createSVG(words, cumsum,hand,fontSize,fontWidth,circle);
  showTime(hand,color,scale);
  
};


function createSVG(sentence, cumsum,hand,fontSize,fontWidth,circle){ 
  //Create an SVG path (based on bl.ocks.org/mbostock/2565344)
  svg.append("path")
  .attr("id", hand) //Unique id of the path
  .attr("d", circle) //SVG path
  .style("fill", "none")
  .style("stroke", "none");



  svg.selectAll("text."+hand)
  .data(sentence)
  .enter()
  .append("text")
      .attr("class", hand)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#"+hand) //place the ID of the path here
      .style("text-anchor","start") //place the text halfway on the arc
      .text(d => d)
      .style("text-transform","uppercase")
      .style("font-size", fontSize)
      .attr("startOffset", (d,i)=> cumsum[i]*fontWidth+"px" );
};

createClock(test1,r1,top1,"Seconds","#be1e2d");
createClock(test2,r2,top2,"Minutes","#21409a");
createClock(test3,r3,top3,"Hours","	#ffde17");

function showTime(hand,color,scale){
  let d= new Date();
  let h= d.getHours();
  let m= d.getMinutes();
  let s= d.getSeconds();
  let t= 0;
  switch(hand){
    case 'Seconds':
      t=s;
      break;
    case 'Minutes':
      t=s+60*m;
      break;
    case 'Hours':
      t=m+60*(h%12);
      break;
  };
  svg.selectAll("text."+hand)
     .style("fill", function(d,i){if(scale[t]==i){return color}else{ return "grey"}});

  setTimeout(showTime, 1000,hand,color,scale);
      };




function createScale(sentence,hand){
  let duration={Seconds : 60, Minutes : 60*60, Hours : 12*60};
  let words=sentence.split(' ').map(d => d+"  ");
  length=words.map(d=>d.length).reduce((a, b)=> a + b,0)
  let cumulativeSum = (sum => value => sum += (value))(0);
  cumsum=words.map(d=> d.length).map(cumulativeSum);
  cumsum.unshift(0);
  let scale=[];
  let j=0;
  for(var i = 0;i<duration[hand];i++){
    if((cumsum[j]<=i*length/duration[hand])&&(i*length/duration[hand]<cumsum[j+1])){
      scale.push(j);
    }else{
      scale.push(j+1);
      j++;
    }
  }
  return scale;
};
    
 

function dichotomy(fun, v,h){
    a = h;
    b = 3*h;
    maxiter=10000;
    iter=0
    while((fun(a) <= fun(b))&&(iter<maxiter)){
        iter++;
        m = (a + b) / 2;
        if((fun(m) >=v-0.05)&&(fun(m) <=v+0.05)){
          return m;
        }          
        else if (fun(m) < v){
          a = m ;
        }         
        else{
         b = m ;
        }
      }
    return "maxiter";
};


function getTextWidth(fontsize) { 
  
  inputText = "h"; 
  canvas = document.createElement("canvas"); 
  context = canvas.getContext("2d"); 
  context.font = fontsize+"px "+font; 
  widthtxt = context.measureText(inputText).width; 
  return widthtxt;;
} 


function createCirclePath(top,radius){
  return ("M "+(size/2)+","+top+" A "+radius+','+radius+ " 0 0,1 "+(size/2)+","+(2*radius+top)+" A "+radius+','+radius+ " 0 0,1 "+(size/2)+","+top)
};








