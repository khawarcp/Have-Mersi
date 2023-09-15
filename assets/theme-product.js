// <!--     Custom changes (Dmitry) -->
$('.template-product .product-single__meta .product-single__description .learn_more').click(function() {
  $('.template-product .product-single__meta .product-single__description').toggleClass('more');
  if($(this).text()=="See More")
    {
      $(this).text("See Less");
    } else {
      $(this).text("See More");
    }
});