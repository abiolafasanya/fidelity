class UI {
    #initialPage = "overview";
    constructor() {
        
        this.sidebar = {
            _active: false,
            open: function(tag = '.navbar-burger') {
                this._active = true;
                tag !=null||undefined ? $(tag).addClass('close') : null;
                $('#aside').css('transform', 'translateX(0)');

                window.innerWidth <= 768 ? ($(".overlay").css("transform", 'translateX(0%)'),
                $('body').css('overflow-y', 'hidden')) : null
            },
            close: function(tag = '.navbar-burger') {
                this._active = false;
                tag !=null||undefined ? $(tag).removeClass('close') : null;
                $('#aside').css('transform', 'translateX(-100%)');
                
                window.innerWidth <= 768 ? ($(".overlay").css("transform", 'translateX(100%)'),
              $('body').css('overflow-y', 'visible')) : null
            }
        }
    }
    get initialPage (){
        return this.#initialPage;
    }

    toggleSidebar(tag){
      
        const { sidebar } = this;
        
          sidebar._active ? 
              sidebar.close(tag) :
               sidebar.open(tag)
    }
    tag(name) {
        return document.querySelector(name);
    }
    variables() {
        return {
            pages: this.tag("#pages"),
            sidebar: this.tag("#aside"),
            navbarBurger: this.tag(".navbar-burger")
        }
    }
    displayCurrentPage(name) {
        this.displayPage(name);
    }

    listenForPageChange() {
        const that = this;
        const { sidebar } = that.variables();
        
        function then(callback) {

            sidebar.addEventListener("click", function(event) {
                let { target } = event;
                if (!target.getAttribute("data-id")) target = target.parentElement;

                if (target.getAttribute("data-id")){ 
                  // hides sidebar on mobile after click
                  window.innerWidth <= 768 ? that.sidebar.close() : null;
                  // gives the callback the id of the page to be displayed
                  const pageId = target.getAttribute("data-id");
                  return callback(pageId);

                }
            });
        }

        return { then };
    }
    
    changePage(page) {
        this.displayPage(page);
    }
    displayPage(page) {
        const { pages } = this.variables();
        // hide all pages first
        Array.from(pages.children).forEach(element => {
            element.style.display = "none";
        });

        // then display the provided page
        this.tag(`#${page}`).style.display = "block";
    }


    static start() {
        
        const ui = new this();
        ui.displayCurrentPage(ui.initialPage);
        // open sidebar only on desktop otherwise close it
        window.innerWidth > 768 ? ui.sidebar.open() : ui.sidebar.close();
        // toggle navbar
        ui.variables().navbarBurger.addEventListener("click", function(){ ui.toggleSidebar(this)});
        
        ui.listenForPageChange().then(pageId => ui.displayPage(pageId));
    }


}
UI.start();
