
const sidebar = document.querySelector('.sidebar')
const toggle = document.querySelector('.menu-toggler')
const menu = document.querySelector('.toggler')

// in large screen
toggle.addEventListener('click', () => {
    sidebar.classList.toggle("collapsed")
})

const collapsedHeight = "56px"
const fullSidebarheight = "calc(100vh - 32px)"
const toggleMenu = (isActive) => {
    sidebar.style.height = isActive ? `${sidebar.scrollHeight}px` : collapsedHeight
    const spanTag = document.querySelector(".span")

    spanTag.innerHTML = isActive ? `<i class="fa fa-close"></i>` : `<i class="fa fa-bars"></i>`
}

// in small screen
menu.addEventListener("click", () => {
    toggleMenu(sidebar.classList.toggle("menu-active"))
})

// optional code
window.addEventListener('resize', () => {
    if(window.innerWidth >= 1024){
        sidebar.style.height = fullSidebarheight
    }else{
        sidebar.classList.remove("collapsed")
        sidebar.style.height = "auto"
        toggleMenu(sidebar.classList.contains("menu-active"))
    }
})