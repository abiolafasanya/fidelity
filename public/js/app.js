class UI {
  #initialPage = "overview";
  constructor() {}
  get initialPage() {
    return this.#initialPage;
  }

 
  tag(name) {
    return document.querySelector(name);
  }
  variables() {
    return {
      pages: this.tag("#pages"),
      sidebar: this.tag("#aside"),
    };
  }
  displayCurrentPage(name) {
    this.displayPage(name);
  }

  listenForPageChange() {
    const that = this;
    const { sidebar } = that.variables();

    function then(callback) {
      sidebar.addEventListener("click", function (event) {
        let { target } = event;
        if (!target.getAttribute("data-id")) target = target.parentElement;

        if (target.getAttribute("data-id")) {
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
    Array.from(pages.children).forEach((element) => {
      element.style.display = "none";
    });

    // then display the provided page
    this.tag(`#${page}`).style.display = "block";
  }

  static start() {
    const ui = new this();
    ui.displayCurrentPage(ui.initialPage);

    ui.listenForPageChange().then((pageId) => ui.displayPage(pageId));
  }
}
UI.start();

const ui = new UI();
