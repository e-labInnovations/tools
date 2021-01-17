var inputName = document.getElementById('name');
var fileinput = document.getElementById("finput");
var inputWidth = document.getElementById("width");
var inputHeight = document.getElementById("height");
var canvas = document.getElementById('can');
var accuracy = document.getElementById('accuracy');

var sprite = {
  width: null,
  height: null,
  zoom: 1,
  selected: false,
  xbmData = []
}

var image = null;

function upload() {
  
  //Get input from file input
  image = new SimpleImage(fileinput);
  //Draw image on canvas
  image.drawTo(canvas);
  
  setTimeout(function() {
    inputWidth.value = image.getWidth();
    inputHeight.value = image.getHeight();
  inputName.value = fileinput.files[0].name.split('.').slice(0, -1).join('.');
  }, 250);
}

function makeGray() {
  var a = accuracy.value;
  console.log(a);
  //change all pixels of image to gray
  for (var pixel of image.values()) {
    var avg = (pixel.getRed() > a | pixel.getGreen() >a | pixel.getBlue() > a | (pixel.getRed()+pixel.getGreen()+pixel.getBlue()/3)>a) ? 255 :0;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  //display new image
  var canvas = document.getElementById("can");
  image.drawTo(canvas);
}


const loadProject = (e) => {
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.onload = function() {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(img, 0, 0);
    
    //fill name, width & height
    inputWidth.value = sprite.width = this.width;
    inputHeight.value = sprite.height = this.height;
    inputName.value = e.target.files[0].name.split('.').slice(0, -1).join('.');
    sprite.selected = true;
    
  }
  img.src = URL.createObjectURL(e.target.files[0]);
}

const createXBM = () => {
  if (!sprite.selected) {
    return alert('No files selected')
  }
  
  
}