let db = firebase.firestore()
const blogList = document.querySelector('.blog-list');
const menuTog = document.querySelector('.menu-tog');
const closeTog = document.querySelector('.close-tog');
const menu = document.querySelector('.menu');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');

let blogPosts;

menuTog.addEventListener('click', () => {
    menu.classList.add('active');
})

closeTog.addEventListener('click', () => {
    menu.classList.remove('active')
})

let postsArray =[];
let page = 0;

db.collection("posts").get().then((querySnapshot) => {
    posts = querySnapshot;
    querySnapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        console.log(data)
        postsArray.push(data)
    })

    appendPosts()
})

function appendPosts(){
    for(let i = page; i < page + 6; i++){
        let data = postsArray[i];
        console.log(data)
        if(postsArray[i] !== undefined){
            let li = document.createElement('li');
            li.classList.add('blog-post-row');
    
            let containerOne = document.createElement('div');
            containerOne.classList.add('row-container-one');
    
            let containerTwo = document.createElement('div');
            containerTwo.classList.add('row-container-two');
    
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('post-title');
            titleDiv.innerText = `${data.title}`;
    
            let dateDiv = document.createElement('div');
            dateDiv.classList.add('post-date');
            dateDiv.innerText = `${data.postDate}`;
    
    
            let imageDiv = document.createElement('div');
            imageDiv.classList.add('post-image');
    
            let imageDivInner = document.createElement('div');
            imageDivInner.classList.add('post-image-inner');
            imageDivInner.style.backgroundImage = `url(${data.image})`
            imageDiv.appendChild(imageDivInner);
    
            let postLink = document.createElement('div');
            postLink.classList.add('post-link');
            postLink.innerText = `Open article`
            postLink.addEventListener('click', ()=>{
                window.location.href = `post.html?id=${data.id}`;
            })
    
            containerOne.append(titleDiv, dateDiv);
            containerTwo.append(imageDiv, postLink)
            li.append(containerOne, containerTwo);
            
            blogList.appendChild(li)
        }
       

    }

    blogPosts = [...document.querySelectorAll('.blog-post-row')];

    blogPosts.forEach((post, idx) => {
        post.addEventListener('click', () => {
            post.classList.toggle('active');
            for(let i = 0; i < blogPosts.length; i++){
                if (i !== idx){
                    blogPosts[i].classList.remove('active');
                }
            }
        })
       
    })
}

// Pagination
next.addEventListener('click', () => {
    blogList.innerHTML = '';
    page += 6;
    if(page > postsArray.length){
        page = 0;
    }
    console.log(page)
    appendPosts()
})

previous.addEventListener('click', () => {
    blogList.innerHTML = '';
    page -= 6;
    if(page < 0){
        // Using mod to account for where the post array length is not a multiple of 6.
        page = postsArray.length -  postsArray.length % 6;  ;
    }
    console.log(page)
    appendPosts()
})
