

      let childLen = $('.home-testimonial .testi-ul .images').children('.img').length;
      
      let currentSlide = 1;
      $(".testi-next").click(function(){
        if(currentSlide>=1 && currentSlide<childLen){
            console.log("if: "+currentSlide);
            $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide)+")").css({"transform":"translateX(90%)","z-index":"5"});
            $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide+1)+")").css({"transform":"translateX(-18%)","z-index":"2"});
            setTimeout(function(){
                $(".home-testimonial .testi-ul .images .img").css({"z-index":"0"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide-1)+")").css({"z-index":"2","transform": "translateX(0)"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide)+")").css({"z-index":"5","transform": "translateX(0)"});
            },200);

            $(".home-testimonial .testi-ul .descript .descr").removeClass("slide-descr-active");
            $(".home-testimonial .testi-ul .descript .descr:nth-of-type("+(currentSlide+1)+")").addClass("slide-descr-active");


            ++currentSlide;
        
        }else if(currentSlide==childLen){
            console.log("else if: "+currentSlide);
            $(".home-testimonial .testi-ul .images .img:nth-child("+currentSlide+")").css({"transform":"translateX(90%)","z-index":"5"});
            $(".home-testimonial .testi-ul .images .img:nth-child(1)").css({"transform":"translateX(-18%)","z-index":"2"});        
            setTimeout(function(){
                $(".home-testimonial .testi-ul .images .img:nth-child(1)").css({"transform":"translateX(0%)","z-index":"5"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+childLen+")").css({"z-index":"0","transform": "translateX(0)"});              
            },200);

            currentSlide=1;	

            $(".home-testimonial .testi-ul .descript .descr").removeClass("slide-descr-active");
            $(".home-testimonial .testi-ul .descript .descr:nth-of-type(1)").addClass("slide-descr-active");
        }
    });

    $(".testi-prev").click(function(){
        if(currentSlide>1){
            console.log("prev if: "+currentSlide);
            $(".home-testimonial .testi-ul .images .img:nth-child("+currentSlide+")").css({"transform":"translateX(90%)","z-index":"5"});
            $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide-1)+")").css({"transform":"translateX(-18%)","z-index":"2"});
            setTimeout(function(){
                $(".home-testimonial .testi-ul .images .img").css({"z-index":"0"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+currentSlide+")").css({"z-index":"5","transform": "translateX(0)"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide+1)+")").css({"z-index":"2","transform": "translateX(0)"});
            },200);

            $(".home-testimonial .testi-ul .descript .descr").removeClass("slide-descr-active");
            $(".home-testimonial .testi-ul .descript .descr:nth-of-type("+(currentSlide-1)+")").addClass("slide-descr-active");


            --currentSlide;
        
        }else if(currentSlide==1){
            console.log("prev else if: "+currentSlide);
            $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide)+")").css({"transform":"translateX(-90%)","z-index":"5"});
            $(".home-testimonial .testi-ul .images .img:nth-child("+childLen+")").css({"transform":"translateX(18%)","z-index":"2"});
            // $(".home-testimonial .testi-ul .images .img:nth-child("+(currentSlide)+")").css({"transform":"translateX(0%)","z-index":"2"});
            setTimeout(function(){
                $(".home-testimonial .testi-ul .images .img:nth-child(1)").css({"transform":"translateX(0%)","z-index":"2"});
                $(".home-testimonial .testi-ul .images .img:nth-child("+childLen+")").css({"z-index":"5","transform": "translateX(0)"});             
            },200);

            currentSlide=childLen;	

            $(".home-testimonial .testi-ul .descript .descr").removeClass("slide-descr-active");
            $(".home-testimonial .testi-ul .descript .descr:nth-of-type("+childLen+")").addClass("slide-descr-active");
        }
    });

