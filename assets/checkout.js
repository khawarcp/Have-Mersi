(function(){
  const upseSellProduct = {
    init: function(){
      this.addExtraContent();

      const upsellProducts = [
        {
          product: upsellProduct,
          variant: upsellVariant,
        },
        {
          product: upsellProduct2,
          variant: upsellVariant2,
        }
      ];

      upsellProducts.forEach((item, index) => {
        if ( item.product && item.variant) {
          const variantItem = Checkout.$("[data-variant-id="+item.variant+"]");
          if ( !variantItem.length ) {

            const addToCartButtonId = 'upsellAtc-'+ index;
            upseSellProduct.appendProduct(addToCartButtonId, item.product, item.variant, function(product, variant){

              const variantId = variant;

              Checkout.$('#' + addToCartButtonId).on('click', function(e){
                e.preventDefault();
                upseSellProduct.addToCart(variantId, Checkout.$(this));
              });

            });
          }
        }
      });
    },

    addExtraContent: function(){
      if ( showBlurb === false){return;}
      let html = `
        <div class="checkout-blurb">
          <h3 class="checkout-blurb__title">${blurbTitle}</h3>

          <div class="checkout-blurb--content">${blurbContent}</div>
        </div>
      `;

      Checkout.$('.order-summary__section--total-lines').after('<div class="blurb-desktop">' + html + '</div>');
      Checkout.$('.step__footer').after('<div class="blurb-mobile">' + html + '</div>');
    },

    appendProduct: function(atcId, selectedProduct, selectVariant, callback){
      if ( !Checkout.$('.upsell-title').length){
        const containerHTML = `<h3 class="upsell-title">Complete your look</h3> <div id="upsell-product"></div>`;
        Checkout.$('.order-summary__section--product-list').after(containerHTML);

      }
      Checkout.$.getJSON('/products/'+selectedProduct+'.js', function(product) {
        if ( product.available === true) {
          let variant = null;
          for(let i = 0; i < product.variants.length; i++){
            if ( product.variants[i].id == selectVariant) {
              variant = product.variants[i];
            }
          }

          if ( !variant) {
            return;
          }

          let price = upseSellProduct.formatMoney(variant.price, Shopify.Checkout.moneyFormat)
          let upsellHTML = `
            <div class="upsell-container">
              <div><img class="upsell-product-image" src="${variant.featured_image.src}" /></div>
              <div class="upsell-product-title-column">
                <span class="upsell-product-title">${product.title} </span>
                <span class="upsell-variant-title">${variant.title}</span>
              </div>
              <div class="upsell-price-column">
                              <span class="upsell-product-price">${price}</span>
                <button type="button" class="upsell-btn" id="${atcId}">ADD</button>
              </div>
            </div></div>
          `;

          
          Checkout.$('#upsell-product').append(upsellHTML);
          callback(product, variant.id);
        }
      });
    },

    addToCart: function(variantId, $btn){
      let formData = {
        'items': [{
          'id': variantId,
          'quantity': 1 
        }]
      };

      $btn.attr('disabled', 'disabled').fadeTo('fast', .5);

      Checkout.$.ajax({
        type: "POST",
        url: "/cart/add.js",
        dataType: 'JSON',
        data: formData,
        success: function(response){
          location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Request Error", errorThrown);
          $btn.removeAttr('disabled').fadeTo('fast', 1);
        }
      });

    },

    formatMoney: function(cents, format) {
      if (typeof cents == 'string') { cents = cents.replace('.',''); }
      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = (format || this.money_format);
    
      function defaultOption(opt, def) {
        return (typeof opt == 'undefined' ? def : opt);
      }
    
      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal   = defaultOption(decimal, '.');
    
        if (isNaN(number) || number == null) { return 0; }
    
        number = (number/100.0).toFixed(precision);
    
        var parts   = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents   = parts[1] ? (decimal + parts[1]) : '';
    
        return dollars + cents;
      }
    
      switch(formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
      }
    
      return formatString.replace(placeholderRegex, value);
    }
  }

  window.addEventListener('load', (event) => {
    upseSellProduct.init();
  });
})();

