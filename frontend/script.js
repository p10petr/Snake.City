/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */


let movement;
let movement2;

let color1;
let color2;

let cnv;
let d = 30;
let g;

//setup() is called initially
function setup() {
  createCanvas(windowWidth, windowHeight);
  movement = 50;
  movement2 = 400;

  color1 = color(55, 40, 99); // Define color 'c'
  color2 = color(10, 134, 267);
}

//calls commands continously
function draw() {
  
  fill(color1); // Use color variable 'c' as fill color
  noStroke(); // Don't draw a stroke around shapes

  // color = R G B
  // R > G > B
  // B < G < R

  rect(30, 40, 50, 0); // Draw rectangle
  rect(movement2, mouseX, 70, 70);

  fill(color2); // Use color variable 'c' as fill color
  
  movement = movement + 2;
  movement2 = movement2 - 10;

  background(170, 86, 16, 1);
  ellipse(movement, mouseY, 60, 60);
  



  fill(color1);

  line(mouseX, 0, mouseX, 100);

  if (mouseIsPressed) {
    color1 = color(115, 40, 99);
  } else {
    color1 = color(75, 40, 99);
    
  }
  
  if(movement > windowWidth ){ movement = 0}
  if(movement2 < -windowWidth ){ movement2 = 600}
  
  


  //mouseX, mouseY
  //https://p5js.org/reference/
}

//https://p5js.org/reference/#/p5/touches
