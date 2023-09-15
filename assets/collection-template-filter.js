const filterCol = document.querySelectorAll('.shop-filters-col')
filterCol.forEach(item => {
    item.addEventListener('click', function(){
        const filterDiv = item.querySelector('.filr-div')
        if(!filterDiv.classList.contains('active-filter-div')){
           filterDiv.classList.add('active-filter-div')
           item.classList.add('active-filterCol')
        }else{
             filterDiv.classList.remove('active-filter-div')
             item.classList.remove('active-filterCol')
        }
    })
})