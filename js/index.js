const PAGE = {
  data:{
    //储存导航容器Id
    navigatorBarIdArr:['introduce','watch','teachers','DragonBoard','about'],
    //当前导航高亮Id
    navigatorBarActiveId:'',
    //导航是否定位在顶部
    navigatorBarFixed:false,
    //导航距离顶部的距离
    navigatorBarFixedOffset:496,
    //导航自身高度
    navigatorBarHeight:70,
    //锁
    isLock:false,
    //滑动时长
    duration:500,
    //当前第几项
    index:0,
    //偏移量
    translateX:0,
    //默认的醒目数量
    defaultLenght:null,
    //单个项目长度
    itemWidth:240,
  },

  init:function(){
    this.clone();
    this.bind();
  },
  
  bind:function(){
    $(window).on('scroll',this.navigator);
    $(window).on('scroll',this.hideShow)
    $('.nav-item').on('click',this.goNavItem);
    $('.watch-subtitle').on('click',this.chapterSwitch);
    $('.swiper-button-prev').on('click',this.swiperPrev);
    $('.swiper-button-next').on('click',this.swiperNext);
    $('.watch-item').on('click',this.watchItem);
    $('.footer-gotop-top').on('click',this.gotop);
  },
 
  navigator(){
    PAGE.locateNavigator();
    PAGE.highBrightNavigator();
  },

  //导航定位
  locateNavigator(){
    let scrollTop = document.documentElement.scrollTop;
    let navigatorLocateOffset = PAGE.data.navigatorBarFixedOffset;
    let navigatorBarFixed = scrollTop >= navigatorLocateOffset;
    if(PAGE.data.navigatorBarFixed !== navigatorBarFixed){
      PAGE.data.navigatorBarFixed = navigatorBarFixed;
      let navigatorBar = $('#navigator-bar').get(0);
      if(navigatorBarFixed){
        navigatorBar.className = 'navigator-bar fixed-top'
      }else{
        navigatorBar.className = 'navigator-bar'
      }
    }
  },

  //点击导航，页面滚动到对应模块。
  goNavItem(e){
    let id = e.target.dataset.nav;
    let offsetTop = document.getElementById(id).offsetTop - PAGE.data.navigatorBarHeight;
    PAGE.navAnimateTo(offsetTop)
  },

  //页面滚动到某个模块，导航对应的模块需要高亮对应。
  highBrightNavigator(){
    let scrollTop = document.documentElement.scrollTop;
    let filterNav = PAGE.data.navigatorBarIdArr.filter(data=>{
      let offsetTop = document.getElementById(data).offsetTop - PAGE.data.navigatorBarHeight;
      return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
    })

    let navigatorBarActiveId = filterNav.length ? filterNav[filterNav.length-1]:'';
    if(PAGE.data.navigatorBarActiveId !== navigatorBarActiveId){
      PAGE.data.navigatorBarActiveId = navigatorBarActiveId;
      let navItems = $('.nav-item');
      for(i=0;i<navItems.length;i++){
        let navItem = navItems[i];
        let dataNav = navItem.dataset.nav;
        if(dataNav === navigatorBarActiveId){
          navItem.className = 'nav-item active'
        }else{
          navItem.className = 'nav-item'
        }
      }
    }
  },

  //课程视频列表默认展开，可点击收起。
  chapterSwitch(){
    let watchRotate = this.children[0];
    let watchList = $(watchRotate).parent().siblings();
    $(watchRotate).toggleClass('active');
    $(watchList).slideToggle();
    console.log(watchList)
  },

  //点击课程到视频位置
  watchItem(){
    let watch = document.getElementById('watch');
    let watchVideo = watch.offsetTop - PAGE.data.navigatorBarHeight;
    PAGE.navAnimateTo(watchVideo)
  },

  //轮播上一项
  swiperPrev(){
    let index = PAGE.data.index;
    PAGE.goIndex(index - 1)
  },

  //轮播下一项
  swiperNext(){
    let index = PAGE.data.index;
    PAGE.goIndex(index + 1)
  },

  //top到指定位置隐藏
  hideShow(){
    let scrollTop = document.documentElement.scrollTop;
    let gotop = $('.footer-gotop').get(0);
    let gotopTop = $('.footer-gotop-top').get(0);
    let gotopOffsetTop = gotop.offsetTop;
    
    if(gotopOffsetTop >= scrollTop + gotopOffsetTop){
      gotopTop.className = 'footer-gotop-top active'
    }else{
      gotopTop.className = 'footer-gotop-top'
    }
  },

  //点击top直接到顶部
  gotop(){
    let gotop = 0;
    PAGE.navAnimateTo(gotop)
  },

  //幻灯片克隆
  clone(){
    let swiperSlide = $('.swiper-slide');
    let swiperWrapper = $('.swiper-wrapper').get(0);

    for(i=0;i<swiperSlide.length;i++){
      swiperSlide[i].setAttribute('data-index',i);
      let firstSwiper = swiperSlide[i].cloneNode(true);
      swiperWrapper.appendChild(firstSwiper);
    }

    let index = PAGE.data.index;
    let swiperSlideWidth = swiperSlide[0].offsetWidth;
    PAGE.data.defaultLenght = swiperSlide.length;
    PAGE.data.itemWidth = swiperSlideWidth;
    PAGE.data.translateX = -(swiperSlideWidth + swiperSlideWidth * index)

    PAGE.goIndex(index)
  },

  //轮播滑动动画
  goIndex(index){
    let swiperDuration = PAGE.data.duration;
    let swiperWidth = PAGE.data.itemWidth;
    let beginTranslateX = PAGE.data.translateX;
    let endTranslateX = -(swiperWidth + swiperWidth * index);
    if(PAGE.data.isLock){
      return
    }
    PAGE.data.isLock = true

    let swiperWrapper = $('.swiper-wrapper').get(0);
    PAGE.animateTo(beginTranslateX,endTranslateX,swiperDuration,function(value){
      swiperWrapper.style.transform = `translateX(${value}px)`
    },function(value){
      let swiperLenght = PAGE.data.defaultLenght;
      if(index === -1){
        index = swiperLenght - 1;
        value = -(swiperWidth + swiperWidth * index)
      }
      if(index === swiperLenght){
        index = 0;
        value = -(swiperWidth + swiperWidth * index)
      }

      swiperWrapper.style.transform = `translateX(${value}px)`
      PAGE.data.index = index;
      PAGE.data.translateX = value;

      PAGE.data.isLock = false
    })
  },

  //导航滚动针频动画
  navAnimateTo:function(end){
    let duration = PAGE.data.duration;
    let startTime = Date.now();
    let begin = document.documentElement.scrollTop;
    requestAnimationFrame(function update(){
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = PAGE.linear(time,begin,end,duration);
      document.documentElement.scrollTop = value;
      if(startTime + duration >dataNow){
        requestAnimationFrame(update)
      }else{
        document.documentElement.scrollTop = end;
      }
    })
  },

  //轮播图滚动针频动画
  animateTo(begin,end,duration,changeCallback,finishCallback){
    let startTime = Date.now();
    requestAnimationFrame(function update(){
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = PAGE.linear(time,begin,end,duration);
      typeof changeCallback === 'function' && changeCallback(value)
      if(startTime + duration >dataNow){
        requestAnimationFrame(update)
      }else{
        typeof finishCallback === 'function' && finishCallback(end)
      }
    })
  },

  linear: function(time, begin, end, duration) { 
    return ( end - begin ) * time / duration + begin;
  }
}
PAGE.init()