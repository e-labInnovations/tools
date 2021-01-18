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
  xbmData: [],
  imgData: null,
  imgMData: null
}

accuracy.addEventListener('change', e => {
  accuracyDisplay.innerText = e.target.value;
})

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
}

const createXBM = () => {
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