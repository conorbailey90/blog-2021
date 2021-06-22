let db = firebase.firestore()
const postSection = document.querySelector('.post-section')
const menuTog = document.querySelector('.menu-tog');
const closeTog = document.querySelector('.close-tog');
const menu = document.querySelector('.menu');

let blogPosts;

menuTog.addEventListener('click', () => {
    menu.classList.add('active');
})

closeTog.addEventListener('click', () => {
    menu.classList.remove('active')
})


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get('id'));

var docRef = db.collection("posts").doc(urlParams.get('id'));
console.log(docRef)

docRef.get().then((doc) => {
    if (doc.exists) {
        let data = doc.data();
        console.log("Document data:", doc.data());
        // destructure the data object
        let {title, postDate, summary, image, content, video}  = data;
       
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = `<h1>${title}</h1>`

        let postContainer = document.createElement('div');
        postContainer.classList.add('post-container');

        let contentDiv = document.createElement('div');
        contentDiv.innerHTML = `<p>${content}</p>`;

    

       postContainer.append(contentDiv)


        let videoFrame = document.createElement('iframe');
        videoFrame.src = video;
        // videoFrame.width = 560;
        // videoFrame.height = 315;
        videoFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        videoFrame.allowFullscreen = true;
        // videoFrame.frameBorder = 0


        // <iframe width="560" height="315" src="https://www.youtube.com/embed/MhEPd1HoVH8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


        postSection.append(titleDiv, postContainer, videoFrame)
      
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});