let galaxy = document.querySelector('#galaxy')
let clusterDisplay = document.querySelector('#cluster')
let systemIndicators

fetch("./data.json")
.then(response => {
   return response.json();
})
.then(jsondata => {
  for (var i in jsondata) {
    let indicator = document.createElement('div')
    let circle = document.createElement('div')
    let textbox = document.createElement('span')
    let name = document.createElement('h6')
    name.innerHTML = jsondata[i]['name']

    indicator.classList.add('indicator')
    indicator.classList.add(jsondata[i]['name'].replaceAll(' ', '-'))
    indicator.style.top = jsondata[i]['top']
    indicator.style.left = jsondata[i]['left']

    // Show cluster name
    circle.addEventListener('mouseover', function() {
      this.nextElementSibling.style.visibility = 'visible'
      this.nextElementSibling.style.opacity = 1
    })

    circle.addEventListener('mouseout', function() {
      this.nextElementSibling.removeAttribute('style');
    })

    circle.addEventListener('click', function() {
      clusterOpen = true
      clusterDisplay.innerHTML = ''

      for (var i in jsondata) {
        let clusterName = this.parentElement.classList[1].replaceAll('-', ' ')

        if (jsondata[i]['name'] == clusterName) {
          clusterDisplay.style.backgroundImage = 'url("img/clusters/' + clusterName + '.webp")'
          clusterDisplay.style.visibility = 'visible'

          setTimeout(function () {
            clusterDisplay.style.opacity = 1;
          }, 2500);

          for (var j in jsondata[i]['systems']) {
            let indicator = document.createElement('div')
            let circle = document.createElement('div')
            let textbox = document.createElement('span')
            let name = document.createElement('h6')
            name.innerHTML = jsondata[i]['systems'][j]['name']

            indicator.classList.add('indicator')
            indicator.classList.add(jsondata[i]['systems'][j]['name'].replaceAll(' ', '-'))
            indicator.style.top = jsondata[i]['systems'][j]['top']
            indicator.setAttribute('data-org-y', jsondata[i]['systems'][j]['top'].replaceAll('%', ''))
            indicator.style.left = jsondata[i]['systems'][j]['left']
            indicator.setAttribute('data-org-x', jsondata[i]['systems'][j]['left'].replaceAll('%', ''))

            circle.addEventListener('mouseover', function() {
              this.nextElementSibling.style.visibility = 'visible'
              this.nextElementSibling.style.opacity = 1
            })

            circle.addEventListener('mouseout', function() {
              this.nextElementSibling.removeAttribute('style');
            })

            indicator.appendChild(circle)
            textbox.appendChild(name)
            indicator.appendChild(textbox)
            clusterDisplay.appendChild(indicator)

            systemIndicators = document.querySelectorAll('#cluster div.indicator')
          }

          break;
        }
      }

      // Animate transition
      const yPos = getComputedStyle(this.parentElement).top
      const xPos = getComputedStyle(this.parentElement).left
      let galaxy = document.querySelector('#galaxy')
      galaxy.style.transformOrigin = xPos + ' ' + yPos
      galaxy.style.animation = 'zoom-transition 3s ease-out normal'

      setTimeout(function () {
        galaxy.removeAttribute('style')
      }, 3000);
    })

    indicator.appendChild(circle)
    textbox.appendChild(name)
    indicator.appendChild(textbox)
    galaxy.appendChild(indicator)
  }
});

document.addEventListener('keydown', function functionName(e) {
  if (e.key == 'Escape' && clusterOpen) {
    clusterOpen = false
    clusterDisplay.style.opacity = 0
    galaxy.style.animation = 'zoom-transition-reverse 1s ease-in'

    setTimeout(function () {
      clusterDisplay.style.visibility= 'hidden'
    }, 300);
  }
})

window.addEventListener('resize', function functionName() {
  clusterDisplay.style.width = window.innerWidth +'px'
  clusterDisplay.style.height = window.innerHeight +'px'
})

clusterDisplay.addEventListener('mousemove', function functionName(e) {
  let xPos = e.clientX / window.innerWidth
  let yPos = e.clientY / window.innerHeight
  clusterDisplay.style.backgroundPosition = (xPos * 100) + '% ' + (yPos * 100) + '%'

  let imgOutsideViewport

  let img = new Image()
  img.src = clusterDisplay.style.backgroundImage.replace('url(', '').replace(')', '').replaceAll('"', '')
  console.log(img.src, img.width, img.height)
  
  if (window.innerWidth / window.innerHeight > img.width / img.height) {
    let heightAtPerfectRatio = img.height * window.innerWidth / img.width
    imgOutsideViewport = heightAtPerfectRatio - window.innerHeight

    systemIndicators.forEach(indicator => {
      const orgX = indicator.getAttribute('data-org-x')
      const orgY = indicator.getAttribute('data-org-y')

      indicator.style.top = 'calc(' + orgY + '% - ' + imgOutsideViewport * yPos + 'px)'
      indicator.style.left = orgX + '%'
    });
  } else {
    let widthAtPerfectRatio = img.width * window.innerHeight / img.height
    imgOutsideViewport = widthAtPerfectRatio - window.innerWidth
    
    systemIndicators.forEach(indicator => {
      const orgX = indicator.getAttribute('data-org-x')
      const orgY = indicator.getAttribute('data-org-y')

      indicator.style.top = orgY + '%'
      indicator.style.left = 'calc(' + orgX + '% - ' + imgOutsideViewport * xPos + 'px)'
    });
  }
})
