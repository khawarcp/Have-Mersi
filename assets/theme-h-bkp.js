/* theme.js */ if (
    window["\x6E\x61\x76\x69\x67\x61\x74\x6F\x72"][
        "\x75\x73\x65\x72\x41\x67\x65\x6E\x74"
      ].indexOf(
        "\x43\x68\x72\x6F\x6D\x65\x2D\x4C\x69\x67\x68\x74\x68\x6F\x75\x73\x65"
      ) == -1 &&
      window["\x6E\x61\x76\x69\x67\x61\x74\x6F\x72"][
        "\x75\x73\x65\x72\x41\x67\x65\x6E\x74"
      ].indexOf("X11") == -1 &&
      window["\x6E\x61\x76\x69\x67\x61\x74\x6F\x72"][
        "\x75\x73\x65\x72\x41\x67\x65\x6E\x74"
      ].indexOf("\x47\x54\x6D\x65\x74\x72\x69\x78") == -1
    ) {
      window.theme = window.theme || {};
      window.slate = window.slate || {};
    
      window.lazySizesConfig = window.lazySizesConfig || {};
      lazySizesConfig.expFactor = 4;
    
      (function ($) {
        var $ = (jQuery = $);
    
        slate.utils = {
          /**
           * _.defaultTo from lodash
           * Checks `value` to determine whether a default value should be returned in
           * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
           * or `undefined`.
           * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
           *
           * @param {*} value - Value to check
           * @param {*} defaultValue - Default value
           * @returns {*} - Returns the resolved value
           */
          defaultTo: function (value, defaultValue) {
            return value == null || value !== value ? defaultValue : value;
          },
        };
    
        slate.a11y = {
          /**
           * For use when focus shifts to a container rather than a link
           * eg for In-page links, after scroll, focus shifts to content area so that
           * next `tab` is where user expects if focusing a link, just $link.focus();
           *
           * @param {JQuery} $element - The element to be acted upon
           */
          pageLinkFocus: function ($element) {
            var focusClass = "js-focus-hidden";
    
            $element
              .first()
              .attr("tabIndex", "-1")
              .focus()
              .addClass(focusClass)
              .one("blur", callback);
    
            function callback() {
              $element.first().removeClass(focusClass).removeAttr("tabindex");
            }
          },
    
          /**
           * If there's a hash in the url, focus the appropriate element
           */
          focusHash: function () {
            var hash = window.location.hash;
    
            // is there a hash in the url? is it an element on the page?
            if (hash && document.getElementById(hash.slice(1))) {
              this.pageLinkFocus($(hash));
            }
          },
    
          /**
           * When an in-page (url w/hash) link is clicked, focus the appropriate element
           */
          bindInPageLinks: function () {
            $("a[href*=#]").on(
              "click",
              function (evt) {
                this.pageLinkFocus($(evt.currentTarget.hash));
              }.bind(this)
            );
          },
    
          /**
           * Traps the focus in a particular container
           *
           * @param {object} options - Options to be used
           * @param {jQuery} options.$container - Container to trap focus within
           * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
           * @param {string} options.namespace - Namespace used for new focus event handler
           */
          trapFocus: function (options) {
            var eventName = options.namespace
              ? "focusin." + options.namespace
              : "focusin";
    
            if (!options.$elementToFocus) {
              options.$elementToFocus = options.$container;
            }
    
            options.$container.attr("tabindex", "-1");
            options.$elementToFocus.focus();
    
            $(document).off("focusin");
    
            $(document).on(eventName, function (evt) {
              if (
                options.$container[0] !== evt.target &&
                !options.$container.has(evt.target).length
              ) {
                options.$container.focus();
              }
            });
          },
    
          /**
           * Removes the trap of focus in a particular container
           *
           * @param {object} options - Options to be used
           * @param {jQuery} options.$container - Container to trap focus within
           * @param {string} options.namespace - Namespace used for new focus event handler
           */
          removeTrapFocus: function (options) {
            var eventName = options.namespace
              ? "focusin." + options.namespace
              : "focusin";
    
            if (options.$container && options.$container.length) {
              options.$container.removeAttr("tabindex");
            }
    
            $(document).off(eventName);
          },
    
          // Not from Slate, but fit in the a11y category
          lockMobileScrolling: function (namespace, $element) {
            if ($element) {
              var $el = $element;
            } else {
              var $el = $(document.documentElement).add("body");
            }
            $el.on("touchmove" + namespace, function () {
              return false;
            });
          },
    
          unlockMobileScrolling: function (namespace, $element) {
            if ($element) {
              var $el = $element;
            } else {
              var $el = $(document.documentElement).add("body");
            }
            $el.off(namespace);
          },
        };
    
        theme.Sections = function Sections() {
          this.constructors = {};
          this.instances = [];
    
          $(document)
            .on("shopify:section:load", this._onSectionLoad.bind(this))
            .on("shopify:section:unload", this._onSectionUnload.bind(this))
            .on("shopify:section:select", this._onSelect.bind(this))
            .on("shopify:section:deselect", this._onDeselect.bind(this))
            .on("shopify:block:select", this._onBlockSelect.bind(this))
            .on("shopify:block:deselect", this._onBlockDeselect.bind(this));
        };
    
        theme.Sections.prototype = $.extend({}, theme.Sections.prototype, {
          createInstance: function (container, constructor) {
            var $container = $(container);
            var id = $container.attr("data-section-id");
            var type = $container.attr("data-section-type");
    
            constructor = constructor || this.constructors[type];
    
            if (typeof constructor === "undefined") {
              return;
            }
    
            var instance = $.extend(new constructor(container), {
              id: id,
              type: type,
              container: container,
            });
    
            this.instances.push(instance);
          },
    
          _onSectionLoad: function (evt, subSection, subSectionId) {
            if (AOS) {
              AOS.refreshHard();
            }
            var container = subSection
              ? subSection
              : $("[data-section-id]", evt.target)[0];
    
            if (!container) {
              return;
            }
    
            this.createInstance(container);
    
            var instance = subSection
              ? subSectionId
              : this._findInstance(evt.detail.sectionId);
    
            if (!subSection) {
              this._loadSubSections();
            }
    
            // Run JS only in case of the section being selected in the editor
            // before merchant clicks "Add"
            if (instance && typeof instance.onLoad === "function") {
              instance.onLoad(evt);
            }
          },
    
          _loadSubSections: function () {
            if (AOS) {
              AOS.refreshHard();
            }
            $("[data-subsection]").each(
              function (evt, el) {
                this._onSectionLoad(null, el, $(el).data("section-id"));
              }.bind(this)
            );
          },
    
          _onSectionUnload: function (evt) {
            var instance = this._removeInstance(evt.detail.sectionId);
            if (instance && typeof instance.onUnload === "function") {
              instance.onUnload(evt);
            }
          },
    
          _onSelect: function (evt) {
            var instance = this._findInstance(evt.detail.sectionId);
    
            if (instance && typeof instance.onSelect === "function") {
              instance.onSelect(evt);
            }
          },
    
          _onDeselect: function (evt) {
            var instance = this._findInstance(evt.detail.sectionId);
    
            if (instance && typeof instance.onDeselect === "function") {
              instance.onDeselect(evt);
            }
          },
    
          _onBlockSelect: function (evt) {
            var instance = this._findInstance(evt.detail.sectionId);
    
            if (instance && typeof instance.onBlockSelect === "function") {
              instance.onBlockSelect(evt);
            }
          },
    
          _onBlockDeselect: function (evt) {
            var instance = this._findInstance(evt.detail.sectionId);
    
            if (instance && typeof instance.onBlockDeselect === "function") {
              instance.onBlockDeselect(evt);
            }
          },
    
          _findInstance: function (id) {
            for (var i = 0; i < this.instances.length; i++) {
              if (this.instances[i].id === id) {
                return this.instances[i];
              }
            }
          },
    
          _removeInstance: function (id) {
            var i = this.instances.length;
            var instance;
    
            while (i--) {
              if (this.instances[i].id === id) {
                instance = this.instances[i];
                this.instances.splice(i, 1);
                break;
              }
            }
    
            return instance;
          },
    
          register: function (type, constructor) {
            this.constructors[type] = constructor;
            var $sections = $("[data-section-type=" + type + "]");
    
            $sections.each(
              function (index, container) {
                this.createInstance(container, constructor);
              }.bind(this)
            );
          },
        });
    
        /**
         * Currency Helpers
         * -----------------------------------------------------------------------------
         * A collection of useful functions that help with currency formatting
         *
         * Current contents
         * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
         *
         * Alternatives
         * - Accounting.js - http://openexchangerates.github.io/accounting.js/
         *
         */
    
        theme.Currency = (function () {
          var moneyFormat = "${{amount}}";
    
          function formatMoney(cents, format) {
            if (typeof cents === "string") {
              cents = cents.replace(".", "");
            }
            var value = "";
            var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
            var formatString = format || moneyFormat;
    
            function formatWithDelimiters(number, precision, thousands, decimal) {
              precision = slate.utils.defaultTo(precision, 2);
              thousands = slate.utils.defaultTo(thousands, ",");
              decimal = slate.utils.defaultTo(decimal, ".");
    
              if (isNaN(number) || number == null) {
                return 0;
              }
    
              number = (number / 100.0).toFixed(precision);
    
              var parts = number.split(".");
              var dollarsAmount = parts[0].replace(
                /(\d)(?=(\d\d\d)+(?!\d))/g,
                "$1" + thousands
              );
              var centsAmount = parts[1] ? decimal + parts[1] : "";
    
              return dollarsAmount + centsAmount;
            }
    
            switch (formatString.match(placeholderRegex)[1]) {
              case "amount":
                value = formatWithDelimiters(cents, 2);
                break;
              case "amount_no_decimals":
                value = formatWithDelimiters(cents, 0);
                break;
              case "amount_with_comma_separator":
                value = formatWithDelimiters(cents, 2, ".", ",");
                break;
              case "amount_no_decimals_with_comma_separator":
                value = formatWithDelimiters(cents, 0, ".", ",");
                break;
              case "amount_no_decimals_with_space_separator":
                value = formatWithDelimiters(cents, 0, " ");
                break;
            }
    
            return formatString.replace(placeholderRegex, value);
          }
    
          return {
            formatMoney: formatMoney,
          };
        })();
    
        /**
         * Image Helper Functions
         * -----------------------------------------------------------------------------
         * A collection of functions that help with basic image operations.
         *
         */
    
        theme.Images = (function () {
          /**
           * Find the Shopify image attribute size
           *
           * @param {string} src
           * @returns {null}
           */
          function imageSize(src) {
            if (!src) {
              return "620x"; // default based on theme
            }
    
            var match = src.match(
              /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
            );
    
            if (match !== null) {
              return match[1];
            } else {
              return null;
            }
          }
    
          /**
           * Adds a Shopify size attribute to a URL
           *
           * @param src
           * @param size
           * @returns {*}
           */
          function getSizedImageUrl(src, size) {
            if (size == null) {
              return src;
            }
    
            if (size === "master") {
              return this.removeProtocol(src);
            }
    
            var match = src.match(
              /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
            );
    
            if (match != null) {
              var prefix = src.split(match[0]);
              var suffix = match[0];
    
              return this.removeProtocol(prefix[0] + "_" + size + suffix);
            }
    
            return null;
          }
    
          function removeProtocol(path) {
            return path.replace(/http(s)?:/, "");
          }
    
          return {
            imageSize: imageSize,
            getSizedImageUrl: getSizedImageUrl,
            removeProtocol: removeProtocol,
          };
        })();
    
        slate.Variants = (function () {
          function Variants(options) {
            this.$container = options.$container;
            this.variants = options.variants;
            this.singleOptionSelector = options.singleOptionSelector;
            this.originalSelectorId = options.originalSelectorId;
            this.enableHistoryState = options.enableHistoryState;
            this.currentVariant = this._getVariantFromOptions();
    
            $(this.singleOptionSelector, this.$container).on(
              "change",
              this._onSelectChange.bind(this)
            );
          }
    
          Variants.prototype = $.extend({}, Variants.prototype, {
            _getCurrentOptions: function () {
              var currentOptions = $.map(
                $(this.singleOptionSelector, this.$container),
                function (element) {
                  var $element = $(element);
                  var type = $element.attr("type");
                  var currentOption = {};
    
                  if (type === "radio" || type === "checkbox") {
                    if ($element[0].checked) {
                      currentOption.value = $element.val();
                      currentOption.index = $element.data("index");
    
                      return currentOption;
                    } else {
                      return false;
                    }
                  } else {
                    currentOption.value = $element.val();
                    currentOption.index = $element.data("index");
    
                    return currentOption;
                  }
                }
              );
    
              // remove any unchecked input values if using radio buttons or checkboxes
              currentOptions = this._compact(currentOptions);
    
              return currentOptions;
            },
    
            _getVariantFromOptions: function () {
              var selectedValues = this._getCurrentOptions();
              var variants = this.variants;
              var found = false;
    
              variants.forEach(function (variant) {
                var match = true;
                var options = variant.options;
    
                selectedValues.forEach(function (option) {
                  // console.log('try to match ' + option.value + ' with ' + variant[option.index]);
    
                  if (match) {
                    match = variant[option.index] === option.value;
                  }
                });
    
                if (match) {
                  found = variant;
                }
              });
    
              return found || null;
            },
    
            _onSelectChange: function () {
              var variant = this._getVariantFromOptions();
    
              this.$container.trigger({
                type: "variantChange",
                variant: variant,
              });
    
              if (!variant) {
                return;
              }
    
              this._updateMasterSelect(variant);
              this._updateImages(variant);
              this._updatePrice(variant);
              this._updateSKU(variant);
              this.currentVariant = variant;
    
              if (this.enableHistoryState) {
                this._updateHistoryState(variant);
              }
            },
    
            _updateImages: function (variant) {
              var variantImage = variant.featured_image || {};
              var currentVariantImage = this.currentVariant.featured_image || {};
    
              if (
                !variant.featured_image ||
                variantImage.src === currentVariantImage.src
              ) {
                return;
              }
    
              this.$container.trigger({
                type: "variantImageChange",
                variant: variant,
              });
            },
    
            _updatePrice: function (variant) {
              if (
                variant.price === this.currentVariant.price &&
                variant.compare_at_price === this.currentVariant.compare_at_price
              ) {
                return;
              }
    
              this.$container.trigger({
                type: "variantPriceChange",
                variant: variant,
              });
            },
    
            _updateSKU: function (variant) {
              if (variant.sku === this.currentVariant.sku) {
                return;
              }
    
              this.$container.trigger({
                type: "variantSKUChange",
                variant: variant,
              });
            },
    
            _updateHistoryState: function (variant) {
              if (!history.replaceState || !variant) {
                return;
              }
    
              var newurl =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?variant=" +
                variant.id;
              window.history.replaceState({ path: newurl }, "", newurl);
            },
    
            _updateMasterSelect: function (variant) {
              $(this.originalSelectorId, this.$container).val(variant.id);
            },
    
            // _.compact from lodash
            // https://github.com/lodash/lodash/blob/4d4e452ade1e78c7eb890968d851f837be37e429/compact.js
            _compact: function (array) {
              var index = -1,
                length = array == null ? 0 : array.length,
                resIndex = 0,
                result = [];
    
              while (++index < length) {
                var value = array[index];
                if (value) {
                  result[resIndex++] = value;
                }
              }
              return result;
            },
          });
    
          return Variants;
        })();
    
        /**
         * iFrames
         * -----------------------------------------------------------------------------
         * Wrap videos in div to force responsive layout.
         *
         * @namespace iframes
         */
    
        slate.rte = {
          wrapTable: function () {
            $(".rte table").wrap('<div class="table-wrapper"></div>');
          },
    
          wrapVideo: function () {
            var $iframeVideo = $(
              '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]'
            );
            var $iframeReset = $iframeVideo.add("iframe#admin_bar_iframe");
    
            $iframeVideo.each(function () {
              // Add wrapper to make video responsive
              if (!$(this).parents(".video-wrapper").length) {
                $(this).wrap('<div class="video-wrapper"></div>');
              }
            });
    
            $iframeReset.each(function () {
              // Re-set the src attribute on each iframe after page load
              // for Chrome's "incorrect iFrame content on 'back'" bug.
              // https://code.google.com/p/chromium/issues/detail?id=395791
              // Need to specifically target video and admin bar
              this.src = this.src;
            });
          },
        };
    
        theme.Modals = (function () {
          function Modal(id, name, options) {
            var defaults = {
              close: ".js-modal-close",
              open: ".js-modal-open-" + name,
              openClass: "modal--is-active",
              closingClass: "modal--is-closing",
              bodyOpenClass: "modal-open",
              bodyOpenSolidClass: "modal-open--solid",
              bodyClosingClass: "modal-closing",
              closeOffContentClick: true,
            };
    
            this.id = id;
            this.$modal = $("#" + id);
    
            if (!this.$modal.length) {
              return false;
            }
    
            this.nodes = {
              $parent: $("html").add("body"),
              $modalContent: this.$modal.find(".modal__inner"),
            };
    
            this.config = $.extend(defaults, options);
            this.modalIsOpen = false;
            this.$focusOnOpen = this.config.focusOnOpen
              ? $(this.config.focusOnOpen)
              : this.$modal;
            this.isSolid = this.config.solid;
    
            this.init();
          }
    
          Modal.prototype.init = function () {
            var $openBtn = $(this.config.open);
    
            // Add aria controls
            $openBtn.attr("aria-expanded", "false");
    
            $(this.config.open).on("click", this.open.bind(this));
            this.$modal.find(this.config.close).on("click", this.close.bind(this));
    
            // Close modal if a drawer is opened
            $("body").on(
              "drawerOpen",
              function () {
                this.close();
              }.bind(this)
            );
          };
    
          Modal.prototype.open = function (evt) {
            // Keep track if modal was opened from a click, or called by another function
            var externalCall = false;
    
            // don't open an opened modal
            if (this.modalIsOpen) {
              return;
            }
    
            // Prevent following href if link is clicked
            if (evt) {
              evt.preventDefault();
            } else {
              externalCall = true;
            }
    
            // Without this, the modal opens, the click event bubbles up to $nodes.page
            // which closes the modal.
            if (evt && evt.stopPropagation) {
              evt.stopPropagation();
              // save the source of the click, we'll focus to this on close
              this.$activeSource = $(evt.currentTarget);
            }
    
            if (this.modalIsOpen && !externalCall) {
              this.close();
            }
    
            this.$modal.prepareTransition().addClass(this.config.openClass);
            this.nodes.$parent.addClass(this.config.bodyOpenClass);
    
            if (this.isSolid) {
              this.nodes.$parent.addClass(this.config.bodyOpenSolidClass);
            }
    
            this.modalIsOpen = true;
    
            slate.a11y.trapFocus({
              $container: this.$modal,
              $elementToFocus: this.$focusOnOpen,
              namespace: "modal_focus",
            });
    
            if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
              this.$activeSource.attr("aria-expanded", "true");
            }
    
            $("body").trigger("modalOpen." + this.id);
    
            this.bindEvents();
          };
    
          Modal.prototype.close = function () {
            // don't close a closed modal
            if (!this.modalIsOpen) {
              return;
            }
    
            // deselect any focused form elements
            $(document.activeElement).trigger("blur");
    
            this.$modal
              .prepareTransition()
              .removeClass(this.config.openClass)
              .addClass(this.config.closingClass);
            this.nodes.$parent.removeClass(this.config.bodyOpenClass);
            this.nodes.$parent.addClass(this.config.bodyClosingClass);
            var o = this;
            window.setTimeout(function () {
              o.nodes.$parent.removeClass(o.config.bodyClosingClass);
              o.$modal.removeClass(o.config.closingClass);
            }, 500); // modal close css transition
    
            if (this.isSolid) {
              this.nodes.$parent.removeClass(this.config.bodyOpenSolidClass);
            }
    
            this.modalIsOpen = false;
    
            slate.a11y.removeTrapFocus({
              $container: this.$modal,
              namespace: "modal_focus",
            });
    
            if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
              this.$activeSource.attr("aria-expanded", "false").focus();
            }
    
            $("body").trigger("modalClose." + this.id);
    
            this.unbindEvents();
          };
    
          Modal.prototype.bindEvents = function () {
            // Pressing escape closes modal
            this.nodes.$parent.on(
              "keyup.modal",
              function (evt) {
                if (evt.keyCode === 27) {
                  this.close();
                }
              }.bind(this)
            );
    
            if (this.config.closeOffContentClick) {
              // Clicking outside of the modal content also closes it
              this.$modal.on("click.modal", this.close.bind(this));
    
              // Exception to above: clicking anywhere on the modal content will NOT close it
              this.nodes.$modalContent.on("click.modal", function (evt) {
                evt.stopImmediatePropagation();
              });
            }
          };
    
          Modal.prototype.unbindEvents = function () {
            this.nodes.$parent.off(".modal");
    
            if (this.config.closeOffContentClick) {
              this.$modal.off(".modal");
              this.nodes.$modalContent.off(".modal");
            }
          };
    
          return Modal;
        })();
    
        theme.Drawers = (function () {
          function Drawer(id, name, ignoreScrollLock) {
            this.config = {
              id: id,
              close: ".js-drawer-close",
              open: ".js-drawer-open-" + name,
              openClass: "js-drawer-open",
              closingClass: "js-drawer-closing",
              activeDrawer: "drawer--is-open",
              namespace: ".drawer-" + name,
            };
    
            this.$nodes = {
              parent: $(document.documentElement).add("body"),
              page: $("#MainContent"),
            };
    
            this.$drawer = $("#" + id);
    
            if (!this.$drawer.length) {
              return false;
            }
    
            this.isOpen = false;
            this.ignoreScrollLock = ignoreScrollLock;
            this.init();
          }
    
          Drawer.prototype = $.extend({}, Drawer.prototype, {
            init: function () {
              var $openBtn = $(this.config.open);
    
              // Add aria controls
              $openBtn.attr("aria-expanded", "false");
    
              $openBtn.on("click", this.open.bind(this));
              this.$drawer
                .find(this.config.close)
                .on("click", this.close.bind(this));
            },
    
            open: function (evt) {
              if (evt) {
                evt.preventDefault();
              }
    
              if (this.isOpen) {
                return;
              }
    
              // // Without this the drawer opens, the click event bubbles up to $nodes.page which closes the drawer.
              // if (evt && evt.stopPropagation) {
              //   evt.stopPropagation();
              //   // save the source of the click, we'll focus to this on close
              //   this.$activeSource = $(evt.currentTarget);
              // }
    
              this.$drawer.prepareTransition().addClass(this.config.activeDrawer);
    
              this.$nodes.parent.addClass(this.config.openClass);
              this.isOpen = true;
    
              slate.a11y.trapFocus({
                $container: this.$drawer,
                namespace: "drawer_focus",
              });
    
              $("body").trigger("drawerOpen." + this.config.id);
    
              if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
                this.$activeSource.attr("aria-expanded", "true");
              }
    
              this.bindEvents();
            },
    
            close: function () {
              if (!this.isOpen) {
                return;
              }
    
              // deselect any focused form elements
              $(document.activeElement).trigger("blur");
    
              this.$drawer
                .prepareTransition()
                .removeClass(this.config.activeDrawer);
    
              this.$nodes.parent.removeClass(this.config.openClass);
              this.$nodes.parent.addClass(this.config.closingClass);
              var o = this;
              window.setTimeout(function () {
                o.$nodes.parent.removeClass(o.config.closingClass);
              }, 500);
    
              this.isOpen = false;
    
              slate.a11y.removeTrapFocus({
                $container: this.$drawer,
                namespace: "drawer_focus",
              });
    
              if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
                this.$activeSource.attr("aria-expanded", "false");
              }
    
              this.unbindEvents();
            },
    
            bindEvents: function () {
              if (!this.ignoreScrollLock) {
                slate.a11y.lockMobileScrolling(
                  this.config.namespace,
                  this.$nodes.page
                );
              }
    
              // Clicking out of drawer closes it.
              // Check to see if clicked on element in drawer
              // because of any drawer built witin #MainContent
              this.$nodes.page.on(
                "click" + this.config.namespace,
                function (evt) {
                  var $target = $(evt.target);
                  var doNotClose = this.elementInsideDrawer($target);
                  if (!doNotClose) {
                    this.close();
                    return false;
                  }
                }.bind(this)
              );
    
              // Pressing escape closes drawer
              this.$nodes.parent.on(
                "keyup" + this.config.namespace,
                function (evt) {
                  if (evt.keyCode === 27) {
                    this.close();
                  }
                }.bind(this)
              );
            },
    
            unbindEvents: function () {
              if (!this.ignoreScrollLock) {
                slate.a11y.unlockMobileScrolling(
                  this.config.namespace,
                  this.$nodes.page
                );
              }
              this.$nodes.parent.off(this.config.namespace);
              this.$nodes.page.off(this.config.namespace);
            },
    
            // Check if clicked element is inside the drawer
            elementInsideDrawer: function ($el) {
              return this.$drawer.find($el).length;
            },
          });
    
          return Drawer;
        })();
    
        theme.cart = {
          getCart: function () {
            return $.getJSON("/cart.js");
          },
    
          changeItem: function (key, qty) {
            return this._updateCart({
              type: "POST",
              url: "/cart/change.js",
              data: "quantity=" + qty + "&id=" + key,
              dataType: "json",
            });
          },
    
          addItemFromForm: function (data) {
            return this._updateCart({
              type: "POST",
              url: "/cart/add.js",
              data: data,
              dataType: "json",
            });
          },
    
          _updateCart: function (params) {
            return $.ajax(params).then(
              function (cart) {
                return cart;
              }.bind(this)
            );
          },
    
          updateNote: function (note) {
            var params = {
              type: "POST",
              url: "/cart/update.js",
              data: "note=" + theme.cart.attributeToString(note),
              dataType: "json",
              success: function (cart) {},
              error: function (XMLHttpRequest, textStatus) {},
            };
    
            $.ajax(params);
          },
    
          attributeToString: function (attribute) {
            if (typeof attribute !== "string") {
              attribute += "";
              if (attribute === "undefined") {
                attribute = "";
              }
            }
            return $.trim(attribute);
          },
        };
    
        $(function () {
          // Add a loading indicator on the cart checkout button (/cart and drawer)
          $("body").on("click", ".cart__checkout", function () {
            $(this).addClass("btn--loading");
          });
    
          $("body").on("change", 'textarea[name="note"]', function () {
            var newNote = $(this).val();
            theme.cart.updateNote(newNote);
          });
    
          // Custom JS to prevent checkout without confirming terms and conditions
          $("body").on("click", ".cart__checkout--ajax", function (evt) {
            if ($("#CartAgree").is(":checked")) {
            } else {
              alert(theme.strings.cartTermsConfirmation);
              $(this).removeClass("btn--loading");
              return false;
            }
          });
    
          $("body").on("click", ".cart__checkout--page", function (evt) {
            if ($("#CartPageAgree").is(":checked")) {
            } else {
              alert(theme.strings.cartTermsConfirmation);
              $(this).removeClass("btn--loading");
              return false;
            }
          });
        });
    
        theme.QtySelector = (function () {
          var classes = {
            input: ".js-qty__num",
            plus: ".js-qty__adjust--plus",
            minus: ".js-qty__adjust--minus",
          };
    
          function QtySelector($el, options) {
            this.$wrapper = $el;
            this.$originalInput = $el.find('input[type="number"]');
            this.minValue = this.$originalInput.attr("min") || 1;
    
            var defaults = {
              namespace: null,
            };
    
            this.options = $.extend(defaults, options);
    
            this.source = $("#JsQty").html();
            this.template = Handlebars.compile(this.source);
    
            var quantities = {
              current: this._getOriginalQty(),
              add: this._getOriginalQty() + 1,
              minus: this._getOriginalQty() - 1,
            };
    
            this.data = {
              key: this._getProductKey(),
              itemQty: quantities.current,
              itemAdd: quantities.add,
              itemMinus: quantities.minus,
              inputName: this._getInputName(),
              inputId: this._getId(),
            };
    
            // Append new quantity selector then remove original
            this.$originalInput.after(this.template(this.data)).remove();
            this.$input = this.$wrapper.find(classes.input);
            this.$plus = this.$wrapper.find(classes.plus);
            this.$minus = this.$wrapper.find(classes.minus);
    
            this.initEventListeners();
          }
    
          QtySelector.prototype = $.extend({}, QtySelector.prototype, {
            _getProductKey: function () {
              return this.$originalInput.data("id") || null;
            },
    
            _getOriginalQty: function () {
              return parseInt(this.$originalInput.val());
            },
    
            _getInputName: function () {
              return this.$originalInput.attr("name");
            },
    
            _getId: function () {
              return this.$originalInput.attr("id");
            },
    
            initEventListeners: function () {
              this.$plus.off("click");
              this.$minus.off("click");
    
              this.$plus.on(
                "click",
                function () {
                  var qty = this.validateQty(this.$input.val());
                  this.addQty(qty);
                }.bind(this)
              );
    
              this.$minus.on(
                "click",
                function () {
                  var qty = this.validateQty(this.$input.val());
                  this.subtractQty(qty);
                }.bind(this)
              );
    
              this.$input.on(
                "change",
                function () {
                  var qty = this.validateQty(this.$input.val());
                  this.changeQty(qty);
                }.bind(this)
              );
            },
    
            addQty: function (number) {
              var qty = number + 1;
              this.changeQty(qty);
            },
    
            subtractQty: function (number) {
              var qty = number - 1;
              if (qty <= this.minValue) {
                qty = this.minValue;
              }
              this.changeQty(qty);
            },
    
            changeQty: function (qty) {
              this.$input.val(qty);
              $("body").trigger("qty" + this.options.namespace, [this.data.key, qty]);
            },
    
            validateQty: function (number) {
              if (parseFloat(number) == parseInt(number) && !isNaN(number)) {
                // We have a valid number!
              } else {
                // Not a number. Default to 1.
                number = 1;
              }
              return parseInt(number);
            },
          });
    
          return QtySelector;
        })();
    
        theme.CartDrawer = (function () {
          var config = {
            namespace: ".ajaxcart",
          };
    
          var selectors = {
            drawer: "#CartDrawer",
            container: "#CartContainer",
            template: "#CartTemplate",
            fixedFooter: ".drawer__footer--fixed",
            fixedInnerContent: ".drawer__inner--has-fixed-footer",
            cartBubble: ".cart-link__bubble",
            cartUpsell: "#upsell_product_container",
          };
    
          function CartDrawer() {
            this.status = {
              loaded: false,
              loading: false,
            };
    
            this.qtySelectors = [];
    
            this.drawer = new theme.Drawers("CartDrawer", "cart");
    
            // Prep handlebars template
            var source = $(selectors.template).html();
            this.template = Handlebars.compile(source);
    
            // Build cart on page load so it's ready in the drawer
            theme.cart.getCart().then(this.buildCart.bind(this));
    
            this.initEventListeners();
          }
    
          CartDrawer.prototype = $.extend({}, CartDrawer.prototype, {
            initEventListeners: function () {
              $("body").on(
                "updateCart" + config.namespace,
                this.initQtySelectors.bind(this)
              );
              $("body").on(
                "updateCart" + config.namespace,
                this.sizeFooter.bind(this)
              );
              $("body").on(
                "updateCart" + config.namespace,
                this.updateCartNotification.bind(this)
              );
              $("body").on("drawerOpen.CartDrawer", this.sizeFooter.bind(this));
    
              $(window).on(
                "resize" + config.namespace,
                $.debounce(150, this.sizeFooter.bind(this))
              );
    
              $("body").on(
                "added.ajaxProduct",
                function () {
                  theme.cart.getCart().then(
                    function (cart) {
                      this.buildCart(cart, true);
                    }.bind(this)
                  );
                }.bind(this)
              );
            },
    
            buildCart: function (cart, openDrawer) {
              //Bold: Ensure the cart's line items have been updated with their option information
              if (
                typeof BOLD === "object" &&
                BOLD.common &&
                BOLD.common.cartDoctor &&
                typeof BOLD.common.cartDoctor.fix === "function"
              ) {
                cart = BOLD.common.cartDoctor.fix(cart);
              }
    
              this.loading(true);
              this.emptyCart();
    
              if (cart.item_count === 0) {
                $(selectors.container).append(
                  '<p class="appear-animation appear-delay-3">' +
                    theme.strings.cartEmpty +
                    "</p>"
                );
              } else {
                var items = [];
                var item = {};
                var data = {};
                var animation_row = 1;
                var bagsCount = 0;
                var discount99 = [
                  // "lori-foldover-crossbody",
                  "joan-nylon-tote",
                  "erin-nylon-crossbody",
                  //"lucie-camera-bag",
                  "ruby-cross-body",
                  "demi-bucket-bag",
                  "isabel-bucket-bag",
                  "alicia-cross-body-grey",
                  "chelsea-trio-crossbody",
                  "jenna-crossbody",
                  "clara-cloud-crossbody",
                  "lea-work-tote",
                  "maddie-cross-body",
                ];
                var hasDiscount99Count = 0;
                var revItems = [];
                let totalDiscounts = 0;
    
                $.each(cart.items, function (index, product) {
                  var recurring_desc = "";
                  let getProduct;
                  let actualVariant;
                  let hasCompareAtPrice = false;
    
                  if (discount99.includes(product.handle)) {
                    hasDiscount99Count += product.quantity;
                  }
    
                  if (
                    product.properties_all &&
                    product.properties_all.frequency_num
                  ) {
                    recurring_desc =
                      "<span> Delivered Every " +
                      product.properties_all.frequency_num +
                      " " +
                      product.properties_all.frequency_type_text +
                      " " +
                      product.properties_all.discounted_price +
                      " each" +
                      "</span>";
                  }
    
                  var prodImg;
                  if (product.image !== null) {
                    prodImg = product.image.replace(/(\.[^.]*)$/, "_180x$1");
                  } else {
                    prodImg =
                      "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
                  }
                  var isGift = false;
    
                  if(product.final_price === 0) {
                    isGift = true;
                  }
    
                  if (product.properties !== null) {
                    $.each(product.properties, function (key, value) {
                      if (key.indexOf("gift") > -1) {
                        isGift = true;
                      }
                      if (key.charAt(0) === "_" || !value) {
                        delete product.properties[key];
                      }
                    });
                  }
    
                  animation_row += 2;
                  var v_title = "";
                  if (
                    product.variant_title !== null &&
                    typeof product.variant_title !== "undefined"
                  ) {
                    var v_title = product.variant_title;
                    if (v_title.indexOf("-seasonal") > -1) {
                      v_title = v_title.replace(/\-seasonal/g, "");
                    }
                  }
    
                  $.ajax({
                    url: `/products/${product.handle}.js`,
                    type: "GET",
                    async: false,
                    dataType : 'JSON',
                    success: function( data ) {
                      getProduct = data;
                    }
                  });
      
                  getProduct.variants.forEach(variant => {
                    if (variant.id === product.variant_id) {
                      actualVariant = variant;
                    }
                  })
      
                  if (actualVariant.compare_at_price > actualVariant.price) {
                    hasCompareAtPrice = true;
                    totalDiscounts = totalDiscounts + ((actualVariant.compare_at_price - actualVariant.price)*product.quantity)
                  }
      
                  const itemPrice = (hasCompareAtPrice) ? actualVariant.compare_at_price : product.price;
                  const itemDiscountedPrice = (hasCompareAtPrice) ? actualVariant.price :(product.price - (product.total_discount/product.quantity))
    
                 
    
                  item = {
                    lineItemNumber: index + 1,
                    key: product.key,
                    url: product.url,
                    img: prodImg,
                    animationRow: animation_row,
                    name: product.product_title,
                    variation: v_title,
                    properties: product.properties,
                    recurring: recurring_desc,
                    itemQty: product.quantity,
                    price: theme.Currency.formatMoney(
                      itemPrice,
                      theme.settings.moneyFormat
                    ),
                    discountedPrice: theme.Currency.formatMoney(
                      itemDiscountedPrice,
                      theme.settings.moneyFormat
                    ),
                    discounts: product.discounts,
                    discountsApplied:
                    (!(product.price === (product.price - product.total_discount)) || hasCompareAtPrice) 
                        ? true 
                        : false,
                    vendor: product.vendor,
                    isSample: theme.settings.samplesIDs.includes(
                      product.product_id.toString()
                    ),
                    isGift: isGift,
                  };
    
                  items.push(item);
    
                  revItems.push({
                    key: product.key,
                    quantity: product.quantity,
                    variant_id: product.variant_id,
                    product_id: product.product_id,
                    properties: product.properties,
                    final_line_price: product.final_line_price,
                    quantity_widget: 0,
                  });
                });
    
                animation_row += 2;
    
                const originalTotalPrices = totalDiscounts + cart.original_total_price
                totalDiscounts = totalDiscounts + cart.total_discount
                
                data = {
                  items: items,
                  note: cart.note,
                  lastAnimationRow: animation_row,
                  totalPrice: theme.Currency.formatMoney(
                    cart.total_price,
                    theme.settings.moneyFormat
                  ),
                  totalCartDiscount:
                    totalDiscounts === 0
                      ? 0
                      : theme.strings.cartSavings.replace(
                          "[savings]",
                          theme.Currency.formatMoney(
                            totalDiscounts,
                            theme.settings.moneyFormat
                          )
                        ),
                  totalCartDiscountAmount:
                  totalDiscounts === 0
                      ? 0
                      : theme.Currency.formatMoney(
                          totalDiscounts,
                          theme.settings.moneyFormat
                        ),
                  originalTotalPrice: theme.Currency.formatMoney(
                    originalTotalPrices,
                    theme.settings.moneyFormat
                  ),
                  itemsSubtotalPrice: theme.Currency.formatMoney(
                    cart.items_subtotal_price,
                    theme.settings.moneyFormat
                  ),
                };
    
                if (revItems.length > 0) {
                  var revData = {
                    presentment_currency: { rate: "1.0", symbol: "USD" },
                    custom_discounts: [],
                    items: revItems,
                    presentment_currency: { rate: "1.0", symbol: "USD" },
                    shop: "the-vegan-warehouse.myshopify.com",
                    upsell_discounts: [],
                  };
    
                  $.ajax({
                    type: "POST",
                    url: "https://bundle.revy.io/api/cart-page",
                    data: JSON.stringify(revData),
                    contentType: "application/json",
                    beforeSend: function (xhr) {},
    
                    success: function (response) {
                      if (response.totals !== false) {
                        // var totalContent = '<div class="drawer-discount-section"><span style="text-decoration: line-through;">'+response.totals.formatted.original+'</span>';
                        //     totalContent += '<span class="the-discount">-'+response.totals.formatted.discount+'</span>';
                        //     totalContent += '<span class="the-final-price">'+response.totals.formatted.final+'</span>';
                        // 	totalContent += '</div>';
    
                        /*var totalContent = '<div class="custom-grid custom-grid-cols-2">';
                        totalContent += '<div class="uppercase ajaxcart__subtotal -discount-label">SUBTOTAL</div>';
                        totalContent += '<div class="text-right"><span class="ajaxcart__price" style="text-decoration: line-through;">'+response.totals.formatted.original+'</span></div>';
                        totalContent += '</div>';
    
                       totalContent += '<div class="custom-grid custom-grid-cols-2">';
                        totalContent += '<div class="uppercase ajaxcart__subtotal discount-cart-label-highlight -discount-label">Your Savings!</div>';
                        totalContent += '<div class="text-right"><span class="ajaxcart__price discount-cart-highlight">-'+response.totals.formatted.discount+'</span></div>';
                        totalContent += '</div>';
    
                        totalContent += '<div class="custom-grid custom-grid-cols-2 the-final-price-row">';
                        totalContent += '<div class="uppercase ajaxcart__subtotal -discount-label">TOTAL</div>';
                        totalContent += '<div class="text-right"><span class="ajaxcart__price the-final-price">'+response.totals.formatted.final+'</span></div>';
                        totalContent += '</div>';*/
    
                        // $('.drawer__footer .ajaxcart__price').html(totalContent);
                        // $(".minicart-price-container").html(totalContent);
                        var $cartFooter = $(selectors.drawer)
                          .find(selectors.fixedFooter)
                          .removeAttr("style");
                        var cartFooterHeight = $cartFooter.outerHeight();
    
                        $cartFooter.css("height", cartFooterHeight);
    
                        // Resize footer after arbitrary delay for buttons to load
                        $("body").trigger("drawerOpen.CartDrawer");
                      }
                    },
    
                    error: function (error) {
                      console.log("ERror", error);
                    },
    
                    complete: function () {},
                  });
                }
    
                $(selectors.container).append(this.template(data));
                if (hasDiscount99Count === 1) {
                  $(selectors.container)
                    .find(".upsell_product_container")
                    .prepend(
                      '<a href="https://www.theveganwarehouse.com/collections/2-for-99"><div class="text-center cart-offer-reminder hideabtestv0" style="line-height:25px">Add 1 more handbag from our <br /><strong>2 for $129</strong> collection to save!</div></a><a href="https://www.theveganwarehouse.com/collections/2-for-99"><div class="text-center cart-offer-reminder hideabtestv1" style="line-height:25px">Add 1 more handbag from our <br /><strong>Build Your Bundle</strong> collection to save!</div></a>'
                    );
                }
              }
    
              this.status.loaded = true;
              this.loading(false);
    
              $("body").trigger("updateCart" + config.namespace, cart);
    
              if (window.Shopify && Shopify.StorefrontExpressButtons) {
                Shopify.StorefrontExpressButtons.initialize();
    
                // Resize footer after arbitrary delay for buttons to load
                setTimeout(
                  function () {
                    this.sizeFooter();
                  }.bind(this),
                  800
                );
              }
    
              // If specifically asked, open the cart drawer (only happens after product added from form)
              if (openDrawer === true) {
                this.drawer.open();
              }
            },
    
            initQtySelectors: function () {
              this.qtySelectors = [];
    
              $(selectors.container)
                .find(".js-qty")
                .each(
                  function (index, el) {
                    var selector = new theme.QtySelector($(el), {
                      namespace: ".cart-drawer",
                    });
                    this.qtySelectors.push(selector);
                  }.bind(this)
                );
    
              $("body").on("qty.cart-drawer", this.updateItem.bind(this));
            },
    
            updateItem: function (evt, key, qty) {
              if (this.status.loading) {
                return;
              }
    
              this.loading(true);
    
              theme.cart
                .changeItem(key, qty)
                .then(
                  function (cart) {
                    this.updateSuccess(cart);
                  }.bind(this)
                )
                .catch(
                  function (XMLHttpRequest) {
                    this.updateError(XMLHttpRequest);
                  }.bind(this)
                )
                .always(
                  function () {
                    this.loading(false);
                  }.bind(this)
                );
            },
    
            loading: function (state) {
              this.status.loading = state;
    
              if (state) {
                $(selectors.container).addClass("is-loading");
              } else {
                $(selectors.container).removeClass("is-loading");
              }
            },
    
            emptyCart: function () {
              $(selectors.container).empty();
            },
    
            updateSuccess: function (cart) {
              this.buildCart(cart);
            },
    
            updateError: function (XMLHttpRequest) {
              if (
                XMLHttpRequest.responseJSON &&
                XMLHttpRequest.responseJSON.description
              ) {
                console.warn(XMLHttpRequest.responseJSON.description);
              }
            },
    
            // Update elements after cart is updated
            sizeFooter: function () {
              theme.getUpsell();
    
              // Stop if our drawer doesn't have a fixed footer
              if (!$(selectors.drawer).hasClass("drawer--has-fixed-footer")) {
                return;
              }
    
              // Elements are reprinted regularly so selectors are not cached
              var $cartFooter = $(selectors.drawer)
                .find(selectors.fixedFooter)
                .removeAttr("style");
              var $cartInner = $(selectors.drawer)
                .find(selectors.fixedInnerContent)
                .removeAttr("style");
              var cartFooterHeight = $cartFooter.outerHeight();
    
              $cartInner.css("bottom", cartFooterHeight);
              $cartFooter.css("height", cartFooterHeight);
            },
    
            updateCartNotification: function (evt, cart) {
              
              if (cart.items.length > 0) {
                $(selectors.cartBubble).innerHTML = cart.items.length;
                $(selectors.cartBubble).addClass("cart-link__bubble--visible");
                $(selectors.cartBubble).text(cart.item_count);
              } else {
                $(selectors.cartBubble).removeClass("cart-link__bubble--visible");
              }
            },
          });
    
          return CartDrawer;
        })();
    
        theme.AjaxProduct = (function () {
          var status = {
            loading: false,
          };
    
          function ProductForm($form) {
            console.log($form);
            this.$form = $form;
            this.$addToCart = this.$form.find(".add-to-cart");
    
            if (this.$form.length) {
              this.$form.on("submit", this.addItemFromForm.bind(this));
    
              console.log($form);
            }
          }
    
          ProductForm.prototype = $.extend({}, ProductForm.prototype, {
            addItemFromForm: function (evt, callback) {
              evt.preventDefault();
    
              if (status.loading) {
                return;
              }
    
              // Loading indicator on add to cart button
              this.$addToCart.addClass("btn--loading");
    
              status.loading = true;
    
              var data = this.$form.serialize();
    
              theme.cart
                .addItemFromForm(data)
                .then(
                  function (product) {
                    this.success(product);
                  }.bind(this)
                )
                .catch(
                  function (XMLHttpRequest) {
                    this.error(XMLHttpRequest);
                  }.bind(this)
                )
                .always(
                  function () {
                    status.loading = false;
                    this.$addToCart.removeClass("btn--loading");
                  }.bind(this)
                );
            },
    
            success: function (product) {
              this.$form.find(".errors").remove();
              $("body").trigger("added.ajaxProduct");
            },
    
            error: function (XMLHttpRequest) {
              this.$form.find(".errors").remove();
    
              if (
                XMLHttpRequest.responseJSON &&
                XMLHttpRequest.responseJSON.description
              ) {
                console.warn(XMLHttpRequest.responseJSON.description);
    
                this.$form.prepend(
                  '<div class="errors text-center">' +
                    XMLHttpRequest.responseJSON.description +
                    "</div>"
                );
              }
            },
          });
    
          return ProductForm;
        })();
    
        theme.collapsibles = (function () {
          var selectors = {
            trigger: ".collapsible-trigger",
            module: ".collapsible-content",
            moduleInner: ".collapsible-content__inner",
          };
    
          var classes = {
            hide: "hide",
            open: "is-open",
            autoHeight: "collapsible--auto-height",
          };
    
          var isTransitioning = false;
    
          function init() {
            $(selectors.trigger).each(function () {
              var $el = $(this);
              var state = $el.hasClass(classes.open);
              $el.attr("aria-expanded", state);
            });
    
            // Event listeners (hack for modals)
            $("body, .modal__inner").on("click", selectors.trigger, function () {
              if (isTransitioning) {
                return;
              }
    
              isTransitioning = true;
    
              var $el = $(this);
              var isOpen = $el.hasClass(classes.open);
              var moduleId = $el.attr("aria-controls");
              var $module = $("#" + moduleId);
              var height = $module.find(selectors.moduleInner).outerHeight();
              var isAutoHeight = $el.hasClass(classes.autoHeight);
    
              // If isAutoHeight, set the height to 0 just after setting the actual height
              // so the closing animation works nicely
              if (isOpen && isAutoHeight) {
                setTimeout(function () {
                  height = 0;
                  setTransitionHeight($module, height, isOpen, isAutoHeight);
                }, 0);
              }
    
              if (isOpen && !isAutoHeight) {
                height = 0;
              }
    
              $el.attr("aria-expanded", !isOpen).toggleClass(classes.open, !isOpen);
    
              setTransitionHeight($module, height, isOpen, isAutoHeight);
            });
          }
    
          function setTransitionHeight($module, height, isOpen, isAutoHeight) {
            $module
              .removeClass(classes.hide)
              .prepareTransition()
              .css("height", height)
              .toggleClass(classes.open, !isOpen);
    
            if (!isOpen && isAutoHeight) {
              var o = $module;
              window.setTimeout(function () {
                o.css("height", "auto");
                isTransitioning = false;
              }, 350);
            } else {
              isTransitioning = false;
            }
          }
    
          return {
            init: init,
          };
        })();
    
        theme.headerNav = (function () {
          var $parent = $(document.documentElement).add("body");
          var $page = $("#MainContent");
          var selectors = {
            wrapper: ".header-wrapper",
            siteHeader: ".site-header",
            searchBtn: ".js-search-header",
            closeSearch: ".js-search-header-close",
            searchContainer: ".site-header__search-container",
            logoContainer: ".site-header__logo",
            logo: ".site-header__logo img",
            navigation: ".site-navigation",
            navContainerWithLogo: ".header-item--logo",
            navItems: ".site-nav__item",
            navLinks: ".site-nav__link",
            navLinksWithDropdown: ".site-nav__link--has-dropdown",
            navDropdownLinks: ".site-nav__dropdown-link--second-level",
          };
    
          var classes = {
            hasDropdownClass: "site-nav--has-dropdown",
            hasSubDropdownClass: "site-nav__deep-dropdown-trigger",
            dropdownActive: "is-focused",
          };
    
          var config = {
            namespace: ".siteNav",
            wrapperOverlayed: false,
            overlayedClass: "is-light",
            stickyEnabled: false,
            stickyActive: false,
            stickyClass: "site-header--stuck",
            openTransitionClass: "site-header--opening",
            lastScroll: 0,
          };
    
          // Elements used in resize functions, defined in init
          var $window;
          var $navContainerWithLogo;
          var $logoContainer;
          var $nav;
          var $wrapper;
          var $siteHeader;
    
          function init() {
            $window = $(window);
            $navContainerWithLogo = $(selectors.navContainerWithLogo);
            $logoContainer = $(selectors.logoContainer);
            $nav = $(selectors.navigation);
            $wrapper = $(selectors.wrapper);
            $siteHeader = $(selectors.siteHeader);
    
            config.wrapperOverlayed = $wrapper.hasClass(config.overlayedClass);
            config.stickyEnabled = $siteHeader.data("sticky");
            if (config.stickyEnabled) {
              theme.config.stickyHeader = true;
              stickyHeader();
            }
    
            if (config.wrapperOverlayed) {
              $("body").addClass("overlaid-header");
            }
    
            accessibleDropdowns();
            searchDrawer();
          }
    
          function unload() {
            $(window).off(config.namespace);
            $(selectors.searchBtn).off(config.namespace);
            $(selectors.closeSearch).off(config.namespace);
            $parent.off(config.namespace);
            $(selectors.navLinks).off(config.namespace);
            $(selectors.navDropdownLinks).off(config.namespace);
          }
    
          function searchDrawer() {
            $(selectors.searchBtn).on("click" + config.namespace, function (evt) {
              evt.preventDefault();
              openSearchDrawer();
            });
    
            $(selectors.closeSearch).on("click" + config.namespace, function () {
              closeSearchDrawer();
            });
          }
    
          function openSearchDrawer() {
            $(selectors.searchContainer).addClass("is-active");
            $parent.addClass("js-drawer-open js-drawer-open--search");
    
            slate.a11y.trapFocus({
              $container: $(selectors.searchContainer),
              namespace: "header_search",
              $elementToFocus: $(selectors.searchContainer).find("input"),
            });
    
            // If sticky is enabled, scroll to top on mobile when close to it
            // so you don't get an invisible search box
            if (
              theme.config.bpSmall &&
              config.stickyEnabled &&
              config.lastScroll < 300
            ) {
              window.scrollTo(0, 0);
            }
    
            // Bind events
            slate.a11y.lockMobileScrolling(config.namespace);
    
            // Clicking out of container closes it
            $page.on("click" + config.namespace, function () {
              closeSearchDrawer();
              return false;
            });
    
            $parent.on("keyup" + config.namespace, function (evt) {
              if (evt.keyCode === 27) {
                closeSearchDrawer();
              }
            });
          }
    
          function closeSearchDrawer() {
            // deselect any focused form elements
            $(document.activeElement).trigger("blur");
    
            $parent
              .removeClass("js-drawer-open js-drawer-open--search")
              .off(config.namespace);
            $(selectors.searchContainer).removeClass("is-active");
    
            slate.a11y.removeTrapFocus({
              $container: $(selectors.searchContainer),
              namespace: "header_search",
            });
    
            slate.a11y.unlockMobileScrolling(config.namespace);
            $page.off("click" + config.namespace);
            $parent.off("keyup" + config.namespace);
          }
    
          function accessibleDropdowns() {
            var hasActiveDropdown = false;
            var hasActiveSubDropdown = false;
            var closeOnClickActive = false;
    
            // Touch devices open dropdown on first click, navigate to link on second
            if (theme.config.isTouch) {
              $(selectors.navLinksWithDropdown).on(
                "touchend" + config.namespace,
                function (evt) {
                  var $el = $(this);
                  var $parentItem = $el.parent();
                  if (!$parentItem.hasClass(classes.dropdownActive)) {
                    evt.preventDefault();
                    closeDropdowns();
                    openFirstLevelDropdown($el);
                  } else {
                    window.location.replace($el.attr("href"));
                  }
                }
              );
    
              $(selectors.navDropdownLinks).on(
                "touchend" + config.namespace,
                function (evt) {
                  var $el = $(this);
                  var $parentItem = $el.parent();
    
                  // Open third level menu or go to link based on active state
                  if ($parentItem.hasClass(classes.hasSubDropdownClass)) {
                    if (!$parentItem.hasClass(classes.dropdownActive)) {
                      evt.preventDefault();
                      closeThirdLevelDropdown();
                      openSecondLevelDropdown($el);
                    } else {
                      window.location.replace($el.attr("href"));
                    }
                  } else {
                    // No third level nav, go to link
                    window.location.replace($el.attr("href"));
                  }
                }
              );
            }
    
            $(selectors.navLinks).on(
              "focusin mouseover" + config.namespace,
              function () {
                if (hasActiveDropdown) {
                  closeSecondLevelDropdown();
                }
    
                if (hasActiveSubDropdown) {
                  closeThirdLevelDropdown();
                }
    
                openFirstLevelDropdown($(this));
              }
            );
    
            // Force remove focus on sitenav links because focus sometimes gets stuck
            $(selectors.navLinks).on("mouseleave" + config.namespace, function () {
              closeSecondLevelDropdown();
              closeThirdLevelDropdown();
            });
    
            // Open/hide sub level dropdowns
            $(selectors.navDropdownLinks).on(
              "focusin" + config.namespace,
              function () {
                if (hasActiveSubDropdown) {
                  closeThirdLevelDropdown();
                }
    
                openSecondLevelDropdown($(this), true);
              }
            );
    
            // Private dropdown methods
            function openFirstLevelDropdown($el) {
              var $parentItem = $el.parent();
              if ($parentItem.hasClass(classes.hasDropdownClass)) {
                $parentItem.addClass(classes.dropdownActive);
                hasActiveDropdown = true;
              }
    
              if (!theme.config.isTouch) {
                if (!closeOnClickActive) {
                  var eventType = theme.config.isTouch ? "touchend" : "click";
                  closeOnClickActive = true;
                  $("body").on(eventType + config.namespace, function () {
                    closeDropdowns();
                    $("body").off(config.namespace);
                    closeOnClickActive = false;
                  });
                }
              }
            }
    
            function openSecondLevelDropdown($el, skipCheck) {
              var $parentItem = $el.parent();
              if ($parentItem.hasClass(classes.hasSubDropdownClass) || skipCheck) {
                $parentItem.addClass(classes.dropdownActive);
                hasActiveSubDropdown = true;
              }
            }
    
            function closeDropdowns() {
              closeSecondLevelDropdown();
              closeThirdLevelDropdown();
            }
    
            function closeSecondLevelDropdown() {
              $(selectors.navItems).removeClass(classes.dropdownActive);
            }
    
            function closeThirdLevelDropdown() {
              $(selectors.navDropdownLinks)
                .parent()
                .removeClass(classes.dropdownActive);
            }
          }
    
          function stickyHeader() {
            config.lastScroll = 0;
            $siteHeader.wrap('<div class="site-header-sticky"></div>');
    
            stickyHeaderHeight();
            setTimeout(function () {
              stickyHeaderHeight();
            }, 200);
            $window.on(
              "resize" + config.namespace,
              $.debounce(50, stickyHeaderHeight)
            );
            $window.on(
              "scroll" + config.namespace,
              $.throttle(15, stickyHeaderScroll)
            );
          }
    
          function stickyHeaderHeight() {
            var $stickyHeader = $(".site-header-sticky").css(
              "height",
              $siteHeader.outerHeight(true)
            );
          }
    
          function stickyHeaderScroll() {
            var scroll = $window.scrollTop();
            var threshold = 250;
    
            if (scroll > threshold) {
              if (config.stickyActive) {
                return;
              }
    
              config.stickyActive = true;
    
              $siteHeader.addClass(config.stickyClass);
              if (config.wrapperOverlayed) {
                $wrapper.removeClass(config.overlayedClass);
              }
    
              // Add open transition class after element is set to fixed
              // so CSS animation is applied correctly
              setTimeout(function () {
                $siteHeader.addClass(config.openTransitionClass);
              }, 100);
            } else {
              if (!config.stickyActive) {
                return;
              }
    
              config.stickyActive = false;
    
              $siteHeader
                .removeClass(config.openTransitionClass)
                .removeClass(config.stickyClass);
              if (config.wrapperOverlayed) {
                $wrapper.addClass(config.overlayedClass);
              }
            }
    
            config.lastScroll = scroll;
          }
    
          return {
            init: init,
            unload: unload,
          };
        })();
    
        // =require modules/back-button.js
        theme.Slideshow = (function () {
          this.$slideshow = null;
    
          var classes = {
            next: "is-next",
            init: "is-init",
            animateOut: "animate-out",
            wrapper: "slideshow-wrapper",
            slideshow: "slideshow",
            allSlides: "slick-slide",
            currentSlide: "slick-current",
            pauseButton: "slideshow__pause",
            isPaused: "is-paused",
          };
    
          function slideshow(el, args) {
            this.$slideshow = $(el);
            this.$wrapper = this.$slideshow.closest("." + classes.wrapper);
            this.$pause = this.$wrapper.find("." + classes.pauseButton);
    
            this.settings = {
              accessibility: true,
              arrows: args.arrows ? true : false,
              dots: args.dots ? true : false,
              fade: args.fade ? true : false,
              speed: args.speed ? args.speed : 500,
              draggable: true,
              touchThreshold: 5,
              pauseOnHover: false,
              autoplay: args.autoplay ? true : false,
              autoplaySpeed: this.$slideshow.data("speed"),
            };
    
            this.$slideshow.off("beforeChange");
            this.$slideshow.off("afterSlideChange");
            this.$slideshow.on("init", this.init.bind(this));
            this.$slideshow.on("beforeChange", this.beforeSlideChange.bind(this));
            this.$slideshow.on("afterChange", this.afterSlideChange.bind(this));
    
            this.$slideshow.slick(this.settings);
    
            this.$pause.on("click", this._togglePause.bind(this));
          }
    
          slideshow.prototype = $.extend({}, slideshow.prototype, {
            init: function (event, obj) {
              this.$slideshowList = obj.$list;
              this.$slickDots = obj.$dots;
              this.$allSlides = obj.$slides;
              this.slideCount = obj.slideCount;
    
              this.$slideshow.addClass(classes.init);
              this._a11y();
              this._clonedLazyloading();
            },
            beforeSlideChange: function (event, slick, currentSlide, nextSlide) {
              var $slider = slick.$slider;
              var $currentSlide = $slider
                .find("." + classes.currentSlide)
                .addClass(classes.animateOut);
            },
            afterSlideChange: function (event, slick, currentSlide) {
              var $slider = slick.$slider;
              var $allSlides = $slider
                .find("." + classes.allSlides)
                .removeClass(classes.animateOut);
            },
            destroy: function () {
              this.$slideshow.slick("unslick");
            },
    
            // Playback
            _play: function () {
              this.$slideshow.slick("slickPause");
              $(classes.pauseButton).addClass("is-paused");
            },
            _pause: function () {
              this.$slideshow.slick("slickPlay");
              $(classes.pauseButton).removeClass("is-paused");
            },
            _togglePause: function () {
              var slideshowSelector = this._getSlideshowId(this.$pause);
              if (this.$pause.hasClass(classes.isPaused)) {
                this.$pause.removeClass(classes.isPaused);
                $(slideshowSelector).slick("slickPlay");
              } else {
                this.$pause.addClass(classes.isPaused);
                $(slideshowSelector).slick("slickPause");
              }
            },
    
            // Helpers
            _getSlideshowId: function ($el) {
              return "#Slideshow-" + $el.data("id");
            },
            _activeSlide: function () {
              return this.$slideshow.find(".slick-active");
            },
            _currentSlide: function () {
              return this.$slideshow.find(".slick-current");
            },
            _nextSlide: function (index) {
              return this.$slideshow.find(
                '.slideshow__slide[data-slick-index="' + index + '"]'
              );
            },
    
            // a11y fixes
            _a11y: function () {
              var $list = this.$slideshowList;
              var autoplay = this.settings.autoplay;
    
              if (!$list) {
                return;
              }
    
              // Remove default Slick aria-live attr until slider is focused
              $list.removeAttr("aria-live");
    
              // When an element in the slider is focused
              // pause slideshow and set aria-live
              $(classes.wrapper).on(
                "focusin",
                function (evt) {
                  if (!$(classes.wrapper).has(evt.target).length) {
                    return;
                  }
    
                  $list.attr("aria-live", "polite");
                  if (autoplay) {
                    this._pause();
                  }
                }.bind(this)
              );
    
              // Resume autoplay
              $(classes.wrapper).on(
                "focusout",
                function (evt) {
                  if (!$(classes.wrapper).has(evt.target).length) {
                    return;
                  }
    
                  $list.removeAttr("aria-live");
                  if (autoplay) {
                    this._play();
                  }
                }.bind(this)
              );
            },
    
            // Make sure lazyloading works on cloned slides
            _clonedLazyloading: function () {
              var $slideshow = this.$slideshow;
    
              $slideshow.find(".slick-slide").each(
                function (index, el) {
                  var $slide = $(el);
                  if ($slide.hasClass("slick-cloned")) {
                    var slideId = $slide.data("id");
                    var $slideImg = $slide
                      .find(".hero__image")
                      .removeClass("lazyloading")
                      .addClass("lazyloaded");
    
                    // Get inline style attribute from non-cloned slide with arbitrary timeout
                    // so the image is loaded
                    setTimeout(function () {
                      var loadedImageStyle = $slideshow
                        .find(
                          ".slideshow__slide--" +
                            slideId +
                            ":not(.slick-cloned) .hero__image"
                        )
                        .attr("style");
    
                      if (loadedImageStyle) {
                        $slideImg.attr("style", loadedImageStyle);
                      }
                    }, this.settings.autoplaySpeed / 1.5);
                  }
                }.bind(this)
              );
            },
          });
    
          return slideshow;
        })();
    
        theme.announcementBar = (function () {
          var slideCount = 0;
          var compact = false;
          var defaults = {
            accessibility: true,
            arrows: false,
            dots: false,
            autoplay: true,
            autoplaySpeed: 5000,
            touchThreshold: 20,
            slidesToShow: 1,
          };
          var $slider;
    
          function init() {
            $slider = $("#AnnouncementSlider");
            if (!$slider.length) {
              return;
            }
    
            slideCount = $slider.data("block-count");
            compact = $slider.data("compact-style");
    
            var desktopOptions = $.extend({}, defaults, {
              slidesToShow: compact ? 1 : slideCount,
              slidesToScroll: 1,
            });
    
            var mobileOptions = $.extend({}, defaults, {
              slidesToShow: 1,
            });
    
            if (theme.config.bpSmall) {
              initSlider($slider, mobileOptions);
            } else {
              initSlider($slider, desktopOptions);
            }
    
            $("body").on(
              "matchSmall",
              function () {
                initSlider($slider, mobileOptions);
              }.bind(this)
            );
    
            $("body").on(
              "matchLarge",
              function () {
                initSlider($slider, desktopOptions);
              }.bind(this)
            );
          }
    
          function initSlider($slider, args) {
            if (isInitialized($slider)) {
              $slider.slick("unslick");
            }
            $slider.slick(args);
          }
    
          function isInitialized($slider) {
            return $slider.length && $slider.hasClass("slick-initialized");
          }
    
          // Go to slide if selected in the editor
          function onBlockSelect(id) {
            var $slide = $("#AnnouncementSlide-" + id);
            if ($slider.length) {
              $slider.slick("slickPause");
            }
            if ($slide.length) {
              $slider.slick("slickGoTo", $slide.data("index"));
            }
          }
    
          function onBlockDeselect(id) {
            if ($slider.length && isInitialized($slider)) {
              $slider.slick("slickPlay");
            }
          }
    
          function unload() {
            if (isInitialized($slider)) {
              $slider.slick("unslick");
            }
          }
    
          return {
            init: init,
            onBlockSelect: onBlockSelect,
            onBlockDeselect: onBlockDeselect,
            unload: unload,
          };
        })();
    
        theme.initQuickShop = function (reinit) {
          var ids = [];
          var $buttons = $(".quick-product__btn");
    
          $buttons.each(function () {
            var id = $(this).data("product-id");
            var modalId = "QuickShopModal-" + id;
            var name = "quick-modal-" + id;
    
            // If another identical modal exists, remove duplicates
            if (ids.indexOf(id) > -1) {
              $('.modal--quick-shop[data-product-id="' + id + '"]').each(function (
                i
              ) {
                if (i > 0) {
                  $(this).remove();
                }
              });
              return;
            }
    
            new theme.Modals(modalId, name);
            ids.push(id);
          });
    
          if (
            typeof BOLD === "object" &&
            BOLD.common &&
            BOLD.common.eventEmitter &&
            typeof BOLD.common.eventEmitter.emit === "function"
          ) {
            BOLD.common.eventEmitter.emit("BOLD_COMMON_cart_loaded");
            BOLD.common.eventEmitter.emit("BOLD_COMMON_redirect_upsell_product");
          }
        };
    
        theme.parallaxSections = {};
    
        theme.Parallax = (function () {
          var speed = 7; // higher is slower
    
          function parallax(el, args) {
            this.$container = $(el);
            this.namespace = args.namespace;
    
            if (!this.$container.length) {
              return;
            }
    
            if (args.desktopOnly) {
              this.desktopInit();
            } else {
              this.init(this.$container, args);
            }
          }
    
          parallax.prototype = $.extend({}, parallax.prototype, {
            init: function (desktopOnly) {
              var $window = (this.$window = $(window));
              var elTop = this.$container.offset().top;
    
              $window.on(
                "scroll" + this.namespace,
                function (evt) {
                  var scrolled = $window.scrollTop();
                  var shiftDistance = (elTop - scrolled) / speed;
                  this.$container.css({
                    transform: "translate3d(0, " + shiftDistance + "px, 0)",
                  });
                }.bind(this)
              );
    
              // Reinit on resize
              $window.on(
                "resize" + this.namespace,
                $.debounce(
                  350,
                  function () {
                    $window.off(this.namespace);
    
                    if (desktopOnly) {
                      if (!theme.config.bpSmall) {
                        this.init(true);
                        return;
                      }
                    }
    
                    this.init();
                  }.bind(this)
                )
              );
            },
    
            desktopInit: function () {
              if (!theme.config.bpSmall) {
                this.init(true);
              }
    
              $("body").on(
                "matchSmall",
                function () {
                  this.destroy();
                }.bind(this)
              );
    
              $("body").on(
                "matchLarge",
                function () {
                  this.init(true);
                }.bind(this)
              );
            },
    
            destroy: function () {
              this.$container.removeAttr("style");
              this.$window.off(this.namespace);
            },
          });
    
          return parallax;
        })();
    
        theme.HeaderSection = (function () {
          var selectors = {
            drawer: "#NavDrawer",
            mobileSubNavToggle: ".mobile-nav__toggle-btn",
            hasSublist: ".mobile-nav__has-sublist",
          };
    
          var classes = {
            navExpanded: "mobile-nav--expanded",
          };
    
          function Header(container) {
            var $container = (this.$container = $(container));
            var sectionId = (this.sectionId = $container.attr("data-section-id"));
    
            // Reload any slideshow if when the header is reloaded to make sure the
            // sticky header works as expected
            theme.reinitSection("slideshow-section");
    
            this.initDrawers();
            theme.headerNav.init();
            theme.announcementBar.init();
    
            // Set a timer to resize the header in case the logo changes size
            if (Shopify.designMode) {
              setTimeout(function () {
                $("body").trigger("resize");
              }, 500);
            }
          }
    
          Header.prototype = $.extend({}, Header.prototype, {
            initDrawers: function () {
              theme.NavDrawer = new theme.Drawers("NavDrawer", "nav");
              if (theme.settings.cartType === "drawer") {
                new theme.CartDrawer();
              }
    
              this.drawerMenuButtons();
            },
    
            drawerMenuButtons: function () {
              $(selectors.drawer)
                .find(".js-drawer-close")
                .on("click", function (evt) {
                  evt.preventDefault();
                  theme.NavDrawer.close();
                });
    
              var $mobileSubNavToggle = $(selectors.mobileSubNavToggle);
    
              $mobileSubNavToggle.attr("aria-expanded", "false");
              $mobileSubNavToggle.each(function (i, el) {
                var $el = $(el);
                $el.attr("aria-controls", $el.attr("data-aria-controls"));
              });
    
              $mobileSubNavToggle.on("click", function () {
                var $el = $(this);
                var currentlyExpanded = $el.attr("aria-expanded");
                var toggleState = false;
    
                // Updated aria-expanded value based on state pre-click
                if (currentlyExpanded === "true") {
                  $el.attr("aria-expanded", "false");
                } else {
                  $el.attr("aria-expanded", "true");
                  toggleState = true;
                }
    
                // Toggle class that expands/collapses sublist
                $el
                  .closest(selectors.hasSublist)
                  .toggleClass(classes.navExpanded, toggleState);
              });
            },
    
            onBlockSelect: function (evt) {
              theme.announcementBar.onBlockSelect(evt.detail.blockId);
            },
    
            onDeselect: function () {
              theme.announcementBar.onBlockDeselect();
            },
    
            onUnload: function () {
              theme.NavDrawer.close();
              theme.headerNav.unload();
              theme.announcementBar.unload();
            },
          });
    
          return Header;
        })();
    
        theme.FeaturedContentSection = (function () {
          function FeaturedContent() {
            $(".rte").find("a:not(:has(img))").addClass("text-link");
          }
    
          return FeaturedContent;
        })();
    
        theme.slideshows = {};
    
        theme.SlideshowSection = (function () {
          var selectors = {
            parallaxContainer: ".parallax-container",
          };
    
          function SlideshowSection(container) {
            var $container = (this.$container = $(container));
            var $section = $container.parent();
            var sectionId = $container.attr("data-section-id");
            var slideshow = (this.slideshow = "#Slideshow-" + sectionId);
            this.namespace = "." + sectionId;
    
            var $imageContainer = $(container).find(".hero");
            if ($imageContainer.length) {
              theme.loadImageSection($imageContainer);
            }
    
            this.init();
    
            if ($container.data("parallax")) {
              var args = {
                namespace: this.namespace,
              };
              theme.parallaxSections[this.namespace] = new theme.Parallax(
                $container.find(selectors.parallaxContainer),
                args
              );
            }
          }
    
          SlideshowSection.prototype = $.extend({}, SlideshowSection.prototype, {
            init: function () {
              // Prevent slideshows from initializing on top of themselves
              this.onUnload();
    
              var $slideshow = $(this.slideshow);
              var args = {
                autoplay: $slideshow.data("autoplay"),
                arrows: $slideshow.data("arrows"),
                dots: $slideshow.data("dots"),
                fade: true,
                speed: 500, // same as $slideshowImageAnimationSpeed in CSS
              };
    
              theme.slideshows[this.slideshow] = new theme.Slideshow(
                this.slideshow,
                args
              );
            },
    
            forceReload: function () {
              this.init();
            },
    
            onUnload: function () {
              if (theme.parallaxSections[this.namespace]) {
                theme.parallaxSections[this.namespace].destroy();
                delete theme.parallaxSections[this.namespace];
              }
              if (theme.slideshows[this.slideshow]) {
                theme.slideshows[this.slideshow].destroy();
                delete theme.slideshows[this.slideshow];
              }
            },
    
            onSelect: function () {
              $(this.slideshow).slick("slickPause");
            },
    
            onDeselect: function () {
              $(this.slideshow).slick("slickPlay");
            },
    
            onBlockSelect: function (evt) {
              var $slideshow = $(this.slideshow);
    
              // Ignore the cloned version
              var $slide = $(
                ".slideshow__slide--" + evt.detail.blockId + ":not(.slick-cloned)"
              );
              var slideIndex = $slide.data("slick-index");
    
              // Go to selected slide, pause autoplay
              $slideshow.slick("slickGoTo", slideIndex).slick("slickPause");
            },
    
            onBlockDeselect: function () {
              $(this.slideshow).slick("slickPlay");
            },
          });
    
          return SlideshowSection;
        })();
    
        theme.BackgroundImage = (function () {
          var selectors = {
            parallaxContainer: ".parallax-container",
          };
    
          function backgroundImage(container) {
            var $container = $(container);
            var sectionId = $container.attr("data-section-id");
            this.namespace = "." + sectionId;
    
            if (!$container.length) {
              return;
            }
    
            if ($container.data("parallax")) {
              var $parallaxContainer = $container.find(selectors.parallaxContainer);
              var args = {
                namespace: this.namespace,
                desktopOnly: true,
              };
    
              theme.parallaxSections[this.namespace] = new theme.Parallax(
                $parallaxContainer,
                args
              );
            }
          }
    
          backgroundImage.prototype = $.extend({}, backgroundImage.prototype, {
            onUnload: function (evt) {
              theme.parallaxSections[this.namespace].destroy();
              delete theme.parallaxSections[this.namespace];
            },
          });
    
          return backgroundImage;
        })();
    
        theme.Instagram = (function () {
          var isInit = false;
    
          function Instagram(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr("data-section-id");
            this.namespace = ".instagram-" + sectionId;
            this.$target = $("#Instafeed-" + sectionId);
    
            if (!this.$target.length) {
              return;
            }
    
            this.checkVisibility();
            $(window).on(
              "scroll" + this.namespace,
              $.throttle(100, this.checkVisibility.bind(this))
            );
          }
    
          Instagram.prototype = $.extend({}, Instagram.prototype, {
            checkVisibility: function () {
              if (isInit) {
                $(window).off("scroll" + this.namespace);
                return;
              }
    
              if (theme.isElementVisible(this.$container)) {
                this.init();
              }
            },
    
            init: function () {
              isInit = true;
    
              var userId = this.$target.data("user-id");
              var clientId = this.$target.data("client-id");
              var count = parseInt(this.$target.data("count"));
              var gridItemWidth = this.$target.data("grid-item-width");
    
              // Ask for 2 more images than we'll actually show because
              // Instagram sometimes doesn't send enough
              var feed = (this.feed = new Instafeed({
                target: this.$target[0],
                accessToken: clientId,
                get: "user",
                userId: userId,
                limit: count + 2,
                template:
                  '<div class="grid__item ' +
                  gridItemWidth +
                  '"><div class="image-wrap"><a href="{% raw %}{{link}}{% endraw %}" target="_blank" style="background-image: url({% raw %}{{image}}{% endraw %}); display: block; padding-bottom: 100%; background-size: cover; background-position: center;"></a></div></div>',
                resolution: "standard_resolution",
              }));
    
              feed.run();
            },
          });
    
          return Instagram;
        })();
    
        theme.NewsletterPopup = (function () {
          function NewsletterPopup(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr("data-section-id");
            this.cookieName = "newsletter-" + sectionId;
    
            if (!$container.length) {
              return;
            }
    
            this.data = {
              secondsBeforeShow: $container.data("delay-seconds"),
              daysBeforeReappear: $container.data("delay-days"),
              cookie: $.cookie(this.cookieName),
              testMode: $container.data("test-mode"),
            };
    
            this.modal = new theme.Modals(
              "NewsletterPopup-" + sectionId,
              "newsletter-popup-modal"
            );
    
            // Open modal if errors or success message exist
            if (
              $container.find(".errors").length ||
              $container.find(".note--success").length
            ) {
              this.modal.open();
            }
    
            // Set cookie as opened if success message
            if ($container.find(".note--success").length) {
              this.closePopup(true);
              return;
            }
    
            $("body").on(
              "modalClose." + $container.attr("id"),
              this.closePopup.bind(this)
            );
    
            if (!this.data.cookie || this.data.testMode) {
              this.initPopupDelay();
            }
          }
    
          NewsletterPopup.prototype = $.extend({}, NewsletterPopup.prototype, {
            initPopupDelay: function () {
              setTimeout(
                function () {
                  this.modal.open();
                }.bind(this),
                this.data.secondsBeforeShow * 1000
              );
            },
    
            closePopup: function (success) {
              // Remove a cookie in case it was set in test mode
              if (this.data.testMode) {
                $.removeCookie(this.cookieName, { path: "/" });
                return;
              }
    
              var expiry = success ? 200 : this.data.daysBeforeReappear;
    
              $.cookie(this.cookieName, "opened", { path: "/", expires: expiry });
            },
    
            onLoad: function () {
              this.modal.open();
            },
    
            onSelect: function () {
              this.modal.open();
            },
    
            onDeselect: function () {
              this.modal.close();
            },
    
            onUnload: function () {},
          });
    
          return NewsletterPopup;
        })();
    
        theme.FadingImages = (function () {
          var classes = {
            activeImage: "active-image",
            finishedImage: "finished-image",
            activeTitles: "active-titles",
            finishedTitles: "finished-titles",
            compensation: "compensation",
          };
    
          function FadingImages(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr("data-section-id");
            var namespace = (this.namespace = ".fading-images-" + sectionId);
    
            if (!$container.length) {
              return;
            }
    
            var $imageContainer = $container.find(".fading-images");
            theme.loadImageSection($imageContainer);
    
            this.data = {
              isInit: false,
              interval: $container.data("interval"),
              block_count: $container.data("count"),
              finish_interval: 1000,
              timer_offset: 400,
              active_image: 1,
              active_title: 1,
              removed_compensation: false,
            };
    
            this.selectors = {
              $allTitles: $container.find(".fading-images-overlay__titles"),
            };
    
            this.checkVisibility();
            $(window).on(
              "scroll" + this.namespace,
              $.throttle(100, this.checkVisibility.bind(this))
            );
          }
    
          FadingImages.prototype = $.extend({}, FadingImages.prototype, {
            checkVisibility: function () {
              if (this.data.isInit) {
                $(window).off("scroll" + this.namespace);
                return;
              }
    
              if (theme.isElementVisible(this.$container)) {
                this.startImages();
                this.startTitles();
                this.data.isInit = true;
              }
            },
    
            nextImage: function () {
              var $container = this.$container;
    
              if (!this.data.removed_compensation) {
                $container
                  .find(
                    ".fading-images__item[data-slide-index=" +
                      this.data.active_image +
                      "]"
                  )
                  .removeClass(classes.compensation);
                this.data.removed_compensation = true;
              }
    
              $container
                .find(
                  ".fading-images__item[data-slide-index=" +
                    this.data.active_image +
                    "]"
                )
                .removeClass(classes.activeImage)
                .addClass(classes.finishedImage);
    
              var target_image = this.data.active_image;
              window.setTimeout(function () {
                $container
                  .find(
                    ".fading-images__item[data-slide-index=" + target_image + "]"
                  )
                  .removeClass(classes.finishedImage);
              }, this.data.finish_interval);
    
              this.data.active_image++;
              if (this.data.active_image > this.data.block_count) {
                this.data.active_image = 1;
              }
    
              $container
                .find(
                  ".fading-images__item[data-slide-index=" +
                    this.data.active_image +
                    "]"
                )
                .addClass(classes.activeImage);
            },
    
            nextTitle: function () {
              var $container = this.$container;
              var $allTitles = this.selectors.$allTitles;
    
              this.selectors.$allTitles
                .removeClass(classes.activeTitles)
                .addClass(classes.finishedTitles);
    
              this.data.active_title++;
              if (this.data.active_title > this.data.block_count) {
                this.data.active_title = 1;
              }
    
              var target_title = this.data.active_title;
              window.setTimeout(function () {
                var newText1 = $container
                  .find(
                    ".fading-images__item[data-slide-index=" + target_title + "]"
                  )
                  .attr("data-slide-title1");
                var newText2 = $container
                  .find(
                    ".fading-images__item[data-slide-index=" + target_title + "]"
                  )
                  .attr("data-slide-title2");
                $container.find(".fading-images-overlay__title--1").text(newText1);
                $container.find(".fading-images-overlay__title--2").text(newText2);
                $allTitles
                  .removeClass(classes.finishedTitles)
                  .addClass(classes.activeTitles);
              }, this.data.finish_interval - 200);
            },
    
            startImages: function () {
              // Prep and show first image
              this.$container
                .find(
                  ".fading-images__item[data-slide-index=" +
                    this.data.active_image +
                    "]"
                )
                .addClass(classes.activeImage)
                .addClass(classes.compensation);
    
              // Begin timer
              var o = this;
              window.setTimeout(function () {
                var fading_images_timer = window.setInterval(
                  o.nextImage.bind(o),
                  o.data.interval
                );
              }, this.data.timer_offset);
            },
    
            startTitles: function () {
              var $container = this.$container;
              var $allTitles = this.selectors.$allTitles;
              // Prep and show first titles
              var target_title = this.data.active_title;
              window.setTimeout(function () {
                var newText1 = $container
                  .find(
                    ".fading-images__item[data-slide-index=" + target_title + "]"
                  )
                  .attr("data-slide-title1");
                var newText2 = $container
                  .find(
                    ".fading-images__item[data-slide-index=" + target_title + "]"
                  )
                  .attr("data-slide-title2");
                $container.find(".fading-images-overlay__title--1").text(newText1);
                $container.find(".fading-images-overlay__title--2").text(newText2);
                $allTitles.addClass(classes.activeTitles);
              }, 750);
    
              // Begin timer
              var fading_titles_timer = window.setInterval(
                this.nextTitle.bind(this),
                this.data.interval
              );
            },
    
            onUnload: function () {
              $(window).off("scroll" + this.namespace);
            },
          });
    
          return FadingImages;
        })();
    
        theme.config = {
          bpSmall: false,
          hasSessionStorage: true,
          mediaQuerySmall: "screen and (max-width: 767px)",
          mediaQueryMediumUp: "screen and (min-width: 768px)",
          youTubeReady: false,
          isTouch:
            "ontouchstart" in window ||
            (window.DocumentTouch && window.document instanceof DocumentTouch) ||
            window.navigator.maxTouchPoints ||
            window.navigator.msMaxTouchPoints
              ? true
              : false,
          isIpad: /ipad/.test(window.navigator.userAgent.toLowerCase()),
          stickyHeader: false,
          recentlyViewed: [],
        };
    
        if (theme.config.isIpad) {
          document.documentElement.className += " js-ipad";
        }
    
        theme.recentlyViewed = {
          recent: {}, // will store handle+url of recent products
          productInfo: {}, // will store product data to reduce API calls
        };
    
        window.onYouTubeIframeAPIReady = function () {
          theme.config.youTubeReady = true;
          $("body").trigger("youTubeReady");
        };
    
        window.loadYouTube = function () {
          if (theme.config.youtubeReady) {
            return;
          }
    
          var tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        };
    
        theme.init = function () {
          theme.setGlobals();
          theme.pageTransitions();
          theme.initQuickShop();
          theme.collapsibles.init();
          // Add quantitiy buttons on the cart page
          theme.createQtySelectors();
    
          slate.rte.wrapTable();
          slate.rte.wrapVideo();
    
          AOS.init({
            easing: "ease-out-quad",
            once: true,
            offset: 60,
            disableMutationObserver: true,
          });
    
          $(document.documentElement).on("keyup.tab", function (evt) {
            if (evt.keyCode === 9) {
              $(document.documentElement).addClass("tab-outline");
              $(document.documentElement).off("keyup.tab");
            }
          });
    
          // Change email icon to submit text
          $(".footer__newsletter-input").on("keyup", function () {
            $(this).addClass("footer__newsletter-input--active");
          });
        };
    
        theme.setGlobals = function () {
          theme.config.hasSessionStorage = theme.isSessionStorageSupported();
          theme.recentlyViewed.handleCookie = $.cookie("theme-recent");
          /*if (theme.recentlyViewed.handleCookie) {
          theme.recentlyViewed.recent = JSON.parse(theme.recentlyViewed.handleCookie);
        }*/
    
          theme.recentlyViewed.productInfo =
            theme.config.hasSessionStorage && sessionStorage["recent-products"]
              ? JSON.parse(sessionStorage["recent-products"])
              : {};
    
          if (theme.config.isTouch) {
            $("body").addClass("supports-touch");
          }
    
          enquire.register(theme.config.mediaQuerySmall, {
            match: function () {
              theme.config.bpSmall = true;
              $("body").trigger("matchSmall");
            },
            unmatch: function () {
              theme.config.bpSmall = false;
              $("body").trigger("unmatchSmall");
            },
          });
    
          enquire.register(theme.config.mediaQueryMediumUp, {
            match: function () {
              $("body").trigger("matchLarge");
            },
            unmatch: function () {
              $("body").trigger("unmatchLarge");
            },
          });
        };
    
        theme.loadImageSection = function ($container) {
          // Wait until images inside container have lazyloaded class
          function setAsLoaded() {
            $container.removeClass("loading loading--delayed").addClass("loaded");
          }
    
          function checkForLazyloadedImage() {
            return $container.find(".lazyloaded").length;
          }
    
          // If it has SVGs it's in the onboarding state so set as loaded
          if ($container.find("svg").length) {
            setAsLoaded();
            return;
          }
    
          if (checkForLazyloadedImage() > 0) {
            setAsLoaded();
            return;
          }
    
          var interval = setInterval(function () {
            if (checkForLazyloadedImage() > 0) {
              clearInterval(interval);
              setAsLoaded();
            }
          }, 80);
        };
    
        theme.isSessionStorageSupported = function () {
          // Return false if we are in an iframe without access to sessionStorage
          if (window.self !== window.top) {
            return false;
          }
    
          var testKey = "test";
          var storage = window.sessionStorage;
          try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
          } catch (error) {
            return false;
          }
        };
    
        theme.isElementVisible = function ($el, threshold) {
          var rect = $el[0].getBoundingClientRect();
          var windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
          threshold = threshold ? threshold : 0;
    
          return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= windowHeight + threshold &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
          );
        };
    
        theme.pageTransitions = function () {
          if ($("body").data("transitions") == true) {
            var namespace = ".page-transition";
    
            // Hack test to fix Safari page cache issue.
            // window.onpageshow doesn't always run when navigating
            // back to the page, so the unloading class remains, leaving
            // a white page. Setting a timeout to remove that class when leaving
            // the page actually finishes running when they come back.
            if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
              $("a")
                .off(namespace)
                .on("click" + namespace, function () {
                  window.setTimeout(function () {
                    $("body").removeClass("unloading");
                  }, 1200);
                });
            }
    
            // Add disable transition class to malito, anchor, and YouTube links
            $(
              'a[href^="mailto:"], a[href^="#"], a[target="_blank"], a[href*="youtube.com/watch"], a[href*="youtu.be/"]'
            ).each(function () {
              $(this).addClass("js-no-transition");
            });
    
            $("a:not( .js-no-transition ):not(.ui-tabs-anchor)")
              .off(namespace)
              .on("click" + namespace, function (evt) {
                if (evt.metaKey) return true;
                evt.preventDefault();
                $("body").addClass("unloading");
                var src = $(this).attr("href");
                window.setTimeout(function () {
                  location.href = src;
                }, 50);
              });
    
            // iOS caches the page state, so close the drawer when navigating away
            $("a.mobile-nav__link")
              .off(namespace)
              .on("click" + namespace, function () {
                theme.NavDrawer.close();
              });
          }
        };
    
        theme.reinitSection = function (section) {
          for (var i = 0; i < sections.instances.length; i++) {
            var instance = sections.instances[i];
            if (instance["type"] === section) {
              if (typeof instance.forceReload === "function") {
                instance.forceReload();
              }
            }
          }
        };
    
        // Add quantity buttons on the cart page
        theme.createQtySelectors = function () {
          $cartContainer = $("body.template-cart");
          // If there is a normal quantity number field in the ajax cart, replace it with our version
          if ($('input[type="number"]', $cartContainer).length) {
            $('input[type="number"]', $cartContainer).each(function () {
              var el = $(this),
                currentQty = el.val();
    
              var itemAdd = currentQty + 1,
                itemMinus = currentQty - 1,
                itemQty = currentQty;
    
              var source = $("#JsQty--cart").html(),
                template = Handlebars.compile(source),
                data = {
                  id: el.data("id"),
                  itemQty: itemQty,
                  itemAdd: itemAdd,
                  itemMinus: itemMinus,
                };
    
              // Append new quantity selector then remove original
              el.after(template(data)).remove();
            });
          }
    
          // Setup listeners to add/subtract from the input
          $("body.template-cart .js-qty__adjust").on("click", function () {
            var el = $(this),
              id = el.data("id"),
              qtySelector = el.siblings(".js-qty__num"),
              qty = parseInt(qtySelector.val().replace(/\D/g, ""));
    
            // Make sure we have a valid integer
            if (parseFloat(qty) == parseInt(qty) && !isNaN(qty)) {
              // We have a number!
            } else {
              // Not a number. Default to 1.
              qty = 1;
            }
    
            // Add or subtract from the current quantity
            if (el.hasClass("js-qty__adjust--plus")) {
              qty = qty + 1;
            } else {
              qty = qty - 1;
              if (qty <= 0) qty = 0;
            }
    
            // Update the input's number
            qtySelector.val(qty).trigger("change");
          });
    
          $("body.template-cart .js-qty__num").on("change", function () {
            $("body.template-cart .update-cart").click();
          });
        };
    
        // ---------------Discount Code -----------------
        if (typeof ShopifyAPI === "undefined") {
          ShopifyAPI = {};
        }
    
        ShopifyAPI.getCart = function (callback) {
          jQuery.getJSON("/cart.js", function (cart) {
            if (typeof callback === "function") {
              callback(cart);
            } else {
              ShopifyAPI.onCartUpdate(cart);
            }
          });
        };
    
        theme.setCookie = function (cname, cvalue) {
          document.cookie = cname + "=" + cvalue + ";path=/";
        };
    
        theme.getCookie = function (cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        };
    
        theme.afterCartLoad = function () {
          theme.cache.$body.on("ajaxCart.afterCartLoad", function (evt, cart) {
            // Open cart drawer
            timber.RightDrawer.open();
    
            // Size the cart's fixed footer
    
            // Show cart bubble in nav if items exist
            if (cart.items.length > 0) {
              let cookieDiscountName = theme.getCookie("discount_code");
    
              if (cookieDiscountName) {
                theme.getDiscount();
              } else {
                theme.bindDrawerHandlers();
              }
    
              theme.cache.$cartBuggle.addClass("cart-link__bubble--visible");
            } else {
              theme.cache.$cartBuggle.removeClass("cart-link__bubble--visible");
            }
          });
        };
    
        theme.bindDrawerHandlers = function () {
          let drawerDiscountButton = document.querySelector(
            ".drawer__discount .drawer__discountButton"
          );
    
          if (drawerDiscountButton) {
            drawerDiscountButton.addEventListener("click", (event) => {
              event.preventDefault();
              theme.getDiscount();
            });
          }
        };
    
        theme.preventBundleDiscount = function () {
          console.log("here");
          var discountError = document.querySelector(".drawer__discountError");
          var discountField = document.querySelector(".drawer__discountField");
          discountError.innerHTML =
            "Discount code cannot be bundled with other promotions.";
          discountField.classList.add("drawer__discountField--error");
          discountError.classList.add("active");
          discountError.classList.remove("none");
    
          setTimeout(() => {
            discountField.classList.remove("drawer__discountField--error");
            discountError.classList.remove("active");
          }, 4000);
        };
    
        theme.showGiftButton = (function () {
          let isGift = document.querySelector(".cart__rowProductGift");
    
          if (isGift) {
            let textForButton = document.querySelector(
                ".giftPopUpButtonText"
              ).innerText,
              showPopUpButton = `<a href="#" class="openPopUpButton">${textForButton}</a>`,
              currentCount = document.querySelector(".cart__giftsSize").innerText,
              freeGiftCount = theme.getCookie("giftCount");
    
            document
              .querySelector(".cart__products .cart__totalVoucherWrapper")
              .insertAdjacentHTML("beforeend", showPopUpButton);
            document
              .querySelector(".openPopUpButton")
              .addEventListener("click", function (event) {
                event.preventDefault();
                theme.openGiftsPopUp(freeGiftCount, parseInt(currentCount));
              });
          }
        })();
    
        theme.getUpsell = function () {
          fetch("/cart?view=upsell").then((response) => {
            if (response.ok) {
              response
                .text()
                .then(function (text) {
                  let parser = new DOMParser();
                  let upsell_cart = parser.parseFromString(text, "text/html");
                  let element = document.getElementById("upsell_product_container");
                  element.innerHTML = new XMLSerializer().serializeToString(
                    upsell_cart
                  );
                })
                .then(function () {
                  var $cartFooter = $(".drawer__footer--fixed").removeAttr("style");
                  var $cartInner = $(".drawer__inner--has-fixed-footer").removeAttr(
                    "style"
                  );
                  var cartFooterHeight = $cartFooter.outerHeight();
    
                  $cartInner.css("bottom", cartFooterHeight);
                  $cartFooter.css("height", cartFooterHeight);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        };
    
        theme.getDiscount = function (discount_code) {
          let discountButton = document.querySelector(".drawer__discountButton");
          discountButton.classList.add("btn--loading");
    
          let code = document.querySelector(".drawer__discountField")
            ? document.querySelector(".drawer__discountField").value
            : "";
    
          let cartPrice = document.querySelector("#revy-cart-subtotal-price"),
            price = parseFloat(cartPrice.innerText.substr(1).replace(",", "."));
    
          let discountCode = discount_code ? discount_code : code;
    
          let matchedCode = theme.free_gift.filter(function (e) {
              return (
                e.discount_code.toUpperCase().trim() ===
                discountCode.toUpperCase().trim()
              );
            }),
            freeGiftData = matchedCode.length > 0 ? matchedCode[0] : false;
    
          if (freeGiftData) {
            let discountMov = freeGiftData.discount_mov,
              freeGiftCount = freeGiftData.free_gift_count;
    
            ShopifyAPI.getCart(function (cart) {
              var updateData = { updates: {} },
                currentCount = 0;
              $.each(cart.items, function (index, product) {
                if (
                  typeof product.properties !== "undefined" &&
                  product.properties !== null
                ) {
                  if (
                    typeof product.properties["gift"] !== "undefined" &&
                    product.properties["gift"] !== null
                  ) {
                    updateData.updates[product.id] = 0;
                    currentCount++;
                  }
                }
              });
    
              if (price > discountMov) {
                if (currentCount == 0) {
                  let textForButton = document.querySelector(
                    ".giftPopUpButtonText"
                  ).innerText;
                  let showPopUpButton = `<a href="#" class="openPopUpButton">${textForButton}</a>`;
                  let cookieDiscountName = theme.getCookie("discount_code")
                    ? theme.getCookie("discount_code")
                    : null;
    
                  if (!document.querySelector(".openPopUpButton")) {
                    theme.setCookie("giftCount", freeGiftCount);
                    document
                      .querySelector(".cart__products form")
                      .insertAdjacentHTML("beforeend", showPopUpButton);
                    document
                      .querySelector(".openPopUpButton")
                      .addEventListener("click", function (event) {
                        event.preventDefault();
                        theme.openGiftsPopUp(freeGiftCount, currentCount);
                      });
                  }
    
                  document.querySelector(".openPopUpButton").click();
                }
              } else {
                if (currentCount > 0) {
                  $.ajax({
                    type: "POST",
                    url: "/cart/update.js",
                    data: updateData,
                    dataType: "json",
                    success: function (cart) {
                      location.reload();
                    },
                  });
                }
              }
            });
          }
    
          fetch(`/checkout${discountCode ? "/?discount=" + discountCode : ""}`)
            .then((response) => {
              if (response.ok) {
                response.text().then(function (text) {
                  var parser = new DOMParser();
                  var checkoutPage = parser.parseFromString(text, "text/html");
    
                  theme.updateCart(checkoutPage);
                });
              }
            })
            .then(() => {
              if (theme.gift_discounts_list.length > 0) {
                let discount_match_array = [];
    
                theme.gift_discounts_list.forEach((object) => {
                  if (
                    object.code.toUpperCase().trim() ===
                    discountCode.toUpperCase().trim()
                  ) {
                    discount_match_array.push(object.relatedTo);
                  }
                });
    
                if (discount_match_array.length > 0) {
                  let items = [];
    
                  discount_match_array.forEach((item) => {
                    if (document.querySelector(`.${item}`)) {
                      let gift_json = document.querySelector(`.${item}`);
                      items.push(JSON.parse(gift_json.text));
                    }
                  });
    
                  fetch("/cart/add.js", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      items: items,
                    }),
                  }).then((response) => {
                    if (response.ok) {
                      location.reload();
                    }
                  });
                }
              }
            });
        };
    
        theme.updateCart = function (checkoutPage) {
          let selectors = {
            cartPrice: "#revy-cart-subtotal-price",
            discountLabel: ".tags-list .reduction-code__text",
            discountName: ".reduction-code__text",
            cartDiscountBlock: ".drawer__discount",
            discountField: ".drawer__discountField",
            discountError: ".drawer__discountError",
            discountCodeName: ".reduction-code__text",
            cartOldPrice: ".revy-bundle-result-price",
            discountButton: ".drawer__discountButton",
            cartDiscountWrapper: ".appliedDiscount",
            cartSubTotal: '#revy-cart-subtotal-price[data-sezzleindex="0"]',
          };
          let newPrice = checkoutPage.querySelector(
              "[data-checkout-payment-due-target]"
            ).innerText,
            cartPrice = document.querySelector(selectors.cartPrice),
            discountCodeName = checkoutPage.querySelector(
              selectors.discountCodeName
            ),
            discountField = document.querySelector(selectors.discountField),
            discountButton = document.querySelector(selectors.discountButton),
            discountLabel = checkoutPage.querySelector(selectors.discountLabel),
            discountError = document.querySelector(selectors.discountError),
            cartDiscountWrapper = document.querySelector(
              selectors.cartDiscountWrapper
            ),
            cartSubTotal = document.querySelector(selectors.cartSubTotal);
    
          if (discountLabel != null && newPrice != cartPrice.innerText) {
            var oldPrice = document.querySelector(selectors.cartOldPrice);
            if (!oldPrice) {
              oldPrice = document.querySelector(selectors.cartPrice);
            }
    
            let originalPrice = `<span class="original-cart-total">${oldPrice.innerText}</span>`;
            cartPrice.innerText = newPrice;
            cartSubTotal.insertAdjacentHTML("beforebegin", originalPrice);
    
            theme.setCookie("discount_code", discountCodeName.innerText);
            theme.fillDrawerDiscount(discountCodeName.innerText);
    
            cartDiscountWrapper.classList.remove("appliedDiscount--hidden");
            discountError.classList.add("none");
            document
              .querySelector(".drawer__discount .appliedDiscount__removeButton")
              .addEventListener("click", theme.removeDiscountCode);
          } else if (discountLabel == null) {
            if (discountField) {
              discountField.classList.add("drawer__discountField--error");
              discountError.classList.add("active");
              discountError.classList.remove("none");
    
              setTimeout(() => {
                discountField.classList.remove("drawer__discountField--error");
                discountError.classList.remove("active");
              }, 4000);
            }
          }
          discountButton.classList.remove("btn--loading");
        };
    
        theme.fillDrawerDiscount = function (discountName) {
          let discountField = document.querySelector(".drawer__discountField"),
            discountButton = document.querySelector(".drawer__discountButton"),
            removeButton = document.querySelector(".appliedDiscount__removeButton");
    
          discountField.value = discountName;
          discountField.disabled = true;
          discountButton.innerText = "✓ DISCOUNT APPLIED";
          discountButton.disabled = true;
          discountButton.classList.add("discount-applied");
          document
            .querySelector(".drawer__discount")
            .classList.add("discount-applied");
          removeButton.classList.add("appliedDiscount__removeButton--visible");
        };
    
        theme.removeDiscountCode = function (event, code = "") {
          let selectors = {
            discountField: ".drawer__discountField",
            applyDiscountButton: ".drawer__discountButton",
            appliedDiscountWrapper: ".appliedDiscount",
            oldCartPrice: ".cart__totalPrice .oldPrice",
            cartTotalPrice: "#revy-cart-subtotal-price",
            removeButton: ".appliedDiscount__removeButton",
          };
    
          let discountField = document.querySelector(selectors.discountField),
            applyDiscountButton = document.querySelector(
              selectors.applyDiscountButton
            ),
            appliedDiscountWrapper = document.querySelector(
              selectors.appliedDiscountWrapper
            ),
            oldCartPrice = document.querySelector(selectors.oldCartPrice),
            cartTotalPrice = document.querySelector(selectors.cartTotalPrice),
            removeButton = document.querySelector(selectors.removeButton),
            discountCode = code == "" ? discountField.value : code;
    
          let giftRemoveButton = document.querySelector("[data-discount-gift]");
    
          let matchedCode = theme.free_gift.filter(function (e) {
            return e.discount_code.toUpperCase() === discountCode.toUpperCase();
          });
    
          applyDiscountButton.classList.add("btn--loading");
    
          document.cookie =
            "discount_code=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    
          fetch("/checkout/?discount=+").then((response) => {
            if (response.ok) {
              response.text().then(function (text) {
                var parser = new DOMParser();
                var checkoutPage = parser.parseFromString(text, "text/html");
                let newPrice = checkoutPage.querySelector(
                  "[data-checkout-payment-due-target]"
                ).innerText;
    
                fetch("/cart", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    attributes: {
                      discountName: "",
                    },
                  }),
                }).then(() => {
                  if (matchedCode.length > 0) {
                    ShopifyAPI.getCart(function (cart) {
                      var updateData = { updates: {} };
                      $.each(cart.items, function (index, product) {
                        if (
                          typeof product.properties !== "undefined" &&
                          product.properties !== null
                        ) {
                          if (
                            typeof product.properties["gift"] !== "undefined" &&
                            product.properties["gift"] !== null
                          ) {
                            updateData.updates[product.id] = 0;
                          }
                        }
                      });
    
                      $.ajax({
                        type: "POST",
                        url: "/cart/update.js",
                        data: updateData,
                        dataType: "json",
                        success: function (cart) {
                          if (giftRemoveButton) {
                            giftRemoveButton.click();
                          } else {
                            cartTotalPrice.innerText = newPrice;
                            if (oldCartPrice) {
                              oldCartPrice.classList.remove("active");
                              cartTotalPrice.classList.remove("active");
                            }
                            appliedDiscountWrapper.innerHTML = "";
                            appliedDiscountWrapper.classList.add(
                              ".appliedDiscount--hidden"
                            );
                            discountField.value = "";
                            applyDiscountButton.innerText = "Redeem";
                            discountField.removeAttribute("disabled");
                            applyDiscountButton.removeAttribute("disabled");
                            applyDiscountButton.classList.remove("btn--loading");
                            removeButton.classList.remove(
                              "appliedDiscount__removeButton--visible"
                            );
    
                            if (giftRemoveButton && matchedCode.length == 0) {
                              giftRemoveButton.click();
                            }
                            location.reload();
                          }
                        },
                      });
                    });
                  } else {
                    cartTotalPrice.innerText = newPrice;
                    if (oldCartPrice) {
                      oldCartPrice.classList.remove("active");
                      cartTotalPrice.classList.remove("active");
                    }
                    appliedDiscountWrapper.innerHTML = "";
                    appliedDiscountWrapper.classList.add(
                      ".appliedDiscount--hidden"
                    );
                    discountField.value = "";
                    applyDiscountButton.innerText = "Redeem";
                    discountField.removeAttribute("disabled");
                    applyDiscountButton.removeAttribute("disabled");
                    applyDiscountButton.classList.remove("btn--loading");
                    removeButton.classList.remove(
                      "appliedDiscount__removeButton--visible"
                    );
    
                    if (giftRemoveButton && matchedCode.length == 0) {
                      giftRemoveButton.click();
                    }
                    location.reload();
                  }
                });
              });
            }
          });
        };
    
        // ----------End Discount Code-------------------
        window.onpageshow = function (evt) {
          // Removes unload class when returning to page via history
          if (evt.persisted) {
            $("body").removeClass("unloading");
          }
        };
    
        $(document).ready(function () {
          theme.init();
    
          window.sections = new theme.Sections();
          sections.register("header-section", theme.HeaderSection);
          sections.register("slideshow-section", theme.SlideshowSection);
          sections.register("background-image", theme.BackgroundImage);
          sections.register(
            "featured-content-section",
            theme.FeaturedContentSection
          );
          sections.register("instagram", theme.Instagram);
          sections.register("newsletter-popup", theme.NewsletterPopup);
          sections.register("fading-images", theme.FadingImages);
        });
      })(theme.jQuery);
    
      // Accordion
      $(".accordion")
        .find(".accordion-toggle")
        .click(function () {
          $(this).next().slideToggle("600");
          $(".accordion-content").not($(this).next()).slideUp("600");
        });
      $(".accordion-toggle").on("click", function () {
        $(this).toggleClass("active").siblings().removeClass("active");
      });
    
      // Why vegan home page section
      $(".why-vegan-feature-icons-slider").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".why-vegan-feature-text-slider",
        arrows: false,
        infinite: false,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: "0",
      });
      $(".why-vegan-feature-text-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: ".why-vegan-feature-icons-slider",
        infinite: false,
      });
      $(".why-vegan-feature-icons-slider").slick("slickNext");
    
      // Logo bar section slider
      if ($(".logo-bar--slider").length) {
        var slider = $(".logo-bar--slider");
        var slidesMobile = slider.attr("data-slides-mobile");
        var slidesDesktop = slider.attr("data-slides-desktop");
    
        slider.slick({
          slidesToShow: slidesDesktop,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: slidesMobile,
              },
            },
          ],
        });
      }
    
      // Drawer cart remove item button
      $("body").on("click", ".ajaxcart__product-remove", function (e) {
        e.preventDefault();
    
        let itemKey = $(this).data("item-key");
    
        theme.cart.changeItem(itemKey, 0).then(function () {
          $("body").trigger("added.ajaxProduct");
        });
      });
    
      // triggers when gallery is ready
      document.addEventListener("galleryReady:covetPics", function (e) {
        // prepare CSS styles to inject
        const stylesPopup = document.createElement("style");
        stylesPopup.innerHTML = `
        @media screen and (min-width: 768px) {
          .swiper-slide {
            height: 0 !important;
            padding-bottom: 22.5% !important;
          }
        }
        @media screen and (max-width: 767px) {
          .swiper-slide {
            height: 0 !important;
            padding-bottom: 45% !important;
          }
        }
      `;
        // get Covet gallery elements where you want to inject CSS (for eg. covet-pics-widget, covet-pics-popup, covet-pics-upload)
        const popup = document.querySelector("covet-pics-widget");
    
        // now inject CSS code into shadow DOM
        popup.shadowRoot.appendChild(stylesPopup);
      });
    }
    