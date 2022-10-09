var inputName = document.getElementById('name');
var fileinput = document.getElementById("finput");
var inputWidth = document.getElementById("width");
var inputHeight = document.getElementById("height");
var canvas = document.getElementById('can');
var accuracy = document.getElementById('accuracy');
var accuracyDisplay = document.getElementById('accuracyDisplay');
var exportedFileList = document.getElementById('exportedFileList');

var ctx = canvas.getContext('2d');
// register the handler 

var sprite = {
  width: null,
  height: null,
  zoom: 1,
  selected: false,
  imgData: null,
  imgMData: null,
  Xs: [],
  Ys: []
}

var penColor = "black",
  penThickness = 2;
var flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

accuracy.addEventListener('change', e => {
  accuracyDisplay.innerText = e.target.value;
})

function init() {
  canvas.addEventListener("mousemove", function (e) {
      findxy('move', e)
  }, false);
  canvas.addEventListener("mousedown", function (e) {
      findxy('down', e)
  }, false);
  canvas.addEventListener("mouseup", function (e) {
      findxy('up', e)
  }, false);
  canvas.addEventListener("mouseout", function (e) {
      findxy('out', e)
  }, false);
}

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = penColor;
  ctx.lineWidth = penThickness;
  ctx.stroke();
  ctx.closePath();
}

function clearCanvas() {
  var m = confirm("Want to clear");
  if (m) {
      ctx.clearRect(0, 0, sprite.width, sprite.height);
  }
}

function findxy(res, e) {
  if (res == 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      flag = true;
      dot_flag = true;
      if (dot_flag) {
          ctx.beginPath();
          ctx.fillStyle = x;
          ctx.fillRect(currX, currY, 2, 2);
          ctx.closePath();
          dot_flag = false;
      }
  }
  if (res == 'up' || res == "out") {
      flag = false;
  }
  if (res == 'move') {
      if (flag) {
          prevX = currX;
          prevY = currY;
          currX = e.clientX - canvas.offsetLeft;
          currY = e.clientY - canvas.offsetTop;
          draw();
      }
  }
}

const selectEraser = () => {
  penColor = "white",
  penThickness = 14;
}

const selectPencil = () => {
  penColor = "black",
  penThickness = 2;
}

const upload = () => {
  var img = new Image;
  img.onload = function() {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(img, 0, 0);
    
    //fill name, width & height
    inputWidth.value = sprite.width = this.width;
    inputHeight.value = sprite.height = this.height;
    inputName.value = fileinput.files[0].name//.split('.').slice(0, -1).join('.');
    
    sprite.imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    sprite.selected = true;
  }
  img.src = URL.createObjectURL(fileinput.files[0]);
  sprite.Xs = []
}

const createMonochrome = () => {
  if (!sprite.selected) {
    return alert('No files selected');
  }
  
  sprite.imgMData = new ImageData(
    new Uint8ClampedArray(sprite.imgData.data),
    sprite.imgData.width,
    sprite.imgData.height
  );
  let pixels = sprite.imgMData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    let red = pixels[i];
    let green = pixels[i + 1];
    let blue = pixels[i + 2];
    let alpha = pixels[i + 3];
    let a = accuracy.value;
    let lightness = red>a | green>a | blue>a | alpha<a ? 255:0;
  
    pixels[i] = lightness;
    pixels[i + 1] = lightness;
    pixels[i + 2] = lightness;
  }
  
  ctx.putImageData(sprite.imgMData, 0, 0);
  let pngURL = canvas.toDataURL('image/bmp');
  
  CanvasToBMP.toDataURL(canvas, function(uri) {
    exportedFileList.innerHTML = '';
    exportedFileList.appendChild(createFileListItem('bmp', uri));
    exportedFileList.appendChild(createFileListItem('png', pngURL));
    
  });
}

const refreshImg = () => {
  if (!sprite.selected) {
    return alert('No files selected');
  }
  
  ctx.putImageData(sprite.imgData, 0, 0);
}


const createFileListItem = (ext, uri) => {
  let name = inputName.value + '.' + ext;
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.innerText = name;
  a.download = name;
  a.href = uri;
  li.appendChild(a)
  return li;
}

const saveHeader = () => {
  let _x = 1
  let _y = sprite.height
  let pixels = sprite.imgMData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    let red = pixels[i];
    if (_x > sprite.width) {
      _x = 1
      _y--
    }

    if (red == 0) {
      // sprite.Xs.push('' + _x + ', ' + _y)
      sprite.Xs.push(_x)
      sprite.Ys.push(_y)
    }
    _x++
  }

  const pre = document.createElement("pre");
  const code = document.createElement("code");

  code.innerHTML = `const int NUM_POINTS = ${sprite.Xs.length};
const unsigned long x_points[NUM_POINTS] = ${sprite.Xs.join(',')};
const unsigned long y_points[NUM_POINTS] = ${sprite.Ys.join(',')};
`
  pre.appendChild(code);
  exportedFileList.appendChild(pre);
}