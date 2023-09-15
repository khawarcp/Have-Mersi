const filterDrawerButton = document.querySelector('.js-drawer-open-collection-filters');
const filterDrawerButtonClose = document.querySelectorAll('.drawer__close-button');
const filterDrawerDiv = document.getElementById('FilterDrawer');
filterDrawerButton.addEventListener('click', toggleDrawer)

filterDrawerButtonClose.forEach(item => {
   item.addEventListener('click', toggleDrawer)
})

function toggleDrawer(e){
     e.preventDefault()
    if(!filterDrawerDiv.classList.contains('drawer--is-open-active')){
        filterDrawerDiv.classList.add('drawer--is-open-active')
        document.body.classList.add('js-drawer-open-active')
        document.querySelector('html').classList.add('js-drawer-open-active')
    }else{
        filterDrawerDiv.classList.remove('drawer--is-open-active')
        document.body.classList.remove('js-drawer-open-active')
        document.querySelector('html').classList.remove('js-drawer-open-active')
    }
}
