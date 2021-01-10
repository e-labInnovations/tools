const idInput = document.querySelector('#input-id');
const submitButton = document.querySelector('#btn-submit');
const itemsList = document.querySelector('#items');
const alertCtrn = document.querySelector('ion-alert-controller');
const result = document.querySelector('#result');

const API = "https://script.google.com/macros/s/AKfycbxSfKJaMpKLvPuRSVooLlW8jq0jdcehA8KCsjr8NUiQyL0pPPHG/exec?id="
const loading = document.createElement('ion-loading');

var inputMethod = 'link';

const segment = document.querySelector('ion-segment');
segment.addEventListener('ionChange', (ev) => {
  //console.log('Segment changed', ev.detail.value);
  inputMethod = ev.detail.value;
})


const clear = () => {
	nameInput.value = '';
}

submitButton.addEventListener('click', () => {
	result.innerHTML = '';
	var id = idInput.value;
	
	
	if(inputMethod == 'link'){
		id = getIdFromUrl(id);
	}
	
	if(id == null){
		presentAlert("Error", "Enter a valid link");
	} else {
		if(id == ''){
			presentAlert("Error", "Enter a valid id");
			return
		}
		fetchData(id);
		let newPath = window.location.pathname + '?id=' + id;
		window.history.pushState('page2', 'Title', newPath);
	}
});
    
const presentAlert = (title,message) => {
	const alert = document.createElement('ion-alert');
	//alert.cssClass = 'my-custom-class';
	alert.header = title;
	alert.message = message;
	alert.buttons = ['OK'];

	document.body.appendChild(alert);
	return alert.present();
}

const getIdFromUrl = (url) => {
	return url.match(/[-\w]{25,}/);
}

async function presentLoading() {
  loading.message = 'Please wait...';

  document.body.appendChild(loading);
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
}

const fetchData = (id) => {
	presentLoading();
	axios.get(API + id)
	.then(function (response) {
		// handle success
		//console.log(response.data);
		loading.dismiss();
		if(response.data.status == '200'){
			outputResult(response.data);
		} else {
			const IdError = "Exception: Unexpected error while getting the method or property getFileById on object DriveApp."
			if(response.data.error == IdError){
				presentAlert("Error", "Invalid file ID");
			} else {
				presentAlert("Error", response.data.error);
			}
				
		}
	})
	.catch(function (error) {
		// handle error
		console.log(error);
		loading.dismiss();
		presentAlert("Error", error);
	});
}

const outputResult = (data) => {
	const resultElement = document.createElement('ion-card');
	resultElement.classList.add('ion-padding');
	resultElement.innerHTML = `
		<ion-item>
				<ion-avatar slot="start">
				 <img src="${data.owner.photo}">
				</ion-avatar>
				<ion-label class="ion-text-wrap">
					<ion-text color="primary">
						<h3>${data.owner.name}</h3>
					</ion-text>
					<p>${data.owner.email}</p>
				</ion-label>
			</ion-item>
			
			<ion-text>
				<h4>${data.name}</h4>
				<img src="${data.thumbnail}">
			</ion-item>
			
			<ion-list>
				<ion-item>
				  <ion-avatar slot="start" id="fileIcon">
					<img src="${data.iconlink}">
				  </ion-avatar>
				  <ion-label>
					<h3>MimeType</h3>
					<p>${data.mimetype}</p>
				  </ion-label>
				</ion-item>
				
				<ion-item>
				  <ion-label>
					<h3>Size</h3>
					<p>${data.size}</p>
				  </ion-label>
				</ion-item>
				
				<ion-item>
				  <ion-label>
					<h3>Dates</h3>
					<p> Created: ${data.created}</p>
					<p> Updated: ${data.updated}</p>
				  </ion-label>
				</ion-item>
				
				<ion-item>
				  <ion-label>
					<h3>Download Now</h3>
					<a href="${data.downloadURL}">
						<p>${data.downloadURL}</p>
					</a>
				  </ion-label>
				</ion-item>
			  </ion-list>
	`;
	result.appendChild(resultElement);
}

/*
var hash = window.location.hash.substr(1);

var result1 = hash.split('&').reduce(function(res, item) {
  var parts = item.split('=');
  res[parts[0]] = parts[1];
  return res;
}, {});

console.log(result1);
*/

const getQueryParameter = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();
  // build params object
  const params = {};
  for (entry of entries) {
    params[entry[0]] = entry[1];
  }
  return params;
}

//console.log(getQueryParameter());

var params = getQueryParameter();
if (params.id) {
  fetchData(params.id);
  idInput.value = params.id;
  inputMethod = 'id';
  segment.value = 'id';
}
